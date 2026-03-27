type Job = {
  _id: string;
  title: string;
  company: string;
  location: string;
  tags: string[];
  postedAt: string;
};

const JobCard = ({ job }: { job: Job }) => {
  return (
    <div className="rounded-xl border border-orange-300 p-5 mb-6 bg-white">
      <div className="flex justify-between items-start">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-lg bg-orange-500 text-white flex items-center justify-center font-bold">
            {job.company[0]}
          </div>

          <div>
            <h2 className="font-semibold text-lg text-blue-700">{job.title}</h2>
            <p className="text-gray-500 text-sm">{job.company}</p>
          </div>
        </div>

        <span className="text-xs bg-orange-100 text-orange-600 px-3 py-1 rounded-full">
          High Match
        </span>
      </div>

      <div className="flex gap-4 text-sm text-gray-600 mt-4">
        <span>{job.location}</span>
        <span>₹ 18-25 LPA</span>
        <span>2 days ago</span>
      </div>

      <div className="mt-4">
        <p className="text-sm text-center font-medium mb-2 text-blue-700 rounded-sm border border-amber-500 mr-200 "> Your Matching Skills</p>
        <div className="flex gap-2 flex-wrap">
          {job.tags.map(tag => (
            <span
              key={tag}
              className="px-3 py-1 text-xs rounded-full border border-amber-500 text-blue-700"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="flex gap-4 mt-5">
        <button className="flex-1 bg-orange-500 text-white py-2 rounded-lg">
          Apply Now →
        </button>
        <button className="px-4 border rounded-lg text-gray-500">
          View Details
        </button>
      </div>
    </div>
  );
};

export default JobCard;
