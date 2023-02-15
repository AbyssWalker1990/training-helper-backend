const express = require('express')
const app = express()
const path = require('path')
const PORT = process.env.PORT || 3500

// Built-in middleware
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(express.static(path.join(__dirname, '/public')))


app.get('^/$|/index(.html)?', (req, res) => {
  res.send('Hi')
})

app.get('/*', (req, res) => {
  res.status(404).send('Not Found')
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

