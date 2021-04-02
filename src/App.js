import React from 'react';
import Main from './Components/mainComponent';
import {Provider} from 'react-redux';
import {configureStore} from './redux/configureStore';
import {BrowserRouter} from 'react-router-dom';

import './App.css';

const store = configureStore();

function App() {
  return (
    <Provider store={store}>
       <BrowserRouter>
         <Main/>
      </BrowserRouter>
    </Provider>
    
    
  );
}

export default App;
