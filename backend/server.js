import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { db } from './firebase.js';

dotenv.config();

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Sample route
app.get('/', (req, res) => {
    console.log("Reached root endpoint");
    res.send('Hello there');
});

// Endpoint to get all jobs
app.get('/api/jobs', async (req, res) => {
    console.log("Fetching Jobs...")
    try {
      const jobsSnapshot = await db.collection('jobs').get();
      const jobs = jobsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.status(200).json(jobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      res.status(500).send('Error fetching jobs');
    }
  });
  
  // Endpoint to add a job
  app.post('/api/jobs', async (req, res) => {
    try {
      const newJob = req.body;
      const jobRef = await db.collection('jobs').add(newJob);
      res.status(201).send({ id: jobRef.id, ...newJob });
    } catch (error) {
      res.status(500).send('Error adding job');
    }
  });


// Start the server
app.listen(PORT, () => {
    console.log("Adding Job...")
    console.log(`Server is running on port ${PORT}`);
});
