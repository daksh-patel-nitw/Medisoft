import React from "react";
import { Routes, Route } from "react-router-dom";
import routes from "./routes/routes";
import { ToastContainer } from "react-toastify";


function App() {
  return (
    <div className="container">
      <Routes>
        {routes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;
