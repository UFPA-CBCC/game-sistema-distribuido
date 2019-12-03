const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const bcrypt = require('bcrypt')

const {tokenSign, tokenVerify} = require('./utils')

const adapter = new FileSync('db.json')
const db = low(adapter)

/**
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
function register(req, res) {
  let {username, password} = req.body
  if (!username || !password) {
    res.status(400).send({
      code: 'invalidRequestPayload'
    })
    return
  }

  const userAlreadyExists = db.get('users')
    .find({username})
    .value()

  if (userAlreadyExists) {
    res.status(400).send({
      code: 'userAlreadyExists'
    })
    return
  }

  // hash password
  password = bcrypt.hashSync(password, 10)

  db.get('users').push({username, password}).write()
  res.header('Location', `/api/users/${username}`)
  res.status(201).end()
}

/**
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
async function login(req, res) {
  const {username, password, rememberMe} = req.body
  if (!username || !password) {
    res.status(400).send({
      code: 'invalidRequestPayload'
    })
    return
  }

  const user = db.get('users')
    .find({username})
    .value()

  if (!user) {
    res.status(400).send({
      code: 'userDoesNotExists'
    })
    return
  }

  if (!bcrypt.compareSync(password, user.password)) {
    res.status(400).send({
      code: 'errLoginDataMismatch'
    })
    return
  }

  // Get JWT
  const userData = {username, password}
  const accessToken = await tokenSign(userData, rememberMe)

  res.status(200)
    .cookie('accessToken', accessToken)
    .cookie('username', userData.username)
    .end()
}

/**
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
function list(req, res) {
  const users = db.get('users').map('username').value()
  res.status(200).send(users)
}

/**
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Express.next} next
 */
async function authz(req, res, next) {
  const { accessToken } = req.cookies
  try {
    tokenVerify(accessToken)
    await next()
  } catch(e) {
    res.status(400).send({
      code: 'errOnAuthz'
    })
  }
}

module.exports = {register, login, authz, list}
