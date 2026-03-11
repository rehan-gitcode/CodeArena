import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
// import axiosClient from "./axiosClient";
import axios from "axios";


// import { check } from "zod";
// import { checkAuthuser } from "../../leetcode/function";
// import { checkuser } from "../../leetcode/function";
// import { user_register } from "../../leetcode/function";
// import { login } from "../../leetcode/function";
// import { logout } from "../../leetcode/function"; 

export const user_register=createAsyncThunk(
    'auth/register',

    async (userData,{rejectWithValue}) => {
        try{
            const response=await axios.post('http://localhost:2000/user/register',userData,{ withCredentials: true })
            return response.data
        }
        catch(error) {
            return rejectWithValue(error.message)
        }


    }
)

export const login=createAsyncThunk(
    'auth/login',

    async (userData,{rejectWithValue}) => {
        try{
            const response=await axios.post('http://localhost:2000/user/login',userData,{ withCredentials: true })
            return response.data.user
        }
        catch(error) {
            return rejectWithValue(error.message)
        }


    }
)


export const checkAuth=createAsyncThunk(
    'auth/check',

    async (_,{rejectWithValue}) => {
        try{
            const {data}=await axios.get('http://localhost:2000/user/check',{ withCredentials: true })
            return data.user
        }
        catch(error) {

            if(error.response?.status === 401){
                return rejectWithValue(null) 
            }
            return rejectWithValue(error.message)
        }


    }
)

export const logout=createAsyncThunk(
    'auth/logout',

    async (_,{rejectWithValue}) => {
        try{
            await axios.post('http://localhost:2000/user/logout',{},{ withCredentials: true })
            return null
        }
        catch(error) {
            return rejectWithValue(error.message)
        }


    }
)


const authSlice=createSlice({

    name:"auth",
    initialState:{
        user:null,
        isAuthenticated:false,
        loading:false,
        error:null
    },

    reducers:{

    },

    extraReducers:(builder)=>{
       
        //register case

         builder

        .addCase(user_register.pending,(state)=>{
            state.loading=true;
            state.error=null
        })

        .addCase(user_register.fulfilled,(state,action)=>{
            state.loading=false;
            state.isAuthenticated=true;
            // !!action.payload;
            state.user=action.payload.user;

        })

        .addCase(user_register.rejected,(state,action)=>{
            state.loading=false
            state.error=action.payload ||'something went wrong'
            state.isAuthenticated=false;
            state.user=null
        })

        //login case

          .addCase(login.pending,(state)=>{
            state.loading=true;
            state.error=null
        })

        .addCase(login.fulfilled,(state,action)=>{
            state.loading=false;
            state.isAuthenticated=true;
            state.user=action.payload;

        })

        .addCase(login.rejected,(state,action)=>{
            state.loading=false
            state.error=action.payload ||'something went wrong'
            state.isAuthenticated=false;
            state.user=null
        }) 


        //check case

         .addCase(checkAuth.pending,(state)=>{
            state.loading=true;
            state.error=null
        })

        .addCase(checkAuth.fulfilled,(state,action)=>{
            state.loading=false;
            state.isAuthenticated=!!action.payload;
            state.user=action.payload;

        })

        .addCase(checkAuth.rejected,(state,action)=>{
            state.loading=false
            state.error=action.payload ||'something went wrong'
            state.isAuthenticated=false;
            state.user=null
        })


        //logout case

         .addCase(logout.pending,(state)=>{
            state.loading=true;
            state.error=null
        })

        .addCase(logout.fulfilled,(state,action)=>{
            state.loading=false;
            state.isAuthenticated=false
            state.user=null

        })

        .addCase(logout.rejected,(state,action)=>{
            state.loading=false
            state.error=action.payload ||'something went wrong'
            state.isAuthenticated=false;
            state.user=null
        })


    }

});

export default authSlice.reducer;