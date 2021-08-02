const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

const connectDB = async () => {
    try {
        await mongoose.connect(db, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex:true,
            useFindAndModify:false
        });
        console.log('MongoDB Connected');
    } catch (e) {
        console.error(e.message);
        //Exit process with failure i.e shut down the server
        process.exit(1);
    }
};

module.exports = connectDB;