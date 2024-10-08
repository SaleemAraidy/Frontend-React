import React ,{useState,useEffect} from "react";
import {Typography,ThemeProvider, CircularProgress,Box, Grid2,Grid} from "@mui/material";
//import theme from "./theme/theme";


import { query, collection, orderBy, getDocs ,addDoc ,serverTimestamp , where } from 'firebase/firestore';
import { useAxiosGet } from "./hooks/useAxiosGet";
import {JobObject} from "./model/job.model"
import theme from "./theme/theme";
import ViewJob from "./components/Jobs/ViewJob";
import JobCard from "./components/Jobs/JobCard";
import SearchBar from "./components/SearchBar";
import NewJob from "./components/Jobs/NewJob";
import Header from "./components/Header";
import { firestore } from "./firebase/config";


export default function App(){
  const [jobs,setJobs] = useState<any>([]);
  const [loading,setLoading] = useState(true);
  const [newJobDialog,setNewJobDialog] = useState(false);
  const [viewJob,setViewJob] = useState({});
  const jobListURL = "http://localhost:8000/api/jobs";
  const { data: jobList, loading: jobListLoading } = useAxiosGet<JobObject>(jobListURL);

  console.log("Job List: :",jobList);
  console.log("Job List Loading:",jobListLoading);

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

 
  const fetchJobsCustom = async (jobSearch: any) => {
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



  const postJob = async (jobDetails: any) => {
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
   <Grid container justifyContent="center" mt={-5} mb={2}>
      <Grid component="div" xs={10}>
        <SearchBar fetchJobsCustom={fetchJobsCustom} />
        <NewJob newJobDialog={newJobDialog} closeNewJobDialog={()=>setNewJobDialog(false)} postJob={postJob} />
        <ViewJob job={viewJob} closeViewJob={()=>setViewJob({})} />
        {  loading ? (<Box mt={5} ml={14} display='flex' justifyContent='center' color="#0A66C2"><CircularProgress sx={{color:"#0A66C2"}}/> </Box>) :
               jobs.length==0 ?  (
                <Box ml={25} mt={5} display='flex' justifyContent='center'>
                  <Typography variant="h6" color="textSecondary">
                    Sorry, there are no matching jobs at the moment.
                  </Typography>
                </Box>
              ) :( jobs.map((job:any)=>{
                  return <JobCard open={()=>setViewJob(job)} key={job.id} {...job}/>
                }))
      }
      </Grid>
   </Grid>
   </Box>
  </ThemeProvider>
};
