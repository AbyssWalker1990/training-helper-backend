import mongoose, { type Date } from 'mongoose'
const Schema = mongoose.Schema

export interface TrainingModel {
  username: string
  title: string
  date: Date
  exercises: {
    position: number
    name: string
    set: {
      setPos: number
      reps: number
      weight: number
    }
  }
}

const trainingSchema = new Schema<TrainingModel>({
  username: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  exercises: [
    {
      set: {
        setPos: {
          type: Number,
          required: true
        },
        name: {
          type: String,
          required: true
        },
        weight: {
          type: Number
        }
      }
    }
  ]
})

export const Training = mongoose.model<TrainingModel>('Training', trainingSchema)
