const mysql = require('mysql');
const inquirer = require('inquirer');


const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'password',
  database: 'tracker_db',
});

connection.connect((err) => {
  if (err) throw err;
  runInquirer();
});

const runInquirer = () => {
  inquirer
    .prompt({
      name: 'action',
      type: 'list',
      message: 'What would you like to do?',
      choices: [
        'View All Employees',
        "View All Employees By Role",
        'View All Employees By Department',
        'View All Managers',
        'View All Roles',
        'Add Employee',
        'Add Department',
        'Add Role',
        'Remove Employee',
        'Update Employee Role',
        'Update Employee Manager',
        
        'Exit'
      ],
    })
    .then((answer) => {
      switch (answer.action) {
        case 'View All Employees':
          viewEmployees();
          break;
        
        case 'View All Employees By Role':
          viewEmployeesByRoles();
          break;

        case 'View All Employees By Department':
          viewEmployeesByDepartment();
          break;

        case 'View All Managers':
          viewManagers();
          break;

        case 'View All Roles':
          viewAllRoles();
          break;

        case 'Add Employee':
          addEmployee();
          break;

        case 'Add Department':
          addDepartment();
          break;

        case 'Add Role':
          addRole();
          break; 

        case 'Remove Employee':
          removeEmployee();
          break;
          
        case 'Update Employee Role':
          updateEmployeeRole();
          break;
  
        case 'Update Employee Manager':
          updateEmployeeManager();
          break;
  


        case 'Exit':
          connection.end();
          break;

        default:
          console.log(`Invalid action: ${answer.action}`);
          break;
      }
    });
};

function viewEmployees() {
  connection.query("SELECT employee.first_name, employee.last_name, role.title, role.salary, department.name, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager FROM employee INNER JOIN role on role.id = employee.role_id INNER JOIN department on department.id = role.department_id left join employee e on employee.manager_id = e.id;", 
  function(err, res) {
    if (err) throw err
    console.table(res)
    runInquirer()
  })
}

function viewEmployeesByRoles() {
  connection.query("SELECT employee.first_name, employee.last_name, department.name AS Department FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY employee.id;", 
  function(err, res) {
    if (err) throw err
    console.table(res)
    runInquirer()
  })
}

function viewEmployeesByDepartment() {
  connection.query("SELECT employee.first_name, employee.last_name, department.name AS Department FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY employee.id;", 
  function(err, res) {
    if (err) throw err
    console.table(res)
    runInquirer()
  })
}

