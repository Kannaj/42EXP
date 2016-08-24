require('dotenv').config({silent:true});

import chaiAsPromised from 'chai-as-promised';
import chai from 'chai';
var pgp = require('pg-promise')();
var cn = process.env.TEST_DATABASE_URL

export const db = pgp(cn)

chai.use(chaiAsPromised)
