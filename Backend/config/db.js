const mongoose = require('mongoose')

const connect = () => {
    mongoose.connect('mongodb://localhost:27017/Blog-App')
    .then(() => {console.log("Database is connected")})
    .catch((error) => {console.log(error)})
}

module.exports = connect