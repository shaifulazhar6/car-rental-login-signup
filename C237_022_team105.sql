CREATE DATABASE C237_022_24041079;
USE C237_022_24041079;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'user'
);

INSERT INTO users (username, email, password, role) VALUES
('admin', 'admin@example.com', '$2a$10$AbCDefghijk1234567890u3NHfU8A1CzwA3zDF.Qyjl6bNzW.DRGu', 'admin'),
('john_doe', 'john@example.com', '$2a$10$Wxyz45678klmNOPQrstuv.MHh6M1V0EVMSkzGy9oZBlEQZzDChm8ti', 'user');
