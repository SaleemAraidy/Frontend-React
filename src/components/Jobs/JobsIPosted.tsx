import React, { useState, useEffect, useContext } from "react";
import {
  Typography,
  ThemeProvider,
  CircularProgress,
  Box,
  Grid2,
  Grid,
  Alert,
  Snackbar,
  Button,
} from "@mui/material";
import axios from "axios";
import { JobObject } from "../../model/job.model";
import ViewJob from "../Jobs/ViewJob";
import JobCard from "../Jobs/JobCard";
import SearchBar from "../SearchBar";
import NewJob from "../Jobs/NewJob";
import Header from "../Header";
import { signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import { signedInUser } from "../../App";
import { usePaginatedAxiosGet } from "../../hooks/usePaginatedAxiosGet";
import { filters } from "../Home/Home";

export interface Filters {
  type?: string | undefined;
  placeType?: string | undefined;
}

//export const filters = signal<Filters | null>(null);

export default function JobsIPosted() {
  useSignals();
  const [filteredJobs, setFilteredJobs] = useState<JobObject[]>([]);
  const [toggleFetch, setToggleFtech] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [newJobDialog, setNewJobDialog] = useState(false);
  const [viewJob, setViewJob] = useState({});
  const [page, setPage] = useState(1);
  const [allJobs, setAllJobs] = useState<JobObject[]>([]);
  const [allJobsLoaded, setAllJobsLoaded] = useState(false);
  const serverURL = "http://localhost:8000/api";

  const {
    data: jobs,
    loading: jobsLoading,
    error,
  } = usePaginatedAxiosGet<JobObject[]>(
    `${serverURL}/jobs/for-user`,
    page,
    toggleFetch
  );
  const isGeneralError: boolean = !loading && (error ? true : false);
  console.log("Error ***", error);
  console.log("SignedInUser: ", signedInUser.value);

  useEffect(() => {
    if (jobsLoading === false) setLoading(false);
  }, [jobsLoading]);

  useEffect(() => {
    if (jobs) {
      console.log("Jobs fetched: ", jobs);
      if (jobs.length > 0) {
        setAllJobs((prev) => {
          const newJobs = jobs.filter(
            (job) => !prev.some((existingJob) => existingJob.id === job.id)
          );
          return [...prev, ...newJobs];
        });
        setFilteredJobs((prev) => {
          const updatedAllJobs = [
            ...prev,
            ...jobs.filter(
              (job) => !prev.some((existingJob) => existingJob.id === job.id)
            ),
          ];
          return applyFilters(updatedAllJobs);
        });
      } else {
        console.log("No jobs, Setting allJobsLoaded to true");
        setAllJobsLoaded(true);
      }
    }
  }, [jobs]);

  const applyFilters = (allJobs: JobObject[]): JobObject[] => {
    let filtered = allJobs;

    if (filters.value) {
      if (
        filters.value.type &&
        filters.value.type !== "All" &&
        filters.value.type !== "Placeholder"
      ) {
        filtered = filtered.filter((item) => {
          console.log("Job id: ", item.id, "type: ", item.type);
          return item.type === filters.value?.type;
        });
      }
      if (
        filters.value.placeType &&
        filters.value.placeType !== "All" &&
        filters.value.placeType !== "Placeholder"
      ) {
        filtered = filtered.filter((item) => {
          console.log("Job id: ", item.id, "placetype: ", item.placeType);
          return item.placeType === filters.value?.placeType;
        });
      }
    }

    filtered = filtered.filter((item) => {
      return String(item.posterId) === String(signedInUser.value?.id);
    });

    if (filtered.length < 200) {
      setAllJobsLoaded(true);
    }

    return filtered;
  };

  useEffect(() => {
    setFilteredJobs(applyFilters(allJobs));
  }, [filters.value]);

  const loadMoreJobs = () => {
    setPage((prev) => prev + 1); // Increment the page to fetch the next set of jobs
  };

  return (
    <div className="JobsIPosted">
      <Header />
      <Box mb={5}>
        <Grid container justifyContent="center" mt={-5} mb={2}>
          <Grid component="div" xs={10}>
            <SearchBar openNewJobDialog={() => setNewJobDialog(true)} />

            <NewJob
              newJobDialog={newJobDialog}
              closeNewJobDialog={() => setNewJobDialog(false)}
              toggleFetch={toggleFetch}
              setToggleFtech={setToggleFtech}
            />

            <ViewJob job={viewJob} closeViewJob={() => setViewJob({})} />
            {error ? (
              <Box ml={25} mt={5} display="flex" justifyContent="center">
                <Typography variant="h6" color="textSecondary">
                  Something went wrong.
                </Typography>
              </Box>
            ) : null}
            {loading && !error ? (
              <Box
                mt={5}
                ml={14}
                display="flex"
                justifyContent="center"
                color="#0A66C2"
              >
                <CircularProgress sx={{ color: "#0A66C2" }} />
              </Box>
            ) : filteredJobs?.length == 0 && !error ? (
              <Box ml={25} mt={5} display="flex" justifyContent="center">
                <Typography variant="h6" color="textSecondary">
                  Sorry, there are no matching jobs at the moment.
                </Typography>
              </Box>
            ) : (
              filteredJobs?.map((job: JobObject) => {
                return (
                  <JobCard
                    open={() => {
                      setViewJob(job);
                    }}
                    key={job.id ?? ""}
                    job={job}
                  />
                );
              })
            )}

            {!allJobsLoaded && !loading && !error && (
              <Box display="flex" justifyContent="center" mt={3}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={loadMoreJobs}
                >
                  Load More
                </Button>
              </Box>
            )}
          </Grid>
        </Grid>
      </Box>

      <Snackbar
        open={isGeneralError}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="error" variant="filled" sx={{ width: "100%" }}>
          Something went wrong.
        </Alert>
      </Snackbar>
    </div>
  );
}
