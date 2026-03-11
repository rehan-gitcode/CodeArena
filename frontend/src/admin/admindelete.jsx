import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router";
import "/components/admindelete.css";

const AdminDelete = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  let { id } = useParams();

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(
        "http://localhost:2000/problem/getallproblem",
        { withCredentials: true }
      );

      setProblems(data);
    } catch (err) {
      setError("Failed to fetch problems");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this problem?"))
      return;

    try {
      await axios.delete(`http://localhost:2000/problem/${id}`, {
        withCredentials: true,
      });

      setProblems(problems.filter((problem) => problem._id !== id));

      alert("Problem deleted successfully!");
    } catch (err) {
      setError("Failed to delete problem");
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-alert">
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="admin-container">

      <div className="header">
        <h1>Delete Problems</h1>
      </div>

      <div className="table-wrapper">
        <table className="problem-table">

          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Difficulty</th>
              <th>Tags</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {problems.map((problem, index) => (
              <tr key={problem._id}>

                <td>{index + 1}</td>

                <td>{problem.title}</td>

                <td>
                  <span className={`badge ${problem.difficulty.toLowerCase()}`}>
                    {problem.difficulty}
                  </span>
                </td>

                <td>
                  <span className="tag">
                    {problem.tags}
                  </span>
                </td>

                <td>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(problem._id)}
                  >
                    Delete
                  </button>
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </div>
  );
};

export default AdminDelete;






// import { useEffect, useState } from 'react';
// // import axiosClient from '../utils/axiosClient'
// import axios from 'axios';
// import { useParams } from 'react-router';
// import './admindelete.css';

// const AdminDelete = () => {
//   const [problems, setProblems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   let {id} = useParams();

//   useEffect(() => {
//     fetchProblems();
//   }, []);

//   const fetchProblems = async () => {
//     try {
//       setLoading(true);
//       const { data } = await axios.get('http://localhost:2000/problem/getallproblem', { withCredentials: true } );
//       setProblems(data);
//     } catch (err) {
//       setError('Failed to fetch problems'); 
//       console.error(err);
//       console.log(err)
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this problem?')) return;
    
//     try {
//       await axios.delete(`http://localhost:2000/problem/${id}`, { withCredentials: true });
//       setProblems(problems.filter(problem => problem._id !== id));
//       alert('Problem deleted successfully!');
//     } catch (err) {
//       setError('Failed to delete problem');
//       console.error(err);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <span className="loading loading-spinner loading-lg"></span>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="alert alert-error shadow-lg my-4">
//         <div>
//           <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
//           </svg>
//           <span>{error}</span>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto p-4">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold">Delete Problems</h1>
//       </div>

//       <div className="overflow-x-auto">
//         <table className="table table-zebra w-full">
//           <thead>
//             <tr>
//               <th className="w-1/12">#</th>
//               <th className="w-4/12">Title</th>
//               <th className="w-2/12">Difficulty</th>
//               <th className="w-3/12">Tags</th>
//               <th className="w-2/12">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {problems.map((problem, index) => (
//               <tr key={problem._id}>
//                 <th>{index + 1}</th>
//                 <td>{problem.title}</td>
//                 <td>
//                   <span className={`badge ${
//                     problem.difficulty === 'Easy' 
//                       ? 'badge-success' 
//                       : problem.difficulty === 'Medium' 
//                         ? 'badge-warning' 
//                         : 'badge-error'
//                   }`}>
//                     {problem.difficulty}
//                   </span>
//                 </td>
//                 <td>
//                   <span className="badge badge-outline">
//                     {problem.tags}
//                   </span>
//                 </td>
//                 <td>
//                   <div className="flex space-x-2">
//                     <button 
//                       onClick={() => handleDelete(problem._id)}
//                       className="btn btn-sm btn-error"
//                     >
//                       Delete
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default AdminDelete;