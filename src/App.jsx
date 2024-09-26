import { Route, Routes } from "react-router-dom";
import "./App.css";
import { AuthProvider } from "./context/AuthContext";
import Login from "./components/Login";
import Inicio from "./components/Inicio";
import ClientesActuales from "./components/ClientesActuales";
import { ProtectedRoute } from "./components/ProtectedRoute";

function App() {
  return (
    <>
      <main className="flex justify-center min-h-[80vh] pt-16">
        <div className="flex flex-col md:mt-7 w-full max-w-screen-lg">
        <section
          id="seccion"
          className="relative flex flex-col items-center w-full h-auto text-white"
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
