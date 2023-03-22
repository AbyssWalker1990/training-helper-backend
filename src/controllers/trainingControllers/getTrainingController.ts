import { Training, type TrainingModel } from '../../models/Training'
import { type Request, type Response } from 'express'
import { User, type UserModel } from '../../models/User'

interface MyCookie {
  jwt: string
}

interface CustomRequest extends Request {
  cookies: MyCookie
}

export const getTrainingsByUser = async (req: CustomRequest, res: Response): Promise<any> => {
  const cookies = req.cookies
  if (cookies?.jwt === null) return res.sendStatus(401) // Unauthorized
  const accessToken = cookies.jwt
  console.log('ACCESS TOKEN: ' + accessToken)
  // Need to be replaced later with access token
  const currentUser = await User.findOne({ refreshToken: accessToken }).exec() as UserModel
  if (currentUser == null) return res.sendStatus(403) // Forbidden
  const currentUserName = currentUser.username

  try {
    const trainingList = await Training.find({ username: currentUserName })
    res.status(200).json(trainingList as TrainingModel[])
  } catch (error) {
    console.log(error)
  }
}

export const getTrainingById = async (req: CustomRequest, res: Response): Promise<any> => {
  const trainingId = req.params.trainingId
  if (trainingId == null || trainingId === undefined || trainingId === '') {
    return res.status(400).json({ message: 'Invalid ID' })
  }
  try {
    const training = await Training.findById(trainingId) as TrainingModel
    if (training !== null && training !== undefined) {
      res.status(200).json(training)
    }
    console.log(training)
  } catch (error) {
    console.log(error)
  }
}
