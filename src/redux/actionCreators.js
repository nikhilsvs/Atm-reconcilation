import * as ActionTypes from './ActionTypes';
import {baseUrl} from '../baseUrl';

export const entitiesLoading = ()=>({
    type:ActionTypes.ENTITY_LOADING
})

export const addEntities = (result)=>({
    type:ActionTypes.ENTITY_SUCCESS,
    payload:result
})

export const entitiesFailed = (errmess)=>({
    type:ActionTypes.ENTITY_FAILED,
    payload:errmess
})

export const fetchEntity =() =>(dispatch)=>{

    dispatch(entitiesLoading(true));

    fetch(baseUrl + 'databases/entity')
    .then((response)=>{
        if(response.ok){
            return response;
        }

        else{
            var err = new Error("Databases fetching Failed " + response.status + response.statusText);
            err.response = err;
            return err;
        }
    },(error)=>{
        throw error;
    })
    .then((response)=>response.json())
    .then((response)=>dispatch(addEntities(response)))
    .catch((error)=>dispatch(entitiesFailed(error.message)))


}
export const formatLoading = ()=>({
    type:ActionTypes.FORMAT_LOADING
})

export const addFormat = (result)=>({
    type:ActionTypes.FORMAT_SUCCESS,
    payload:result
})

export const formatFailed = (errmess)=>({
    type:ActionTypes.FORMAT_FAILED,
    payload:errmess
})

export const fetchFormat =() =>(dispatch)=>{

    dispatch(formatLoading(true));

    fetch(baseUrl + 'databases/format')
    .then((response)=>{
        if(response.ok){
            return response;
        }

        else{
            var err = new Error("Databases fetching Failed " + response.status + response.statusText);
            err.response = err;
            return err;
        }
    },(error)=>{
        throw error;
    })
    .then((response)=>response.json())
    .then((response)=>dispatch(addFormat(response)))
    .catch((error)=>dispatch(formatFailed(error.message)))


}

export const loginRequest = (creds)=>({
    type:ActionTypes.LOGIN_REQUEST,
    payload:creds
});
export const loginSuccess = (response)=>({
    type:ActionTypes.LOGIN_SUCCESS,
    token:response.token
});
export const loginFailed = (mess) =>({
    type:ActionTypes.LOGIN_FAILED,
    message:mess
});
export const loginUser = (creds)=> (dispatch)=>{

    dispatch(loginRequest(creds));

    fetch(baseUrl + "users/login",{
        method:"POST",
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify(creds)
    })
    .then((response)=>{
        if(response.ok){
            return response;
        }

        var err = new Error("Could not login");
        err.response = response;
        throw err;
    },(error)=>{
        throw error;
    })
    .then((response)=>{
        return response.json();
    })
    .then((response)=>{
        if(response.success){
            localStorage.setItem('token',response.token);
            localStorage.setItem('creds',JSON.stringify(creds));

            dispatch(loginSuccess(response));
        }
        else{
            var err = new Error("Error : " + response.status);
            err.response = response;
            throw err;
        }
    })
    .catch(error => dispatch(loginFailed(error.message)))

}
export const logoutRequest = ()=>({
    type:ActionTypes.LOGOUT_REQUEST
});
export const logoutSuccess = ()=>({
    type:ActionTypes.LOGOUT_SUCCESS
});
export const logoutFailed = (mess) =>({
    type:ActionTypes.LOGOUT_FAILED,
    payload:mess
});
export const logoutUser = () =>(dispatch)=>{

    dispatch(logoutRequest());
    localStorage.removeItem('token');
    localStorage.removeItem('creds');
    dispatch(logoutSuccess());
}
export const signupUser = (creds)=>(dispatch)=>{
    fetch(baseUrl+"users/signup",{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify(creds)
    })
    .then((response)=>{
        if(response.ok){
            return response;
        }
        else{
            var err = new Error("User to signup");
            err.response = response;
            throw err;
        }
    },(error)=>{
        throw error;
    })
    .then((response)=>response.json())
    .then((response)=>{
        alert("User : " + response.username + 
            "\n Successfully Registered , Now you can Login");
    })
    .catch((err)=>{
        alert(err.message);
    })
}