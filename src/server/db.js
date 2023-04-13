const mysql = require('mysql2');
require('dotenv').config()

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD
});



const getExams = (id, func) => {
    console.log(id)
    const statement = `SELECT * from exams WHERE id in( select examid from examtakingstudent where registerno=${id} and examstatus="Upcoming");`;
    console.log(statement)
    execution(statement, func);
}

const getPastExams = (id, func) => {
    const statement = `SELECT * from exams WHERE id in( select examid from examtakingstudent where registerno=${id} and status="Done");`;
    console.log(statement)
    execution(statement, func);
}

const getCurrentExams = (id, func) => {
    const statement = `SELECT * from exams WHERE id in( select examid from examtakingstudent where registerno=${id} and examstatus="Ongoing" and status<>"Done");`;
    console.log(statement)
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

const findTestCase = (filename, qid, userid, runcode, func) => {
    const statement = `select path from TestCases where qid="${qid}";`
    pool.execute(statement, (err, result) => {
        if (err) throw err;
        runcode(filename, func, result, qid, userid);
    })
}

const postQuestion = (data, pass, testconversion, func) => {
    const datetime = data.Date + " " + data.Time;
    const statement = `INSERT INTO exams VALUES ("${data.id}", "${data.name}", ${data.duration}, ${data.totalMarks}, "${pass}", "${data.examstatus}","${datetime}","${data.author}")`;
    const statement2 = "INSERT INTO Question VALUES (?,?,?)";
    const statement3 = "INSERT INTO ExamQuestion VALUES(?,?)";
    //creating queries
    let insertQuery = "";
    data.Students.forEach((regno, i) => {
        insertQuery += `(${regno},"${data.id}","not-attempted",0),`
    });
    let statement4 = "INSERT INTO examtakingstudent VALUES" + insertQuery.substring(0, insertQuery.length - 1)
    console.log(statement4)
    pool.execute(statement, (err, result) => {
        if (err) throw err;
        //retriving year
        data.Questions.forEach((qus, index) => {
            let id = data.name + "-" + data.Date + "-" + index;
            pool.execute(statement2, [id, qus.Question, qus.Marks], (err, result) => {
                if (err) throw err;
                pool.execute(statement3, [id, data.id], (err) => {
                    if (err) throw err;
                    pool.execute(statement4, (err, result) => {
                        if (err) throw err;
                    })
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

const getStudents = (func) => {
    const sql = `select registerno, firstname, lastname from login where isProfessor=0`;
    pool.execute(sql, (error, result) => {
        if (error) {
            func(true, null)
        } else {
            func(false, result)
        }
    })
}

//get timing
const getTiming = (userid, examid, func) => {
    //first check if the user is connecting for the first time
    const sql2 = `select * from userexamstatus where registerno=${userid} and examid="${examid}"`

    pool.execute(sql2, (error, result) => {
        if (error) throw error;
        if (result.length <= 0) {
            //first time
            const sql = `select duration from exams where id = '${examid}'`
            console.log(sql)
            pool.execute(sql, async (error, result) => {
                if (error) {
                    console.log(error)
                } else {
                    pool.query(`INSERT INTO userexamstatus(registerno,examid,remaining_time) values(${userid},'${examid}',${result[0].duration})`)
                    func(true, result)
                }
            })
        } else {
            const sql3 = `select remaining_time from userexamstatus where registerno=${userid} and examid="${examid}"`
            //reconnecting
            pool.execute(sql3, (error, result) => {
                if (error) throw error;
                func(false, result)
            })
        }
    })




}

//update marks
const updateMarks = (userid, questionid) => {
    console.log(userid, questionid)
    const examid = questionid.substring(0, questionid.lastIndexOf('-'));
    //update now
    const sql = `update examtakingstudent set marks=marks + (select Marks from Question where id='${questionid}') where registerno='${userid}' and examid='${examid}'`
    console.log(sql)
    pool.execute(sql, (error, result) => {
        if (error) {
            console.log(error)
        }
    })
}

//storing time
const storeTime = (userid, examid, time) => {
    const sql = `update userexamstatus set remaining_time=${time} where registerno=${userid} and examid="${examid}"`
    pool.execute(sql, (error, result) => {
        if (error) throw error;
    })
}

//update status
const updateExamStatus = (userid, examid, status) => {
    //console.log(" in update ")
    const sql = `update examtakingstudent set status="${status}" where registerno=${userid} and examid="${examid}"`
    pool.execute(sql, (error, result) => {
        if (error) throw error;
    })
}


//get all the dates and time 
const getDateTime = (func) => {
    const sql = 'select Date from exams where examstatus="upcoming"';
    pool.execute(sql, (error, result) => {
        if (error) throw error;
        func(result)
    })
}

const setStatus = (examid) => {
    const sql = `update exams set examstatus="ongoing" where id="${examid}"`
    pool.execute(sql, (err) => {
        if (err) throw err;
    })
}

const getTeacherExams = (userid, func) => {
    const sql = `select * from exams where author="${userid}"`
    pool.execute(sql, (err, result) => {
        if (err) throw err;
        func(result)
    })
}

const getStu = (examid, func) => {
    const sql = `select * from login where registerno in (select registerno from examtakingstudent where examid="${examid}")`;
    pool.execute(sql, (err, result) => {
        if (err) throw err;
        func(result);
    })
}


module.exports = {
    getExams, getQuestion, findTestCase, postQuestion, insertTestCase, retriveLogin,
    postRegister, getType, getStudents, updateMarks, getTiming, storeTime, updateExamStatus
    , getDateTime, setStatus, getCurrentExams, getPastExams, getTeacherExams, getStu
};

