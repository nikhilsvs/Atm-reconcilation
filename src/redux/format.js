import * as ActionTypes from  './ActionTypes';

export const Format = (state={
    isFormatLoading:false,
    format:[],
    err:null
},action)=>{
    switch(action.type){
        case ActionTypes.FORMAT_LOADING:
            return {...state,isFormatLoading:true,format:[],err:null};
    
        case ActionTypes.FORMAT_SUCCESS:
            return{...state,isFormatLoading:false,format:action.payload,err:null};
    
        case ActionTypes.ENTITY_FAILED:
             return{...state,isFormatLoading:false,format:[],err:action.payload};

        default:
            return state;
    }
}