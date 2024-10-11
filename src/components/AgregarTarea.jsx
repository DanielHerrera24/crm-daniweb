/* eslint-disable react/prop-types */
// src/components/AgregarTarea.jsx
import { useState } from 'react';
import { firestore } from '../firebase'; // Asegúrate de importar tu configuración de Firebase
import { toast } from 'react-toastify';

const AgregarTarea = ({ clienteId, onClose }) => {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fechaVencimiento, setFechaVencimiento] = useState('');
  const [prioridad, setPrioridad] = useState('media'); // Prioridad por defecto

  const handleAgregarTarea = async (e) => {
    e.preventDefault();

    // Validación simple
    if (!titulo || !descripcion || !fechaVencimiento) {
      toast.error('Todos los campos son obligatorios');
      return;
    }

    const nuevaTarea = {
      titulo,
      descripcion,
      fechaVencimiento: new Date(fechaVencimiento),
      completada: false,
      prioridad,
    };

    try {
      await firestore.collection('posiblesClientes').doc(clienteId).update({
        tareas: firestore.FieldValue.arrayUnion(nuevaTarea),
      });
      toast.success('Tarea agregada correctamente');
      onClose(); // Cierra el modal
    } catch (error) {
      toast.error('Error al agregar la tarea: ' + error.message);
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow-md">
      <h2 className="text-lg font-bold mb-4">Agregar Tarea</h2>
      <form onSubmit={handleAgregarTarea}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Título:</label>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            
            className="border border-gray-300 rounded p-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Descripción:</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            
            className="border border-gray-300 rounded p-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Fecha de Vencimiento:</label>
          <input
            type="date"
            value={fechaVencimiento}
            onChange={(e) => setFechaVencimiento(e.target.value)}
            
            className="border border-gray-300 rounded p-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Prioridad:</label>
          <select
            value={prioridad}
            onChange={(e) => setPrioridad(e.target.value)}
            className="border border-gray-300 rounded p-2 w-full"
          >
            <option value="baja">Baja</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
          </select>
        </div>
        <div className="flex justify-between">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Agregar Tarea
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default AgregarTarea;
