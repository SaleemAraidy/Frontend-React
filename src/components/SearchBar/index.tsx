import React , {useEffect, useState} from 'react';
import {Box , Select ,MenuItem , Button} from '@mui/material';
import { filters } from '../Home/Home';
import { useSignals } from '@preact/signals-react/runtime';




export default function SearchBar(props: any) {
  useSignals();
  const [loading,setLoading] = useState(false);
  const handleChange = (e: any) => {
    filters.value = {...filters.value,[e.target.name]:e.target.value};
  }

  const search = async () =>{
    setLoading(true);
    await props.fetchJobsCustom(filters.value);
    setLoading(false);
  }



  return (
    <Box p={2} mt={-5}
      component="form"
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: 800, // Set a max width for the form
        margin: '0 auto', // Center the form horizontally
        marginLeft: 30,
        marginTop: -40,
        backgroundColor: "#fff",
        boxShadow: "0px 1px 5px rgba(0,0,0,0.1)",
        borderRadius: "5px",
        "& > *": {
          flex: 1,
          height: "45px",
          margin: "8px",
          paddingRight: "2"
        },
      }}
      noValidate
      autoComplete="off"
    >
        <Select disableUnderline onChange={handleChange}  variant="filled" value={filters.value?.type?? "Placeholder"} name="type"  sx={{ minWidth: 150, height: 40 , paddingBottom:2 }}>
            <MenuItem value="Placeholder" disabled>Select Job Type</MenuItem>
            <MenuItem value ="All">All</MenuItem>
            <MenuItem value ="Full time">Full time</MenuItem>
            <MenuItem value="Part time">Part time</MenuItem>
            <MenuItem value="Remote">Remote</MenuItem>
        </Select>
        <Select disableUnderline onChange={handleChange}  variant="filled" value={filters.value?.placeType?? "Placeholder"} name="placeType" sx={{ minWidth: 150, height: 40 ,paddingBottom:2}}>
            <MenuItem value="Placeholder" disabled>Select Work Place</MenuItem>
            <MenuItem value ="All">All</MenuItem>
            <MenuItem value ="Food Place">Food Place</MenuItem>
            <MenuItem value="Clothing">Clothing</MenuItem>
            <MenuItem value="Supermarket">Supermarket</MenuItem>
            <MenuItem value="Gas Station">Gas Station</MenuItem>
            <MenuItem value="Electronics Store">Electronics Store</MenuItem>
            <MenuItem value="hi-tech">hi-tech</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
        </Select>
        <Button onClick={search} disabled={loading} variant="contained" color="primary" disableElevation sx={{ color:"white" ,fontWeight:'bold',height: 40, width: 110 ,backgroundColor:"#0A66C2"}}>
            Search
        </Button>
    </Box>
  );
}