import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router";
import "/components/AdminDelete.css";
import { useNavigate } from "react-router";

const AdminUpdate = () => {
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

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

    const handleUpdate = (id) => {
        navigate(`/updateproblem/${id}`);

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
                <h1>Update Problems</h1>
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
                                        onClick={() => handleUpdate(problem._id)}
                                    >
                                        Update
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

export default AdminUpdate;






