import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './mycomponents/Header';
import TList from './mycomponents/Todo';
// import CreateTask from './mycomponents/Create';
import Auth from './mycomponents/Auth';
import ProtectedRoute from './mycomponents/protectedRoutes';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, createContext} from 'react';

export const AppContext = createContext(null);

const App = () => {


  const [isUser, setUser] = useState('');
  const [userName, setUserName] = useState('');

  return (


    <AppContext.Provider value={{isUser, setUser, userName, setUserName}}>
      <BrowserRouter>
        <Header/>
        <Routes>
          <Route exact path="/" element={<Auth />} />              
          <Route element={<ProtectedRoute />}>
            <Route exact path="/home" element={<TList />} />

            {/* <Route exact path="/createTask" element={<CreateTask />} /> */}

          </Route>    
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>
   
  );
}

export default App;
