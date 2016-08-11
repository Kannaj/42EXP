\c Xanadu;

-- INSERT INTO category (name) VALUES ('Machine Learning');
-- INSERT INTO category (name) VALUES ('Music');
-- INSERT INTO category (name) VALUES ('Sports');
-- INSERT INTO category (name) VALUES ('Entertainment');
-- INSERT INTO category (name) VALUES ('Gaming');
-- INSERT INTO category (name) VALUES ('Frameworksq');

\COPY category(name) FROM '/home/avernus/Desktop/Xanadu/postgres-production/category-list.txt';
