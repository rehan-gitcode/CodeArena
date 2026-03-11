import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import "/components/login.css";
import { useDispatch,useSelector } from "react-redux";
import { useEffect } from "react";
import { login } from "../redux/authSlice";
import { useNavigate } from "react-router";
import "/components/login.css";

const signupSchema = z.object({
  // name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});



const LOGIN = () => {

const dispatch=useDispatch()
const navigate=useNavigate()
const {isAuthenticated,loading,error}=useSelector((state)=>state.auth);



  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signupSchema),
  });


  useEffect(()=>{
      if(isAuthenticated){
        navigate('/');
      }
    },[isAuthenticated,navigate])

  const onSubmit =  (data) => {

     dispatch(login(data))
    console.log("Submitted:", data);
    // await new Promise((res) => setTimeout(res, 1000));

    alert("login Successful!");
    // reset();
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h1 className="signup-title">LEETCODE</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="signup-form">
        

          {/* Email */}
          <div className="form-group">
            <label  className="label">Email</label>
            <input type="email" {...register("email")} placeholder="john@gmail.com" />
            {errors.email && <p className="error">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div className="form-group">
            <label  className="label">Password</label>
            <input type="password" {...register("password")} placeholder="**********"/>
            {errors.password && (
              <p className="error">{errors.password.message}</p>
            )}
          </div>

          <button className="submit-btn"> 
           LOGIN
          </button>
          {/* disabled={isSubmitting} */}
        </form>
      </div>
    </div>
  );
};

export default LOGIN;
















































// import React from 'react'
// import { useState } from 'react'
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod'; // or 'zod/v4'






// const Signup = () => {

//     const signupSchema=z.object({
//         firstName:z.string().min(3,"3 letterslong"),
//          lastName:z.string().min(3,"3 letterslong"),


//     })

//      const { register,handleSubmit,formState: { errors },} = useForm({resolver:zodResolver(signupSchema)});
//   return (
//       <form  onSubmit={handleSubmit((data) => console.log(data))}>
//       <input  {...register('firstName')} />
//       <input {...register('lastName')} />
//       {errors.lastName && <p className=''>{errors.lastName.message}</p>}
//       <input {...register('age', { pattern: /\d+/ })} />
//       {errors.age && <p>Please enter number for age.</p>}
//       <input className='bg-amber-200' type="submit" />
//     </form>
   
//   )
// }


//  export default Signup





















// const Signup = () => {

//     const [name, setname] = useState("")
//     const [email, setemail] = useState('')
//     const [password, setpassword] = useState('')

//     function handlesubmit(e) {
//         e.preventDefult()
//         console.log(name, password, email)

//     }


//     return (
//         <>
//             <form onSubmit={handlesubmit}>

//                 <div>
//                     <label className="block text-gray-800 font-medium mb-2">Name</label>
//                     <input
//                         onChange={(e) => setname(e.target.value)}
//                         name={name}
//                         type="text"
//                         placeholder="Enter your name"
//                         className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-400 outline-none"
//                         required
//                     />
//                 </div>

//                 <div >
//                     <label className="block text-gray-700 font-medium mb-2">E-mail</label>
//                     <input
//                         onChange={(e) => setemail(e.target.value)}
//                         name={email}
//                         type="email"
//                         placeholder="Enter your name"
//                         className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-400 outline-none"
//                         required
//                     />
//                 </div>

//                 <div>
//                     <label className="block text-gray-700 font-medium mb-2 mt-2">PASSWORD</label>
//                     <input
//                         onChange={(e) => setpassword(e.target.value)}
//                         name={password}
//                         type="password"
//                         placeholder="Enter your password"
//                         className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-400 outline-none"
//                         required
//                     />
//                 </div>

//                 <button
//                     type="submit"
//                     className="w-full mt-8 bg-yellow-400 hover:bg-yellow-500 transition-colors text-white font-semibold py-3 rounded-lg shadow-lg"
//                 >
//                     SUBMIT
//                 </button>

//             </form >
//         </>
//     )
// }


