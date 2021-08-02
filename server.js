const express = require('express');
const connectDB = require("./config/db.js");

const app = express();

//Init middleware to parse req.body
app.use(express.json({extended:false}));

//Connect Database
connectDB();

app.use('/api/users',require('./Routes/api/users'));
app.use('/api/auth',require('./Routes/api/auth'));
app.use('/api/posts',require('./Routes/api/posts'));
app.use('/api/profile',require('./Routes/api/profile'));


app.get('/', (req, res) => {
    res.send('API running');
})

const PORT = process.env.PORT || 5000; //if no env varuable set defaults to port no 5000

app.listen(PORT, () => {
    console.log(`Server started on ${PORT}`);
})