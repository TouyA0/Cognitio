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

-- Tags table (hierarchical)
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  parent_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  category VARCHAR(100),
  theologian_id UUID
);

CREATE INDEX idx_tags_parent_id ON tags(parent_id);
CREATE INDEX idx_tags_category ON tags(category);

-- Discoveries table (4 types: reflection, discovery, quote, lecture)
CREATE TABLE discoveries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL CHECK (type IN ('reflection', 'discovery', 'quote', 'lecture')),
  title VARCHAR(255) NOT NULL,
  content TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);

CREATE INDEX idx_discoveries_user_id ON discoveries(user_id);
CREATE INDEX idx_discoveries_type ON discoveries(type);
CREATE INDEX idx_discoveries_created_at ON discoveries(created_at DESC);

-- Discovery tags junction (many-to-many)
CREATE TABLE discovery_tags (
  discovery_id UUID NOT NULL REFERENCES discoveries(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  locked BOOLEAN DEFAULT FALSE,
  PRIMARY KEY (discovery_id, tag_id)
);

CREATE INDEX idx_discovery_tags_tag_id ON discovery_tags(tag_id);

-- Bible books
CREATE TABLE bible_books (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  "order" INT UNIQUE,
  testament VARCHAR(10) CHECK (testament IN ('OT', 'NT'))
);

CREATE INDEX idx_bible_books_order ON bible_books("order");

-- Bible passages
CREATE TABLE bible_passages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  book_id UUID NOT NULL REFERENCES bible_books(id) ON DELETE CASCADE,
  chapter INT NOT NULL,
  verse VARCHAR(50) NOT NULL,
  text_fr TEXT NOT NULL
);

CREATE INDEX idx_bible_passages_book_id ON bible_passages(book_id);

-- Catechism entries
CREATE TABLE catechism_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section VARCHAR(255) NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL
);

CREATE INDEX idx_catechism_section ON catechism_entries(section);

-- Theologians (pre-loaded)
CREATE TABLE theologians (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL UNIQUE,
  period VARCHAR(50),
  tradition VARCHAR(100),
  school VARCHAR(100),
  biography_short TEXT,
  key_works JSONB DEFAULT '[]',
  tag_id UUID REFERENCES tags(id) ON DELETE SET NULL
);

CREATE INDEX idx_theologians_name ON theologians(name);
CREATE INDEX idx_theologians_tag_id ON theologians(tag_id);

-- Discovery references (N-N relations to bible passages, catechism, theologians)
CREATE TABLE discovery_references (
  discovery_id UUID NOT NULL REFERENCES discoveries(id) ON DELETE CASCADE,
  reference_type VARCHAR(50) NOT NULL CHECK (reference_type IN ('bible_passage', 'catechism_entry', 'theologian')),
  reference_id UUID NOT NULL,
  notes TEXT,
  PRIMARY KEY (discovery_id, reference_type, reference_id)
);

CREATE INDEX idx_discovery_references_discovery_id ON discovery_references(discovery_id);
CREATE INDEX idx_discovery_references_type ON discovery_references(reference_type);