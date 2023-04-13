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


//formatting the error output
const formatError = (out) => {
    //find if its a syntax error or not
    let result;
    const isType = out.includes("TypeError");
    const isAttribute = out.includes("AttributeError");
    if (isType || isAttribute) {
        //find the last index of a line
        const lastLineIndex = out.lastIndexOf("Error")
        result = { "syntax": false, "Error": out.substring(lastLineIndex, out.length) }
    } else {
        const lastErrorIndex = out.lastIndexOf("line")
        result = { "syntax": true, "Error": out.substring(lastErrorIndex, out.length) }
    }
    return result;
}

//iteration over solved
const findSolved = (url) => {
    let solvedData;
    try {
        const data = fs.readFileSync(url,
            { encoding: 'utf8', flag: 'r' });
        solvedData = data.split('\n');
    } catch (err) {
        solvedData = null;
    }

    return solvedData;
}


const runcode = async (filename, func, url, qid, userid) => {
    fs.rename(__dirname + "/../" + filename, path.join(url[0].path, filename), function (err) {
        if (err) throw err
    })

    const command = `python ${url[0].path}/test.py`;

    exec(command, async (err, stdout, stderr) => {
        //iterate over solved.txt
        const solvedData = findSolved(`${url[0].path}/solved.txt`);
        const totalProbSolved = {
            'total': solvedData[0].substring(solvedData[0].lastIndexOf(':') + 1),
            'solved': solvedData[1].substring(solvedData[1].lastIndexOf(':') + 1)
        }
        console.log(totalProbSolved)
        if (err || stderr) {
            console.log(`Error: ${err.message}`);
            const output = formatError(err.message);
            func({
                type: "Error",
                errorType: output.syntax,
                data: output.Error,
                totalTestPassed: totalProbSolved
            });
        } else if (stderr) {
            console.log(`stderr: ${stderr.message}`)
            func({
                type: "Error",
                data: err.message,
                totalTestPassed: totalProbSolved
            });
        } else {
            if (totalProbSolved['total'] === totalProbSolved['solved']) {
                await dbms.updateMarks(userid, qid)
            }
            func({
                type: "Success",
                data: stdout,
                qid: qid,
                totalTestPassed: totalProbSolved
            });

        }
    })
}

const runPython = (data, qid, userid, func) => {
    console.log(qid);
    const file = createnewFile(data);
    //const command = "python " + file;
    dbms.findTestCase(file, qid, userid, runcode, func);
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
        console.log(funcFile)
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


