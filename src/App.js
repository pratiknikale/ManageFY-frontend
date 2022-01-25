import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./mycomponents/Header";
import Sidebar from "./mycomponents/Sidebar";
import TList from "./Pages/Todo";
import ManageManager from "./Pages/ManageManager";
import ManageEmployee from "./Pages/ManageEmployee";
import Assigned from "./Pages/Assigned";
import Auth from "./Pages/Auth";
import Chats from "./Pages/Chats";
import ProtectedRoute from "./mycomponents/protectedRoutes";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import {useState, createContext} from "react";

export const AppContext = createContext(null);

const App = () => {
  const [isUser, setUser] = useState("");
  const [role, setRole] = useState("");
  const [userName, setUserName] = useState("");

  return (
    <AppContext.Provider value={{isUser, setUser, role, setRole, userName, setUserName}}>
      <BrowserRouter>
        <Header />
        {isUser && <Sidebar />}
        <div className={isUser && "mainContainer"}>
          <Routes>
            <Route exact path="/" element={<Auth />} />
            <Route element={<ProtectedRoute />}>
              <Route exact path="/mytasks" element={<TList />} />
              <Route exact path="/ManageEmployee" element={<ManageEmployee />} />
              <Route exact path="/ManageManager" element={<ManageManager />} />
              <Route exact path="/Assigned" element={<Assigned />} />
              {isUser && <Route exact path="/Chats" element={<Chats />} />}
            </Route>
          </Routes>
        </div>
      </BrowserRouter>
    </AppContext.Provider>
  );
};

export default App;
