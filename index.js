const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors')
require('dotenv').config()

app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1m4kiwj.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


const userCollection = client.db('jobportal').collection('users')
const categoryCollection = client.db('jobportal').collection('category')
const jobCollection = client.db('jobportal').collection('jobs')
const itcompanyCollection =client.db('jobportal').collection('itcompany')

async function run() {
    try {

        app.post('/users', async (req, res) => {
            const user = req.body
            const result = await userCollection.insertOne(user)
            res.send(result);
        })
        app.post('/jobs', async (req, res) => {
            const jobs = req.body
            const result = await jobCollection.insertOne(jobs)
            res.send(result)
        })
        app.get('/jobs', async (req, res) => {
            const query = req.query.categoyname
            console.log(query)
            const match = {
                category: query
            }
            if (!query == '') {
                const result = await jobCollection.find(match).limit(6).toArray()
                return res.send(result)
            }

            const result = await jobCollection.find({}).limit(6).toArray()
            res.send(result)
        })
        app.get('/alljobs', async (req, res) => {
            const query = req.query.categoyname
            console.log(query)
            const match = {
                category: query
            }
            if (!query == '') {
                const result = await jobCollection.find(match).toArray()
                return res.send(result)
            }

            const result = await jobCollection.find({}).toArray()
            res.send(result)
        })
        app.get('/jobdetails/:id', async (req, res) => {
            const id = req.params.id
            const query = {
                _id: (new ObjectId(id))
            }
            const result = await jobCollection.findOne(query)
            console.log(result);
            res.send(result)
            
        })
        app.get('/it',async(req,res)=>{
            const result=await itcompanyCollection.find({}).toArray()
            res.send(result)
        })
        app.get('/it/:id',async(req,res)=>{
          const id=req.params.id
          const query={
            _id:(new ObjectId(id))
          }
          const result=await itcompanyCollection.findOne(query)
          res.send(result)
        })

        app.get('/category', async (req, res) => {
            const result = await categoryCollection.find({}).toArray()
            res.send(result)
        })

    } finally {

    }

} run().catch((error) => {
    console.log(error)
})



app.get('/', (req, res) => {
    res.send('server running');
})
app.listen(port, () => {
    console.log('server is running');
})