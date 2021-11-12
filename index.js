const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 5000
const { MongoClient } = require('mongodb');
require('dotenv').config();

// db credential & client
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.apq2y.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri);

// middlewire
app.use(cors())
app.use(express.json())

// connect DBs
async function run() {
    try {
        await client.connect();
        const database = client.db("Pottery");
        const potteriesCollection = database.collection("potteries");

    } finally {
        //   await client.close();
    }
}
run().catch(console.dir);

// root api
app.get('/', (req, res) => {
    res.send('Server Running from Pottery')
})

// Listen
app.listen(port, (req, res) => {
    console.log('Server running ta port', port);
})