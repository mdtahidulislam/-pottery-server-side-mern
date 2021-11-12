const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 5000

// middlewire
app.use(cors())
app.use(express.json())

// root api
app.get('/', (req, res) => {
    res.send('Server Running from Pottery')
})

// Listen
app.listen(port, (req, res) => {
    console.log('Server running ta port', port);
})