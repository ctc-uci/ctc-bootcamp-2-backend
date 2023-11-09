DROP TABLE IF EXISTS user_profile_image CASCADE;

CREATE TABLE user_profile_image (
	id BIGINT PRIMARY KEY REFERENCES user_info(id),
	url varchar(255) NOT NULL
);
