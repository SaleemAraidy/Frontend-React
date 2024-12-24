import React, { createContext, useContext, useState, ReactNode } from "react";
import { JobObject } from "../../model/job.model";

interface JobsContextType {
  allJobs: JobObject[];
  setAllJobs: React.Dispatch<React.SetStateAction<JobObject[]>>;
}

export const JobsContext = createContext<JobsContextType>({
  allJobs: [],
  setAllJobs: () => {},
});

export function useJobsContext() {
  const context = useContext(JobsContext);
  if (!context) {
    throw new Error("useJobsContext must be used within a JobsProvider");
  }
  return context;
}

export const JobsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [allJobs, setAllJobs] = useState<JobObject[]>([]);
  console.log("All Jobs in JobsContext file: ", allJobs);

  return (
    <JobsContext.Provider value={{ allJobs, setAllJobs }}>
      {children}
    </JobsContext.Provider>
  );
};

export const useJobs = () => {
  const context = useContext(JobsContext);
  if (!context) {
    throw new Error("useJobs must be used within a JobsProvider");
  }
  return context;
};
