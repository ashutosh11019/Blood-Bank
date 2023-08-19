const mongoose = require('mongoose')

mongoose.connect(process.env.mongo_url)

const connection = mongoose.connection

connection.on('connected', () => {
    console.log('Server Connected')
})

connection.on('error', (err) => {
    console.log('Server Connection Error', err)
})


