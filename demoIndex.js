/* const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.nftlnia.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

//jwt
function verifyJwt(req, res, next) {
  const authHeaders = req.headers.authorization;
  if (!authHeaders) {
  return res.status(401).send({ message: "unauthorized access" });
  }
  const token = authHeaders.split(' ')[1]
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(err, decoded){
    if(err){
      res.status(403).send({message: 'unauthorized access'})
    }
    req.decoded= decoded;
    next()
  })
}

async function run() {
  try {
    //serviceCOllection
    const serviceCollection = client.db("geniusCar").collection("services");
    //order collection
    const orderCollection = client.db("geniusCar").collection("orders");

    //
    app.post("/jwt", async (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1d",
      });
      res.send({ token });
    });

    // all services api call
    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    });

    //single services api call
    app.get("/services/:id", verifyJwt, async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await serviceCollection.findOne(query);
      res.send(service);
    });

    //orders api call
    app.get("/orders", verifyJwt, async (req, res) => {
      const decoded = req.decoded;
      console.log('inside or api', decoded)
      if(decoded.email !== req.query.email){
        res.status(403).send({message: 'unauthorized access'})
      }
      let query = {};
      if (req.query.email) {
        query = {
          email: req.query.email,
        };
      }
      const cursor = orderCollection.find(query);
      const orders = await cursor.toArray();
      res.send(orders);
    });

    app.post("/orders", async (req, res) => {
      const order = req.body;
      const result = orderCollection.insertOne(order);
      res.send(result);
    });

    //patch
    app.patch("/orders/:id",  async (req, res) => {
      const id = req.params.id;
      const status = req.body.status;
      const query = { _id: ObjectId(id) };
      const updateDoc = {
        $set: {
          status: status,
        },
      };
      const result = await orderCollection.updateOne(query, updateDoc);
      res.send(result);
    });

    // delete method
    app.delete("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await orderCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
}
run().catch((error) => console.error(error));

app.get("/", (req, res) => {
  res.send("Hello Genius Car Server");
});
app.listen(PORT, () => {
  console.log("genius car server is running", PORT);
});

/*
//mongodb 
0. npm install mongodb
1. create New Project (copy user and password)
2. Database > Connect > connect your application copy (include full drive) paste index.js 
//
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://GeniusCar:<password>@cluster0.nftlnia.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});
3. Remove this and create async function
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
}); 
4. create async function (follow mongodb crud find many)
async function run(){
    try{
        //4.1 create collection 
const serviceCollection = client.db("geniusCar").collection('services');
    }
    finally{

    }
}
run().catch(error => console.error(error))
5. Database > collections > create database same name 
client.db("geniusCar").collection(services);
database name (geniusCar)
collection(services)
6. Backend data load করতে api lagbe
app.get('/services', async(req, res) => {

    })
7. query কারে কারে find করতে চাই ( )
 const query = { runtime: { $lt: 15 } };

৮। সব গুলাকে find করতে চাইলে empty object দিতে হবে।

const query = { };
৯। data sort করতে options use করে। 
  const options = {
      // sort returned documents in ascending order by title (A->Z)
      sort: { title: 1 },
      // Include only the `title` and `imdb` fields in each returned document
      projection: { _id: 0, title: 1, imdb: 1 },
    };
10. অথবা find use করতে cursor নিবো।
    const query = { };
    const cursor = serviceCollection.find(query);

11. data create করার জন্য Express er post method use করতে হয়
 //orders api call
    app.post("/orders", async (req, res) => {
      const order = req.body;
      const result = orderCollection.insertOne(order);
      res.send(result);
    });
12. //  call post method
    fetch("https://genius-car-server-kappa-orpin.vercel.app/orders", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body:JSON.stringify(order)
    })
    .then(res=> res.json)
    .then(data=> console.log(data))
    .then(error => console.error(error))
13, //api get korte hole
  app.get("/orders", async (req, res) => {
      const query = {};
      const cursor = orderCollection.find(query);
      const orders = await cursor.toArray();
      res.send(orders);
    });
  14, delete server site
  // delete method
    app.delete("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await orderCollection.deleteOne(query);
      res.send(result);
    });
    15. delete client site code
      const handleDelete = (id) => {
    const proceed = window.confirm("Are you sure, you want ");
    if (proceed) {
      fetch(`https://genius-car-server-kappa-orpin.vercel.app/orders/${id}`, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          if (data.deletedCount > 0) {
            alert("deleted successfully");
            const remaining = orders.filter(odr=> odr._id !== id);
            setOrders(remaining)
          }
        });
    }
  };

14. patch server code
 //patch
    app.patch('/orders/:id', async(req, res) => {
      const id = req.params.id;
      const status = req.body.status;
      const query = {_id:ObjectId(id)};
      const updateDoc = {
        $set:{
          status: status
        }
      }
      const result = await orderCollection.updateOne(query, updateDoc);
      res.send(result)
    })
    14. patch client site code
    //patch
  const handleStatusUpdate = (id) => {
    fetch(`https://genius-car-server-kappa-orpin.vercel.app/orders/${id}`, {
      method: "PATCH",
      Headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ status: "Approved" }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.modifiedCOunt > 0) {
          const remaining = orders.filter((odr) => odr._id !== id);
          const approving = orders.find(odr => odr._id === id);
          approving.status = 'Approved'
          const newOrders = [...remaining, approving];
          setOrders(newOrders);
        }
      });
  };


*/
*/