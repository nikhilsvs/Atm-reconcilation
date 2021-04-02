import * as ActionTypes from './ActionTypes';

export const Entities = (state={
    isEntityLoading:false,
    entity:[],
    err:null
},action)=>{
    switch(action.type){
        case ActionTypes.ENTITY_LOADING:
            return {...state,isEntityLoading:true,entity:[],err:null};

        case ActionTypes.ENTITY_SUCCESS:
            return{...state,isEntityLoading:false,entity:action.payload,err:null};

        case ActionTypes.ENTITY_FAILED:
            return{...state,isEntityLoading:false,entity:[],err:action.payload};

        default:
            return state;
    }
}