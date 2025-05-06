
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS events CASCADE;

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    description TEXT,
    type VARCHAR(50) NOT NULL,
    sub_type VARCHAR(50) NOT NULL,
    metadata JSONB,
    name VARCHAR(255) NOT NULL,
    url VARCHAR(255) NOT NULL,
    image_url VARCHAR(255),
    average_rating DECIMAL(10,2) NOT NULL DEFAULT 0,
    num_reviews INTEGER NOT NULL DEFAULT 0,
    price DECIMAL(10, 2) NOT NULL,
    last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    available_stock INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(50) NOT NULL
);

CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    preferred_address_line_1 VARCHAR(255) NOT NULL,
    preferred_address_line_2 VARCHAR(255),
    preferred_address_line_3 VARCHAR(255),
    preferred_address_country VARCHAR(100) NOT NULL,
    preferred_address_city VARCHAR(100) NOT NULL,
    preferred_address_postcode VARCHAR(20) NOT NULL,
    preferred_address_state VARCHAR(100),
    phone_number VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    social_login JSONB
);


CREATE TABLE orders (
    id VARCHAR(255) UNIQUE PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) NOT NULL,
    last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    amount INTEGER NOT NULL,
    currency VARCHAR(3) NOT NULL,
    notes TEXT
);

CREATE TABLE payments (
    id VARCHAR(255) UNIQUE PRIMARY KEY,
    order_id VARCHAR(255) REFERENCES orders(id),
    status VARCHAR(50) NOT NULL,
    type VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    payment_method VARCHAR(50),
    amount INTEGER NOT NULL,
    metadata JSONB,
    currency VARCHAR(3) NOT NULL,
    last_payment_error JSONB
);

CREATE TABLE events (
    id VARCHAR(255) UNIQUE PRIMARY KEY,
    object_id VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL,
    type VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE orders
ADD COLUMN payment_id VARCHAR(255) REFERENCES payments(id);

CREATE INDEX idx_orders_product_id ON orders(product_id);
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_orders_last_updated_at ON orders(last_updated_at);
CREATE INDEX idx_orders_created_updated ON orders(created_at, last_updated_at);
CREATE INDEX idx_products_type ON products(type);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_created_at ON products(created_at);
CREATE INDEX idx_products_last_updated_at ON products(last_updated_at);
CREATE INDEX idx_products_created_updated ON products(created_at, last_updated_at);
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_name ON customers(first_name, last_name);
CREATE INDEX idx_customers_created_at ON customers(created_at);
CREATE INDEX idx_customers_last_updated_at ON customers(last_updated_at);
CREATE INDEX idx_customers_created_updated ON customers(created_at, last_updated_at);
CREATE INDEX idx_customers_country ON customers(preferred_address_country);
CREATE INDEX idx_customers_postcode ON customers(preferred_address_postcode);
CREATE INDEX idx_customers_phone ON customers(phone_number);
CREATE INDEX idx_payments_order_id ON payments(order_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_created_at ON payments(created_at);
CREATE INDEX idx_payments_last_updated_at ON payments(last_updated_at);
CREATE INDEX idx_payments_created_updated ON payments(created_at, last_updated_at);
CREATE INDEX idx_events_id ON events(id);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_type ON events(type);
