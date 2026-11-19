-- ============================================================
-- WatchHub Luxury E-Commerce Database Schema (Aptech eProject)
-- Target DBMS: MySQL / MariaDB / PostgreSQL / SQLite
-- Database Name: watchhub_luxury_db
-- ============================================================

CREATE DATABASE IF NOT EXISTS watchhub_luxury_db;
USE watchhub_luxury_db;

-- ------------------------------------------------------------
-- 1. Table: users
-- Stores customer accounts and administrative accounts
-- ------------------------------------------------------------
DROP TABLE IF EXISTS users;
CREATE TABLE users (
    user_id VARCHAR(50) PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'customer') DEFAULT 'customer',
    phone VARCHAR(50),
    avatar_url VARCHAR(255),
    shipping_address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- 2. Table: categories
-- Horology product classifications (Chronograph, Tourbillon, Diver, etc.)
-- ------------------------------------------------------------
DROP TABLE IF EXISTS categories;
CREATE TABLE categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(80) NOT NULL UNIQUE,
    slug VARCHAR(80) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- 3. Table: brands
-- Master luxury watchmakers (Rolex, Patek Philippe, Audemars Piguet, etc.)
-- ------------------------------------------------------------
DROP TABLE IF EXISTS brands;
CREATE TABLE brands (
    brand_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    origin_country VARCHAR(100) DEFAULT 'Switzerland',
    founded_year INT,
    heritage_note TEXT
);

-- ------------------------------------------------------------
-- 4. Table: watches (Products Catalog)
-- Master catalog of luxury timepieces
-- ------------------------------------------------------------
DROP TABLE IF EXISTS watches;
CREATE TABLE watches (
    watch_id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    category VARCHAR(80) NOT NULL,
    price DECIMAL(12, 2) NOT NULL,
    original_price DECIMAL(12, 2),
    stock_quantity INT DEFAULT 0,
    gender ENUM('Men', 'Women', 'Unisex') DEFAULT 'Unisex',
    movement VARCHAR(200),
    case_size VARCHAR(50),
    case_material VARCHAR(150),
    dial_color VARCHAR(100),
    water_resistance VARCHAR(100),
    power_reserve VARCHAR(100),
    crystal_type VARCHAR(150),
    strap_material VARCHAR(150),
    tagline VARCHAR(255),
    description TEXT,
    featured_flag BOOLEAN DEFAULT FALSE,
    is_new_arrival BOOLEAN DEFAULT FALSE,
    is_bestseller BOOLEAN DEFAULT FALSE,
    rating DECIMAL(3, 2) DEFAULT 5.00,
    review_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- 5. Table: watch_images
-- High-definition gallery imagery for each timepiece
-- ------------------------------------------------------------
DROP TABLE IF EXISTS watch_images;
CREATE TABLE watch_images (
    image_id INT AUTO_INCREMENT PRIMARY KEY,
    watch_id VARCHAR(50) NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (watch_id) REFERENCES watches(watch_id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- 6. Table: orders
-- Customer sales orders & fulfillment status
-- ------------------------------------------------------------
DROP TABLE IF EXISTS orders;
CREATE TABLE orders (
    order_id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    user_name VARCHAR(150) NOT NULL,
    user_email VARCHAR(150) NOT NULL,
    subtotal DECIMAL(12, 2) NOT NULL,
    discount_amount DECIMAL(12, 2) DEFAULT 0.00,
    tax_amount DECIMAL(12, 2) DEFAULT 0.00,
    shipping_fee DECIMAL(12, 2) DEFAULT 0.00,
    total_amount DECIMAL(12, 2) NOT NULL,
    payment_method VARCHAR(100) NOT NULL,
    status ENUM('Pending Verification', 'Processing Vault Verification', 'In Transit', 'Delivered', 'Cancelled') DEFAULT 'Processing Vault Verification',
    tracking_number VARCHAR(100),
    carrier_name VARCHAR(100) DEFAULT 'Swiss Armored Vault Courier',
    shipping_full_name VARCHAR(150),
    shipping_street VARCHAR(255),
    shipping_city VARCHAR(100),
    shipping_country VARCHAR(100),
    shipping_postal_code VARCHAR(30),
    order_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- 7. Table: order_items
-- Individual line items per order
-- ------------------------------------------------------------
DROP TABLE IF EXISTS order_items;
CREATE TABLE order_items (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id VARCHAR(50) NOT NULL,
    watch_id VARCHAR(50) NOT NULL,
    watch_name VARCHAR(200) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    unit_price DECIMAL(12, 2) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    subtotal DECIMAL(12, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (watch_id) REFERENCES watches(watch_id)
);

-- ------------------------------------------------------------
-- 8. Table: reviews
-- Customer appraisals and star ratings
-- ------------------------------------------------------------
DROP TABLE IF EXISTS reviews;
CREATE TABLE reviews (
    review_id VARCHAR(50) PRIMARY KEY,
    watch_id VARCHAR(50) NOT NULL,
    user_name VARCHAR(150) NOT NULL,
    user_avatar VARCHAR(500),
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    title VARCHAR(200),
    content TEXT NOT NULL,
    helpful_count INT DEFAULT 0,
    verified_buyer BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (watch_id) REFERENCES watches(watch_id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- 9. Table: wishlist
-- User saved timepieces
-- ------------------------------------------------------------
DROP TABLE IF EXISTS wishlist;
CREATE TABLE wishlist (
    wishlist_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    watch_id VARCHAR(50) NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY user_watch_unique (user_id, watch_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (watch_id) REFERENCES watches(watch_id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- 10. Table: support_messages
-- Concierge client inquiries
-- ------------------------------------------------------------
DROP TABLE IF EXISTS support_messages;
CREATE TABLE support_messages (
    message_id VARCHAR(50) PRIMARY KEY,
    sender_name VARCHAR(150) NOT NULL,
    sender_email VARCHAR(150) NOT NULL,
    subject VARCHAR(200) NOT NULL,
    message_content TEXT NOT NULL,
    status ENUM('Received', 'Assigned', 'Replied') DEFAULT 'Received',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- 11. Table: app_feedback
-- In-app user feedback and issue bug reports
-- ------------------------------------------------------------
DROP TABLE IF EXISTS app_feedback;
CREATE TABLE app_feedback (
    feedback_id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50),
    user_name VARCHAR(150),
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    category VARCHAR(100) NOT NULL,
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- 12. Table: coupons
-- Promotional discounts
-- ------------------------------------------------------------
DROP TABLE IF EXISTS coupons;
CREATE TABLE coupons (
    coupon_id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_percentage INT DEFAULT 0,
    discount_fixed DECIMAL(10, 2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT TRUE
);

-- ------------------------------------------------------------
-- SEED DATA INSERTS
-- ------------------------------------------------------------
INSERT INTO coupons (code, discount_percentage, discount_fixed, is_active) VALUES
('WATCHVIP10', 10, 0.00, TRUE),
('LUXURY500', 0, 500.00, TRUE),
('ROYAL20', 20, 0.00, TRUE);

INSERT INTO users (user_id, full_name, email, password_hash, role, phone, address) VALUES
('usr-001', 'Henri Stern', 'admin@watchhub.luxury', 'admin123', 'admin', '+41 22 819 12 00', 'Rue du Stand 6, 1204 Geneva, Switzerland'),
('usr-002', 'Arthur Pendelton', 'client@watchhub.luxury', 'user123', 'customer', '+44 20 7946 0912', 'Mayfair, Grosvenor Square, London W1K 6JP, UK');

INSERT INTO watches (watch_id, name, brand, category, price, original_price, stock_quantity, gender, movement, case_size, case_material, dial_color, water_resistance, power_reserve, crystal_type, strap_material, tagline, description, featured_flag, is_new_arrival, is_bestseller, rating, review_count) VALUES
('wh-001', 'Cosmograph Daytona Oyster 40mm', 'Rolex', 'Chronograph', 34500.00, 38000.00, 4, 'Unisex', 'Calibre 4131 perpetual self-winding', '40 mm', 'Oystersteel and 18 ct Everose Gold', 'Sunray Black', '100m / 330ft', '72 hours', 'Sapphire crystal', 'Oysterlock Everose', 'The quintessential chronograph born for endurance racing.', 'The Cosmograph Daytona is benchmarked in horological mastery.', TRUE, TRUE, TRUE, 4.95, 38),
('wh-002', 'Nautilus 5711/1R Jumbo Rose Gold', 'Patek Philippe', 'Luxury', 112000.00, 125000.00, 2, 'Men', 'Caliber 26-330 S C self-winding', '40.5 mm', '18k Rose Gold', 'Brown Gradated Sunburst', '120m / 400ft', '45 hours', 'Sapphire crystal back', '18k Rose Gold integrated bracelet', 'The pinnacle of haute horlogerie sports elegance.', 'Horizontal embossed dial and rounded octagonal porthole case.', TRUE, FALSE, TRUE, 4.98, 24),
('wh-003', 'Royal Oak Jumbo Extra-Thin 16202ST', 'Audemars Piguet', 'Skeleton', 68500.00, 72000.00, 3, 'Unisex', 'Calibre 7121 selfwinding', '39 mm', 'Stainless steel', 'Bleu Nuit Nuage 50 Petite Tapisserie', '50m / 165ft', '55 hours', 'Glareproofed sapphire', 'Stainless steel AP folding clasp', 'Iconic octagonal bezel with 8 hexagonal screws.', '50 years of Royal Oak heritage framed by Gerald Genta geometry.', TRUE, TRUE, TRUE, 4.92, 19),
('wh-004', 'Speedmaster Professional Moonwatch', 'Omega', 'Chronograph', 7600.00, 8200.00, 8, 'Men', 'Calibre 3861 manual-winding METAS', '42 mm', 'Stainless steel', 'Step dial matte black', '50m / 165ft', '50 hours', 'Hesalite crystal', 'Stainless steel bracelet', 'The legendary Moonwatch worn on lunar soil.', 'Certified by METAS to resist magnetic fields up to 15,000 gauss.', TRUE, FALSE, TRUE, 4.88, 52);
