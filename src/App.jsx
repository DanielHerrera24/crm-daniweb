import { Route, Routes } from "react-router-dom";
import "./App.css";
import { AuthProvider } from "./context/AuthContext";
import Login from "./components/Login";
import Inicio from "./components/Inicio";
import ClientesActuales from "./components/ClientesActuales";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <ToastContainer />
      <main className="flex justify-center min-h-[80vh]">
        <div className="flex flex-col md:mt-7 w-full max-w-screen-lg">
          <section
            id="seccion"
            className="relative flex flex-col items-center w-full h-auto text-black"
          >
            <AuthProvider>
              <Routes>
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Inicio />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/clientes-actuales"
                  element={
                    <ProtectedRoute>
                      <ClientesActuales />
                    </ProtectedRoute>
                  }
                />
                <Route path="/login" element={<Login />} />
              </Routes>
            </AuthProvider>
          </section>
        </div>
      </main>
    </>
  );
}

export default App;
