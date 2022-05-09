--I used the same information as the mockup video

INSERT INTO departments (name)
VALUES
    ('Sales'),
    ('Engineering'),
    ('Finance'),
    ('Legal');

INSERT INTO roles (title, salary, department_id)
VALUES
    ('Salesperson', '80000', 2),
    ('Sales Lead', '100000', 1),
    ('Lead Engineer', '150000', 3),
    ('Software Engineer', '120000', 4),
    ('Account Manager', '160000', 5),
    ('Accountant', '125000', 6),
    ('Legal Team Lead', '250000', 7);
    ('Lawyer', '190000', 8),


INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
    ('John', 'Doe', 1, NULL),
    ('Mike', 'Chan', 2, 1),
    ('Ashley', 'Rodriguez', 3, NULL),
    ('Kevin', 'Tupik', 4, 3),
    ('Kunal', 'Singh', 5, NULL),
    ('Malia', 'Brown', 6, 5),
    ('Sarah', 'Lourd', 7, NULL),
    ('Tom', 'Allen', 8, 7),


INSERT INTO managers (first_name, last_name, role_id, title, manager_id)
VALUES
    ('John', 'Doe', 1, 'Sales Lead', 1),  
    ('Ashley', 'Rodriguez', 3, 'Lead Engineer', 3),
    ('Kunal', 'Singh', 5, 'Account Manager', 5),
    ('Sarah', 'Lourd', 7, 'Legal Team Lead', 7);