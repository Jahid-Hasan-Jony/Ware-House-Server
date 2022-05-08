const express = require('express')
const cors = require('cors');
const jwt = require('jsonwebtoken')
require('dotenv').config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();

//middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.r1icf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const foodsCollection = client.db('gloceryStore').collection('foods')
        //Auth
        app.get('/login', async (req, res){

        })
        //Others
        app.get('/foods', async (req, res) => {
            const query = {};
            const cursor = foodsCollection.find(query);
            const foods = await cursor.toArray();
            res.send(foods);
        })

        // update product
        app.put('/foods/:id', async (req, res) => {
            const id = req.params.id;
            const updatedQuantity = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = { $set: { quantity: parseInt(updatedQuantity.quantity) } };
            const result = await foodsCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        })
        app.get('/foods/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const cursor = await foodsCollection.findOne(query);
            res.send(cursor);
        })
        // add product
        app.post('/foods', async (req, res) => {
            const newFood = req.body;
            const result = await foodsCollection.insertOne(newFood);
            res.send(result);
        })
        // delete item
        app.delete('/foods/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await foodsCollection.deleteOne(query);
            res.send(result);
        })
    }
    finally { }
}
run().catch(console.dir)


app.get('/', (req, res) => {
    res.send('okk response doing')
})

app.listen(port, () => {
    console.log('server working')
})