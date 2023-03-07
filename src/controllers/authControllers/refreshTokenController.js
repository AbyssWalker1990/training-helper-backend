const User = require('../../models/User')
const jwt = require('jsonwebtoken')

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies
  if (!cookies?.jwt) return res.sendStatus(401) // Unauthorized
  const refreshToken = cookies.jwt
  console.log(`Refresh token cookie: ${refreshToken}`)
  const currentUser = await User.findOne({ refreshToken }).exec()
  console.log(`User refresh token: ${currentUser.refreshToken}`)
  console.log(`Name: ${currentUser.username}`)
  if (!currentUser) return res.sendStatus(403) // Forbidden
  // Decode jwt refresh token
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (err, decoded) => {
      console.log(`Decoded: ${decoded.username}`)
      if (err || currentUser.username !== decoded.username) return res.sendStatus(403)
      const accessToken = jwt.sign(
        { "username": currentUser.username },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '20m' }
      )
      res.json({ accessToken })
    }
  )
}

module.exports = { handleRefreshToken }