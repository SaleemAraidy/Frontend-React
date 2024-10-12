import * as React from 'react';
import { CssVarsProvider, useColorScheme } from '@mui/joy/styles';
import Sheet from '@mui/joy/Sheet';
import CssBaseline from '@mui/joy/CssBaseline';
import Typography from '@mui/joy/Typography';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Button from '@mui/joy/Button';
import Link from '@mui/joy/Link';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import {Box , Grid } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';


function Header(props){
  return <Box py={5} bgcolor="#0A66C2" color="white">
           <Grid container justifyContent="center">
               <Grid item xs={10} sx={{ px: 2 }}>
                   <Box display="flex" justifyContent="center" >
                     <Typography variant ="h4" sx={{ fontSize: '3rem' , textAlign:'center' ,color:"white" }}>JobFinder</Typography>
                       </Box> 
               </Grid>
           </Grid>
       </Box>
}

export default function Login() {
  return (
  <CssVarsProvider>
    <main>
      <Header />
      <CssBaseline />
      <Sheet
        sx={{
          width: 300,
          mx: 'auto', // margin left & right
          my: 4, // margin top & bottom
          py: 3, // padding top & bottom
          px: 2, // padding left & right
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          borderRadius: 'sm',
          boxShadow: 'md',
        }}
        variant="outlined"
      >
        <div style={{textAlign:'center'}}>
          <Typography level="h4" component="h1">
            <b>Welcome back !</b>
          </Typography>
          <Typography level="body-sm">Sign in to JobFinder.</Typography>
        </div>


        <FormControl>
          <FormLabel>Email</FormLabel>
          <Input
            // html input attribute
            name="email"
            type="email"
          />
        </FormControl>


        <FormControl>
          <FormLabel>Password</FormLabel>
          <Input
            // html input attribute
            name="password"
            type="password"
          />
        </FormControl>
        
        <Button sx={{ mt: 1 /* margin top */ }}>Log in</Button>
        <Typography
          endDecorator={<Link href="/sign-up">Sign up</Link>}
          sx={{ fontSize: 'sm', alignSelf: 'center' }}
        >
          Don&apos;t have an account?
        </Typography>

        {/* Line with "or" */}
        <Box display="flex" alignItems="center" sx={{ my: 0.5 }}>
            <Box sx={{ flexGrow: 1, height: '1px', bgcolor: '#9b9fa3' }} />
            <Typography sx={{ mx: 2 }}>or</Typography>
            <Box sx={{ flexGrow: 1, height: '1px', bgcolor: '#9b9fa3' }} />
          </Box>

          {/* Google Authentication Button */}
          <Button 
            variant="outlined" 
            startIcon={<GoogleIcon />} // Add Google icon
            sx={{ justifyContent: 'center', width: '100%' }} // Center icon and text
            onClick={() => { /* Handle Google sign-in here */ }}
          >
            Continue with Google
          </Button>

      </Sheet>
    </main>
  </CssVarsProvider>
  );
}
