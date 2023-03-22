import express from 'express'
import createTraining from '../../controllers/trainingControllers/createTrainingController'
import { getTrainingsByUser, getTrainingById } from '../../controllers/trainingControllers/getTrainingController'
import deleteTraining from '../../controllers/trainingControllers/deleteTraining'
const trainingRouter = express.Router()

trainingRouter.post('/', (req, res) => {
  createTraining(req, res)
    .catch((err) => { console.log(err) })
})

trainingRouter.get('/user', (req, res) => {
  getTrainingsByUser(req, res)
    .catch((err) => { console.log(err) })
})

trainingRouter.get('/:trainingId', (req, res) => {
  getTrainingById(req, res)
    .catch((err) => { console.log(err) })
})

trainingRouter.delete('/:trainingId', (req, res) => {
  deleteTraining(req, res)
    .catch((err) => { console.log(err) })
})

export default trainingRouter
