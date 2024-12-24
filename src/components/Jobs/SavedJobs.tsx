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
import {
  RegisterCredentials,
  LoginCredentials,
} from "../../model/credentials.model";
import { useAxiosGet } from "../../hooks/UseAxiosGet";
import { signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import Navbar from "../Navbar/Navbar";
import { signedInUser } from "../../App";
import { usePaginatedAxiosGet } from "../../hooks/usePaginatedAxiosGet";
import { JobsContext, useJobsContext } from "../Jobs/JobsContext";
import { isThisHour } from "date-fns";

export interface Filters {
  type?: string | undefined;
  placeType?: string | undefined;
}

export const filters = signal<Filters | null>(null);

export default function SavedJobs() {
  useSignals();
  const [toggleFetch, setToggleFtech] = useState<boolean>(false);
  const [newJobDialog, setNewJobDialog] = useState(false);
  const [viewJob, setViewJob] = useState({});
  const { allJobs, setAllJobs } = useContext(JobsContext);
  const [filteredJobs, setFilteredJobs] = useState<JobObject[]>(allJobs);
  console.log("Filtered Jobs: ", filteredJobs, "All Jobs: ", allJobs);

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
      return item.isChecked === true;
    });

    return filtered;
  };

  useEffect(() => {
    // Re-apply filters whenever filters or allJobs change
    setFilteredJobs(allJobs);
    setFilteredJobs((prevJobs) => applyFilters(prevJobs));
  }, [filters.value]);

  return (
    <div className="SavedJobs">
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

            {filteredJobs?.length == 0 ? (
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
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}
