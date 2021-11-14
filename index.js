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
        const reviewsCollection = database.collection("reviews");
        const usersCollection = database.collection("users");

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

        // GET API (Order)
        app.get('/orders', async (req, res) => {
            const userEmail = req.query.userEmail;
            const query = { userEmail: userEmail };
            const cursor = ordersCollection.find(query);
            const orders = await cursor.toArray();
            res.json(orders);
        })

        // DELETE API (Order)
        app.delete('/orders/:orderId', async (req, res) => {
            const id = req.params.orderId;
            const query = { _id: ObjectId(id) }
            const result = await ordersCollection.deleteOne(query)
            res.json(result);
        })

        // POST REVIEW
        app.post('/reviews', async (req, res) => {
            const newReview = req.body;
            const result = await reviewsCollection.insertOne(newReview);
            res.send(result);
        })

        // GET REVIEW
        app.get('/reviews', async (req, res) => {
            const query = {};
            const cursor = reviewsCollection.find(query);
            const reviews = await cursor.toArray();
            res.json(reviews);
        })

        // POST USER
        app.post('/users', async (req, res) => {
            const newUser = req.body;
            const result = await usersCollection.insertOne(newUser);
            res.send(result);
        })

        // UPADTE USER AS ADMIN
        app.put('/users/admin', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email }
            const updateDoc = { $set: { role: 'admin' } }
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.json(result);
        })

        // GET USER & CHECK ADMIN
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin });
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