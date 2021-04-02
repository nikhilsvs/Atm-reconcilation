import {createStore,combineReducers,applyMiddleware} from 'redux';
import {Entities} from './entity';
import {Format} from './format';
import {auth} from './auth';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
export const configureStore = ()=>{

    const store = createStore(
        combineReducers({
            entities:Entities,
            format:Format,
            auth:auth
        }),
        applyMiddleware(thunk,logger)
    );

    return store;
}