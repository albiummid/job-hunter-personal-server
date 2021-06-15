const express = require('express');
const cors = require('cors')
const admin = require('firebase-admin');
const app = express();
const jwt_decode = require('jwt-decode');
const port = process.env.PORT || 5000;
require('dotenv').config();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!')
})


const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gpn2l.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log("database connected , err", err);
    const usersCollection = client.db(`${process.env.DB_NAME}`).collection("users");

    app.post('/addUser', (req, res) => {
        const userInfo = req.body;
        console.log(userInfo);
        usersCollection.insertOne(userInfo)
            .then(result => {
                console.log(result.insertedCount);
                res.send(result.insertedCount > 0)
            })
    })

    app.get('/isClient', (req, res) => {
        const token = req.query.token;
        const { email } = jwt_decode(token);
        usersCollection.find({ email: email })
            .toArray((err, documents) => {
                res.send(documents)
                console.log(documents, "fouind");
            })



    });
});

app.listen(port, () => {
    console.log(`Job Hunting listening at http://localhost:${port}`)
})