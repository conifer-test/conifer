const chalk = require('chalk');
const inquirer = require('inquirer'); //https://www.npmjs.com/package/inquirer/v/7.0.2
//use old version of inquirer for require compatibility: npm install --save inquirer@^8.0.0
const { writeFileSync } = require('fs');
// const { config } = require('process');

const configFileName = 'conifer-config.json';


/*stuff from the fireship tutorial:
https://github.com/fireship-io/javascript-millionaire/blob/main/README.md
//npm i chalk chalk-animation figlet gradient-string inquirer nanospinner




*/




const tinycolor = require('tinycolor2')
const gradient = require('gradient-string');
// const chalkAnimation = require('chalk-animation');
const figlet = require('figlet');
const { createSpinner } = require('nanospinner');


// let coolGradient = gradient([
//   tinycolor('#FFBB65'),       // tinycolor object
//   {r: 0, g: 255, b: 0},       // RGB object
//   {h: 240, s: 1, v: 1, a: 1}, // HSVa object
//   'rgb(120, 120, 0)',         // RGB CSS string
//   'gold'                      // named color
// ]);

// let coolGradient = gradient([
//   'dark-green',
//   'green'
// ]);
// let coolString = coolGradient('This is a fancy string!');
// console.log(coolString);


// figlet('conifer!!', function(err, data) {
//   if (err) {
//     console.log('Something went wrong...');
//     console.dir(err);
//     return;
//   }
//   console.log(gradient.pastel.multiline(data));
// });


// const spinner = createSpinner('Run test').start()

// setTimeout(() => {s
//   spinner.success();
// }, 1000);

// import ora from 'ora';

// const ora = require('ora')

// const spinner = ora('Loading unicorns').start();

// setTimeout(() => {
// 	spinner.color = 'yellow';
// 	spinner.text = 'Loading rainbows';
// }, 1000);


/*dotenv stuff
npm install dotenv --save



*/


module.exports = async () => {
  // console.log(`${chalk.cyan('Hello World')}`);

  await inquirer.prompt([
    {
      type:'input',
      name: 'cred',
      message: 'what is your id?',
      default: '123'
    },
    {
      type: 'password',
      name: 'pw',
      message: 'what is your pw?',
      default: '***'
    }
  ])
    .then(answers => {
      console.log(answers);
      let envStr = "";
      for (let e of Object.entries(answers)) {
        envStr += String(e[0]) + "=" + "'" + String(e[1]) + "'" + "\n";
      }
      writeFileSync('.env', envStr);
    })
    .catch(e => console.log('error: ', e));

  await inquirer.prompt([ 
    {
      type: 'input',
      name: 'first_name',
      message: 'what is your first name?',
      default: 'sam',
      validate: x => {
        if (x === 'samuel') {
          return 'woah too fancy';
        } else {
          return true;
        }
      }
    },
    {
      type: 'input',
      name: 'first_name2',
      message: 'what is your first name2?',
      validate: function(x){
        if (x === '') {
          // return 'this is a required question';
          return true;
        }
        return true;
      }
    },
    {
      type: 'expand',
      message: 'Conflict on `file.js`: ',
      name: 'overwrite',
      choices: [
        {
          key: 'y',
          name: 'Overwrite',
          value: 'overwrite',
        },
        {
          key: 'a',
          name: 'Overwrite this one and all next',
          value: 'overwrite_all',
        },
        {
          key: 'd',
          name: 'Show diff',
          value: 'diff',
        },
        new inquirer.Separator(),
        {
          key: 'x',
          name: 'Abort',
          value: 'abort',
        },
      ],
    },

    {
      type: 'confirm',
      name: 'bacon',
      message: 'Do you like bacon?',
    },
    {
      type: 'input',
      name: 'favorite',
      message: 'Bacon lover, what is your favorite type of bacon?',
      when(answers) {
        return answers.bacon;
      },
    },
    {
      type: 'confirm',
      name: 'pizza',
      message: 'Ok... Do you like pizza?',
      when(answers) {
        return !likesFood('bacon')(answers);
      },
    },
    {
      type: 'input',
      name: 'favorite',
      message: 'Whew! What is your favorite type of pizza?',
      when: likesFood('pizza'),
    },
  


  ])
    .then((answers) => {
      console.log('answers: ',answers);
      writeFileSync(configFileName, JSON.stringify(answers))
    })
    .catch(e => console.log(e));
  // writeFileSync()
};

function likesFood(aFood) {
  return function (answers) {
    return answers[aFood];
  };
}