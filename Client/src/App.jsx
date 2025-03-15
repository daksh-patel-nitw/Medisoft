import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import routes from "./routes/routes";
import { ToastContainer } from "react-toastify";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
}

export default App;
