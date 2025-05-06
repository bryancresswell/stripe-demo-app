### The Flask app here will simply serve as the server

from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
from enums import ProductType, ProductSubType
from dotenv import load_dotenv
import psycopg2 as psql
from utils import set_up_db
import stripe
import os
from datetime import datetime, timezone


app = Flask(__name__)
db = set_up_db()
load_dotenv()
stripe.api_key = os.environ.get('STRIPE_SECRET_KEY')
cors = CORS(app)

@app.route('/')
def index():
    return "Hello, World!"

@app.route('/api/products', methods=['GET'])
def products():
    cur = db.cursor()
    try:
        query = 'SELECT * FROM products'
        cur.execute(query)
        result = cur.fetchall()
        # Convert list of tuples to list of dicts using cursor description
        columns = [desc[0] for desc in cur.description]
        products = [dict(zip(columns, row)) for row in result]
        return jsonify(products)
    except Exception as e:
        cur.close()
        return jsonify({"error": str(e)})
    finally:
        cur.close()

@app.route('/api/payments', methods=['GET', 'POST', 'PATCH'])
def payments():
    if request.method == 'POST':
        data = request.get_json()
        amount = data.get('amount')
        currency = data.get('currency')
        shippingInfo = data.get('shippingInfo')
        items = data.get('items')
        # Fix shippingInfo blob
        shippingData = {
            "address": {
                "city": shippingInfo['city'],
                "country": "SG",
                "line1": shippingInfo['address'],
                "postal_code": shippingInfo['zipCode'],
                "state": shippingInfo['state']
            },
            "name": shippingInfo['firstName'] + " " + shippingInfo['lastName'],
            "phone": shippingInfo['phone']
        } 
        try:
            payment_intent = stripe.PaymentIntent.create(
                amount=int(float(amount) * 100),  # Stripe expects amount in cents
                currency=currency,
                shipping=shippingData
            )
            result = {
                "client_secret": payment_intent.client_secret,
                "status": payment_intent.status,
                "id": payment_intent.id,
                "object": payment_intent.object,
                "amount": payment_intent.amount,
                "currency": payment_intent.currency,
                "created_at": payment_intent.created
            }
            cur = db.cursor()
            query = """
                INSERT INTO payments (
                    id,
                    status,
                    type,
                    created_at,
                    last_updated_at,
                    amount,
                    currency
                ) VALUES (
                    %s, %s, %s, %s, %s, %s, %s
                )
            """
            cur.execute(
                query,
                (
                    result.get('id'),
                    result.get('status'),
                    result.get('object'),
                    datetime.fromtimestamp(result.get("created_at"), tz=timezone.utc),
                    datetime.fromtimestamp(result.get("created_at"), tz=timezone.utc),
                    result.get('amount'),
                    result.get('currency')
                )
            )
            db.commit()
        except Exception as e:
            result = {"error": str(e)}
        return jsonify(result)
    elif request.method == 'PATCH':
        data = request.get_json()
        payment_intent_id = data.get("payment_intent_id")
        orderInfo = data.get('metadata')
        try:
            payment_intent = stripe.PaymentIntent.modify(
               payment_intent_id,
               metadata={
                   "order_number": orderInfo.get('order_number')
               }
            )
            result = {
                "client_secret": payment_intent.client_secret,
                "status": payment_intent.status,
                "id": payment_intent.id
            }
            return jsonify(result)
        except Exception as e:
            result = {"error": str(e)}
        finally:
            return jsonify(result)
    return


@app.route('/api/orders', methods=['GET', 'POST'])
def orders():
    if request.method == 'GET':
        cur = db.cursor()
        try:
            query = 'SELECT id FROM orders ORDER BY last_updated_at DESC LIMIT 1'
            cur.execute(query)
            result = cur.fetchall()
            return jsonify(result)
        except Exception as e:
            cur.close()
            return jsonify({"error": str(e)})
        finally:
            cur.close()
    elif request.method == 'POST':
        data = request.get_json()
        cur = db.cursor()
        try:
            query = """
                INSERT INTO orders (
                    id,
                    created_at,
                    status,
                    last_updated_at,
                    amount,
                    currency,
                    payment_id
                ) VALUES (
                    %s, NOW(), %s, NOW(), %s, %s, %s
                )
            """
            cur.execute(
                query,
                (
                    data.get('id'),
                    data.get('status'),
                    data.get("total_amount"),
                    data.get("currency"),
                    data.get('payment_intent_id')
                )
            )
            db.commit()
            return jsonify({"status": "success"}), 200
        except Exception as e:
            cur.close()
            return jsonify({"error": str(e)})
        finally:
            cur.close()
    else:
        return
    
@app.route('/webhooks/stripe', methods=['GET', 'POST'])
def webhooks():
    ## Maybe for future, we add queuing and message recovery but for now just ingestion of webhooks
    if request.method == 'GET':
        cur = db.cursor()
        try:
            query = 'SELECT * FROM payments'
            cur.execute(query)
            result = cur.fetchall()
            # Convert list of tuples to list of dicts using cursor description
            columns = [desc[0] for desc in cur.description]
            products = [dict(zip(columns, row)) for row in result]
            return jsonify(products)
        except Exception as e:
            return jsonify({"error": str(e)})
        finally:
            cur.close()
    elif request.method == 'POST':
        data = request.get_json()
        cur = db.cursor()

        try:
            if data.get("type", "").startswith("payment_intent"):
                paymentsTableQuery = """
                UPDATE payments
                SET
                    order_id = %s,
                    status = %s,
                    last_updated_at = %s
                WHERE id = %s
            """
            cur.execute(
                paymentsTableQuery,
                (
                    data.get('data').get('object').get('metadata').get('order_number'),
                    data.get('data').get('object').get('status'),
                    datetime.fromtimestamp(data.get("created"), tz=timezone.utc),
                    data.get('data').get('object').get('id')
                )
            )
            
            eventsTableQuery = """
                INSERT INTO events (
                    id,
                    object_id,
                    status,
                    type,
                    created_at,
                    last_updated_at
                ) VALUES (
                    %s, %s, %s, %s, %s, %s
                )
            """
            cur.execute(
                eventsTableQuery,
                (
                    data.get('id'),
                    data.get('data').get('object').get('id'),
                    data.get('data').get('object').get('status'),
                    data.get("type"),
                    datetime.fromtimestamp(data.get("created"), tz=timezone.utc),
                    datetime.fromtimestamp(data.get("created"), tz=timezone.utc),
                )
            )
            db.commit()
            return jsonify({"status": "success"}), 200
        except Exception as e:
            return jsonify({"error": str(e)})
        finally:
            cur.close()
    else:
        return



if __name__ == '__main__':
    app.run(debug=True, port=3000, host='0.0.0.0')

