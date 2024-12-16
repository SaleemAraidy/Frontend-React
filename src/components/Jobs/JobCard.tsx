import React from "react";
import { Grid, Box, Typography, Button, IconButton } from "@mui/material";
import { differenceInCalendarDays, differenceInMinutes, set } from "date-fns";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { JobObject } from "../../model/job.model";
import axios from "axios";

const skillsChip = {
  margin: "4px",
  padding: "4px 8px",
  fontSize: "12px",
  borderRadius: "5px",
  fontWeight: 600,
  backgroundColor: "#0B0B15",
  color: "#fff",
};

function convertTimestampToDate(posted: any) {
  const milliseconds =
    posted._seconds * 1000 + Math.floor(posted._nanoseconds / 1000000);
  return new Date(milliseconds);
}

export { convertTimestampToDate };
interface JobCardProps {
  open: () => void;
  key: string;
  job: JobObject;
}

export default function JobCard(props: JobCardProps) {
  // Add checked useState parameter
  const { open, key, job } = props;
  const [checked, setChecked] = React.useState(job.isChecked);
  const serverURL = "http://localhost:8000/api";

  const toggleSaveJob = async () => {
    try {
      // here we will send an axios post request to the server to endpoint /api/jobs/save
      await axios.post(`${serverURL}/jobs/save`, {
        jobId: job.id,
        isChecked: !checked,
      });
      setChecked(!job.isChecked);
    } catch (e) {
      console.error("Error saving job in toggleSaveJob in JobCard", e);
    }
  };

  return (
    <Box
      sx={{
        padding: 2,
        maxWidth: "800px",
        margin: "0 auto",
        alignContent: "center",
        align: "center",
        border: "1px solid #e8e8e8",
        marginLeft: 30,
        marginTop: 2,
        transition: "0.2s",
        "&:hover": {
          boxShadow: "0px 5px 25px rgba(0,0,0,0.1)",
          borderLeft: "6px solid #0A66C2",
        },
      }}
    >
      <Grid container alignItems="center">
        <Grid item xs={4}>
          <Typography variant="subtitle1">{job.jobTitle}</Typography>
          <Typography
            variant="subtitle2"
            sx={{
              fontSize: "13.5px",
              color: "white",
              backgroundColor: "#0A66C2",
              padding: "6px",
              borderRadius: "5px",
              display: "inline-block",
              fontWeight: 600,
            }}
          >
            {job.jobPlace}
          </Typography>
        </Grid>

        <Grid item container xs={4} spacing={1}>
          {job.skills.map((skill: any) => (
            <Grid key={skill} sx={skillsChip} item>
              {" "}
              {skill}{" "}
            </Grid>
          ))}
        </Grid>

        <Grid item container direction="column" alignItems="flex-end" xs={4}>
          <Grid item>
            <Typography variant="caption">
              {differenceInCalendarDays(
                Date.now(),
                convertTimestampToDate(job.posted)
              )}{" "}
              days ago | {job.type} | {job.placeType}
            </Typography>
          </Grid>

          <div style={{ display: "flex" }}>
            <Box mt={1}>
              <IconButton aria-label="delete" onClick={() => toggleSaveJob()}>
                {checked ? (
                  <BookmarkIcon color="primary" />
                ) : (
                  <BookmarkBorderIcon />
                )}
              </IconButton>
            </Box>

            <Box mt={1}>
              <Button
                onClick={props.open}
                variant="outlined"
                sx={{
                  color: "black",
                  borderColor: "black",
                  borderRadius: "25px",
                  fontWeight: "bold",
                }}
              >
                Check
              </Button>
            </Box>
          </div>
        </Grid>
      </Grid>
    </Box>
  );
}
