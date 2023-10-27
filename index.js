const express = require('express');
const mongoose = require('mongoose');
const router = require('./route/route')
const cors = require('cors')

const app = express();
const port = 8080;

app.use(cors())
app.options('*',cors())
app.use(express.json());
app.get('/',(req,res)=> {
res.status(200).json({message:'Connected'})
})
app.use('/', router);

mongoose.connect('mongodb+srv://Keerthika:keerthika@cluster0.gghgn0m.mongodb.net/Event')
.then(()=> console.log('Mongoose Connected'))

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
