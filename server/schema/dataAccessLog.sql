DROP TABLE IF EXISTS data_access_log CASCADE;

CREATE TABLE data_access_log (
	id SERIAL PRIMARY KEY,
	access_time TIMESTAMP NOT NULL,
	user_id BIGINT NOT NULL REFERENCES user_info(id),
	sensitive_data_id BIGINT NOT NULL REFERENCES sensitive_data(id)
);
