import { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import "/components/updateproblem.css";


const UpdateProblem = () => {

  const { id } = useParams();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    difficulty: "",
    tags: "",
    visibleTestCases: [{ input: "", output: "", explanation: "" }],
    hiddenTestCases: [{ input: "", output: "" }]
  });

  const [loading, setLoading] = useState(true);

  // fetch problem
  useEffect(() => {
    const fetchProblem = async () => {
      try {

        const res = await axios.get(`http://localhost:2000/problem/getproblem/${id}`, { withCredentials: true });

       const problem= res.data.problem || res.data.data
       if (!problem) {
        setFormData(problem);

       

      } 
       setLoading(false);
    }
      catch (err) {
        console.log(err);
        alert("Error fetching problem");
      }
    };

    fetchProblem();
  }, [id]);



  // handle input change
  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };


  // handle visible test case change
  const handleVisibleChange = (index, e) => {

    const updated = [...formData.visibleTestCases];

    updated[index][e.target.name] = e.target.value;

    setFormData({
      ...formData,
      visibleTestCases: updated
    });

  };


  // handle hidden test case change
  const handleHiddenChange = (index, e) => {

    const updated = [...formData.hiddenTestCases];

    updated[index][e.target.name] = e.target.value;

    setFormData({
      ...formData,
      hiddenTestCases: updated
    });

  };


  // update problem
  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await axios.patch(`http://localhost:2000/problem/problemupdate/${id}`, formData, { withCredentials: true });

      alert("Problem Updated Successfully");

      setFormData({
        title: "",
        description: "",
        difficulty: "",
        tags: "",
        visibleTestCases: [{ input: "", output: "", explanation: "" }],
        hiddenTestCases: [{ input: "", output: "" }]
      });

    } catch (err) {

      console.log(err);
      alert("Update failed");

    }

  };


  if (loading) return <h2>Loading...</h2>;


  return (
    <div className="update-container">

      <h1>Update Problem</h1>

      <form onSubmit={handleSubmit}>

        {/* Title */}
        <input
          type="text"
          name="title"
          value={formData?.title || ""}
          onChange={handleChange}
          placeholder="Title"
        />

        {/* Description */}
        <textarea
          name="description"
          value={formData?.description ||""}
          onChange={handleChange}
          placeholder="Description"
        />

        {/* Difficulty */}
        <select
          name="difficulty"
          value={formData?.difficulty||""}
          onChange={handleChange}
        >
          <option value="">Select Difficulty</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>


        {/* Tags */}
        <input
          type="text"
          name="tags"
          value={formData?.tags ||""}
          onChange={handleChange}
          placeholder="Tags"
        />


        {/* Visible Test Cases */}
        <h3>Visible Test Cases</h3>

        {formData?.visibleTestCases?.map((test, index) => (

          <div key={index}>

            <input
              type="text"
              name="input"
              value={test.input}
              placeholder="Input"
              onChange={(e) => handleVisibleChange(index, e)}
            />

            <input
              type="text"
              name="output"
              value={test.output}
              placeholder="Output"
              onChange={(e) => handleVisibleChange(index, e)}
            />

            <input
              type="text"
              name="explanation"
              value={test.explanation}
              placeholder="Explanation"
              onChange={(e) => handleVisibleChange(index, e)}
            />

          </div>

        ))}


        {/* Hidden Test Cases */}
        <h3>Hidden Test Cases</h3>

        {formData?.hiddenTestCases?.map((test, index) => (

          <div key={index}>

            <input
              type="text"
              name="input"
              value={test.input}
              placeholder="Input"
              onChange={(e) => handleHiddenChange(index, e)}
            />

            <input
              type="text"
              name="output"
              value={test.output}
              placeholder="Output"
              onChange={(e) => handleHiddenChange(index, e)}
            />

          </div>

        ))}


        <button type="submit">
          Update Problem
        </button>

      </form>

    </div>
  );
};

export default UpdateProblem;