


import chaiAsPromised from 'chai-as-promised';
import chai from 'chai';
var pgp = require('pg-promise')();



process.env.DATABASE_URL = 'postgres://avernus:Domain123@localhost:5432/42EXP_test'

var cn = process.env.DATABASE_URL

export const db = pgp(cn)

chai.use(chaiAsPromised)
