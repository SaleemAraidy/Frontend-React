import React , {useState} from 'react';
import {Box , Select ,MenuItem , Button} from '@mui/material';



export default function SearchBar(props: any) {
  const [loading,setLoading] = useState(false);
  const [jobSearch,setJobSearch] = useState({
    type: "Placeholder",
    placeType:"Placeholder"
  });

  const handleChange = (e: any) => {
    //e.persist();
    setJobSearch(oldState => ({...oldState,[e.target.name]:e.target.value}));
    //console.log(jobSearch);
  }

  const search = async () =>{
    setLoading(true);
    await props.fetchJobsCustom(jobSearch);
    setLoading(false);

  }


console.log(jobSearch);

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
        <Select disableUnderline onChange={handleChange}  variant="filled" value={jobSearch.type} name="type"  sx={{ minWidth: 150, height: 40 , paddingBottom:2 }}>
            <MenuItem value="Placeholder" disabled>Select Job Type</MenuItem>
            <MenuItem value ="All">All</MenuItem>
            <MenuItem value ="Full time">Full time</MenuItem>
            <MenuItem value="Part time">Part time</MenuItem>
            <MenuItem value="Remote">Remote</MenuItem>
        </Select>
        <Select disableUnderline onChange={handleChange}  variant="filled" value={jobSearch.placeType} name="placeType" sx={{ minWidth: 150, height: 40 ,paddingBottom:2}}>
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