// src/components/ClientesActuales.jsx
import { useEffect, useState, useMemo } from "react";
import { db } from "../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import Accordion from "./Accordion";
import AgregarCliente from "./AgregarCliente";
import { SyncLoader } from "react-spinners";

const ClientesActuales = () => {
  const [loading, setLoading] = useState(false);
  const [clientes, setClientes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const clientesPerPage = 5; // Puedes ajustar este valor según tus necesidades

  // Estados para la búsqueda y el ordenamiento
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [sortOrder, setSortOrder] = useState("asc"); // 'asc' o 'desc'

  // Estado para el modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Implementación de debounce para la búsqueda
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); // 300ms de debounce

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  useEffect(() => {
    setLoading(true);
    const q = query(
      collection(db, "clientes"),
      where("estado", "in", ["Pendiente", "Desarrollando", "Realizado"])
    );

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const clientesData = [];
        querySnapshot.forEach((doc) => {
          clientesData.push({ id: doc.id, ...doc.data() });
        });
        setClientes(clientesData);
        setLoading(false);
      },
      (error) => {
        setLoading(false);
        console.error("Error al obtener clientes:", error);
        // Opcional: Puedes establecer un estado de error y mostrar un mensaje al usuario
      }
    );

    return () => unsubscribe();
  }, []);

  // Filtrar y ordenar los clientes
  const filteredAndSortedClientes = useMemo(() => {
    // Filtrar por nombre
    const filtered = clientes.filter((cliente) =>
      cliente.nombre.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );

    // Ordenar alfabéticamente
    const sorted = filtered.sort((a, b) => {
      if (a.nombre.toLowerCase() < b.nombre.toLowerCase())
        return sortOrder === "asc" ? -1 : 1;
      if (a.nombre.toLowerCase() > b.nombre.toLowerCase())
        return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [clientes, debouncedSearchTerm, sortOrder]);

  // Calcular índices para la paginación
  const indexOfLastCliente = currentPage * clientesPerPage;
  const indexOfFirstCliente = indexOfLastCliente - clientesPerPage;
  const currentClientes = filteredAndSortedClientes.slice(
    indexOfFirstCliente,
    indexOfLastCliente
  );
  const totalPages = Math.ceil(
    filteredAndSortedClientes.length / clientesPerPage
  );

  // Funciones para manejar la navegación
  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handlePageSelect = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Funciones para manejar la búsqueda y el ordenamiento
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reiniciar a la primera página al buscar
  };

  const handleSortOrderChange = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
    setCurrentPage(1); // Reiniciar a la primera página al cambiar el orden
  };

  // Funciones para manejar el modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Generar números de página
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="min-h-[50vh] bg-gray-100 p-4">
      <h2 className="text-2xl mb-4 text-black">Clientes Actuales</h2>

      {/* Botón para abrir el modal */}
      <div className="flex justify-end mb-4">
        <button
          onClick={openModal}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Agregar Cliente
        </button>
      </div>

      {/* Modal para agregar cliente */}
      {isModalOpen && <AgregarCliente onClose={closeModal} />}

      {/* Barra de Búsqueda y Controles de Ordenamiento */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        {/* Buscador por Nombre */}
        <div className="mb-2 sm:mb-0">
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="px-4 py-2 border rounded w-full sm:w-64"
          />
        </div>

        {/* Controles de Ordenamiento */}
        <div className="flex items-center space-x-2">
          <span>Ordenar:</span>
          <button
            onClick={handleSortOrderChange}
            className="px-4 py-2 bg-[#2c94ea] text-white rounded hover:bg-[#19578a] flex items-center"
          >
            {sortOrder === "asc" ? "A - Z" : "Z - A"}
            <svg
              className="w-4 h-4 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {sortOrder === "asc" ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 15l7-7 7 7"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Lista de Clientes en Acordeón */}
      {loading ? (<SyncLoader color="#2c94ea"/>) : (<Accordion items={currentClientes} />)}

      {/* Controles de Paginación */}
      <div className="flex justify-center mt-4 space-x-2">
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded ${
            currentPage === 1
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-[#2c94ea] text-white hover:bg-[#19578a]"
          }`}
        >
          Anterior
        </button>

        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => handlePageSelect(number)}
            className={`px-4 py-2 rounded ${
              currentPage === number
                ? "bg-[#19578a] text-white"
                : "bg-[#2c94ea] text-white hover:bg-[#19578a]"
            }`}
          >
            {number}
          </button>
        ))}

        <button
          onClick={handleNext}
          disabled={currentPage === totalPages || totalPages === 0}
          className={`px-4 py-2 rounded ${
            currentPage === totalPages || totalPages === 0
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-[#2c94ea] text-white hover:bg-[#19578a]"
          }`}
        >
          Siguiente
        </button>
      </div>

      {/* Mensaje cuando no hay clientes */}
      {filteredAndSortedClientes.length === 0 && (
        <p className="text-center mt-4 text-gray-500">
          No se encontraron clientes.
        </p>
      )}
    </div>
  );
};

export default ClientesActuales;
