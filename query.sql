-- Below query is to add the required table for app to function
-- oclc is used for rendering the book cover image on the site
CREATE TABLE reviews (
	id SERIAL PRIMARY KEY,
	title VARCHAR(100) UNIQUE,
	author VARCHAR(100),
	readdate VARCHAR(100),
	recommendation INTEGER,
	oclc INTEGER,
	review TEXT
)
