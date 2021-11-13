const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
const { MongoClient } = require('mongodb');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;

// db credential & client
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.apq2y.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri);

// middlewire
app.use(cors())
app.use(express.json())

// connect DB
async function run() {
    try {
        await client.connect();
        const database = client.db("Pottery");
        const potteriesCollection = database.collection("potteries");
        const ordersCollection = database.collection("orders");

        // GET API 6 POTTERIES
        app.get('/potteries', async (req, res) => {
            const query = {};
            const cursor = potteriesCollection.find(query);
            const potteries = await cursor.limit(6).toArray();
            res.json(potteries)
        })

        // GET API ALL POTTERIES
        app.get('/allpotteries', async (req, res) => {
            const query = {};
            const cursor = potteriesCollection.find(query);
            const potteries = await cursor.toArray();
            res.json(potteries)
        })

        // GET API SPECIFIC POTTERY
        app.get('/potteries/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const pottery = await potteriesCollection.findOne(query);
            res.send(pottery);
        })

        // POST ORDER
        app.post('/orders', async (req, res) => {
            const newOrder = req.body;
            const result = await ordersCollection.insertOne(newOrder);
            res.send(result);
        })

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