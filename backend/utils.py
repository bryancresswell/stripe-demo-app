import psycopg2 as psql
import os
from dotenv import load_dotenv

load_dotenv()

def set_up_db():
    conn = psql.connect("dbname=" + os.environ.get('POSTGRESQL_DB_NAME') + " user=" + os.environ.get("POSTGRESQL_USERNAME") + " password=" + os.environ.get("POSTGRESQL_PASSWORD") + " host=localhost")
    return conn
