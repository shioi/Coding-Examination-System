const express = require("express");
var bodyParser = require('body-parser')
const python = require('./services/python.js')
const cors = require('cors');
const dbms = require('./db');
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
    python.runPython(data.content, (data) => {
        res.status(200).json(data);
    });

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

app.listen(port, () => {
    console.log("Listening at " + port);
})
