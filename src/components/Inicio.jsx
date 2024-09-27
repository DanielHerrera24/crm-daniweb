import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { SyncLoader } from "react-spinners";
import { FaSignOutAlt, FaUsers } from "react-icons/fa";

function Inicio() {
  const { user, logout, loading } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  if (loading) return <SyncLoader color="#3B82F6" />;

  return (
    <>
      <div className="bg-white rounded-lg sm:shadow-xl p-6 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-blue-600 mb-4">
          ¡Bienvenido, {user?.email || "Usuario"}!
        </h1>
        <p className="text-black mb-6">
          En esta aplicación podrás gestionar tus clientes, su información y los
          pagos de manera fácil y rápida.
        </p>

        <div className="flex flex-col space-y-4">
          <Link
            to="/clientes-pasados"
            className="bg-orange-500 hover:bg-orange-700 text-white text-lg font-bold py-3 px-6 rounded shadow-lg flex items-center justify-center space-x-2 transition-colors duration-300"
          >
            <FaUsers className="text-white" />
            <span>Clientes Pasados</span>
          </Link>
          <Link
            to="/posibles-clientes"
            className="bg-[#2c94ea] hover:bg-[#19578a] text-white text-lg font-bold py-3 px-6 rounded shadow-lg flex items-center justify-center space-x-2 transition-colors duration-300"
          >
            <FaUsers className="text-white" />
            <span>Posibles Clientes</span>
          </Link>
          <Link
            to="/clientes-actuales"
            className="bg-green-500 hover:bg-green-700 text-white text-lg font-bold py-3 px-6 rounded shadow-lg flex items-center justify-center space-x-2 transition-colors duration-300"
          >
            <FaUsers className="text-white" />
            <span>Clientes Actuales</span>
          </Link>

          {/* Botón de cerrar sesión */}
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded w-full transition-colors duration-300 flex items-center justify-center space-x-2"
          >
            <FaSignOutAlt className="text-white" />
            <span>Cerrar Sesión</span>
          </button>
        </div>

        {/* Información adicional */}
        <div className="mt-8 text-black">
          <p>Puedes crear, ver, editar, guardar y eliminar clientes.</p>
        </div>
      </div>
    </>
  );
}

export default Inicio;
