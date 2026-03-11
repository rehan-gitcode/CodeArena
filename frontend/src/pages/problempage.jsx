import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
// import Editor from '@monaco-editor/react';
import Editor, { DiffEditor, useMonaco, loader } from '@monaco-editor/react';
import { useParams } from 'react-router';
// import axiosClient from "../utils/axiosClient"
import axios from 'axios';
import SubmissionHistory from './SubmissionHistory';
// import SubmissionHistory from "../components/SubmissionHistory"
// import ChatAi from '../components/ChatAi';
// import Editorial from '../components/Editorial';
// import './problempage.css';
import '/components/problempage.css'
import { set } from 'mongoose';
import { useNavigate } from 'react-router';
import{ArrowRight,ArrowLeft} from'lucide-react'
import './App.css'

const langMap = {
  cpp: 'C++',
  java: 'Java',
  javascript: 'JavaScript'
};

const ProblemPage = () => {
  const [problem, setProblem] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [activeLeftTab, setActiveLeftTab] = useState('description');
  const [activeRightTab, setActiveRightTab] = useState('code');
  const [example, setexample] = useState('')
  const editorRef = useRef(null);
  const navigate = useNavigate();


  let { problemId } = useParams();
  const { handleSubmit } = useForm();

  useEffect(() => {
    const fetchProblem = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:2000/problem/getproblem/${problemId}`, { withCredentials: true });
        // const initialCode = response.data.startCode.find(
        //   sc => sc.language === langMap[selectedLanguage]
        // )?.initialCode;

        setProblem(response.data);
      //   setCode(problem.startCode.map((sc)=>{
      // if (sc.language === langMap[selectedLanguage]){
      //     return sc.initialCode
      //   }
      // }))
        let basiccode=response.data.startCode[0].initialCode || ''; 
        if(response.data.startCode[0].language === langMap[selectedLanguage]){ 
          setCode(basiccode)
        }
       
      } catch (error) {
        console.error('Error fetching problem:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProblem();
  }, [problemId]);

  // useEffect(() => {
  //   if (problem) {
  //     // const initialCode = problem.startCode.find(
  //     //   sc => sc.language === langMap[selectedLanguage]
  //     // )?.initialCode || "";
  //      const initialCode = problem.startCode.map((sc)=>{
  //       if (sc.language === langMap[selectedLanguage]){
  //         return sc.initialCode
  //       }
  //      })
      
  //     setCode(initialCode);
  //    }
     
  // }, [selectedLanguage, problem]);

  const handleEditorChange = (value) => {
    setCode(value || '');
  };

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
  };

  const handleRun = async () => {
    setLoading(true);
    setRunResult(null);
    try {
      const response = await axios.post(
        `http://localhost:2000/submit/runcode/${problemId}`,
        { code, language: selectedLanguage },
        { withCredentials: true }
      );
      setRunResult(response.data);
      setActiveRightTab('testcase');
    } catch (error) {
      console.error('Error running code:', error);
      setRunResult({ success: false, error: 'Internal server error' });
      setActiveRightTab('testcase');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitCode = async () => {
    setLoading(true);
    setSubmitResult(null);
    try {
      const response = await axios.post(
        `http://localhost:2000/submit/sub/${problemId}`,
        { code, language: selectedLanguage },
        { withCredentials: true }
      );
      setSubmitResult(response.data);
      setActiveRightTab('result');
    } catch (error) {
      console.error('Error submitting code:', error);
      setSubmitResult(null);
      setActiveRightTab('result');
    } finally {
      setLoading(false);
    }
  };

  const getLanguageForMonaco = (lang) => {
    switch (lang) {
      case 'java': return 'java';
      case 'cpp': return 'cpp';
      default: return 'javascript';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'easy-badge';
      case 'medium': return 'medium-badge';
      case 'hard': return 'hard-badge';
      default: return 'gray-badge';
    }
  };

  if (loading && !problem) {
    return <div className="loading-container"><div className="spinner"></div></div>;
  }

  if (!problem) {
    return <div className="error-container"><div className="error-text">Problem not found</div></div>;
  }

  const back=()=>{
    navigate('/')
  }
   

  return (
    <div className="app-container">

      <div className="header">
        <div className="header-content">
          <div className="header-left">
            {/* <span> <button onClick={back} className="back-button">
              <ArrowLeft />
            </button> </span> */}
            
            <h1 className="problem-title">{problem.title}</h1>
            <div className="problem-meta">
              <span className={`difficulty-badge ${getDifficultyColor(problem.difficulty)}`}>
                {problem.difficulty}
              </span>
              <span className='tag'>
                {problem.tags}
              </span>
              <span className="meta-item">{problem.memoryLimit} MB</span>
            </div>
          </div>

          <div className="header-buttons">
            <button onClick={handleRun} disabled={loading} className="btn btn-primary">
              {loading ? 'Running...' : 'Run Code'}
            </button>
            <button onClick={handleSubmitCode} disabled={loading} className="btn btn-success">
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </div>
      </div>

      <div className="main-content">
        <div className="content-grid">

          <div className="left-panel">
            <div className="panel-card">
              <div className="tab-header">
                <nav className="tab-nav">
                  <button
                    onClick={() => setActiveLeftTab('description')}
                    className={`tab-link ${activeLeftTab === 'description' ? 'active' : ''}`}
                  >
                    Description
                  </button>
                  <button
                    onClick={() => setActiveLeftTab('editorial')}
                    className={`tab-link ${activeLeftTab === 'editorial' ? 'active' : ''}`}
                  >
                    Editorial
                  </button>

                  <button
                    onClick={() => setActiveLeftTab('submission')}
                    className={`tab-link ${activeLeftTab === 'submission' ? 'active' : ''}`}
                  >

                    submission
                  </button>
                </nav>
              </div>

              <div className="tab-content">

               {activeLeftTab === 'description' && (
                  // <div dangerouslySetInnerHTML={{ __html: problem.description }} />
                   <h2> <strong>{problem.description}</strong></h2>
                  )}

                {activeLeftTab === 'description' && (
                  // <div dangerouslySetInnerHTML={{ __html: problem.description }} />
                
                  
                   problem.visibleTestCases.map((t,index)=>{

       
                       return(
                       
                <div key={index} className="example-testcase">
                  
                  
                  <h4>Example {index + 1}</h4>
                  <p><strong>Input:</strong> {t.input}</p>
                  <p><strong>Output:</strong> {t.output}</p>
                  <p><strong>Explanation:</strong> {t.explanation}</p>
                </div>
                )
      }) 
                  
                )}
                {activeLeftTab === 'editorial' && (
                  <div dangerouslySetInnerHTML={{ __html: problem.description }} />

                )}

                {activeLeftTab === 'submission' && (
                  <SubmissionHistory problemId={problemId} />
                )}
              </div>
            </div>
          </div>

          <div className="right-panel">
            <div className="panel-card">
              <div className="tab-header">
                <nav className="tab-nav">
                  <button
                    onClick={() => setActiveRightTab('code')}
                    className={`tab-link ${activeRightTab === 'code' ? 'active' : ''}`}
                  >
                    Code
                  </button>

                  {runResult && (
                    <button
                      onClick={() => setActiveRightTab('testcase')}
                      className={`tab-link ${activeRightTab === 'testcase' ? 'active' : ''}`}
                    >
                      Test Cases
                    </button>
                  )}

                  {submitResult && (
                    <button
                      onClick={() => setActiveRightTab('result')}
                      className={`tab-link ${activeRightTab === 'result' ? 'active' : ''}`}
                    >
                      Result
                    </button>
                  )}
                </nav>

                <select
                  value={selectedLanguage}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className='language-sel'

                >
                  <option className='list' value="javascript">JavaScript</option>
                  <option className='list' value="java">Java</option>
                  <option className='list' value="cpp">C++</option>
                </select>
              </div>

              <div className="editor-content">
                {activeRightTab === 'code' && (
                  <Editor
                    height="60vh"
                    language={getLanguageForMonaco(selectedLanguage)}
                    value={code}
                    onChange={handleEditorChange}
                    onMount={handleEditorDidMount}
                    theme="vs-dark"
                  />
                )}
              </div>
            </div>
          </div>

        </div>

        {/* <div className="bottom-section">
          <SubmissionHistory problemId={problemId} />
         
        </div>  */}

        {/* <ChatAi problemId={problemId} /> */}

      </div>
    </div>
  );
};

function renderTestcaseResult() {
  if (runResult.success) {
    return (
      <div className="testcase-passed">
        <div className="status-header">
          <div className="status-dot success"></div>
          <h3 className="status-title">Test Case Passed ✓</h3>
        </div>

        <div className="output-section">
          <p><strong>Expected Output:</strong></p>
          <pre className="output expected">{runResult.expectedOutput}</pre>
        </div>

        <div className="output-section">
          <p><strong>Your Output:</strong></p>
          <pre className="output actual">{runResult.actualOutput}</pre>
        </div>

        <div className="metrics-grid">
          <div className="metric">
            <span className="metric-label">Runtime:</span>
            <div className="metric-value">{runResult.runtime} sec</div>
          </div>
          <div className="metric">
            <span className="metric-label">Memory:</span>
            <div className="metric-value">{runResult.memory} KB</div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="testcase-failed">
        <div className="error-icon"></div>
        <h3 className="error-title">Runtime Error</h3>
        <pre className="error-message">{runResult.error}</pre>
      </div>
    );
  }
}

function renderSubmitResult() {
  if (submitResult.status === 'AC') {
    return (
      <div className="submit-success">
        <div className="success-icon-large"></div>
        <h2 className="success-title">Congratulations! Accepted ✅</h2>
        <p className="success-message">All test cases passed successfully.</p>

        <div className="metrics-grid large">
          <div className="metric">
            <span className="metric-label">Test Cases:</span>
            <div className="metric-value large">
              {submitResult.passedTestCases}/{submitResult.totalTestCases}
            </div>
          </div>

          <div className="metric">
            <span className="metric-label">Runtime:</span>
            <div className="metric-value large">{submitResult.runtime} sec</div>
          </div>

          <div className="metric">
            <span className="metric-label">Memory:</span>
            <div className="metric-value large">{submitResult.memory} KB</div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className={`submit-failed failed-${submitResult.status.toLowerCase()}`}>
        <div className="status-dot failed"></div>
        <h3 className="failed-title capitalize">{submitResult.status}</h3>

        <div className="metrics-grid">
          <div className="metric">
            <span className="metric-label">Test Cases:</span>
            <div className="metric-value">
              {submitResult.passedTestCases}/{submitResult.totalTestCases}
            </div>
          </div>

          <div className="metric">
            <span className="metric-label">Runtime:</span>
            <div className="metric-value">{submitResult.runtime} sec</div>
          </div>

          <div className="metric">
            <span className="metric-label">Memory:</span>
            <div className="metric-value">{submitResult.memory} KB</div>
          </div>
        </div>

        {submitResult.failedTestCases &&
          submitResult.failedTestCases.length > 0 && (
            <div className="failed-testcases">
              <h4>Failed Test Cases:</h4>

              <div className="testcases-list">
                {submitResult.failedTestCases.map((testCase, index) => (
                  <div key={index} className="testcase-item">
                    <div><strong>Input:</strong></div>
                    <pre>{testCase.input}</pre>

                    <div className="testcase-outputs">
                      <div>
                        <span>Expected:</span>
                        <pre>{testCase.expected}</pre>
                      </div>
                      <div>
                        <span>Got:</span>
                        <pre>{testCase.actual}</pre>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
      </div>
    );
  }
}


export default ProblemPage;
