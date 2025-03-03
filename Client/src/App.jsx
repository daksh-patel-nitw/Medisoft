import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import routes from "./routes/routes";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <div className="container">
      <BrowserRouter>
        <Routes>
          {routes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </div>
  );
}

export default App;
