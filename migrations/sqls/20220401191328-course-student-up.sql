CREATE TABLE course_student (
    student_id INT REFERENCES student ON DELETE CASCADE,
    course_id INT REFERENCES course ON DELETE CASCADE,
    grade CHAR(1) DEFAULT 'A',
    PRIMARY KEY (student_id, course_id)
    );