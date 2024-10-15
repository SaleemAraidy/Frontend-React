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
import { signInWithEmailAndPassword } from 'firebase/auth';
import {auth} from '../../../firebase/config';
import {useState} from 'react';
import axios from 'axios';

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

function validateEmail(email){
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}



const initState = {
  email: "",
  Password: ""
}

export default function Login() {
  const [loginCreds , setLoginCreds] = useState(initState); 
  const [errorFields, setErrorFields] = useState({});
  const [loading,setLoading]=useState(false);


  const loginUser = async (userCredentials) => {
    console.log("Entered loginUser");
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, loginCreds.email, loginCreds.password);
      const user = userCredential.user;
  
      // Get the user's ID token
      const token = await user.getIdToken();
  
      // Send this token to your backend for verification
      const response = await axios.post('http://localhost:8000/api/login', { token });
  
      console.log('User signed in:', response.data);
    } catch (error) {
      console.error('Error logging in:', error);
      //setError('Invalid email or password');
    }
  }
  
  
  const handleChange = (e) => {
    console.log("Entered handleChange");
    setLoginCreds((oldState) => ({...oldState,[e.target.name]:e.target.value}));
  }
  
  
  
  const handleSubmit = async () => {
    console.log("Entered handleSubmit");
    const { email, password} = loginCreds;
    
    const errors = {};
    if (!validateEmail(email)) {errors.email = true; console.log("Email no good");}
  
    if (Object.keys(errors).length > 0) {
        setErrorFields(errors);
        return;
    }
  
        setErrorFields({});
        setLoading(true);
        await loginUser(loginCreds);
        setLoading(false);
  }


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
            onChange={handleChange} 
            autoComplete='off'  
            value={loginCreds.email}
            name="email"
            type="email"
            sx={{border: errorFields.email ? '1px solid red' : 'grey.800',
            }}
          />
          {errorFields.email && (
            <Typography sx={{ color: 'red', fontSize: '0.75rem', marginTop: '0.25rem' }}>
               Please enter a valid email
            </Typography>
          )}
        </FormControl>


        <FormControl>
          <FormLabel>Password</FormLabel>
          <Input
            // html input attribute
            onChange={handleChange} 
            autoComplete='off'  
            value={loginCreds.password}
            name="password"
            type="password"
          />
        </FormControl>
        
        <Button sx={{ mt: 1 ,
                 backgroundColor: loading ? 'grey' : 'primary.main',
                 color: 'white',
                 cursor: loading ? 'not-allowed' : 'pointer',
                 '&:hover': {
                 backgroundColor: loading ? 'grey' : 'primary.dark',
                   },}}
                onClick={handleSubmit}
                disabled={loading}
                >Log in</Button>
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
