const { sign, verify, decode } = require('jsonwebtoken')
/**
 * Picks objects fields
 * @param {Object} obj
 * @param {Array} params
 */
function pick(obj, params) {
  const payload = {}
  for (const d in obj) {
    if (params.includes(d)) {
      payload[d] = obj[d]
    }
  }
  return payload
}

// Default exp = 24h
const TIMEOUT = 60 * 60 * 24

async function tokenSign(user, rememberMe, expiresIn = TIMEOUT) {
  const exp = Math.floor(Date.now() / 1000) + expiresIn
  return {
    accessToken: sign(
      { user, exp, rmb: !!rememberMe },
      process.env.JWT_SECRET
    )
  }
}

/* RememberMe prolonga a expiração para 1 mẽs (default)
 * Verificar o token recebido no header contra o xsrfToken no JWT
 */
function tokenVerify(token, xsrfToken, rememberMeFactor = 30) {
  const tokenPayload = decode(token, { json: true })
  const maxAge = tokenPayload.rmb ? TIMEOUT * rememberMeFactor : TIMEOUT
  return verify(token, process.env.JWT_SECRET, { maxAge })
}

module.exports = {pick, tokenSign, tokenVerify}
