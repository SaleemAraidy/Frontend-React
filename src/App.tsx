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
import {RegisterCredentials,LoginCredentials} from "./model/credentials.model";
import { useAxiosGet } from "./hooks/UseAxiosGet";
import { signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";


export interface Filters{
  type?: string | undefined;
  placeType?: string | undefined;
}

export const filters = signal<Filters|null>(null);



export default function App(){
  useSignals();
  console.log("the value is:",filters.value);
  const [filteredJobs,setfilteredJobs] = useState<JobObject []>([]);
  const [toggleFetch,setToggleFtech] = useState<boolean>(false);
  const [loading,setLoading] = useState(true);
  const [newJobDialog,setNewJobDialog] = useState(false);
  const [viewJob,setViewJob] = useState({});
  const serverURL = "http://localhost:8000/api";
  const {data: jobs ,loading: jobsLoading , error} = useAxiosGet<JobObject []>(`${serverURL}/jobs`,toggleFetch);
  console.log("App component");
  useEffect(()=>{
    if(jobsLoading===false)
      setLoading(false);
  },[jobsLoading]);

 
  const fetchJobsCustom = async (jobSearch: any) => {
    setLoading(true);
    try{
      const response = await axios.get(`${serverURL}/jobs/filter`,{params: jobSearch});
      //setJobs(response.data);
    }catch(error){
      console.error("Error fetching jobs in custom search: ", error);
    }finally{
      setLoading(false)
    }
  };



  const registeUser = async (userCredentials: RegisterCredentials) => {
      setLoading(true);
      try{
        const response = await axios.post(`${serverURL}/register`,userCredentials);
      }catch(error){
        console.error("Error fetching jobs in custom search: ", error);
      }finally{
        setLoading(false);
      }
  }

   useEffect(()=>{
    let newFiltered: null | undefined | JobObject[] = jobs;
    console.log("first values are:",newFiltered);  
    if(filters.value){
      console.log("Filtering...");
      if(filters.value.type && filters.value.type!=='All' && filters.value.type!=='Placehodler'){
        console.log("Filtering FILTER 1...");
         newFiltered = newFiltered?.filter((item)=>{
          return item.type === filters.value?.type;
        })
      }
      if(filters.value.placeType && filters.value.placeType!=='All' && filters.value.placeType!=='Placehodler'){
        console.log("Filtering FILTER 2...");
        newFiltered = newFiltered?.filter((item)=>{
          return item.placeType === filters.value?.placeType;
        })
      }
      if(newFiltered){
      setfilteredJobs(newFiltered);
      }
    } else {
      if(jobs) setfilteredJobs(jobs);
    }
    console.log("Filtered jobs are :" , newFiltered);
  },[filters.value,jobs]);  
 
   
  return <ThemeProvider theme={theme}>
   <Header openNewJobDialog={()=>setNewJobDialog(true)} />
    <Box mb={5}>
   <Grid container justifyContent="center" mt={-5} mb={2}>
      <Grid component="div" xs={10}>
        <SearchBar fetchJobsCustom={fetchJobsCustom} />

        <NewJob newJobDialog={newJobDialog} 
                closeNewJobDialog={()=>setNewJobDialog(false)} 
                toggleFetch={toggleFetch} setToggleFtech={setToggleFtech} />

        <ViewJob job={viewJob} closeViewJob={()=>setViewJob({})} />

        {  loading ? (<Box mt={5} 
                           ml={14} 
                           display='flex' 
                           justifyContent='center' 
                           color="#0A66C2"><CircularProgress 
                           sx={{color:"#0A66C2"}}/> 
                           </Box>) :
               filteredJobs?.length==0 ?  (
                <Box ml={25} 
                     mt={5}
                     display='flex' 
                     justifyContent='center'>

                  <Typography variant="h6" color="textSecondary">
                    Sorry, there are no matching jobs at the moment.
                  </Typography>

                </Box>
              ) :( filteredJobs?.map((job:any)=>{
                  return <JobCard open={()=>{console.log("reached open"); 
                                  setViewJob(job); console.log("reached open 23");}} 
                                  key={job.id} {...job}/>
                }))
               }
      </Grid>
   </Grid>
   </Box>
  </ThemeProvider>
};
