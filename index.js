const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.RB_DB}:${process.env.RB_DB_PASSWORD}@cluster0.tjxwcci.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// console.log(uri);


async function run() {
    try {
        const catagoryCollection = client.db('reBooksDb').collection('catagories');

        app.get('/', async (req, res) => {
            const query = {}
            const cursor = catagoryCollection.find(query);
            const catagories = await cursor.toArray();
            res.send(catagories);
        });

    }
    finally {

    }
}
run().catch(err => console.error(err));

// app.get('/', (req, res) =>{
//     res.send('Re-Books server is running');
// })

app.listen(port, () => {
    console.log(`Re-Books running on: ${port}`)
})