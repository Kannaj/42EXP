\c Xanadu;

-- INSERT INTO skill (name) VALUES ('Javascript');
-- INSERT INTO skill (name) VALUES ('Java');
-- INSERT INTO skill (name) VALUES ('Golang');
-- INSERT INTO skill (name) VALUES ('C');
-- INSERT INTO skill (name) VALUES ('C++');
-- INSERT INTO skill (name) VALUES ('Rust');
-- INSERT INTO skill (name) VALUES ('PHP');

\COPY skill (name) FROM '/home/avernus/Desktop/Xanadu/postgres-production/skill_list.txt';
