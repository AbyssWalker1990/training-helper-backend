import { plainToInstance } from 'class-transformer'
import { validate, type ValidationError } from 'class-validator'
import { type RequestHandler } from 'express'
import HttpException from '../exceptions/HttpException'

function validationMiddleware (type: any): RequestHandler {
  return (req, res, next) => {
    validate(plainToInstance(type, req.body))
      .then((errors: ValidationError[]) => {
        if (errors.length > 0) {
          const message = errors.map((error) => {
            if (error.constraints != null) {
              return Object.values(error.constraints)
            } else {
              return ''
            }
          }).join(', ')
          next(new HttpException(400, message))
        } else {
          next()
        }
      })
      .catch((err) => { console.log(err) })
  }
}

export default validationMiddleware
