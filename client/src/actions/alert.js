import {SET_ALERT,REMOVE_ALERT} from "./types";
import { v4 as uuidv4 } from 'uuid';

//Dispatching async action poosible because of "thunk" middleware
export const setAlert = (msg,alertType,timeout = 5000) => {    // can also be writtn as ()=>dispatch=>{}
    return function (dispatch) {
        const id = uuidv4();
        dispatch({
            type:SET_ALERT,
            payload:{msg,alertType,id}
        });
        setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id }), timeout);
    }
}
