import axios from 'axios';
import { setAlert } from './alert';
import {
    GET_PROFILE,
  GET_PROFILES,
  PROFILE_ERROR,
  UPDATE_PROFILE,
  CLEAR_PROFILE,
  ACCOUNT_DELETED,
  GET_REPOS,
  NO_REPOS
} from './types';

//Get current user's profile
export const getCurrentProfile = () => async dispatch => {
    try {
        const res = await axios.get('/api/profile/me');
        dispatch({
            type:GET_PROFILE,
            payload:res.data, //upon succesfull returning of response we get the profile data of current user in res.data
        })
    } catch (err) { //if request fails then err object created 
        dispatch({
            type:PROFILE_ERROR,
            payload:{
                msg:err.response.statusText,
                status:err.response.status
            }
        })
    }
}

//Get all profiles
export const getProfiles = () => async dispatch => {
    dispatch({type:CLEAR_PROFILE});
    try {
        const res = await axios.get('/api/profile');
        dispatch({
            type:GET_PROFILES,
            payload:res.data, //upon succesfull returning of response we get the profile data of current user in res.data
        })
    } catch (err) { //if request fails then err object created 
        dispatch({
            type:PROFILE_ERROR,
            payload:{
                msg:err.response.statusText,
                status:err.response.status
            }
        })
    }
}

//Get profile by id
export const getProfileById = (userId) => async dispatch => {
    try {
        const res = await axios.get(`/api/profile/user/${userId}`);
        dispatch({
            type:GET_PROFILE,
            payload:res.data, //upon succesfull returning of response we get the profile data of current user in res.data
        })
    } catch (err) { //if request fails then err object created 
        dispatch({
            type:PROFILE_ERROR,
            payload:{
                msg:err.response.statusText,
                status:err.response.status
            }
        })
    }
}

//Get github repos
export const getGithubRepos = (githubusername) => async dispatch => {
    try {
        const res = await axios.get(`/api/profile/github/${githubusername}`);
        dispatch({
            type:GET_REPOS,
            payload:res.data, //upon succesfull returning of response we get the profile data of current user in res.data
        })
    } catch (err) { //if request fails then err object created 
        dispatch({
            type:PROFILE_ERROR,
            payload:{
                msg:err.response.statusText,
                status:err.response.status
            }
        })
    }
}

//Create / Update a profile
export const createProfile = (formData,history,edit=false) =>async dispatch =>{  //edit tells if we are editing a profile or creating a new one
    try {
        const config = {
            headers:{
                "Content-type":"Application/json",
            }
        }
        const res = await axios.post("/api/profile",formData,config);
        dispatch({
            type:GET_PROFILE,
            payload:res.data, //upon succesfull returning of response we get the profile data of current user in res.data
        })
        dispatch(setAlert(edit?'Profile Updated':'Profile Created',"success"));
        if(!edit) //if not editing then redirect
        {
            history.push('/dashboard');
        }
    } catch (err) {
        const errors = err.response.data.errors; //this comes from backend as a result of errors produced by express-validator
        if(errors){
            errors.forEach(error => {
                dispatch(setAlert(error.msg,"danger"));
            });
        }
        dispatch({
            type:PROFILE_ERROR,
            payload:{
                msg:err.response.statusText,
                status:err.response.status
            }
        })
    }
}

//Add experience
export const addExperience = (formData,history)=>async dispatch=>{
    try {
        const config = {
            headers:{
                "Content-type":"Application/json",
            }
        }
        const res = await axios.put("/api/profile/experience",formData,config);
        dispatch({
            type:UPDATE_PROFILE,
            payload:res.data, //upon succesfull returning of response we get the profile data of current user in res.data
        })
        dispatch(setAlert('Experience Added',"success"));
        history.push('/dashboard');

    } catch (err) {
        const errors = err.response.data.errors; //this comes from backend as a result of errors produced by express-validator
        if(errors){
            errors.forEach(error => {
                dispatch(setAlert(error.msg,"danger"));
            });
        }
        dispatch({
            type:PROFILE_ERROR,
            payload:{
                msg:err.response.statusText,
                status:err.response.status
            }
        })
    }
}

//Add education
export const addEducation = (formData,history)=>async dispatch=>{
    try {
        const config = {
            headers:{
                "Content-type":"Application/json",
            }
        }
        const res = await axios.put("/api/profile/education",formData,config);
        dispatch({
            type:UPDATE_PROFILE,
            payload:res.data, //upon succesfull returning of response we get the profile data of current user in res.data
        })
        dispatch(setAlert('Education Added',"success"));
        history.push('/dashboard');
        
    } catch (err) {
        const errors = err.response.data.errors; //this comes from backend as a result of errors produced by express-validator
        if(errors){
            errors.forEach(error => {
                dispatch(setAlert(error.msg,"danger"));
            });
        }
        dispatch({
            type:PROFILE_ERROR,
            payload:{
                msg:err.response.statusText,
                status:err.response.status
            }
        })
    }
}

// Delete Expereince
export const deleteExperience = id => async dispatch => {
    try {
        const res =await axios.delete(`/api/profile/experience/${id}`);
        dispatch({
            type:UPDATE_PROFILE,
            payload:res.data
        })
        dispatch(setAlert('Experience Deleted',"success"));
    } catch (err) {
        dispatch({
            type:PROFILE_ERROR,
            payload:{
                msg:err.response.statusText,
                status:err.response.status
            }
        })
    }
}

// Delete Education
export const deleteEducation = id => async dispatch => {
    try {
        const res =await axios.delete(`/api/profile/education/${id}`);
        dispatch({
            type:UPDATE_PROFILE,
            payload:res.data
        })
        dispatch(setAlert('Education Deleted',"success"));
    } catch (err) {
        dispatch({
            type:PROFILE_ERROR,
            payload:{
                msg:err.response.statusText,
                status:err.response.status
            }
        })
    }
}

//Delete account and profile
export const deleteAccount = () => async dispatch => {
    if(window.confirm('Are you sure ?This cant be undone'))
    {
        try {
            const res =await axios.delete(`/api/profile`);
            dispatch({
                type:CLEAR_PROFILE,
            });
            dispatch({
                type:ACCOUNT_DELETED
            })
            dispatch(setAlert('Your account has been permanently deleted'));
        } catch (err) {
            dispatch({
                type:PROFILE_ERROR,
                payload:{
                    msg:err.response.statusText,
                    status:err.response.status
                }
            })
        }
    }
}