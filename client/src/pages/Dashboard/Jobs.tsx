import { useEffect, useState } from "react";
import JobCard from "../../components/JobCard";
import apiClient from "../../lib/apiClient";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    apiClient.get("/jobs")
      .then(res => {
        setJobs(res.data?.data ?? res.data ?? []);
      })
      .catch(() => setJobs([]));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-6">
        Perfect Matches For You
      </h1>

      {jobs.map((job: any) => (
        <JobCard key={job._id} job={job} />
      ))}
    </div>
  );
};

export default Jobs;
