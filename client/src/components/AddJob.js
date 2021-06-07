import { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import JobsApi from "../apis/JobsApi";

const AddJob = () => {
  const [title, setTitle] = useState("");
  const [purpose, setPurpose] = useState("");
  const [categories, setCategories] = useState([]); // the categories retrieved from the database
  const [category, setCategory] = useState(""); // the category that is currently being selected by the user
  const [organizer, setOrganizer] = useState(""); // to be removed once authentication is added

  let history = useHistory();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await JobsApi.get("/categories");
        // console.log(res);
        setCategories(res.data);
        setCategory(res.data[0]);
      } catch (err) {
        console.log(err);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await JobsApi.post("/", {
        title,
        organizer,
        purpose,
        category,
      });
      // redirect somewhere else,
      // e.g: to the job detail page,
      history.push("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="row">
      <h1 className="text-center">New Job</h1>
      <div className="col-6 offset-3">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label" htmlFor="title">
              Title
            </label>
            <input
              required
              className="form-control"
              type="text"
              id="title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="organizer">
              Organizer
            </label>
            <input
              required
              className="form-control"
              type="text"
              id="organizer"
              name="organizer"
              value={organizer}
              onChange={(e) => setOrganizer(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="purpose">
              Purpose
            </label>
            <textarea
              required
              className="form-control"
              name="purpose"
              id="purpose"
              cols="30"
              rows="5"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
            ></textarea>
          </div>
          <div className="mb-3">
            <select
              className="form-select"
              name="category"
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((category) => (
                <option value={category} key={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <button className="btn btn-success" type="submit">
              Add Job
            </button>
          </div>
        </form>
        <Link to="/">Return to Board</Link>
      </div>
    </div>
  );
};

export default AddJob;