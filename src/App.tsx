import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import BoardsListPage from "./pages/BoardsListPage";
import BoardPage from "./pages/BoardPage";
import CalendarPage from "./pages/CalendarPage";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import PrivateRoute from "./pages/auth/PrivateRoute";
import Layout from "./components/Layout";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<PrivateRoute />}>
            <Route path="/boards" element={<BoardsListPage />} />
            <Route path="/board/:id" element={<BoardPage />} />
            <Route path="/board/:id/calendar" element={<CalendarPage />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
