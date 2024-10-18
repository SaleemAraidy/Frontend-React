import React ,{useState,useEffect} from "react";
import {Typography,ThemeProvider, CircularProgress,Box, Grid2,Grid} from "@mui/material";
import axios from "axios";
import {JobObject} from "../../model/job.model";
import ViewJob from "../Jobs/ViewJob";
import JobCard from "../Jobs/JobCard";
import SearchBar from "../SearchBar";
import NewJob from "../Jobs/NewJob";
import Header from "../Header";
import {RegisterCredentials,LoginCredentials} from "../../model/credentials.model";
import { useAxiosGet } from "../../hooks/UseAxiosGet";
import { signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import Navbar from "../Navbar/Navbar";


export interface Filters{
  type?: string | undefined;
  placeType?: string | undefined;
}

export const filters = signal<Filters|null>(null);



export default function Home(){
  useSignals();
  const [filteredJobs,setfilteredJobs] = useState<JobObject []>([]);
  const [toggleFetch,setToggleFtech] = useState<boolean>(false);
  const [loading,setLoading] = useState(true);
  const [newJobDialog,setNewJobDialog] = useState(false);
  const [viewJob,setViewJob] = useState({});
  const serverURL = "http://localhost:8000/api";
  const {data: jobs ,loading: jobsLoading , error} = useAxiosGet<JobObject []>(`${serverURL}/jobs`,toggleFetch);
  
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
     
    if(filters.value){
      
      if(filters.value.type && filters.value.type!=='All' && filters.value.type!=='Placehodler'){
        
         newFiltered = newFiltered?.filter((item)=>{
          return item.type === filters.value?.type;
        })
      }
      if(filters.value.placeType && filters.value.placeType!=='All' && filters.value.placeType!=='Placehodler'){
        
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
    
  },[filters.value,jobs]);  
 
   
  return <div className="Home">
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
                  return <JobCard open={()=>{ 
                                  setViewJob(job); }} 
                                  key={job.id} {...job}/>
                }))
               }
      </Grid>
   </Grid>
   </Box>
  </div>
};
