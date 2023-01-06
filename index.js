const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();
// middle wares
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("genius car update 2.0 server is running");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.nftlnia.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

//verify jwt 
function verifyJWT(req, res, next){
  const authHeader = req.headers.authorization;
  if(!authHeader){
    return res.status(401).send({message: 'Unauthorize access'})
  }
  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(err, decoded){
    if(err){
      return res.status(403).send({message: 'Forbidden access'})
    }
    req.decoded = decoded
    next()
  })
}


async function run() {
  try {
    //serviceCOllection
    const serviceCollection = client.db("geniusCar").collection("services");
    //order collection
    const orderCollection = client.db("geniusCar").collection("orders");

    app.post("/jwt", async (req, res, next) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "5",
      });
      res.send({ token });
    });

    //services api
    //all service fetch
    app.get("/services", async (req, res) => {
      const query = {};
      const result = await serviceCollection.find(query).toArray();
      res.send(result);
    });
    //single service

    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await serviceCollection.findOne(query);
      res.send(service);
    });

    //orders api
    app.get("/orders", verifyJWT, async (req, res) => {
      const decoded = req.decoded;
      if(decoded.email !== req.query.email){
        res.send({message: 'Unauthorized access'})
      }
      console.log('Inside order api', decoded)
      let query = {};
      if (req.query.email) {
        query = {
          email: req.query.email,
        };
      }
      const result = await orderCollection.find(query).toArray();
      res.send(result);
    });

    //order post
    app.post("/orders", async (req, res) => {
      const order = req.body;
      const result = orderCollection.insertOne(order);
      res.send(result);
    });

    //delete method
    app.delete("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await orderCollection.deleteOne(query);
      res.send(result);
    });

    app.patch("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const status = req.body.status;
      console.log(id, status);
      const query = { _id: ObjectId(id) };
      const updatedDoc = {
        $set: {
          status: status,
        },
      };
      const result = await orderCollection.updateOne(query, updatedDoc);
      res.send(result);
    });
  } finally {
    //  await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Genius car update 2.0 server running .... on ${port}`);
});
