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
        
        const bookCollection = client.db('reBooksDb').collection('books');

        const userCollection = client.db('reBooksDb').collection('users');

        // home
        app.get('/', async (req, res) => {
            const query = {}
            const cursor = catagoryCollection.find(query);
            const catagories = await cursor.toArray();
            res.send(catagories);
        });

        // books read by catagory id
        app.get('/catagory/:id', async (req, res) => {
            const id = req.params.id;
            // console.log(typeof id);
            const query = { catagoryId: +id };
            const cursor = bookCollection.find(query);
            const books = await cursor.toArray();
            // console.log(books);
            res.send(books);
        });

        // users create
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user);
            res.send(result);
        });

        // user read by email
        app.get('/users', async (req, res) => {
            let query = {};
            if (req.query.email) {
                query = {
                    userEmail: req.query.email
                }
            }
            const cursor = userCollection.findOne(query);
            const eachUser = await cursor;
            console.log(eachUser);
            if(eachUser == null){
                res.send(eachUser == false);
            }
            else{
                res.send(eachUser);
            }
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