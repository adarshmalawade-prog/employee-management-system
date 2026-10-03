-- Seed: seed_employees.sql
-- Description: Inserts realistic initial employee records for testing

INSERT INTO employees (employee_id, first_name, last_name, email, phone, department, role, salary, hire_date)
VALUES
    ('EMP-1001', 'Alice', 'Smith', 'alice.smith@example.com', '+1-555-0101', 'Engineering', 'Senior Software Engineer', 115000.00, '2022-03-15'),
    ('EMP-1002', 'Bob', 'Johnson', 'bob.johnson@example.com', '+1-555-0102', 'Engineering', 'DevOps Engineer', 110000.00, '2022-06-01'),
    ('EMP-1003', 'Carol', 'Williams', 'carol.williams@example.com', '+1-555-0103', 'Human Resources', 'HR Manager', 85000.00, '2021-09-10'),
    ('EMP-1004', 'David', 'Brown', 'david.brown@example.com', '+1-555-0104', 'Product', 'Product Manager', 105000.00, '2023-01-20'),
    ('EMP-1005', 'Eva', 'Martinez', 'eva.martinez@example.com', '+1-555-0105', 'Finance', 'Financial Analyst', 90000.00, '2023-05-12')
ON CONFLICT (employee_id) DO NOTHING;
