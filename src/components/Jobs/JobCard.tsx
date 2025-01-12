import React from "react";
import { Grid, Box, Typography, Button, IconButton } from "@mui/material";
import { differenceInCalendarDays, differenceInMinutes, set } from "date-fns";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import DeleteIcon from "@mui/icons-material/Delete";
import { JobObject } from "../../model/job.model";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { signedInUser } from "../../App";
import { useSignal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

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
  useSignals();
  const navigate = useNavigate();
  const { open, key, job } = props;
  const [checked, setChecked] = React.useState(job.isChecked);
  const [dialogOpen, setDialogOpen] = React.useState(false); // Dialog state
  const serverURL = "http://localhost:8000/api";

  const toggleSaveJob = async () => {
    try {
      // here we will send an axios post request to the server to endpoint /api/jobs/save
      await axios.post(`${serverURL}/jobs/save`, {
        jobId: job.id,
        isChecked: !checked,
      });
      setChecked(!checked);
    } catch (e) {
      console.error("Error saving job in toggleSaveJob in JobCard", e);
    }
  };

  const deleteJob = async (jobId: string) => {
    try {
      if (jobId === "none") {
        console.error("No job id found, could not delete job");
        alert("An error occurred while trying to delete the job");
      }
      const response = await axios.delete(
        `http://localhost:8000/api/jobs/${jobId}`,
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        console.log(response.data.message);
        alert("Job deleted successfully");
        navigate(0);
      } else {
        console.error("Failed to delete job:", response.data.message);
        alert(response.data.message);
      }
    } catch (e) {
      console.error("Error deleting job:", e);
      alert("An error occurred while trying to delete the job.");
    } finally {
      setDialogOpen(false); // Close dialog
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
              <IconButton
                aria-label="delete"
                onClick={() => setDialogOpen(true)}
              >
                {String(signedInUser.value?.id) === String(job.posterId) ||
                String(signedInUser.value?.id) === String(1) ? (
                  <DeleteIcon color="action" />
                ) : null}
              </IconButton>
            </Box>

            <Box mt={1}>
              <IconButton aria-label="saved" onClick={() => toggleSaveJob()}>
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

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Delete Job</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this job? This action is permanent and
          cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={() => deleteJob(job.id ? job.id : "none")}
            color="error"
          >
            Yes, delete job
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
