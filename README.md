# [![Conifer-branding-logo](https://conifer-test.github.io/images/logo/logo-name.svg)][github]

[![shields.io npm version badge](https://img.shields.io/npm/v/conifer-test?style=flat&logo=npm)][npm]
[![shields.io npm license badge](https://img.shields.io/npm/l/conifer-test?style=flat)][npm]
[![shields.io custom website link badge](https://img.shields.io/static/v1?label=website&message=conifer-test.github.io&color=green?style=flat)][website]

## Overview

Conifer is an open-source framework that allows developers to easily deploy an infrastructure that runs Cypress tests in parallel without a CI. The user can run the full Cypress test suite on a parallelised infrastructure that belongs to them.

[Read our case study for more information about test parallelization and to learn how we built Conifer.](https://conifer-test.github.io)

## The Team

**[Sam Harreschou](https://www.linkedin.com/in/samuel-harr/)** _Software Engineer_ Los Angeles, CA

**[Ahmad Jiha](https://www.linkedin.com/in/ahmad-jiha/)** _Software Engineer_ Bay Area, CA

**[Ainaa Sakinah](https://www.linkedin.com/in/ainaasakinah/)** _Software Engineer_ Tokyo, Japan

**[Lawrence Tam](https://www.linkedin.com/in/lawrenceatam/)** _Software Engineer_ Bay Area, CA

---

## Table of Contents

- [Prerequisites](https://github.com/conifer-test/conifer#prerequisites)
- [Installing Conifer](https://github.com/conifer-test/conifer#installing-conifer)
- [Initialization](https://github.com/conifer-test/conifer#initialization)
- [Building a Conifer Image](https://github.com/conifer-test/conifer#building-a-conifer-image)
- [Deploying Conifer](https://github.com/conifer-test/conifer#deploying-conifer)
- [Teardown](https://github.com/conifer-test/conifer#teardown)
- [Architecture](https://github.com/conifer-test/conifer#conifer-architecture)
- [Helpful Resources](https://github.com/conifer-test/conifer#helpful-resources)

---

## Prerequisites

- Node.js (v12+)
- NPM
- AWS Account
- AWS CLI configured locally
- Docker (v18.09+)

You'll need to have the above accounts and tools before running any Conifer commands. Being that Conifer is an Node package, both Node.js and NPM must be installed on your local machine. Conifer also requires you to have an AWS account and the AWS CLI configured locally since it relies your local environment to provision AWS resources. Conifer uses Docker images and containers to run parallelized tests on AWS.

---

## Installing Conifer

```sh
npm i -g conifer-test
```

## Conifer Commands

| Command            | Description                                                                                                                            |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| `conifer init`     | Gathers project information, testing parameters, and provisions necessary tools to build, deploy, and run conifer in your application. |
| `conifer build `   | Builds your application with Conifer's Dockerfile and uploads the image to AWS ECR.                                                    |
| `conifer deploy`   | Deploys the AWS infrastructure needed to run your application's tests in parallel.                                                     |
| `conifer run`      | Runs your application's tests in parallel based on the gathered testing parameters.                                                    |
| `conifer teardown` | Destroys most or all of the AWS resources that were deployed.                                                                          |

---

## Initialization

The first command you want to run to setup your project is `init`.

### `conifer init`
![conifer-init][conifer-init]

> **Note** 
> Please ensure you are in your project directory before running `conifer init`.
- Conifer prompts you for the number of parallel instances you want provisioned and the type of AWS EC2 instance.
- Conifer provisions a `.conifer` folder within your project directory and installs the necessary deployment and dashboard packages to deploy and run Conifer.
- Creates a configuration file called `conifer-config.json` that stores prompt information.

---

## Building a Conifer Image

### Prerequisites:

- Application Dockerfile

Conifer assumes your application already has a Dockerfile and will use your Dockerfile in combination with Conifer's Dockerfile.

> **Note**
> In order for Conifer to use your Dockerfile, you will need to comment out your `FROM` instruction.

### `conifer build`
![conifer-build][conifer-build]
- Builds the Conifer image based on your Dockerfile and Conifer's Dockerfile to install the necessary dependencies needed to run your application and perform Cypress tests within a Docker container.
- Once built, the image is automatically pushed to the your private AWS Elastic Container Registry (ECR).
- Can be used to re-build if any changes were made to your application.

---

## Deploying Conifer

### `conifer deploy`
![conifer-deploy][conifer-deploy]

- Deploys the required AWS infrastructure using AWS CDK based on Conifer's configuration file.
- Automatically launches the Conifer dashboard so you can see your test results live.

---

## Running Tests on Conifer

### `conifer run`
- The local dashboard server and React front-end will automatically spin up and start receiving live test run result data for the user to view. The user will also have access to the videos recorded by Cypress within the dashboard.

![conifer-run][conifer-run]


---
## Teardown

### `conifer teardown`
![conifer-teardown][conifer-teardown]

Destroys most or all of the AWS infrastructure depending on prompt responses.

> **Note**
> We do not destroy the Image stored on AWS ECR and the DynamoDB Table unless specified.

---

## Conifer Architecture

![Conifer Architecture][architecture]

The above diagram shows the complete infrastructure of Conifer that is provisioned with `deploy`. For a deeper understanding of this architecture and what each piece is doing, please read our [case study](https://conifer-test.github.io).

---

## Helpful Resources

- [AWS CLI Setup](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-welcome.html)
- [Dockerfile Reference](https://docs.docker.com/engine/reference/builder/)
- [Conifer Case Study](https://conifer-test.github.io)

[npm]: https://www.npmjs.com/package/conifer-test
[website]: https://conifer-test.github.io/
[github]: https://github.com/conifer-test
[architecture]: https://raw.githubusercontent.com/conifer-test/conifer-test.github.io/main/images/diagrams/conifer_full_architecture.png
[conifer-init]: https://github.com/conifer-test/conifer-test.github.io/blob/main/images/diagrams/conifer_init.gif?raw=true
[conifer-build]: https://github.com/conifer-test/conifer-test.github.io/blob/main/images/diagrams/conifer-build.gif?raw=true
[conifer-deploy]: https://github.com/conifer-test/conifer-test.github.io/blob/main/images/diagrams/conifer-deploy3x.gif?raw=true
[conifer-run]: https://github.com/conifer-test/conifer-test.github.io/blob/main/images/diagrams/live_dashboard.gif?raw=true
[conifer-teardown]: https://github.com/conifer-test/conifer-test.github.io/blob/main/images/diagrams/conifer-td4x.gif?raw=true