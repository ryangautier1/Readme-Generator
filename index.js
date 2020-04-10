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
            message: "Enter your project title:",
            name: "title"
        },
        {
            message: "Enter a label for your badge:",
            name: "badgeLabel"
        },
        {
            message: "Enter a message for your badge:",
            name: "badgeMessage"
        },
        {
            message: "Enter a description for your project:",
            name: "description"
        },
        {
            message: "Your USER STORY will be displayed in a AS A, I WANT, SO THAT format. Enter something to follow 'AS A':",
            name: "userASA"
        },
        {
            message: "Enter something to follow 'I WANT':",
            name: "userIWant"
        },
        {
            message: "Enter something to follow 'SO THAT':",
            name: "userSoThat"
        },
        {
            message: "Enter your project's acceptance criteria:",
            name: "userAcceptanceCriteria"
        },
        {
            message: "Enter your porject's installation instructions:",
            name: "installation"
        },
        {
            message: "Enter your project's usage info:",
            name: "usage"
        },
        {
            message: "Enter your project's credits information:",
            name: "credits"
        },
        {
            message: "Enter your project's license information:",
            name: "license"
        },
        {
            message: "Enter your project's contributing information:",
            name: "contributing"
        },
        {
            message: "Enter your project's testing information:",
            name: "tests"
        }
    ])
}

function generateReadMe(data) {
    return `# ${data.title}

![Badge](https://img.shields.io/badge/${data.badgeLabel}-${data.badgeMessage}-blue)
    
## Description
${data.description}
    
### User Story
\`\`\`
AS a ${data.userASA}
I WANT ${data.userIWant}
SO THAT ${data.userSoThat}
\`\`\`
    
### Acceptance Criteria
\`\`\`
${data.userAcceptanceCriteria}
\`\`\`
    
## Table of Contents
    
* [Installation](#installation)
* [Usage](#usage)
* [Credits](#credits)
* [License](#license)
    
## Installation
${data.installation}
    
## Usage 
${data.usage}
    
## Credits
${data.credits}
    
## License
${data.license}
    
## Contributing
${data.contributing}
    
## Tests
${data.tests}
    
## Questions
\`\`\`
Email : ${data.userEmail}
\`\`\`
![Picture of me](${data.userPictureUrl})`;
}
const readMeArray = {
    title: "",
    badgeLabel: "",
    badgeMessage: "",
    description: "",
    userASA: "",
    userIWant: "",
    userSoThat: "",
    userAcceptanceCriteria: "",
    installation: "",
    usage: "",
    credits: "",
    license: "",
    contributing: "",
    tests: "",
    userEmail: "",
    userPictureUrl: ""
};

async function init() {
    console.log("Begin:");
    try {
        const answer = await promptUser();

        readMeArray.title = answer.title;

        // any spaces in user inout must be replaced with %20 for the badge url to work
        readMeArray.badgeLabel = answer.badgeLabel.replace(" ", "%20");
        readMeArray.badgeMessage = answer.badgeMessage.replace(" ", "%20");;

        readMeArray.description = answer.description;
        readMeArray.userASA = answer.userASA;
        readMeArray.userIWant = answer.userIWant;
        readMeArray.userSoThat = answer.userSoThat;
        readMeArray.userAcceptanceCriteria = answer.userAcceptanceCriteria;
        readMeArray.installation = answer.installation;
        readMeArray.usage = answer.usage;
        readMeArray.credits = answer.credits;
        readMeArray.license = answer.license;
        readMeArray.contributing = answer.contributing;
        readMeArray.tests = answer.tests;

        const queryUrl = `https://api.github.com/users/${answer.username}`;
        axios.get(queryUrl).then(function (res) {
            readMeArray.userEmail = res.data.email;
            readMeArray.userPictureUrl = res.data.avatar_url;

            const readMeData = generateReadMe(readMeArray);
            writeFileAsync("README.md", readMeData);
        });
        console.log("wrote it!")
    }
    catch (err) {
        console.log(err);
    }
}

init();