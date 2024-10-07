import React from 'react';
import {Box , Grid ,Typography , Button } from '@mui/material';

/*export default props => <Box bgcolor="secondary.main" color="white">
    <Typography variant ="h5">Open jobs listing</Typography>
    <Button>Post a job</Button>
</Box>*/

function Header(props){
   return <Box py={10} bgcolor="#0A66C2" color="white">
            <Grid container justifyContent="center">
                <Grid item xs={10} sx={{ px: 2 }}>
                    <Box display="flex" justifyContent="space-between" >
                      <Typography variant ="h4">JobFinder</Typography>
                        <Button
                            onClick={props.openNewJobDialog}
                            variant="contained"
                            disableElevation
                            sx={{
                                textTransform: 'none',
                                fontWeight: 'bold',
                                backgroundColor: 'white',
                                color: 'black',
                                '&:hover': {
                                backgroundColor: '#f0f0f0', // A slightly darker shade on hover for a subtle effect
                                },
                            }}
                         >Post a job</Button>
                        </Box> 
                </Grid>
            </Grid>
        </Box>
}

export default Header;