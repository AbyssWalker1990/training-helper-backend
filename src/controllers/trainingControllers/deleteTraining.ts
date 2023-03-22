import { Training, type TrainingModel } from '../../models/Training'
import { type Request, type Response } from 'express'
import { User, type UserModel } from '../../models/User'

interface MyCookie {
  jwt: string
}

interface CustomRequest extends Request {
  cookies: MyCookie
}

const deleteTraining = async (req: CustomRequest, res: Response): Promise<any> => {
  const cookies = req.cookies
  if (cookies?.jwt === null) return res.sendStatus(401) // Unauthorized
  const accessToken = cookies.jwt
  console.log('ACCESS TOKEN: ' + accessToken)
  // Need to be replaced later with access token
  const currentUser = await User.findOne({ refreshToken: accessToken }).exec() as UserModel
  if (currentUser == null) return res.sendStatus(403) // Forbidden
  const currentUserName = currentUser.username

  try {
    const trainingId = req.params.trainingId
    const training = await Training.findById(trainingId) as TrainingModel
    if (training.username !== currentUserName) return res.sendStatus(403)
    await Training.findByIdAndDelete(trainingId)
    console.log(`Training ${training.title} DELETED!`)
    res.status(200).json({ message: `Training ${training.title} DELETED!` })
  } catch (error) {
    console.log(error)
  }
}

export default deleteTraining
