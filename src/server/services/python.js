const fs = require("fs");
const { exec } = require("child_process");

const createnewFile = (data) => {
    const filename = "file.py"
    var writeStream = fs.createWriteStream(filename);
    writeStream.write(data);
    writeStream.end();
    return filename;
}

const runcode = (command, func) => {
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
                data: stdout
            });

        }
    })
}

const runPython = (data, func) => {
    const file = createnewFile(data);
    const command = "python " + file;
    runcode(command, func);
}


module.exports = { runPython };


