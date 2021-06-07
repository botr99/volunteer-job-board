const Job = require("../models/Job");

module.exports.getCategories = async (req, res) => {
  try {
    // returns an array of all the enum values
    // of the category field in the Job model
    const categories = await Job.schema.path("category").enumValues;
    res.status(200).json(categories);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

module.exports.getJobs = async (req, res) => {
  try {
    if (req.query.page <= 0 || req.query.limit <= 0) {
      return res.status(404).json({ message: "Page not found" });
    }

    const page = parseInt(req.query.page) || 1; // current page
    const limit = parseInt(req.query.limit) || 10; // max number of items in a page
    const skip = (page - 1) * limit; // number of items to skip

    const modelCount = await Job.find({}).countDocuments();

    const pageCount = Math.ceil(modelCount / limit); // number of pages

    if (page > pageCount) {
      // page number is out of upper bound
      return res.status(404).json({ message: "Page not found" });
    }

    // paginate the jobs, sort them by the latest job created
    const jobs = await Job.find({})
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: "desc" });

    res.status(200).json({ page, limit, pageCount, data: jobs });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports.getJobDetail = (req, res) => {
  Job.findById(req.params.id)
    .then((job) => {
      job
        ? res.status(200).json(job)
        : res.status(404).json({ message: "Job not found" });
    })
    .catch((err) => res.status(404).json({ message: err.message }));
};

module.exports.postJob = async (req, res) => {
  const newJob = new Job(req.body);

  try {
    await newJob.save();
    res.status(201).json(newJob);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

module.exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body);
    const updatedJob = { ...job.toObject(), ...req.body };
    res.status(200).json(updatedJob);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

module.exports.deleteJob = async (req, res) => {
  try {
    const deletedJob = await Job.findByIdAndDelete(req.params.id);
    res.status(204).json(deletedJob);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};