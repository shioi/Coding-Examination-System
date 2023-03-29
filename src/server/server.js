const express = require("express");
var bodyParser = require('body-parser')
const python = require('./services/python.js')
const cors = require('cors');
const dbms = require('./db');
const crypto = require("crypto");
const app = express();
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken");
const port = 4000;

const createToken = (id) => {
    return jwt.sign({ id }, process.env.SECRET, { expiresIn: '3d' });
}

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


app.post("/api/post/login", async (req, res) => {
    const { registerNo, password } = req.body;
    dbms.retriveLogin(registerNo, (error, result) => {
        if (error) {
            res.status(200).json({ error: true, message: "Register Number does not exist" });
        } else if (result.length === 0) {
            res.status(200).json({ error: true, message: "Register Number does not exist" });
        } else {
            bcrypt.compare(password, result[0].password, (err, data) => {
                if (err) throw error;
                if (!data) {
                    res.status(200).json({ error: true, message: "Wrong password" });
                } else {
                    const token = createToken(registerNo);
                    res.status(200).json({ error: false, tok: token });
                }
            });
        }
    })
});

app.post("/api/post/signup", async (req, res) => {
    const { registerNo, firstname, lastname, email, password, isProfessor } = req.body;
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    dbms.postRegister(registerNo, firstname, lastname, email, hash, isProfessor, (error) => {
        if (error) {
            res.status(200).json({ error: true })
        } else {
            const token = createToken(registerNo);
            res.status(200).json({ error: false, tok: token })
        }
    })
});


app.listen(port, () => {
    console.log("Listening at " + port);
})

