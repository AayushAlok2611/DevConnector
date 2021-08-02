import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT,
    ACCOUNT_DELETED
} from "../actions/types";

const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: null, //whether current user id Authenticated or not
    loading: true, 
    user: null //data of current user
  };

  export default function(state= initialState,action) {
      const {type,payload} = action;
      switch(type){
        case USER_LOADED:
          return{
            ...state,
            isAuthenticated:true,
            loading:false,
            user:payload
          }
        case REGISTER_SUCCESS: //on succesfull registration we get back the token from backend
        case LOGIN_SUCCESS:
        localStorage.setItem('token',payload.token);
              return {
                ...state,
                ...payload,
                loading:false,  //since we got user data
                isAuthenticated:true
              };
        case REGISTER_FAIL:
        case AUTH_ERROR:
        case LOGIN_FAIL:
        case LOGOUT:
        case ACCOUNT_DELETED:
            localStorage.removeItem('token'); 
            return {
                ...state,
                token:null,
                loading:false,  //since we got user data
                isAuthenticated:false
              };          
        default:
            return state;
      }
};


