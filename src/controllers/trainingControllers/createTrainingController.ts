import { Training, type TrainingModel } from '../../models/Training'
import { type Request, type Response } from 'express'

const createTraining = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, title, exercises } = req.body as TrainingModel
    if (username === '' || username === null || username === undefined) {
      res.status(400).json({ message: 'Username required' })
    }
    if (title === '' || title === null || title === undefined) {
      res.status(400).json({ message: 'Title required' })
    }

    const newTraining = await Training.create({
      username,
      title,
      exercises
    })
    console.log(newTraining)
    res.status(201).json({ success: `New Training ${newTraining.title} created!!!` })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: (error as Error).message })
  }
}

export default createTraining
