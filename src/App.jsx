import { useContext, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import "./App.css";
import Login from "./components/login";
import SignUp from "./components/SignUp";
import Home from "./components/Home";
import HealthProgress from "./components/progress";
import UserData from "./components/userData";
import About from "./components/About";
import ErrorPage from "./components/ErrorPage";

import { AuthContext } from "./firebase/AuthContext";

function App() {
  const { user, loading } = useContext(AuthContext);
  // const [presentUser, setPresentUser] = useState(null);
  const [userHealthData, setUserHealthData] = useState(null);

  const handleUserDataSubmit = (data) => {
    setUserHealthData(data);
  };

  if (loading) {
    return (
      <>
        <div className="loading-page">
          <div className="loading-div">
            <div className="loader"></div>
            <p>Loading...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {user ? (
          <>
            <Route
              path="/"
              element={<Home userHealthData={userHealthData} />}
            />
            <Route
              path="/userdata"
              element={<UserData onSubmitUserData={handleUserDataSubmit} />}
            />
            <Route path="/progress" element={<HealthProgress />} />
            <Route path="/login" element={<Navigate to="/" />} />
            <Route path="/signup" element={<Navigate to="/" />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<ErrorPage />} />


          </>
        ) : (
          <>
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
