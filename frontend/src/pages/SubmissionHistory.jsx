import { useState, useEffect } from 'react';
import axios from 'axios';
import '/components/SubmissionHistory.css';

const SubmissionHistory = ({ problemId }) => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
         
           `http://localhost:2000/submit/Allusersubmission/${problemId}`,{withCredentials:true}
          //  'http://localhost:2000/submit/Allusersubmission/',{withCredentials:true}
        );
        setSubmissions(response.data);
        
        setError(null);
      } catch (err) {
        setError('Failed to fetch submission history');
        console.error(err);
         
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [problemId]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted':
        return 'badge-success';
      case 'wrong':
        return 'badge-error';
      case 'error':
        return 'badge-warning';
      case 'pending':
        return 'badge-info';
      default:
        return 'badge-neutral';
    }
  };

  const formatMemory = (memory) => {
    if (memory < 1024) return `${memory} kB`;
    return `${(memory / 1024).toFixed(2)} MB`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
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
      <div className="alert-error">
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="submission-wrapper">

      <div className="table-container">
        <table className="submission-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Language</th>
              <th>Status</th>
              <th>Runtime</th>
              <th>Memory</th>
              <th>Test Cases</th>
              <th>Submitted</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {submissions.map((sub, index) => (
              <tr key={sub.id}>
                <td>{index + 1}</td>
                <td>{sub.language}</td>
                <td>
                  <span className={`badge ${getStatusColor(sub.status)}`}>
                    {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                     {/* {sub.status.toUpperCase() + sub.status.slice(1)} */}
                  </span>
                </td>
                <td>{sub.runtime} sec</td>
                <td>{formatMemory(sub.memory)}</td>
                <td>{sub.testCasePassed}/{sub.testCaseTotal}</td>
                <td>{formatDate(sub.createdAt)}</td>
                <td>
                  <button
                    className="btn-view"
                    onClick={() => setSelectedSubmission(sub)}
                  >
                    View Code
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {submissions.length === 0 && (
        <div className="empty-state">No submissions found.</div>
      )}

      {submissions.length > 0 && (
        <div className="submission-count">
          Showing {submissions.length} submissions
        </div>
      )}

      {selectedSubmission && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Submission Code</h3>

            <pre className="code-block">
              <code>{selectedSubmission.code}</code>
            </pre>

            <button
              className="btn-close"
              onClick={() => setSelectedSubmission(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default SubmissionHistory;
