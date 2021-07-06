DROP DATABASE IF EXISTS tracker_db;
CREATE database tracker_db;

USE tracker_db;

CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(30) NULL
);

CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(30),
  salary DECIMAL(15,2) NULL,
  department_id INT,
  FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  role_id INT,
  manager_id INT,
  FOREIGN KEY (role_id) REFERENCES role(id),
  FOREIGN KEY (manager_id) REFERENCES employee(id)
);


-- SEEDS
INSERT INTO department (name)
VALUE ("Marketing");
INSERT INTO department (name)
VALUE ("Technology");
INSERT INTO department (name)
VALUE ("Accounting");
INSERT INTO department (name)
VALUE ("Administrative");

INSERT INTO role (title, salary, department_id)
VALUE ("Lead Engineer", 180000, 2);
INSERT INTO role (title, salary, department_id)
VALUE ("Administrative Team Lead", 190000, 4);
INSERT INTO role (title, salary, department_id)
VALUE ("Accountant", 80000, 3);
INSERT INTO role (title, salary, department_id)
VALUE ("Marketing Lead", 90000, 1);
INSERT INTO role (title, salary, department_id)
VALUE ("Marketing Coordinator", 80000, 1);
INSERT INTO role (title, salary, department_id)
VALUE ("Software Engineer", 120000, 2);
INSERT INTO role (title, salary, department_id)
VALUE ("Administraitve Assistant", 50000, 4);

INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Jose", "Martinez", null, 1);
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Levi", "Cohen", null, 2);
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Alexis","Larsen",null,3);
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Jeffery", "Strickland", 1, 4);
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Shelby", "Christianson", 4, 5);
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Hubert", "Oswald", 1, 6);
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Yael", "Chaim", 2, 7);

SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;