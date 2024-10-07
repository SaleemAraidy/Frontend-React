import React ,{useState,useEffect} from "react";
import {Typography,ThemeProvider,Grid, CircularProgress,Box} from "@mui/material";
import theme from "./theme/theme";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import JobCard from "./components/Jobs/JobCard";
import NewJob from "./components/Jobs/NewJob";
import {firestore} from './firebase/config';
import { query, collection, orderBy, getDocs ,addDoc ,serverTimestamp , where } from 'firebase/firestore';
import ViewJob from "./components/Jobs/ViewJob";

export default function App(){
  const [jobs,setJobs] = useState([]);
  const [loading,setLoading] = useState(true);
  const [newJobDialog,setNewJobDialog] = useState(false);
  const [viewJob,setViewJob] = useState({});


  const fetchJobs = async () => {
    setLoading(true);
    const q = query(collection(firestore, "jobs"), orderBy("posted", "desc"));
    const querySnapshot = await getDocs(q);
    const jobsData = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      posted: doc.data().posted.toDate()
    }));
    setJobs(jobsData);
    setLoading(false);
  }

 
  const fetchJobsCustom = async (jobSearch) => {
    setLoading(true);
  
    let q = query(collection(firestore, "jobs"), orderBy("posted", "desc"));

    if (jobSearch.type !== 'All' && jobSearch.type !== 'Placeholder' ) {
      q = query(q, where("type", "==", jobSearch.type));
    }
  
    if (jobSearch.placeType !== 'All' && jobSearch.placeType !== 'Placeholder') {
      q = query(q, where("placeType", "==", jobSearch.placeType));
    }
  
    const querySnapshot = await getDocs(q);
    const jobsData = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      posted: doc.data().posted.toDate()
    }));
  
    setJobs(jobsData);
    setLoading(false);
  };



  const postJob = async (jobDetails) => {
    try {
      await addDoc(collection(firestore, "jobs"), {
        ...jobDetails,
        posted: serverTimestamp() 
      });
      fetchJobs(); 
    } catch (error) {
      console.error("Error adding job: ", error);
    }
  };



  useEffect(()=>{
    fetchJobs();
  },[]);
  
  return <ThemeProvider theme={theme}>
   <Header openNewJobDialog={()=>setNewJobDialog(true)} />
    <Box mb={5}>
   <Grid container justify="center" mt={-5} mb={2}>
      <Grid item xs={10}>
        <SearchBar fetchJobsCustom={fetchJobsCustom} />
        <NewJob newJobDialog={newJobDialog} closeNewJobDialog={()=>setNewJobDialog(false)} postJob={postJob} />
        <ViewJob job={viewJob} closeViewJob={()=>setViewJob({})} />
        {  loading ? (<Box mt={5} ml={14} display='flex' justifyContent='center' color="#0A66C2"><CircularProgress color="#0A66C2"/> </Box>) :
               jobs.length==0 ?  (
                <Box ml={25} mt={5} display='flex' justifyContent='center'>
                  <Typography variant="h6" color="textSecondary">
                    Sorry, there are no matching jobs at the moment.
                  </Typography>
                </Box>
              ) :( jobs.map((job)=>{
                  return <JobCard open={()=>setViewJob(job)} key={job.id} {...job}/>
                }))
      }
      </Grid>
   </Grid>
   </Box>
  </ThemeProvider>
};
