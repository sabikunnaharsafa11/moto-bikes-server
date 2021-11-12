const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const ObjectId = require("mongodb").ObjectId;
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.a87wj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, {
 useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
    try {
      await client.connect();
    //   console.log('database connected succesfully');
      const database = client.db("motoBikes");
      const productCollection = database.collection("products");
      const orderCollection = database.collection("orders");
      const userCollection = database.collection("users");
  
  
      // GET API
      app.get("/products", async (req, res) => {
        const cursor =  productCollection.find({});
        const products = await cursor.toArray();
        res.send( products);
      });

      // POST API
    app.post("/products", async (req, res) => {
        const newUser = req.body;
        console.log("got new user ", req.body);
        const result = await  productCollection.insertOne(newUser);
        console.log("added user", result);
        res.send(result);
      });
  

    //   // GET single services
      app.get("/products/:id", async (req, res) => {
        const id = req.params.id;
        console.log("getting specific service", id);
        const query = { _id: ObjectId(id) };
        const product = await productCollection.findOne(query);
        res.json(product);
      });
  
    //  Add orders
      app.post("/orders", async (req, res) => {
        const order = req.body;
        const result = await orderCollection.insertOne(order);
        console.log("order", order);
        res.json(result);
      });

    //  GET orders 
      app.get('/orders',async (req,res)=>{
          const order = await orderCollection.find({});
          const result = await order.toArray();
          res.send(result)
      })

  app.get("/orders/:email", async (req, res) => {
        const myOrder = await orderCollection
          .find({
            email: req.params.email,
          })
          .toArray();
        res.send(myOrder);
      });
  
      // delect product order
    //   app.delete("/products/:id", async (req, res) => {
    //     const id = req.params.id;
    //     const query = { _id: ObjectId(id) };
    //     const result = await servicesCollection.deleteOne(query);
    //     res.json(result);
    //   });
  
    // delete order api
      app.delete("/deleteOrders/:id", async (req, res) => {
        const id = req.params.id;
        const result = await orderCollection.deleteOne({
          _id: ObjectId(id),
        });
        console.log("deleted.fired");
        res.send(result);
      });

    // POST User 
      app.post("/users", async (req, res) => {
        const user = req.body;
        const result = await userCollection.insertOne(user);
        console.log("user", user);
        res.json(result);
      });

      app.put('/users', async (req, res) => {
        const user = req.body;
        console.log('put', user);
        const filter = { email: user.email };
        const options = { upsert: true };
        const updateDoc = { $set: user };
        const result = await userCollection.updateOne(filter, updateDoc, options);
        res.json(result);
    });

    app.put('/users/admin', async(req, res) => {
        const user = req.body;
        console.log('put', user);
        const filter = { email: user.email };
        const updateDoc = { $set: {role: 'admin' } };
        const result = await userCollection.updateOne(filter, updateDoc);
        res.json(result);
    })


    } finally {
      //  await client.close();
    }
  }
  
  run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World Moto Bikes!')
})

app.listen(port, () => {
  console.log(`listening at ${port}`)
})