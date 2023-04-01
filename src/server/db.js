const mysql = require('mysql2');
require('dotenv').config()

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD
});



const getExams = (func) => {
    const statement = "SELECT * from exams;";
    execution(statement, func);
}

const getQuestion = (id, func) => {
    const statement = `select * from Question where id in (
select questionId from ExamQuestion where examId = "${id}");`
    execution(statement, func);
}

const execution = (sql, func) => {
    pool.execute(sql, function (err, result) {
        if (err) throw err;
        func(result);
    });
}

const insertTestCase = (qid, content) => {
    pool.execute("insert into TestCases VALUES(?,?)", [qid, content], (err, result) => {
        if (err) throw err;
    })
}

const findTestCase = (filename, qid, runcode, func) => {
    const statement = `select path from TestCases where qid="${qid}";`
    pool.execute(statement, (err, result) => {
        if (err) throw err;
        runcode(filename, func, result, qid);
    })
}

const postQuestion = (data, pass, testconversion, func) => {
    const datetime = data.Date + " " + data.Time;
    const statement = `INSERT INTO exams VALUES ("${data.id}", "${data.name}", ${data.duration}, ${data.totalMarks}, "${pass}", "${data.examstatus}","${datetime}")`;
    const statement2 = "INSERT INTO Question VALUES (?,?)";
    const statement3 = "INSERT INTO ExamQuestion VALUES(?,?)";
    pool.execute(statement, (err, result) => {
        if (err) throw err;
        //retriving year
        data.Questions.forEach((qus, index) => {
            let id = data.name + "-" + data.Date + "-" + index;
            pool.execute(statement2, [id, qus.Question], (err, result) => {
                if (err) throw err;
                pool.execute(statement3, [id, data.id], (err) => {
                    if (err) throw err;
                })
            })

        })
        testconversion(data.Questions, data.name, data.Date, func);
    })
}

//for login and registration
const retriveLogin = (no, func) => {
    const sqlCommand = "SELECT password FROM login WHERE registerno = ?";
    pool.execute(sqlCommand, [no], (error, result) => {
        if (error) {
            console.log("this is an error");
            func(true, null);
        } else {
            func(false, result);
        }
    })

}

const postRegister = (registerNo, firstname, lastname, email, password, isProfessor, func) => {
    console.log(registerNo, firstname, lastname, email, password, isProfessor);
    const sqlInsert = "INSERT INTO login (registerno, firstname, lastname,email,password,isProfessor) VALUES (?, ?, ?,?,?,?)";
    pool.execute(sqlInsert, [registerNo, firstname, lastname, email, password, isProfessor], (error, result) => {
        if (error) {
            func(true);
        } else {
            func(false);
        }
    })
}

const getType = (registerNo, func) => {
    const sql = `select isProfessor from login where registerno=${registerNo}`;
    pool.execute(sql, (error, result) => {
        if (error) throw error;
        func(result);
    })
}

module.exports = { getExams, getQuestion, findTestCase, postQuestion, insertTestCase, retriveLogin, postRegister, getType };

