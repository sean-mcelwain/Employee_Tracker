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
        'Add Employee',
        'Add Department',
        'Add Role',
        'Update Employee Role',
        
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

        case 'Add Employee':
          addEmployee();
          break;

        case 'Add Department':
          addDepartment();
          break;

        case 'Add Role':
          addRole();
          break; 
          
        case 'Update Employee Role':
          updateEmployeeRole();
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


let roleArray = [];
function selectRole() {
  connection.query("SELECT * FROM role", function(err, res) {
    if (err) throw err
    for (let i = 0; i < res.length; i++) {
      roleArray.push(res[i].title);
    }

  })
  return roleArray;
}

let managersArray = [];
function selectManager() {
  connection.query("SELECT first_name, last_name FROM employee WHERE manager_id IS NULL", function(err, res) {
    if (err) throw err
    for (let i = 0; i < res.length; i++) {
      managersArray.push(res[i].first_name);
    }

  })
  return managersArray;
}

function addEmployee() { 
  inquirer.prompt([
      {
        name: "firstname",
        type: "input",
        message: "Employee's first name: "
      },
      {
        name: "lastname",
        type: "input",
        message: "Employee's last name: "
      },
      {
        name: "role",
        type: "list",
        message: "What is their role? ",
        choices: selectRole()
      },
      {
          name: "choice",
          type: "rawlist",
          message: "Whats their managers name?",
          choices: selectManager()
      }
  ]).then(function (res) {
    let roleId = selectRole().indexOf(res.role) + 1
    let managerId = selectManager().indexOf(res.choice) + 1
    let firstName = res.firstname;
    let lastName = res.lastname;
    connection.query("INSERT INTO employee SET ?", 
    {
        first_name: firstName,
        last_name: lastName,
        manager_id: managerId,
        role_id: roleId
        
    }, function(err){
        if (err) throw err
        console.table(res)
        runInquirer();
    })

})
}

function addDepartment() { 
  inquirer.prompt([
      {
        name: "name",
        type: "input",
        message: "What Department would you like to add?"
      }
  ]).then(function(res) {
      connection.query("INSERT INTO department SET ? ",
          {
            name: res.name
          },
          function(err) {
              if (err) throw err
              console.table(res);
              runInquirer();
          }
      )
  })
}


function addRole() { 
  connection.query("SELECT role.title AS Title, role.salary AS Salary FROM role",   function(err, res) {
    inquirer.prompt([
        {
          name: "Title",
          type: "input",
          message: "New Role Title: "
        },
        {
          name: "Salary",
          type: "input",
          message: "New Role Salary?"

        } 
    ]).then(function(res) {
        connection.query(
            "INSERT INTO role SET ?",
            {
              title: res.Title,
              salary: res.Salary,
            },
            function(err) {
                if (err) throw err
                console.table(res);
                runInquirer();
            }
        )

    });
  });
  }

  function updateEmployeeRole() {
    connection.query("SELECT employee.last_name, role.title FROM employee JOIN role ON employee.role_id = role.id;", function(err, res) {
     if (err) throw err
     console.log(res)
    inquirer.prompt([
          {
            name: "lastName",
            type: "rawlist",
            choices: function() {
              let lastName = [];
              for (let i = 0; i < res.length; i++) {
                lastName.push(res[i].last_name);
              }
              return lastName;
            },
            message: "What is the Employee's last name? ",
          },
          {
            name: "role",
            type: "rawlist",
            message: "What is the Employees new role? ",
            choices: selectRole()
          },
      ]).then(function(val) {
        let roleId = selectRole().indexOf(val.role) + 1
        let lastName = val.lastname;
        connection.query("UPDATE employee SET WHERE ?", 
        {
          last_name: lastName
           
        }, 
        {
          role_id: roleId
           
        }, 
        function(err){
            if (err) throw err
            console.table(val)
            runInquirer();
        })
  
    });
  });

  }