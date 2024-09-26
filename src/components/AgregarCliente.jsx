/* eslint-disable react/prop-types */
// src/components/AgregarCliente.jsx
import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { toast } from 'react-toastify';

const AgregarCliente = ({ onClose }) => {
  const [cliente, setCliente] = useState({
    nombre: '',
    nombreNegocio: '',
    direccion: '',
    telefono: '',
    correo: '',
    notas: '',
    estado: 'Pendiente'
  });

  const handleChange = (e) => {
    setCliente({
      ...cliente,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "clientes"), cliente);
      toast.success("Cliente añadido exitosamente");
      setCliente({
        nombre: '',
        nombreNegocio: '',
        direccion: '',
        telefono: '',
        correo: '',
        notas: '',
        estado: 'Pendiente'
      });
      onClose();
    } catch (error) {
      console.error("Error añadiendo cliente: ", error);
      toast.error("Error al añadir cliente");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white text-black rounded-lg shadow-lg w-11/12 max-w-md mx-auto p-6 relative">
        {/* Botón de cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-2xl mb-4 text-center">Agregar Nuevo Cliente</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nombre" className="block font-semibold">Nombre:</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={cliente.nombre}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div>
            <label htmlFor="nombreNegocio" className="block font-semibold">Nombre del Negocio:</label>
            <input
              type="text"
              id="nombreNegocio"
              name="nombreNegocio"
              value={cliente.nombreNegocio}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div>
            <label htmlFor="direccion" className="block font-semibold">Dirección:</label>
            <input
              type="text"
              id="direccion"
              name="direccion"
              value={cliente.direccion}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div>
            <label htmlFor="telefono" className="block font-semibold">Teléfono:</label>
            <input
              type="tel"
              id="telefono"
              name="telefono"
              value={cliente.telefono}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div>
            <label htmlFor="correo" className="block font-semibold">Correo Electrónico:</label>
            <input
              type="email"
              id="correo"
              name="correo"
              value={cliente.correo}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div>
            <label htmlFor="notas" className="block font-semibold">Notas:</label>
            <textarea
              id="notas"
              name="notas"
              value={cliente.notas}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            ></textarea>
          </div>
          <div>
            <label htmlFor="estado" className="block font-semibold">Estado:</label>
            <select
              id="estado"
              name="estado"
              value={cliente.estado}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="Pendiente">Pendiente</option>
              <option value="Desarrollando">Desarrollando</option>
              <option value="Realizado">Realizado</option>
            </select>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Añadir Cliente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AgregarCliente;
