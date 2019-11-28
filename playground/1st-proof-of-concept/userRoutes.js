const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const bcrypt = require('bcrypt')

const adapter = new FileSync('db.json')
const db = low(adapter)

/**
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
function register(req, res) {
    console.log(req.body)
    const {username, password} = req.body
    if (!username || !password) {
      res.status(400)
      res.json({
        code: 'invalidRequestPayload'
      })
    }

    const userAlreadyExists = db.get('users')
      .find({username})
      .value()

    if (userAlreadyExists) {
      res.status(400)
      res.json({
        code: 'userAlreadyExists'
      })
    }

    // hash password
    password = bcrypt.hashSync(password, 10)

    db.get('users').push({username, password}).write()
    res.status(201)
}

/**
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
async function login(req, res) {
  // console.log(req.body)
  const {username, password, rememberMe} = req.body
  if (!username || !password) {
    res.status(400)
    res.json({
      code: 'invalidRequestPayload'
    })
  }

  const user = db.get('users')
    .find({username})
    .value()

  console.log(user)

  if (!user) {
    res.status(400)
    res.json({
      code: 'userDoesNotExists'
    })
  }

  if (!bcrypt.compareSync(password, user.password)) {
    res.status(400)
    res.json({
      code: 'errLoginDataMismatch'
    })
  }

  // Get JWT
  const user = {username, password}
  const accessToken = await tokenSign(user, rememberMe)

  res.status(200)
  res.json({
    accessToken
  })
}

module.exports = {register, login}
