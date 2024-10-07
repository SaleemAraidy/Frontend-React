import React from 'react';
import {Grid ,Box , Typography ,Button} from '@mui/material';
import { differenceInCalendarDays, differenceInMinutes } from 'date-fns';


const skillsChip ={
    margin:"4px",
    padding:"4px 8px",
    fontSize:"12px",
    borderRadius:"5px",
    fontWeight:600,
    backgroundColor:"#0B0B15",
    color:"#fff"
};

export default function JobCard(props){
    return (
        <Box sx={{ 
            padding: 2, 
            maxWidth: '800px', 
            margin: '0 auto' , 
            alignContent: 'center' , 
            align:'center',
            border: "1px solid #e8e8e8",
            marginLeft:30,
            marginTop:2,
            border:"1px solid #e8e8e8",
            transition:"0.2s",
            "&:hover":{
                boxShadow: "0px 5px 25px rgba(0,0,0,0.1)",
                borderLeft:"6px solid #0A66C2"
            }
            }} >
            <Grid container alignItems='center'>

                <Grid item xs={4} >
                    <Typography variant="subtitle1">{props.jobTitle}</Typography>
                    <Typography 
                        variant="subtitle2"
                         sx={{
                            fontSize: "13.5px",
                            color:"white",
                            backgroundColor: "#0A66C2",
                            padding :"6px",
                            borderRadius:"5px",
                            display:"inline-block",
                            fontWeight:600,}
                            }>
                                {props.jobPlace}
                    </Typography>
                </Grid>

                <Grid item container xs={4} spacing={1}>
                   { props.skills.map((skill) => (
                        <Grid key={skill} sx={skillsChip} item> {skill} </Grid>
                    ))}
                </Grid>

                <Grid item container direction="column" alignItems="flex-end" xs ={4}>
                    <Grid item>
                        <Typography variant="caption">
                          {differenceInCalendarDays(Date.now(),props.posted)} days ago | {props.type} | {props.placeType}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Box mt={1}>
                            <Button onClick={props.open} variant="outlined" color="black" sx={{borderRadius:'25px' ,fontWeight:'bold'}}>Check</Button>
                        </Box>

                    </Grid>
                </Grid>
            </Grid>
        </Box>
    )
}