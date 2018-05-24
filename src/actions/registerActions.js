//all functions for registration go here
import {REGISTER_USER} from './types';

export const registerUser = () => dispatch => {
    dispatch({
        type: REGISTER_USER,
        payload: ''
    })
}