// src/components/PosiblesClientes.jsx
import { useEffect, useState, useMemo } from 'react';
import { db } from '../firebase';
import {
  collection,
  query,
  onSnapshot,
} from 'firebase/firestore';
import { toast } from 'react-toastify';
import AgregarPosibleCliente from './AgregarPosibleCliente';
import Accordion from './AccordionPosiblesClientes';

const PosiblesClientes = () => {
  const [posiblesClientes, setPosiblesClientes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' o 'desc'
  const [loading, setLoading] = useState(true);

  // Implementación de debounce para la búsqueda
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); // 300ms de debounce

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // Escuchar cambios en Firestore
  useEffect(() => {
    const q = query(collection(db, "posiblesClientes"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const clientesData = [];
      querySnapshot.forEach((doc) => {
        clientesData.push({ id: doc.id, ...doc.data() });
      });
      setPosiblesClientes(clientesData);
      setLoading(false);
    }, (error) => {
      console.error("Error al obtener posibles clientes:", error);
      toast.error("Error al obtener posibles clientes");
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Filtrar y ordenar los posibles clientes
  const filteredAndSortedClientes = useMemo(() => {
    // Filtrar por nombre o negocio
    const filtered = posiblesClientes.filter(cliente =>
      cliente.nombre.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      cliente.nombreNegocio.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );

    // Ordenar por fecha de creación
    const sorted = filtered.sort((a, b) => {
      const dateA = a.fechaCreacion.toDate();
      const dateB = b.fechaCreacion.toDate();
      if (sortOrder === 'asc') {
        return dateA - dateB;
      } else {
        return dateB - dateA;
      }
    });

    return sorted;
  }, [posiblesClientes, debouncedSearchTerm, sortOrder]);

  // Funciones para manejar la búsqueda y el ordenamiento
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSortOrderChange = () => {
    setSortOrder(prevOrder => prevOrder === 'asc' ? 'desc' : 'asc');
  };

  // Funciones para manejar el modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-auto bg-gray-100 p-4">
      <h2 className="text-2xl mb-4 text-black">Posibles Clientes</h2>

      {/* Botón para abrir el modal */}
      <div className="flex justify-end mb-4">
        <button
          onClick={openModal}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Agregar Posible Cliente
        </button>
      </div>

      {/* Modal para agregar posible cliente */}
      {isModalOpen && <AgregarPosibleCliente onClose={closeModal} />}

      {/* Barra de Búsqueda y Controles de Ordenamiento */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        {/* Buscador por Nombre o Negocio */}
        <div className="mb-2 sm:mb-0 w-full sm:w-1/3">
          <input
            type="text"
            placeholder="Buscar por nombre o negocio..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="px-4 py-2 border rounded w-full"
          />
        </div>

        {/* Controles de Ordenamiento */}
        <div className="flex items-center space-x-2">
          <span className="font-semibold">Ordenar por Fecha:</span>
          <button
            onClick={handleSortOrderChange}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
          >
            {sortOrder === 'asc' ? 'Más Antiguos' : 'Más Recientes'}
            <svg
              className="w-4 h-4 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {sortOrder === 'asc' ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Lista de Posibles Clientes en Acordeón */}
      <Accordion items={filteredAndSortedClientes} />

      {/* Mensaje cuando no hay posibles clientes */}
      {!loading && filteredAndSortedClientes.length === 0 && (
        <p className="text-center mt-4 text-gray-500">No se encontraron posibles clientes.</p>
      )}

      {/* Mensaje de carga */}
      {loading && (
        <div className="flex justify-center mt-4">
          <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-12 w-12"></div>
        </div>
      )}
    </div>
  );
};

export default PosiblesClientes;
