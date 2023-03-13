const fs = require("fs");
const { exec, execSync } = require("child_process");
const dbms = require('../db');
const path = require('path');

const createnewFile = (data) => {
    const filename = "file.py"
    var writeStream = fs.createWriteStream(filename);
    writeStream.write(data);
    writeStream.end();
    return filename;
}


const runcode = (filename, func, url, qid) => {
    fs.rename(__dirname + "/../" + filename, path.join(url[0].path, filename), function (err) {
        if (err) throw err
    })

    const command = `python ${url[0].path}/test.py`;

    exec(command, (err, stdout, stderr) => {
        if (err) {
            console.log(`Error: ${err.message}`);
            func({
                type: "Error",
                data: err.message
            });
        } else if (stderr) {
            console.log(`stderr: ${stderr.message}`)
            func({
                type: "Error",
                data: err.message
            });
        } else {
            func({
                type: "Success",
                data: stdout,
                qid: qid,
            });

        }
    })
}

const runPython = (data, qid, func) => {
    console.log(qid);
    const file = createnewFile(data);
    //const command = "python " + file;
    dbms.findTestCase(file, qid, runcode, func);
    //runcode(command, func);
}

const createFolder = (folderPath, name) => {
    const folderName = path.join(folderPath, name);
    console.log(folderName)
    try {
        if (!fs.existsSync(folderName)) {
            fs.mkdirSync(folderName);
        }
    } catch (err) {
        console.error(err);
    }
    return folderName;
}


//converting to json and storing
const convertToTest = (data, name, date, func) => {
    console.log(data);
    const testingPath = path.join(__dirname, "..", "testing", "generateTestCases.py");
    const dictPath = path.join(__dirname, "..", "..", "..", "testCases");
    data.forEach((qus, index) => {
        let funcFile = [];
        const id = name + "-" + date + "-" + index;
        qus.Functions.forEach(fun => {
            let testText = [];
            fun.TestCases.forEach(test => {
                const inputArr = test.Input.split(',');
                const Inputs = [];
                inputArr.forEach(input => {
                    Inputs.push({ "input": input })
                })
                testText.push({ "Inputs": Inputs, "Output": test.Output });
            })
            funcFile.push({
                "functionName": fun.functionName,
                "type": fun.Type,
                "tests": testText
            })
        })
        console.log("for: " + id);
        const folderpath = createFolder(dictPath, id);
        //write to file
        try {
            fs.writeFileSync(path.join(folderpath, "test.json"), JSON.stringify(funcFile));
        } catch (err) {
            console.error(err);
        }
        dbms.insertTestCase(id, folderpath);
        const command = `python ${testingPath} ${folderpath}/test ${folderpath}/test.json`;
        execSync(command, (err) => {
            if (err) throw err;
        });

    })
}

module.exports = { runPython, convertToTest };


