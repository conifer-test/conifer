const fs = require('fs');
const ora = require('ora');
const spinner = ora();

const { CWD } = require('./coniferConfig');

const content = `# syntax = edrevo/dockerfile-plus

FROM cypress/included:10.3.0

INCLUDE+ Dockerfile

RUN yarn add wait-on
RUN yarn add dotenv
RUN yarn add @aws-sdk/client-s3
RUN yarn add mochawesome

WORKDIR /.conifer
ADD conifer-start.sh /
RUN chmod +x /conifer-start.sh

# Reset entrypoint
ENTRYPOINT []

ARG arg
ENV FILES_GLOB=$arg

CMD ["/conifer-start.sh"]
`;

const createDockerfile = async () => {
  spinner.start('Creating Dockerfile');
  process.chdir(CWD);
  fs.writeFileSync('./Dockerfile.conifer', content);
  spinner.succeed('Dockerfile.conifer created in project directory');
};

module.exports = { createDockerfile };
