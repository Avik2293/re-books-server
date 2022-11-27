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

        const bookingCollection = client.db('reBooksDb').collection('bookings');

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

        // new book for sale create
        app.post('/book', async (req, res) => {
            const newBook = req.body;
            // newBook.postTime = new Date(); //server date 
            const result = await bookCollection.insertOne(newBook);
            res.send(result);
        });

        // books read by email
        app.get('/books', async (req, res) => {
            let query = {};
            if (req.query.email) {
                query = {
                    sellerEmail: req.query.email
                }
            }
            const cursor = bookCollection.find(query);
            const books = await cursor.toArray();
            console.log(books);
            res.send(books);
        })

        // Book delete by _id
        app.delete('/book/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await bookCollection.deleteOne(query);
            res.send(result);
        });

        // book advertise update by _id
        app.patch('/book/:id', async (req, res) => {
            const id = req.params.id;
            const update = req.body;
            console.log(req.body);
            const query = { _id: ObjectId(id) };
            const option = { upsert: true };
            const updatedDoc = {
                $set: {
                    advertised: update.advertised
                }
            }
            const result = await bookCollection.updateOne(query, updatedDoc, option);
            res.send(result);
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
            if (eachUser == null) {
                res.send(eachUser == false);
            }
            else {
                res.send(eachUser);
            }
        });

        // find seller
        app.get('/users/sellers', async (req, res) => {
            let query = { role: "Seller" };
            const cursor = userCollection.find(query);
            const eachSeller = await cursor.toArray();
            console.log(eachSeller);
            res.send(eachSeller);
        });

        // user-seller verified update by _id
        app.patch('/users/:id', async (req, res) => {
            const id = req.params.id;
            const update = req.body;
            console.log(req.body);
            const query = { _id: ObjectId(id) };
            const option = { upsert: true };
            const updatedDoc = {
                $set: {
                    verified: update.verified
                }
            }
            const result = await userCollection.updateOne(query, updatedDoc, option);
            res.send(result);
        });

        // // Admin check by email
        // app.get('/users/admin/:email', async (req, res) => {
        //     const email = req.params.email;
        //     const query = { userEmail: `${email}` };
        //     const cursor = userCollection.findOne(query);
        //     const user = await cursor;
        //     console.log(user);
        //     res.send({isAdmin: user?.role === "Admin"});
        // });

        // bookings create
        app.post('/bookings', async (req, res) => {
            const booking = req.body;
            const result = await bookingCollection.insertOne(booking);
            res.send(result);
        });

        // bookings read by email
        app.get('/bookings', async (req, res) => {
            let query = {};
            if (req.query.email) {
                query = {
                    bookingEmail: req.query.email
                }
            }
            const cursor = bookingCollection.find(query);
            const bookings = await cursor.toArray();
            console.log(bookings);
            // if(bookings == null){
            //     res.send(bookings == false);
            // }
            // else{
            res.send(bookings);
            // }
        });

    }
    finally { }
}
run().catch(err => console.error(err));

// app.get('/', (req, res) =>{
//     res.send('Re-Books server is running');
// })

app.listen(port, () => {
    console.log(`Re-Books running on: ${port}`)
})