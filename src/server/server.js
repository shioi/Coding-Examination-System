const express = require("express");
var bodyParser = require('body-parser')
const python = require('./services/python.js')
const cors = require('cors');
const dbms = require('./db');
const crypto = require("crypto");
const app = express();
const port = 4000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors());


app.get("/", (req, res) => {
    res.render('index');
})


app.post('/postcode', (req, res) => {
    const data = JSON.parse(JSON.stringify(req.body));
    console.log(data);
    python.runPython(data.content, data.questionId, (data) => {
        res.status(200).json(data);
    });

})

app.post('/postquestion', async (req, res) => {
    const data = req.body;
    //python.convertToTest(data, dbms.postQuestion);
    const algorithm = "aes-256-cbc";
    const initVector = crypto.randomBytes(16);
    const Securitykey = crypto.randomBytes(32);
    const cipher = crypto.createCipheriv(algorithm, Securitykey, initVector);
    let password = cipher.update(data.password, "utf-8", "hex");
    password += cipher.final("hex");
    dbms.postQuestion(data, password, python.convertToTest, (result) => {
        res.status(200);
    })

})

app.get('/getexams', (req, res) => {
    dbms.getExams((result) => {
        res.status(200).json(result);
    });
})

app.get('/question/:qid', (req, res) => {
    const id = req.params.qid;
    //console.log(id);
    dbms.getQuestion(id, (result) => {
        res.status(200).json(result);
    })
})


app.get("/api/get/login", (req, res) => {
    dbms.retriveLogin((result) => {
	res.send(result);
    })
});

app.post("/api/post/signup", (req, res) => {
    const { username, password, isProfessor } = req.body;
    dbms.postRegister(username, password, isProfessor, ()=>{
	res.status(200);
    })
});


app.listen(port, () => {
    console.log("Listening at " + port);
})

