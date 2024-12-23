import React, { createContext, useContext, useState, ReactNode } from "react";
import { JobObject } from "../../model/job.model";

interface JobsContextType {
  allJobs: JobObject[];
  setAllJobs: React.Dispatch<React.SetStateAction<JobObject[]>>;
}

const JobsContext = createContext<JobsContextType | undefined>(undefined);

export const JobsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [allJobs, setAllJobs] = useState<JobObject[]>([]);

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
