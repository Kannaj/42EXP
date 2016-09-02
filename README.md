42 Exp
======

### Greetings!

This is the primary codebase that powers [42exp.com](https://42exp.com). Each folder has its own readme file which explains how everything works.

-------

## Quickstart

### Installation

There are two ways to start 42exp.com locally.

1. Docker
  - clone the repo
  - create a `.env` file similar to `.env-example`
  - run `make development`

2. Non-Docker
  - Clone the repo
  - Run `npm install`
  - create a `.env` file similar to `.env-example`.
    - NOTE : database url will be different when not using docker.
    - Database url is of the format **postgres://username:password@postgres:5432/42EXP**
    - Ensure that postgres already has a `42EXP` table.
  - run `webpack --watch --progress` in another terminal to ensure static files are watched and updated.
  - run `npm start`

=====

### Stack

42exp.com uses the following stack

- Front-end:
  - React
  - Redux
  - SCSS
- Backend
  - Node.js (6.4)
  - Express.js
  - Socketcluster
  - pg-promise
  - node-pg-migrate
  - Postgresql (9.4)
- Devops
  - Docker
  - Ansible
- Testing
  - Mocha
  - Chai
  - Enzyme

====

### Testing

Run tests by either
  1. Docker
    - run `make tests`
  2. Non-Docker
    - run `npm test`
    - ensure you specify the test-database in your env-file
    - server tests execute `42EXP-test.sql` which creates the database for you.
