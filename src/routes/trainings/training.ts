import express from 'express'
import createTraining from '../../controllers/trainingControllers/createTrainingController'

const trainingRouter = express.Router()

trainingRouter.post('/', (req, res) => {
  createTraining(req, res)
    .catch((err) => { console.log(err) })
})

export default trainingRouter
