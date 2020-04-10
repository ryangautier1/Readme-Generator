const fs = require("fs");
const axios = require("axios");
const inquirer = require("inquirer");
const util = require("util");

const writeFileAsync = util.promisify(fs.writeFile);

function promptUser() {
    return inquirer.prompt([
        {
            message: "Enter your GitHub username:",
            name: "username"
        },
        {
            message: "Enter the project title:",
            name: "project"
        }
    ])
}


function generateReadMe(userEmail, userPictureUrl) {
    return `Hello, you look like this ${userPictureUrl}, and your email is ${userEmail}`;
}

async function init() {
    console.log("Begin");
    try {
        const answer = await promptUser();
        const queryUrl = `https://api.github.com/users/${answer.username}`;
        axios.get(queryUrl).then(function (res) {
            const userEmail = res.data.email;
            const userPictureUrl = res.data.avatar_url;
            const readMeData = generateReadMe(userEmail, userPictureUrl);
            writeFileAsync("README.md", readMeData);
        });
        console.log("wrote it!")
    }
    catch (err) {
        console.log(err);
    }
}

init();