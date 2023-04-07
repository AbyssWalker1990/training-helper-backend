import HttpException from '../HttpException'

class MissingDataException extends HttpException {
  constructor (message: string) {
    super(400, message)
  }
}

export default MissingDataException
