import HttpException from '../HttpException'

class TokenExpiredException extends HttpException {
  constructor () {
    super(401, 'Access Token Expired!')
  }
}

export default TokenExpiredException
