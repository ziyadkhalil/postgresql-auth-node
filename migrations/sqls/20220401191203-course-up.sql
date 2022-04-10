CREATE TABLE course (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    instructor_id INT REFERENCES instructor
);