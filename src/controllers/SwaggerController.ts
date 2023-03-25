import swaggerUI from 'swagger-ui-express'
import specsSwagger from '../config/swaggerOptions'
import type Controller from '../interfaces/controller.interface'
import express from 'express'

class SwaggerController implements Controller {
  public path = ''
  public router = express.Router()

  constructor () {
    this.initRoutes()
  }

  public initRoutes (): void {
    this.router.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specsSwagger))
  }
}

export default SwaggerController
