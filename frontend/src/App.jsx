
import { useState } from 'react'
import {BrowserRouter, Route,Routes} from "react-router"
import Home from "./pages/Home"
import Signup from './auth/Signup'
import Login from './auth/Login'
import { useDispatch ,useSelector} from 'react-redux'
import { checkAuth } from './redux/authSlice'
import { useEffect } from 'react'
import { Navigate } from 'react-router'
import AdminPanel from './admin/adminpanel'
import ProblemPage from './pages/problempage'
import Admin from './admin/adminhome'
import AdminDelete from './admin/admindelete'
import AdminUpdate from './admin/adminupdate'
import UpdateProblem from './admin/updateproblem'




function App() {
 
 
 const {isAuthenticated,user}= useSelector((state)=>state.auth)
 const dispach=useDispatch()

 useEffect(()=>{
  dispach(checkAuth());
 },[dispach])

//  console.log(isAuthenticated) 
 
  
  return (
    <>

<Routes>
<Route path='/' element={isAuthenticated?<Home/>:<Navigate to='/signup' replace/>}></Route>
<Route path='/signup' element={isAuthenticated?<Navigate to='/' replace />:<Signup/>}></Route>
<Route path='/login' element={isAuthenticated?<Navigate to='/' replace />:<Login/>}></Route>
<Route path='/admin/create'  element={isAuthenticated  && user?.role == 'admin' ? <AdminPanel/>:<Navigate to='/'/>}></Route>
<Route path='/adminhome'  element={isAuthenticated  && user?.role == 'admin' ? <Admin/>:<Navigate to='/'/>}></Route>
<Route path='/admin/delete'  element={isAuthenticated  && user?.role == 'admin' ? <AdminDelete/>:<Navigate to='/'/>}></Route>
<Route path='/admin/update'  element={isAuthenticated  && user?.role == 'admin' ? <AdminUpdate/>:<Navigate to='/'/>}></Route>
<Route path='/problem/:problemId'  element= {<ProblemPage/>}></Route>
<Route path='/updateproblem/:id'  element= {<UpdateProblem/>}></Route>

</Routes>
    
 
     
    </>
  )
}

export default App
