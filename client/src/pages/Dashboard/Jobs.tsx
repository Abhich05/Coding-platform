import { useEffect, useState } from "react";
import JobCard from "../../components/JobCard";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/jobs")
      .then(res => res.json())
      .then(data => {
        setJobs(data.data);
      });
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
