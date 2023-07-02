export interface TrainingModel {
  username: string
  title: string
  date: Date
  exercises: [{
    position: number
    name: string
    sets: {
      setPos: number
      reps: number
      weight: number
    }
  }]
}

export interface Exercise {
  position: number
  name: string
  sets: singleSet[]
}

export interface singleSet {
  setPos: number
  reps: number
  weight: number
}
