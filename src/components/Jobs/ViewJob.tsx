import React, { useState } from "react";
import {
  Box,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  IconButton,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { format } from "date-fns";
import { convertTimestampToDate } from "./JobCard";
import emailjs from "emailjs-com";
import { UserData } from "../../model/user.model";
import { signedInUser } from "../../App";
import { JobObject } from "../../model/job.model";
import axios from "axios";

const skillsChip = {
  margin: "4px",
  padding: "6px 12px",
  fontSize: "13px",
  borderRadius: "8px",
  fontWeight: 500,
  backgroundColor: "#1e88e5",
  color: "#fff",
};

const attributeLabel = {
  fontSize: "14px",
  fontWeight: "bold",
  color: "#0A66C2",
  marginRight: "8px",
};

const attributeValue = {
  fontSize: "14px",
  fontWeight: "normal",
  color: "#333",
};

export default function ViewJob(props: any) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const job: JobObject = props.job;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleSendEmail = async () => {
    if (!selectedFile) {
      alert("Please select a file to upload.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64File = (reader.result as string)?.split(",")[1];

        const emailData = {
          from: `${signedInUser.value?.givenName} ${signedInUser.value?.familyName} <${signedInUser.value?.email}>`,
          to: job.posterEmail,
          subject: `New Application for ${job.jobTitle} at ${job.jobPlace}`,
          text: `A new application has been submitted from ${signedInUser.value?.givenName} ${signedInUser.value?.familyName}.`,
          attachments: [
            {
              content: base64File,
              filename: selectedFile.name,
              type: selectedFile.type,
              disposition: "attachment",
            },
          ],
        };

        const response = await axios.post(
          "http://localhost:8000/api/jobs/apply",
          emailData
        );

        if (response.status === 200) {
          alert("Email sent successfully!");
        } else {
          console.error("Failed to send email:", response.data);
          alert("Failed to send email.");
        }
      } catch (error) {
        console.error("Error sending email:", error);
        alert("Failed to send email.");
      }
    };

    reader.readAsDataURL(selectedFile);
  };

  return (
    <Dialog open={Object.keys(props.job).length > 0} fullWidth maxWidth="sm">
      <DialogTitle sx={{ backgroundColor: "#f5f5f5", padding: "16px 24px" }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">{props.job.jobTitle}</Typography>
          <IconButton onClick={props.closeViewJob}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ padding: "16px 24px", backgroundColor: "#fafafa" }}>
        <Box mb={2} display="flex">
          <Typography sx={attributeLabel}>Posted on:</Typography>
          <Typography sx={attributeValue}>
            {props.job.posted &&
              format(
                convertTimestampToDate(props.job.posted),
                "dd/MM/yyyy HH:mm"
              )}
          </Typography>
        </Box>

        <Box mb={2} display="flex">
          <Typography sx={attributeLabel}>Job type:</Typography>
          <Typography sx={attributeValue}>{props.job.type}</Typography>
        </Box>

        <Box mb={2} display="flex">
          <Typography sx={attributeLabel}>Workplace type:</Typography>
          <Typography sx={attributeValue}>{props.job.placeType}</Typography>
        </Box>

        {props.job.link && (
          <Box mb={2} display="flex">
            <Typography sx={attributeLabel}>Job URL:</Typography>
            <Typography sx={attributeValue}>
              <a
                href={props.job.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#1e88e5", fontWeight: 500 }}
              >
                {props.job.link}
              </a>
            </Typography>
          </Box>
        )}

        <Box mb={2}>
          <Typography sx={attributeLabel}>Job description:</Typography>
          <Typography sx={attributeValue}>{props.job.description}</Typography>
        </Box>

        <Box mb={2}>
          <Typography sx={attributeLabel}>Posted by:</Typography>
          <Typography sx={attributeValue}>{props.job.posterEmail}</Typography>
        </Box>

        <Box mb={2}>
          <Typography sx={attributeLabel}>Basic requirements:</Typography>
          <Grid container spacing={1}>
            {props.job.skills &&
              props.job.skills.map((skill: any) => (
                <Grid item key={skill}>
                  <Box sx={skillsChip}>{skill}</Box>
                </Grid>
              ))}
          </Grid>
        </Box>

        <Box mb={2} display="flex">
          <Typography sx={attributeLabel}>Contact number:</Typography>
          <Typography sx={attributeValue}>{props.job.contactNumber}</Typography>
        </Box>

        <Box mt={2}>
          <Typography>Upload Resume:</Typography>
          <input type="file" onChange={handleFileChange} />
          <Button
            onClick={handleSendEmail}
            variant="contained"
            color="primary"
            disabled={!selectedFile}
          >
            Apply
          </Button>
        </Box>
      </DialogContent>

      <DialogActions sx={{ padding: "16px 24px", backgroundColor: "#f5f5f5" }}>
        <Button
          onClick={props.closeViewJob}
          variant="contained"
          color="primary"
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
