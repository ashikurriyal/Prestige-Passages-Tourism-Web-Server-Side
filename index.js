const express = require('express');
const cors = require('cors');
const app = express()
require('dotenv').config()
const port = process.env.PORT || 5300;


app.use(express.json())
app.use(cors())



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5ltl8ps.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        //await client.connect();
        // Send a ping to confirm a successful connection
        //await client.db("admin").command({ ping: 1 });


        const placeCollection = client.db('PrestigePassagesDB').collection('place')
        app.get('/place', async (req, res) => {
            const cursor = placeCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })
        app.get('/place/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await placeCollection.findOne(query)
            res.send(result)
        })

        //for my list page (email)
        app.get('/myList/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: (email) };
            const result = await placeCollection.find(query).toArray()
            res.send(result);
        })
        app.post('/place', async (req, res) => {
            const place = req.body;
            const result = await placeCollection.insertOne(place)
            res.send(result);
            console.log(result);
        })

        //update
        app.put('/place/:id', async (req, res) => {
            const id = req.params.id
            console.log(id)
            const filter = { _id: new ObjectId(id) }
            const updatedItem = req.body;
            const item = {
                $set: {
                    tourists_spot_name: updatedItem.tourists_spot_name,
                    short_description: updatedItem.short_description,
                    average_cost: updatedItem.average_cost,
                    country_Name: updatedItem.country_Name,
                    location: updatedItem.location,
                    seasonality: updatedItem.seasonality,
                    travel_time: updatedItem.travel_time,
                    image: updatedItem.image,
                    totaVisitorsPerYear: updatedItem.totaVisitorsPerYear
                }
            }
            const result = await placeCollection.updateOne(filter, item)
            res.send(result);
        })

        app.get('/country/:country_Name', async(req,res) => {
            const country_Name = req.params.country_Name
            const query = {country_Name: country_Name}
            const result = await placeCollection.find(query).toArray()
            res.send(result)
        })

        //delete
        app.delete('/myList/:id', async (req, res) => {
            const id = req.params.id
            // console.log(id);
            const query = { _id: new ObjectId(id) }
            // console.log(query)
            const result = await placeCollection.deleteOne(query);
            // console.log(result)
            res.send(result);
          })

        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        //await client.close();
    }
}
run().catch(console.dir);





app.get('/', (req, res) => {
    res.send('Prestige Passages Server is OnGoing!')
})
app.listen(port, () => {
    console.log(`Server is running on port${port}`)
})

