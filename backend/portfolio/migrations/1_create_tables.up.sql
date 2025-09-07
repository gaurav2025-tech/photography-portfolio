CREATE TABLE portfolio_categories (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE portfolio_items (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  image_url VARCHAR(500) NOT NULL,
  thumbnail_url VARCHAR(500),
  category_id BIGINT NOT NULL REFERENCES portfolio_categories(id),
  featured BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE testimonials (
  id BIGSERIAL PRIMARY KEY,
  client_name VARCHAR(100) NOT NULL,
  client_role VARCHAR(100),
  content TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE blog_posts (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(200) NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image_url VARCHAR(500),
  published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE contact_submissions (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(200) NOT NULL,
  phone VARCHAR(20),
  subject VARCHAR(200),
  message TEXT NOT NULL,
  service_type VARCHAR(100),
  event_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default categories
INSERT INTO portfolio_categories (name, slug, description) VALUES
('Photography', 'photography', 'Professional photography services'),
('Videography', 'videography', 'Creative videography and cinematography'),
('Wedding', 'wedding', 'Wedding photography and videography'),
('Events', 'events', 'Event coverage and documentation'),
('Portrait', 'portrait', 'Portrait and headshot photography'),
('Commercial', 'commercial', 'Commercial and corporate projects');

-- Insert sample testimonials
INSERT INTO testimonials (client_name, client_role, content, rating, featured) VALUES
('Sarah Johnson', 'Bride', 'Absolutely stunning work! They captured every precious moment of our wedding day perfectly.', 5, true),
('Michael Chen', 'CEO, Tech Corp', 'Professional, creative, and delivered beyond our expectations for our corporate event.', 5, true),
('Emily Davis', 'Event Coordinator', 'Their attention to detail and artistic vision made our event memorable. Highly recommended!', 5, false);
