import { useEffect, useState } from 'react';
import { NavLink } from 'react-router'; // Fixed import
import { useDispatch, useSelector } from 'react-redux';
// import axiosClient from '../utils/axiosClient';
import axios from 'axios';
import { logout } from '../redux/authSlice';
import '/components/home.css'
import { useNavigate } from 'react-router';

function Homepage() {
  const dispatch = useDispatch();
  const navigate=useNavigate()
  const { user } = useSelector((state) => state.auth);
  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [filters, setFilters] = useState({
    difficulty: 'all',
    tag: 'all',
    status: 'all' 
  });
  const {isAuthenticated,loading,error}=useSelector((state)=>state.auth);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const {data} = await axios.get('http://localhost:2000/problem/getallproblem',{ withCredentials: true });
        setProblems(data );
       console.log(data)
      } catch (err) {
        console.log('error :',err);
      }
    };
     
     const fetchSolvedProblems = async () => {
      try {
        const {data} = await axios.get('http://localhost:2000/problem/allsolvedproblem',{withCredentials:true});
      
        setSolvedProblems(data); 
        //  console.log([])
      } catch (err) {
        console.log('error :',err);
      }
    };



    fetchProblems();
    if(user) fetchSolvedProblems()
  }, [user]);

  const handleLogout = () => {
    dispatch(logout());
  };

  const adminnav=()=>{
    if(user.role=='admin'){
     navigate('/adminhome') }
    }

    
 

  const filteredProblems = problems.filter((p) => {
    const difficultyMatch =
      filters.difficulty === 'all' || p.difficulty === filters.difficulty;

    const tagMatch =
      filters.tag === 'all' || p.tags.includes(filters.tag);

    const statusMatch =
      filters.status === 'all' ||
      (filters.status === 'solved' && solvedProblems.includes(p._id)) ||
      (filters.status === 'unsolved' && !solvedProblems.includes(p._id));

    return difficultyMatch && tagMatch && statusMatch;
  });

if(loading){
  return (
    <div className="loading-container">
      <p>Loading problems...</p>
    </div>
  );
}

   return (
    <div className="home-container">
      
      {/* TOP NAV */}
      <div className="navbar">
        <h1 className="logo">LeetCode</h1>
        <div className="nav-right">
        <span className="username">{user?.firstname}</span>
         <button className="logout-btn" onClick={handleLogout}>Logout</button>
         {/* <button className="logout-btn" onClick={adminnav}>Admin </button> */}
          {user?.role === 'admin' && (
            <button className="logout-btn" onClick={adminnav}>Admin </button>
          )}


          
        </div>
      </div>

      {/* FILTERS */}
      <div className="filters-row">
        <select
          className="filter-select"
          onChange={(e) =>
            setFilters({ ...filters, difficulty: e.target.value })
          }
        >
          <option value="all">All Problems</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        <select
          className="filter-select"
          onChange={(e) => setFilters({ ...filters, tag: e.target.value })}
        >
          <option value="all">All Difficulties</option>
          <option value="array">Array</option>
          <option value="string">String</option>
          <option value="dp">DP</option>
        </select>

        <select
          className="filter-select"
          onChange={(e) =>
            setFilters({ ...filters, status: e.target.value })
          }
        >
          <option value="all">All Tags</option>
          <option value="solved">Solved</option>
          <option value="unsolved">Unsolved</option>
        </select>
      </div>

      {/* PROBLEM CARDS */}
      <div className="problems-wrapper">
        {filteredProblems.map((p) => (
          <div key={p._id} className="problem-card">
            <NavLink to={`/problem/${p._id}`} className="problem-link">
              <h3 className="problem-title">{p.title}</h3>

              <div className="badge-row">
                <span className={`difficulty-badge ${p.difficulty}`}> 
                  {p.difficulty}
                </span> 

              <span className="tag-badge">{p.tags}</span>

                {/* {p.tags.map((tag, index) => (
                  // <span key={index} className="tag-badge">{tag}</span>
                 ))}  */}
              </div>
            </NavLink>
          </div>
        ))}
      </div>

    </div>
  );
}

export default Homepage;

//   return (
//     <div className="homepage-container">
//       <div className="header">
//         <h1>Welcome, {user?.firstname}</h1>
//         {/* {console.log({user.firstname})} */}
//         <button onClick={handleLogout}>Logout</button>
//       </div>

//       <div className="filters">
//         <select
//           onChange={(e) =>
//             setFilters({ ...filters, difficulty: e.target.value })
//           }
//         >
//           <option value="all">All Difficulty</option>
//           <option value="easy">Easy</option>
//           <option value="medium">Medium</option>
//           <option value="hard">Hard</option>
//         </select>

//         <select
//           onChange={(e) =>
//             setFilters({ ...filters, tag: e.target.value })
//           }
//         >
//           <option value="all">All Tags</option>
//           <option value="array">Array</option>
//           <option value="string">String</option>
//           <option value="dp">Dynamic Programming</option>
//         </select>

//         <select
//           onChange={(e) =>
//             setFilters({ ...filters, status: e.target.value })
//           }
//         >
//           <option value="all">All Status</option>
//           <option value="solved">Solved</option>
//           <option value="unsolved">Unsolved</option>
//         </select>
//       </div>

//       <div className="problems-list">
//         {filteredProblems.map((p) => (
//           <div key={p._id} className="problem-card">
//             <NavLink to={`/problem/${p._id}`}>
//               <h3>{p.title}</h3>
//               <span className={`badge ${getDifficultyBadgeColor(p.difficulty)}`}>
//                 {p.difficulty}
//               </span>
//             </NavLink>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// const getDifficultyBadgeColor = (difficulty) => {
//   switch (difficulty.toLowerCase()) {
//     case 'easy': return 'badge-success';
//     case 'medium': return 'badge-warning';
//     case 'hard': return 'badge-error';
//     default: return 'badge-neutral';
//   }
// };

// export default Homepage;
