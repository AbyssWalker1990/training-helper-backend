import mongoose from 'mongoose'
import type { TrainingModel } from '../interfaces/training.interface'
const Schema = mongoose.Schema

const trainingSchema = new Schema<TrainingModel>({
  username: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  exercises: [
    {
      position: {
        type: String,
        required: true
      },
      name: {
        type: String,
        required: true
      },
      sets: [{
        setPos: {
          type: Number,
          required: true
        },
        reps: {
          type: Number,
          required: true
        },
        weight: {
          type: Number
        }
      }]
    }
  ]
})

export const Training = mongoose.model<TrainingModel>('Training', trainingSchema)
