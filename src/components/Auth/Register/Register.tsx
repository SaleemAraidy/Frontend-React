import * as React from 'react';
import {useState} from 'react';
//import { CssVarsProvider, useColorScheme } from '@mui/joy/styles';
import Sheet from '@mui/joy/Sheet';
import CssBaseline from '@mui/joy/CssBaseline';
import Typography from '@mui/joy/Typography';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Button from '@mui/material/Button';
import Link from '@mui/joy/Link';
//import Select from '@mui/joy/Select';
//import Option from '@mui/joy/Option';
import {Box , Grid } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
//import { Password } from '@mui/icons-material';
import axios from "axios";
import { RegisterCredentials } from '../../../model/credentials.model';


function Header(){
  return <Box py={0.5} bgcolor="#0A66C2" color="white">
           <Grid container justifyContent="center">
               <Grid item xs={10} sx={{ px: 2 }}>
                   <Box display="flex" justifyContent="center" >
                     <Typography component ="h4" 
                                 sx={{ fontSize: '3rem' , 
                                       textAlign:'center' ,
                                       color:"white" }}>
                            JobFinder</Typography>
                       </Box> 
               </Grid>
           </Grid>
       </Box>
}


function validateEmail(email: string){
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}


function validatePassword(password: string){
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_])[A-Za-z\d!@#$%^&*()_]{8,}$/;
  return passwordRegex.test(password);
}


const initState = {
  email: "",
  password: "",
  confirmPassword: ""
}

const errorFieldsInitState = {
  email: false,
  password: false,
  confirmPassword: false
}


export default function Register() {
  const [registerCreds , setRegisterCreds] = useState(initState); 
  const [errorFields, setErrorFields] = useState(errorFieldsInitState);
  const [loading,setLoading]=useState(false);

  
  const registeUser = async (userCredentials : RegisterCredentials) => {
    console.log("Entered registerUser");
    setLoading(true);
    try{
      const response = await axios.post("http://localhost:8000/api/register",userCredentials);
    }catch(error){
      console.error("Error registering user ", error);
    }finally{
      setLoading(false);
    }
  }




  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    console.log("Entered handleChange");
    setRegisterCreds((oldState) => ({...oldState,[e.target.name]:e.target.value}));
  }

 

  const handleSubmit = async () => {
    console.log("Entered handleSubmit");
    const { email, password , confirmPassword} = registerCreds;
    
    const errors = {email:false , password:false , confirmPassword:false};
    if (!validateEmail(email)) {errors.email = true; console.log("Email no good");}
    if (!validatePassword(password)) {errors.password = true; console.log("Passwod no good");}
    if (registerCreds.password !== registerCreds.confirmPassword) {errors.confirmPassword = true; console.log("passwords dont match");}
  
    if (Object.keys(errors).length > 0) {
        setErrorFields(errors);
        return;
    }

        setErrorFields(errorFieldsInitState);
        setLoading(true);
        await registeUser(registerCreds);
        setLoading(false);
  }


  
  return (
  <div className="register">
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
            <b>Welcome!</b>
          </Typography>
          <Typography level="body-sm">Sign up to JobFinder.</Typography>
        </div>

        <FormControl>
          <FormLabel>Email</FormLabel>
          <Input // html input attribute
            onChange={handleChange} 
            autoComplete='off'  
            value={registerCreds.email}
            name="email"
            type="email"
            sx={{border: errorFields.email ? '1px solid red' : 'grey.800'}}
          />
          {errorFields.email && (
            <Typography sx={{ color: 'red', fontSize: '0.75rem', marginTop: '0.25rem' }}>
               Please enter a valid email
            </Typography>
          )}
        </FormControl>

        <FormControl>
          <FormLabel>Password</FormLabel>
          <Input // html input attribute
            onChange={handleChange} 
            autoComplete='off'  
            value={registerCreds.password}
            name="password"
            type="password"
            sx={{border: errorFields.password ? '1px solid red' : 'grey.800'}}
          />
          {errorFields.password && (
            <Typography sx={{ color: 'red', fontSize: '0.75rem', marginTop: '0.25rem' }}>
               Password must be at least 8 characters long , contain at least one capital letter,
               one small letter , one number and one special character
            </Typography>
          )}
        </FormControl>

        <FormControl>
          <FormLabel>Confirm Password</FormLabel>
          <Input // html input attribute
            onChange={handleChange} 
            autoComplete='off'  
            value={registerCreds.confirmPassword}
            name="confirmPassword"
            type="password"
            sx={{border: errorFields.confirmPassword ? '1px solid red' : 'grey.800'}}
          />
          {errorFields.confirmPassword && (
            <Typography sx={{ color: 'red', fontSize: '0.75rem', marginTop: '0.25rem' }}>
               Passwords do not match
            </Typography>
          )}
        </FormControl>

        <Button sx={{
                 mt: 1, 
                 backgroundColor: loading ? 'grey' : 'primary.main',
                 color: 'white',
                 cursor: loading ? 'not-allowed' : 'pointer',
                 '&:hover': {
                 backgroundColor: loading ? 'grey' : 'primary.dark',
                   },
                 }}
                onClick={handleSubmit}
                disabled={loading}
                >Register</Button>
        <Typography
          endDecorator={<Link href="/sign-up">Sign in</Link>}
          sx={{ fontSize: 'sm', alignSelf: 'center' }}
        >
          Already have an account?
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
          >
            Continue with Google
          </Button>

      </Sheet>
    </main>
  </div>
  );
}
