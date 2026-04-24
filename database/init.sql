-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tags table
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  parent_id UUID REFERENCES tags(id),
  category VARCHAR(100),
  theologian_id UUID
);

-- Discoveries table
CREATE TABLE discoveries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255),
  content TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  metadata JSONB
);

-- Discovery tags junction
CREATE TABLE discovery_tags (
  discovery_id UUID REFERENCES discoveries(id),
  tag_id UUID REFERENCES tags(id),
  locked BOOLEAN DEFAULT FALSE,
  PRIMARY KEY (discovery_id, tag_id)
);

-- Bible books
CREATE TABLE bible_books (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  "order" INT,
  testament VARCHAR(10)
);

-- Bible passages
CREATE TABLE bible_passages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  book_id UUID REFERENCES bible_books(id),
  chapter INT,
  verse VARCHAR(50),
  text_fr TEXT
);

-- Catechism entries
CREATE TABLE catechism_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section VARCHAR(255),
  question TEXT,
  answer TEXT
);

-- Theologians
CREATE TABLE theologians (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255),
  period VARCHAR(50),
  tradition VARCHAR(100),
  school VARCHAR(100),
  biography_short TEXT,
  tag_id UUID REFERENCES tags(id)
);

-- Discovery references
CREATE TABLE discovery_references (
  discovery_id UUID REFERENCES discoveries(id),
  reference_type VARCHAR(50),
  reference_id UUID,
  notes TEXT,
  PRIMARY KEY (discovery_id, reference_type, reference_id)
);