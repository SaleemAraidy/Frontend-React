import React,{useState} from 'react';
import {Box,Grid,Select,MenuItem,Dialog,DialogTitle,DialogContent,DialogActions,FilledInput, Typography, Button,IconButton, CircularProgress} from '@mui/material';
import {Close as CloseIcon} from '@mui/icons-material';
import {JobObject} from "../../model/job.model";
import { serverTimestamp, Timestamp } from 'firebase/firestore';


const selectStylig = {
    minWidth: 150,
    height: '56px', 
    display: 'flex', 
    alignItems: 'center', 
    paddingBottom:2
};

const skills=[
    'Relevant experience',
    'Friendly attitdue',
    'Customer service',
    'Computer knowledge',
    'Sales experience',
    'B.Sc',
];

const skillStyling ={
    margin:"4px",
    padding:"4px 8px",
    fontSize:"12px",
    borderRadius:"5px",
    fontWeight:600,
    border:'1px solid #0B0B15',
    color:"#0B0B15",
    cursor:'pointer',
    "&:hover":{
        backgroundColor:'#0B0B15',
        color:"#fff",
    },
    included:{
        backgroundColor:'#0B0B15',
        color:"#fff",
    }
};

/*interface JobDetails {
    jobTitle: string;
    type: string; // For example, it could be "Full time", "Part time", etc.
    placeType: string; // For example, it could be "hi-tech", "startup", etc.
    jobPlace: string; // Name of the company or job location
    contactNumber: string; // Contact number as a string
    skills: string[]; // Array of skills required for the job
    link: string; // URL or link related to the job posting
    description: string; // Job description
}*/

const initState : JobObject  = {
    //id:"",
    jobTitle: "",
    type: "Placeholder",
    placeType: "Placeholder",
    jobPlace: "",
    contactNumber: "",
    skills: [],
    link: "",
    description: "",
    posted: serverTimestamp,
}


export default function NewJob(props: any){
    const [loading,setLoading]=useState(false);
    const [jobDetails,setJobDetails] = useState<JobObject>(initState);
    const [errorFields, setErrorFields] = useState<any>({});

    const handleChange = (e: any) => {
        //e.persist();
        setJobDetails((oldState : JobObject) => ({...oldState,[e.target.name]:e.target.value}));
    }


   const handleSubmit = async () => {

        const { jobTitle, type, jobPlace, contactNumber, placeType } = jobDetails;
        
        const errors: any = {};
        if (!jobTitle) errors.jobTitle = true;
        if (!jobPlace) errors.jobPlace = true;
        if (!contactNumber) errors.contactNumber = true;
        //if (type === 'All') errors.type = true;
        //if (placeType === 'All') errors.placeType = true;

        if (Object.keys(errors).length > 0) {
            setErrorFields(errors);
            return;
        }

            setErrorFields({});
            setLoading(true);
            await props.postJob(jobDetails);
            closeDialog();
    }



    const addRemoveSkill = (skill: any) => {
        const skillStr: string = skill ?? "";
        return jobDetails.skills.includes(skillStr)
            ? setJobDetails((oldState)=>({
                ...oldState,
                skills: oldState.skills.filter((s)=>s!==skill),
            }))
            : setJobDetails(oldState=>({...oldState,skills:oldState.skills.concat(skill)}))
        }



    const closeDialog = ()=>{
        setJobDetails(initState);
        setLoading(false);
        props.closeNewJobDialog();
    }


    console.log(jobDetails);

    return (
        <Dialog open={props.newJobDialog} fullWidth>
            <DialogTitle>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    Post a job
                    <IconButton onClick={closeDialog}>
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <FilledInput onChange={handleChange} autoComplete='off' name="jobTitle" value={jobDetails.jobTitle}
                             sx={{ height: '56px',border: errorFields.jobTitle ? '1px solid red' : 'none' }} placeholder='Job title*' disableUnderline fullWidth />
                        </Grid>
                        <Grid item xs={6}>
                            <Select onChange={handleChange} name="type" value={jobDetails.type} sx={{...selectStylig,border: errorFields.type ? '1px solid red' : 'none'}} disableUnderline fullWidth variant="filled" defaultValue="All" >
                                <MenuItem value="Placeholder" disabled>Select Job Type</MenuItem>
                                <MenuItem value ="Full time">Full time</MenuItem>
                                <MenuItem value="Part time">Part time</MenuItem>
                                <MenuItem value="Remote">Remote</MenuItem>
                            </Select>
                        </Grid>
                        <Grid item xs={6}>
                            <FilledInput onChange={handleChange} autoComplete='off' name="jobPlace" value={jobDetails.jobPlace} 
                            sx={{ height: '56px',border: errorFields.jobPlace ? '1px solid red' : 'none' }} placeholder='Work place name*' disableUnderline fullWidth />
                        </Grid>
                        <Grid item xs={6}>
                            <FilledInput onChange={handleChange} autoComplete='off' name="contactNumber" value={jobDetails.contactNumber}
                             sx={{ height: '56px',border: errorFields.contactNumber ? '1px solid red' : 'none' }} placeholder='Contact Number*' disableUnderline fullWidth />
                        </Grid>
                        <Grid item xs={6}>
                            <Select onChange={handleChange} name="placeType" value={jobDetails.placeType} disableUnderline sx={{...selectStylig,border: errorFields.placeType ? '1px solid red' : 'none'}} variant="filled" defaultValue="All">
                                <MenuItem value="Placeholder" disabled>Select Job Type</MenuItem>
                                <MenuItem value ="Food Place">Food Place</MenuItem>
                                <MenuItem value="Clothing">Clothing</MenuItem>
                                <MenuItem value="Supermarket">Supermarket</MenuItem>
                                <MenuItem value="Gas Station">Gas Station</MenuItem>
                                <MenuItem value="Electronics Store">Electronics Store</MenuItem>    
                                <MenuItem value="hi-tech">hi-tech</MenuItem>
                                <MenuItem value="Other">Other</MenuItem>
                             </Select>
                        </Grid>
                        <Grid item xs={6}>
                            <FilledInput onChange={handleChange} autoComplete='off' name="link" value={jobDetails.link}
                            sx={{ height: '56px' }} placeholder='Job URL' disableUnderline fullWidth />
                        </Grid>
                        <Grid item xs={12}>
                            <FilledInput onChange={handleChange} multiline rows={5} placeholder='Job description' name="description" value={jobDetails.description} disableUnderline fullWidth />
                        </Grid>
                    </Grid>
                    <Box mt={2}>
                        <Typography>Basic Requirments:</Typography>
                            <Box display="flex">
                                {skills.map((skill)=>{
                                    return <Box onClick={()=>addRemoveSkill(skill)} key={skill} sx={{
                                        ...skillStyling,
                                        ...(jobDetails.skills.includes(skill) ? skillStyling.included : {}),
                                    }}>{skill}</Box>
                                })}
                            </Box>
                    </Box>
                    <DialogActions>
                        <Box
                          width="100%"
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                            <Typography color="red" variant='caption'>*Required fields</Typography>
                            <Button onClick={handleSubmit} 
                                    variant='contained' 
                                    disableElevation 
                                    sx={loading ? {backgroundColor:"white", color:"#0A66C2"}:{color:"white",backgroundColor:"#0A66C2",fontWeight:"bold"}}
                                    disabled={loading}
                                    >
                                       { loading ? (<CircularProgress color="primary" sx={{ color: "#0A66C2"}}/>) : 
                                        ("Post job")}
                                    </Button>
                        </Box>
                    </DialogActions>
                </DialogContent>
        </Dialog>
    )
}