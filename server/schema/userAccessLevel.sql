DROP TABLE IF EXISTS user_access_level CASCADE;

CREATE TABLE user_access_level (
	id BIGINT PRIMARY KEY REFERENCES user_info(id),
	access_level INT NOT NULL CHECK(access_level > 0)
);
