const config = require('../config.json');
const mongoose = require('mongoose');
url = "mongodb+srv://shourya123:shourya123@ellipcluster.ar2u2.mongodb.net/numero1?retryWrites=true&w=majority"

// url = "mongodb://localhost:27017/numero"
mongoose.connect(process.env.MONGODB_URI || config.connectionString, { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true ,useFindAndModify: false}).catch((err)=>console.log(err));
mongoose.Promise = global.Promise;

module.exports = {
    User: require('../model/users')
};