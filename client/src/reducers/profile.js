import {
    GET_PROFILE,
    PROFILE_ERROR,
    CLEAR_PROFILE,
    UPDATE_PROFILE,
    GET_PROFILES,
    GET_REPOS,
    NO_REPOS
  } from '../actions/types';

  
const initialState = {
    profile:null, //hold the profile data of current user
    profiles:[], //holds the data of the profiles of all the users
    repos:[], //holds the data of github repos of current user
    loading:true,
    error:{}
}

export default function(state=initialState,action) {
    const {type,payload} = action;
    switch(type){
        case GET_PROFILE:
        case UPDATE_PROFILE:
            return {
                ...state,
                profile:payload,
                loading:false,
            } 
        case GET_PROFILES:
            return {
                ...state,
                profiles:payload,
                loading:false,
            }
        case PROFILE_ERROR:
            return {
                ...state,
                loading:false,
                error:payload
            };
        case CLEAR_PROFILE:
            return {
                ...state,
                profile:null,
                repos:[],
                loading:false
            }    
        case GET_REPOS:
            return{
                ...state,
                repos:payload,
                loading:false
            }
        default:
            return state;
    }
}