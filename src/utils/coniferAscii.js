const gradient = require('gradient-string');
const figlet = require('figlet');

module.exports = () => {
  console.log(
    gradient.atlas.multiline(
      figlet.textSync('conifer', {
        font: 'Nancyj',
        horizontalLayout: 'default',
        whitespaceBreak: true,
      })
    )
  );
};
