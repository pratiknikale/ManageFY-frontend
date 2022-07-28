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
import ProtectedManagerRoute from "./mycomponents/ProtectedManagerRoute";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import {useState, createContext, useEffect} from "react";
import {useSelector} from "react-redux";
import Settings from "./Pages/Settings";
import Footer from "./mycomponents/Footer";

export const AppContext = createContext(null);

const App = () => {
  const user = useSelector((state) => state.user.user);
  const [userName, setUserName] = useState("");

  return (
    <AppContext.Provider
      value={{
        userName,
        setUserName,
      }}
    >
      <BrowserRouter>
        <Header />
        {user.result && <Sidebar />}
        <div className={user.result ? "mainContainer" : "notLoggedMainContainer"}>
          <Routes>
            <Route exact path="/" element={<Auth />} />
            <Route element={<ProtectedRoute />}>
              <Route exact path="/mytasks" element={<TList />} />
              <Route element={<ProtectedManagerRoute />}>
                <Route exact path="/ManageEmployee" element={<ManageEmployee />} />
                <Route exact path="/ManageManager" element={<ManageManager />} />
                <Route exact path="/Assigned" element={<Assigned />} />
              </Route>
              <Route exact path="/Chats" element={<Chats />} />
              <Route exact path="/Settings" element={<Settings />} />
            </Route>
          </Routes>
          <Footer />
        </div>
      </BrowserRouter>
    </AppContext.Provider>
  );
};

export default App;

// ProtectedManagerRoute
