import * as ActionTypes from './ActionTypes';

export const auth = (state = {
    isLoading:false,
    token : localStorage.getItem('token'),
    isAuthenticated : localStorage.getItem('token')?true:false,
    user:localStorage.getItem('creds')?JSON.parse(localStorage.getItem('creds')):null,
    errmess : null
},action)=>{

    switch(action.type){
        case ActionTypes.LOGIN_REQUEST : 
            return {...state,isLoading:true,user:action.payload,isAuthenticated:false,errmess:null};

        case ActionTypes.LOGIN_SUCCESS :
            return {...state,isLoading:false,token:action.token,isAuthenticated:true};

        case ActionTypes.LOGIN_FAILED :
            return {...state,isLoading:false,isAuthenticated:false,errmess:action.payload};

        case ActionTypes.LOGOUT_REQUEST : 
            return {...state,isLoading:true};

        case ActionTypes.LOGIN_SUCCESS :
            return {...state,isLoading:false,isAuthenticated:false};

        case ActionTypes.LOGIN_FAILED :
            return {...state,isLoading:false,isAuthenticated:true,errmess:action.payload};
            

        default : return state;
    }
}