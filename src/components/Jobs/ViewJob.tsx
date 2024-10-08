import React from 'react';
import {Box,Grid,Select,MenuItem,Dialog,DialogTitle,DialogContent,DialogActions,FilledInput, Typography, Button,IconButton, CircularProgress} from '@mui/material';
import {Close as CloseIcon} from '@mui/icons-material';
import {format} from 'date-fns';

const skillsChip ={
    margin:"4px",
    padding:"4px 8px",
    fontSize:"12px",
    borderRadius:"5px",
    fontWeight:300,
    backgroundColor:"#0B0B15",
    color:"#fff"
};

export default function ViewJob(props: any){
    return(
        <Dialog open={Object.keys(props.job).length>0} fullWidth>
            <DialogTitle>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        {props.job.jobTitle} - {props.job.jobPlace}
                        <IconButton>
                            <CloseIcon onClick={props.closeViewJob} />
                        </IconButton>
                    </Box>
            </DialogTitle>
            <DialogContent></DialogContent>
            <Box>

                <Box display="flex" ml={3} mb={2}>
                    <Typography variant="caption" fontSize={13}>Posted on:{" "}</Typography>
                    <Typography variant="body2" display="inline" ml={1} mt={0.1}>
                      {props.job.posted && format(props.job.posted,"dd/MM/yyyy HH:MM")}
                    </Typography>
                </Box>

                <Box display="flex" ml={3} mb={2}>
                    <Typography variant="caption" fontSize={13}>Job type:</Typography>
                    <Typography variant="body2" display="inline" ml={1} mt={0.1}>{props.job.type}</Typography>
                </Box>

                <Box display="flex" ml={3} mb={2}>
                    <Typography variant="caption" fontSize={13}>Work place type:</Typography>
                    <Typography variant="body2" display="inline" ml={1} mt={0.1}>{props.job.placeType}</Typography>
                </Box>

               
                {props.job.link ? (
                    <Box display="flex" ml={3} mb={2}>
                        <Typography variant="caption" fontSize={13}>Job URL:</Typography>
                        <Typography variant="body2" display="inline" ml={1} mt={0.1}>
                        <a href={props.job.link} target="_blank" rel="noopener noreferrer">
                            {props.job.link}
                        </a>
                        </Typography>
                    </Box>
                ) : null} 

                <Box display="flex" ml={3} mb={2}>
                    <Typography variant="caption" fontSize={13}>Job description:</Typography>
                    <Typography variant="body2" display="inline" ml={1} mt={0.1}>{props.job.description}</Typography>
                </Box>

                <Box ml={3} mb={2}>
                    <Typography variant="caption" fontSize={13}>Basic requirements:</Typography>
                   {<Grid container alignItems="center">
                        {props.job.skills && 
                         props.job.skills.map((skill: any)=>(
                            <Grid item key={skill} sx={skillsChip}>
                                {skill}
                            </Grid>
                         ))}
                    </Grid>}
                </Box>

                <Box display="flex" ml={3} mb={2}>
                    <Typography variant="caption" fontSize={13}>Contact number:</Typography>
                    <Typography variant="body2" display="inline" ml={1} mt={0.1}>{props.job.contactNumber}</Typography>
                </Box>

            </Box>
            <DialogActions></DialogActions>
        </Dialog>
    )
} 