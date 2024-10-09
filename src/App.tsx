import React ,{useState,useEffect} from "react";
import {Typography,ThemeProvider, CircularProgress,Box, Grid2,Grid} from "@mui/material";
import axios from "axios";
import {JobObject} from "./model/job.model";
import theme from "./theme/theme";
import ViewJob from "./components/Jobs/ViewJob";
import JobCard from "./components/Jobs/JobCard";
import SearchBar from "./components/SearchBar";
import NewJob from "./components/Jobs/NewJob";
import Header from "./components/Header";



export default function App(){
  const [jobs,setJobs] = useState<any>([]);
  const [loading,setLoading] = useState(true);
  const [newJobDialog,setNewJobDialog] = useState(false);
  const [viewJob,setViewJob] = useState({});
  const jobListURL = "http://localhost:8000/api/jobs";

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await axios.get(jobListURL); // Fetch jobs using Axios
      setJobs(response.data); // Set jobs state with fetched data
    } catch (error) {
      console.error("Error fetching jobs: ", error);
    } finally {
      setLoading(false); // Stop loading regardless of success or failure
    }
  }

 
  /*const fetchJobsCustom = async (jobSearch: any) => {
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
  };*/

  const fetchJobsCustom = async (jobSearch: any) => {
    setLoading(true);
    try{
      const response = await axios.get(`${jobListURL}/filter`,{params: jobSearch});
      setJobs(response.data);
    }catch(error){
      console.error("Error fetching jobs in custom search: ", error);
    }finally{
      setLoading(false)
    }
  };






  const postJob = async (jobDetails: JobObject) => {
    setLoading(true);
    try {
      const response = await axios.post(jobListURL,jobDetails); // Fetch jobs using Axios
      fetchJobs(); // Set jobs state with fetched data
    } catch (error) {
      console.error("Error fetching jobs: ", error);
    } finally {
      setLoading(false); // Stop loading regardless of success or failure
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
                  return <JobCard open={()=>{console.log("reached open"); setViewJob(job); console.log("reached open 23");}} key={job.id} {...job}/>
                }))
      }
      </Grid>
   </Grid>
   </Box>
  </ThemeProvider>
};
