DROP TABLE IF EXISTS sensitive_data CASCADE;

CREATE TABLE sensitive_data (
	id SERIAL PRIMARY KEY,
	quote_text VARCHAR(255) NOT NULL,
	quotee_id BIGINT NOT NULL REFERENCES user_info(id),
	access_level INT NOT NULL CHECK(access_level > 0)
);
