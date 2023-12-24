import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./index.css";
import Login from "./views/authentication/Login";
import NotFound from "./views/NotFound";
import LogsView from "./views/timeLogs/View";
import ProjectList from "./views/projects/List";
import FilterLogs from "./views/filterLogs/List";
import ProjectView from "./views/projects/View";
import LogsList from "./views/admin/List";
import NavBar from "./views/NavBar";
import { useSelector } from "react-redux";

function App() {
  const currentUser = useSelector((state) => state.auth.currentUser);

  return (
    // Set the directory path if you are deploying in sub-folder

    <BrowserRouter>
      {currentUser && <NavBar />}
      <Routes>
        <Route path="/projects" element={<ProjectList />}></Route>
        <Route path="/logs" element={<LogsList />}></Route>
        <Route
          path="/projects/:projectName/:id"
          element={<ProjectView />}
        ></Route>
        <Route
          path="/projects/:projectName/task/:id"
          element={<LogsView />}
        ></Route>
        <Route path="/filterLogs" element={<FilterLogs />}></Route>
        <Route path="/not-found" element={<NotFound />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/" element={<Navigate replace to="/login" />}></Route>
        <Route path="*" element={<Navigate replace to="/not-found" />}></Route>
      </Routes>
    </BrowserRouter>

  );
}

export default App;
