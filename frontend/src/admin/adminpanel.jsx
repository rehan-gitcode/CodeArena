import { useForm, useFieldArray } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
// import axiosClient from '../utils/axiosClient';
import axios from 'axios';
import { useNavigate } from 'react-router';
import '/components/adminPanel.css';


const problemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  tags: z.enum(['array', 'linkedList', 'graph', 'dp']),
  visibleTestCases: z.array(
    z.object({
      input: z.string().min(1, 'Input is required'),
      output: z.string().min(1, 'Output is required'),
    })
  ),
  hiddenTestCases: z.array(
    z.object({
      input: z.string().min(1, 'Input is required'),
      output: z.string().min(1, 'Output is required'),
    })
  ),
  explanation: z.string().optional(),
});

 function AdminPanel() {
  const navigate = useNavigate(); 
 

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      title: '',
      description: '',
      difficulty: 'easy',
      tags: 'array',
      visibleTestCases: [{ input: '', output: '' }],
      hiddenTestCases: [{ input: '', output: '' }],
      explanation: '',
    },
  });

  const {
    fields: visibleFields,
    append: appendVisible,
    remove: removeVisible,
  } = useFieldArray({ control, name: 'visibleTestCases' });

  const {
    fields: hiddenFields,
    append: appendHidden,
    remove: removeHidden, 
  } = useFieldArray({ control, name: 'hiddenTestCases' });

  const onSubmit = async (data) => {
    try {
      const res = await axios.post('http://localhost:2000/problem/create', data,{withCredentials:true}); 

      if (res.status === 201) {
        alert('Problem created successfully!');
        navigate('/adminhome');
      }
    } catch (error) {
      // console.error(error);
      console.log(error)
      alert('Failed to create problem');
    }
  };

  return (
    <div className="container">
      <h1 className="title">Admin Panel - Create Problem</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <div className="form-group">
          <label>Problem Title</label>
          <input {...register('title')} className="input" />
          {errors.title && <p className="error">{errors.title.message}</p>}
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea {...register('description')} className="textarea" />
          {errors.description && (
            <p className="error">{errors.description.message}</p>
          )}
        </div>

        <div className="form-group">
          <label>Difficulty</label>
          <select {...register('difficulty')} className="select">
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <div className="form-group">
          <label>Tags</label>
          <select {...register('tags')} className="select">
            <option value="array">Array</option>
            <option value="linkedList">Linked List</option>
            <option value="graph">Graph</option>
            <option value="dp">Dynamic Programming</option>
          </select>
        </div>

        <div className="form-group">
          <label>Visible Test Cases</label>
          <div className="testcase-list">
            {visibleFields.map((field, index) => (
              <div key={field.id} className="testcase-item">
                <textarea
                  {...register(`visibleTestCases.${index}.input`)}
                  placeholder="Input"
                  className="textarea"
                />
                <textarea
                  {...register(`visibleTestCases.${index}.output`)}
                  placeholder="Output"
                  className="textarea"
                />
                <button type="button" onClick={() => removeVisible(index)} className="btn-delete">X</button>
              </div>
            ))}
            <button type="button" onClick={() => appendVisible({ input: '', output: '' })} className="btn-add">+ Add Visible Test Case</button>
          </div>
        </div>

        <div className="form-group">
          <label>Hidden Test Cases</label>
          <div className="testcase-list">
            {hiddenFields.map((field, index) => (
              <div key={field.id} className="testcase-item">
                <textarea
                  {...register(`hiddenTestCases.${index}.input`)}
                  placeholder="Input"
                  className="textarea"
                />
                <textarea
                  {...register(`hiddenTestCases.${index}.output`)}
                  placeholder="Output"
                  className="textarea"
                />
                <button type="button" onClick={() => removeHidden(index)} className="btn-delete">X</button>
              </div>
            ))}
            <button type="button" onClick={() => appendHidden({ input: '', output: '' })} className="btn-add">+ Add Hidden Test Case</button>
          </div>
        </div>

        <div className="form-group">
          <label>Explanation (Optional)</label>
          <textarea {...register('explanation')} className="textarea" />
        </div>

        <button type="submit" className="btn-submit">Create Problem</button>
      </form>
    </div>
  );
}
export default AdminPanel;