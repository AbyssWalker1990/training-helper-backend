import path from 'path'
import swaggerJsDoc from 'swagger-jsdoc'

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Training Helper API',
      version: '1.0.0',
      description: 'Simple app for training notes'
    },
    servers: [
      {
        url: 'http://localhost:3500'
      }
    ]
  },
  apis: [
    path.join(__dirname, '..', 'routes/auth/*.js')
  ]
}

const specsSwagger = swaggerJsDoc(options)

export default specsSwagger
