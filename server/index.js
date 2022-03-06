require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const auth = require('./routes/auth');
const post = require('./routes/post');

const connectDB = async () => {
    try {
        await mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.veij3.mongodb.net/testdatabase?retryWrites=true&w=majority`,{
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log('MongoDB Connected...');
    } catch (err) {
        console.log(err.message);
        process.exit(1);
    }
}

connectDB();

const app = express();
app.use(express.json());

app.use('/api/auth', auth);
app.use('/api/post', post);

const Post = 5000



app.listen(Post, () => {
  console.log(`Example app listening on port ${Post}!`);
});