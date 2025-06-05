const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;
require("dotenv").config();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@chicken-hub.rc8bdv2.mongodb.net/?retryWrites=true&w=majority&appName=Chicken-Hub`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const database = client.db("usersdb");
    const usersCollection = database.collection("users");

    app.get("/all-foods", async (req, res) => {
      const cursor = usersCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // app.get("/my-plants/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: new ObjectId(id) };
    //   const result = await usersCollection.findOne(query);
    //   res.send(result);
    // });

    app.post("/all-foods", async (req, res) => {
      console.log("data in the server ", req.body);
      const newfood = req.body;
      const result = await usersCollection.insertOne(newfood);
      res.send(result);
    });

    // app.put("/my-plants/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const filter = { _id: new ObjectId(id) };
    //   const user = req.body;

    //   const updatedInfo = {
    //     $set: {
    //       name: user.name,
    //       photo: user.photo,
    //       price: user.price,
    //       lasteDate: user.lastDate,
    //       nextDate: user.nextDate,
    //       des: user.des,
    //     },
    //   };
    //   const result = await usersCollection.updateOne(filter, updatedInfo);
    //   res.send(result);
    // });

    // app.delete("/my-plants/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: new ObjectId(id) };
    //   const result = await usersCollection.deleteOne(query);
    //   res.send(result);
    // });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Chicken Hub server is active now...!");
});

app.listen(port, () => {
  console.log(`Chicken Hub server is running on port ${port}`);
});
