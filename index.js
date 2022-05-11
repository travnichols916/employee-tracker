// declarations importing mods
const mysql = require("mysql2");
const inquirer = require("inquirer")
const db = require('./db/connection');


//Questions required
const start = () => {
    inquirer.prompt([
        {
            type: "list",
            name: "options",
            message: "Please select an option.",
            choices: ["View All Departments", "View Department Budgets", "View All Roles", "View All Employees", "View Team Members By Manager", "View Team Members By Department", "Add Department", "Add Role", "Add Employee", "Update Employee", "Update Manager", "Remove a Department", "Remove a Position", "Remove a Team Member", "Exit"],
        }
    ]).then(answers => {

        if (answers.options === "Exit") {
            db.end();
        }
        else if (answers.options === "View All Departments") {
            viewAllDepartments();
        }
        else if (answers.options === "View All Roles") {
            viewAllRoles();
        }
        else if (answers.options === "View Department Budgets") {
            viewDepartmentBudgets();
        }
        else if (answers.options === "View All Employees") {
            viewAllEmployees();
        }
        else if (answers.options === "View Team Members By Department") {

            viewEmployeesByDept();
        }
        else if (answers.options === "View Team Members By Manager") {

            viewEmployeesByManager();
        }
        else if ( answers.options === "Add Department") {
            addDepartment();
        }
        else if (answers.options === "Add Role") {
            addRole();
        }
        else if (answers.options === "Add Employee") {
            addEmployee();
        }
        else if (answers.options === "Remove a Department") {
            removeDepartment();
        }
        else if (answers.options === "Remove a Position") {
            removeRole();
        }
        else if (answers.options === "Remove a Team Member") {
            removeEmployee();
        }
        else if (answers.options === "Update Employee") {
            updateEmployee();
        }
        else if (answers.options === "Update Manager") {
            updateManager();
        }
    })
};



//functions for viewing
function viewAllDepartments() {
    db.query("SELECT * FROM departments", function (err, data) {
        if (err) throw err;
        console.table(data);
        start();
    })
};



function viewAllRoles() {
    db.query("SELECT * FROM roles", function (err, data) {
        if (err) throw err;
        console.table(data);
        start();
    })

};


function viewAllEmployees() {

    db.query("SELECT * FROM employees", function (err, data) {

        if (err) throw err;
        console.table(data);
        start();
    })

};
//functions for adding
function addDepartment() {
    inquirer.prompt(
        {
            type: "input",
            name: "new_department",
            message: "Enter new department name. Enter nothing to return to Menu."
        }).then(answers => {
            if (answers.new_department === '') {
                start();
            }
            else {
                db.query("INSERT INTO departments (name) VALUES (?)", [answers.new_department], function (err, res) {
                    if (err) throw err;
                    console.table(res);
                    start();
                })
            }
    })
};
//functions for add roles
function addRole() {
    db.query("SELECT * FROM departments", function (err, data) {
        if (err) throw err;
        let departments = data.map(departments => {
            return { name : departments.name, value: departments.id };
        })
        inquirer.prompt([
            {
                type: "input",
                name: "new_role",
                message: "Enter a new position. Enter nothing to return to Menu."
            },
            {
                type: "input",
                name: "salary",
                message: "Enter salary for this position.",
                when: (answers) => answers.new_role !== ""
            },
            {
                type: "list",
                name: "dept_choices",
                message: "Which department does this position fall under?",
                choices: departments,
                when: (answers) => answers.new_role !== ""
            }]).then(answers => {
                if (answers.new_role === "") {
                    start();    
                }
                else {
                    db.query("INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)", [answers.new_role, answers.salary, answers.dept_choices], function (err, res) {
                        if (err) throw err;
                        console.table(res);
                        start();
                })
            }
        })
    })
};

//functions for adding employees
function addEmployee() {
    db.query("SELECT * FROM roles", function (err, data) {

        if(err) throw err;

        // generate new array using map
        let role = data.map(role => {
            return {name: role.title, value: role.id}
        })

        db.query("SELECT * FROM employees", function (err, data) {
            if (err) throw err;
            // each item in the array will be an object
            let manager = data.map(manager => {
                return { name: `${manager.first_name} ${manager.last_name}`, value: manager.id }
            })
            let nullValue = { name: 'No Manager', value: 50 };
            manager.push(nullValue);
            inquirer.prompt([
                {   
                    type: "input",
                    name: "first_name",
                    message: "Enter employee's First Name."
                },
                {
                    type: "input",
                    name: "last_name",
                    message: "Enter employee's Last Name.",
                    when: (answers) => answers.first_name != ""
                },
                {
                    type: "list",
                    name: "role_id",
                    message: "Choose new Employee's Position.",
                    choices: role,
                    when: (answers) => answers.first_name != ""
                },
                {
                    type: "list",
                    name: "manager_id",
                    message: "Choose the team member that will oversee the new employee.",
                    choices: manager,
                    when: (answers) => answers.first_name != ""
                }]).then(answers => {
                    if (answers.first_name === "") {
                        start();
                    }
                    else {
                        // inserts into employees db
                        db.query("INSERT INTO employees SET ?", answers, function (err, res) {
                            if (err) throw err;
                            console.table(res);
                            start();
                        })
                    }
                })
        })
    })
};
//function for updating 
function updateEmployee() {
    // query db
    db.query("SELECT * FROM employees", function (err, data) {
        if (err) throw err;
        //each array item to have a name equal to the employee names
        let employees = data.map(employees => {
            return { name: `${employees.first_name} ${employees.last_name}`, value: employees.id}
        })
        //roles table to change employee roles
        db.query("SELECT * FROM roles", function (err, data) {
            if (err) throw err;
            let roles = data.map(roles => {
                return { name: roles.title, value: roles.id }
            })
            let nullValue = { name: 'Return to Menu.', value: 100 };
            employees.push(nullValue);
            inquirer.prompt([
                {
                    type: "list",
                    name: "employee_choices",
                    message: "Select Team Member to update.",
                    choices: employees
                },
                {
                    type: "list",
                    name: "new_role",
                    message: "Change Team Member's position.",
                    choices: roles,
                    // ask question if they don't chose Main menu
                    when: (answers) => answers.employee_choices != 100
                }]).then(answers => {
                    if (answers.employee_choices === 100) {
                        start();
                    }
                    // we update the employees table
                    else {
                        db.query(`UPDATE employees SET role_id = ? WHERE id = ?`, [answers.new_role, answers.employee_choices], function (err, res) {
                            if (err) throw err;
                            console.table(res);
                            start(); 
                        })
                    }
                    
                })
        })
    })
};

//function for viewing employees 
function viewEmployeesByDept() {

    db.query("SELECT * FROM departments", function (err, data) {

        if (err) throw err;
        // the map function will generate a new array with object keys including dept name and id
        let departments = data.map(departments => {
            return { name: `${departments.name}`, value: departments.id }
        })

        let nullValue = { name: 'Return to main menu.', value: 100 };
        departments.push(nullValue);

        
        inquirer.prompt([
            {
                type: "list",
                name: "department_choices",
                message: "Select a department to view team.",
                choices: departments
            }]).then(answers => {
                if (answers.department_choices === 100) {
                    start();
                }

                // where statement to filter records
                else { 
                    db.query(`SELECT employees.first_name, employees.last_name, roles.title FROM employees, roles WHERE roles.department_id = ? AND employees.role_id = roles.id`, answers.department_choices, function (err, res) {
                        if (err) throw err;
                        console.table(res);
                        start();
                    })
                }
            })
    })
}; 

//update manager function
function updateManager() {
    db.query("SELECT * FROM employees", function (err, data) {
        if (err) throw err;
        let employees = data.map(employees => {
            return { name: `${employees.first_name} ${employees.last_name}`, value: employees.id }
        })
        db.query("SELECT * FROM managers", function (err, data) {
            
            let managers = data.map(managers => {
                return { name: `${managers.first_name} ${managers.last_name}, ${managers.title}`, value: managers.manager_id}
            })
            let nullValue = { name: 'No Manager', value: null };
            managers.push(nullValue);
            let nullValue2 = { name: 'Return to Main Menu.', value: 100 };
            employees.push(nullValue2);

            inquirer.prompt([
                {
                    type: "list",
                    name: "employee_choices",
                    message: "Update supervisor for which team member?.",
                    choices: employees
                },
                {
                    type: "list",
                    name: "manager_choices",
                    message: "Select a new Manager.",
                    choices: managers,
                    //ask question when user doesn't select main menu
                    when: (answers) => answers.employee_choices != 100
                }]).then(answers => {
                    if (answers.manager_choices === "No Manager") {
                        db.query(`UPDATE employees SET manager_id = ?`, null, function (err, data) {
                            if (err) throw err;
                            console.table(data);
                            start();
                        })
                    }
                    else if (answers.employee_choices === 100) {
                        start();
                    }

                    else if (answers.employee_choices === 50) {
                        db.query(`UPDATE employees SET manager_id = ? WHERE id = employees.id`, [answers.manager_choices], function (err, data) {
                            if (err) throw err;
                            console.table(data);
                            start();
                        })
                    }
                    
                    else { 
                        // where statement to filter records and have more than one condition
                        db.query(`UPDATE employees SET manager_id = ? WHERE id = ?`, [answers.manager_choices, answers.employee_choices], function (err, res) {
                            if (err) throw err;
                            console.table(res);
                            start();
                        })
                    }
                })
            })        
    })  

}; 
//function for viewing departments
function viewDepartmentBudgets () {
    db.query("SELECT * FROM departments", function (err, data) {
        if (err) throw err;
        let departments = data.map(departments => {
            return { name: departments.name, value: departments.id }
        })
        let nullValue = { name: 'Return to main menu.', value: 100 };
        departments.push(nullValue);
        inquirer.prompt([
            {
                type: "list",
                name: "department_choices",
                message: "Select department to view budget.",
                choices: departments
            }]).then(answers => {
                if (answers.department_choices === 100) {
                    start();
                }
                else {
                    //select SUM to make budget 
                    db.query("SELECT SUM(roles.salary) AS budget FROM roles WHERE roles.department_id = ?", answers.department_choices, function (err, res) {
                        if (err) throw err;
                        console.table(res);
                        start();
                    })
                }
        })
    })
};
//function for removing department
function removeDepartment () {
    db.query("SELECT * FROM departments", function (err, data) {
        if (err) throw err;
        let departments = data.map(departments => {
            return { name: departments.name, value: departments.id }
        })
        let nullValue = { name: 'Return to main menu.', value: 100 };
        departments.push(nullValue);
        inquirer.prompt([
            {
                type: "list",
                name: "department_choices",
                message: "Select department to remove.",
                choices: departments
            }]).then(answers => {
                if (answers.department_choices === 100 ) {
                    start();
                }
                else {
                    db.query("DELETE from departments WHERE departments.id = ?", answers.department_choices, function (err, res) {
                        if (err) throw err;
                        console.table(res);
                        start();
                    })
                }
        })
    })
};
//function remove role
function removeRole () {
    db.query("SELECT * FROM roles", function (err, data) {
        if (err) throw err;
        let roles = data.map(roles => {
            return { name: roles.title, value: roles.id }
        })
        let nullValue = { name: 'Return to main menu.', value: 100 };
        roles.push(nullValue);
        inquirer.prompt([
            {
                type: "list",
                name: "role_choices",
                message: "Select a Position to remove.",
                choices: roles
            }]).then(answers => {
                if (answers.role_choices === 100 ) {
                    start();
                }
                else {
                    db.query("DELETE from roles WHERE roles.id = ?", answers.role_choices, function (err, res) {
                        if (err) throw err;
                        console.table(res);
                        start();
                    })
                }
        })
    })
};

//remove employee
function removeEmployee () {
    db.query("SELECT * FROM employees", function (err, data) {
        if (err) throw err;

        let employees = data.map(employees => {
            
            return { name: `${employees.first_name} ${employees.last_name}`, value: employees.id }
        })
        let nullValue = { name: 'Return to main menu.', value: 100 };
        employees.push(nullValue);
        inquirer.prompt([
            {
                type: "list",
                name: "employee_choices",
                message: "Select a team member to remove from database.",
                choices: employees
            }]).then(answers => {
                if (answers.employee_choices === 100) {
                    start();
                }
                else {
                    db.query("DELETE from employees WHERE employees.id 0= ?", answers.employee_choices, function (err, res) {
                        if (err) throw err;
                        console.table(res);
                        start();
                    })
                }
        })
    })
};

// call our function to begin
start()