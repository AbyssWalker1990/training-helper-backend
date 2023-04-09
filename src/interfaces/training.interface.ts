export interface TrainingModel {
  username: string
  title: string
  date: Date
  exercises: [{
    position: number
    name: string
    set: {
      setPos: number
      reps: number
      weight: number
    }
  }]
}
