

//--------------------------------------Connection to MongoDB-------------------------------------------------------------


const mongoose = require('mongoose');
const uri = "mongodb+srv://shourya123:shourya123@ellipcluster.ar2u2.mongodb.net/numero1?retryWrites=true&w=majority"

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

var conn = mongoose.connection;
conn.on('connected', () => {
    console.log('Database connected')
})

module.exports=conn