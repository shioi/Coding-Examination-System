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
select questionId from ExamQuestion where examId = ${id});`
    execution(statement, func);
}

const execution = (sql, func) => {
    pool.execute(sql, function (err, result) {
        if (err) throw err;
        func(result);
    });
}

module.exports = { getExams, getQuestion };