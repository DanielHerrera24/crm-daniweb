/* eslint-disable react/prop-types */
// src/components/Accordion.jsx
import { useState } from "react";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Accordion = ({ items }) => {
  const [activeId, setActiveId] = useState(null);
  const [estado, setEstado] = useState({});
  const [editModeId, setEditModeId] = useState(null);
  const [editData, setEditData] = useState({});

  const toggle = (id) => {
    // Si el cliente está en modo de edición, salir del modo de edición al cerrar el acordeón
    if (editModeId === id) {
      setEditModeId(null);
    }
    setActiveId(activeId === id ? null : id);
  };

  const handleEstadoChange = (id, newEstado) => {
    setEstado({ ...estado, [id]: newEstado });
    const clienteRef = doc(db, "clientes", id);
    updateDoc(clienteRef, { estado: newEstado })
      .then(() => {
        console.log("Estado actualizado");
      })
      .catch((error) => {
        console.error("Error actualizando el estado: ", error);
      });
  };

  const handleEditClick = (cliente) => {
    setEditModeId(cliente.id);
    setEditData({
      nombre: cliente.nombre,
      nombreNegocio: cliente.nombreNegocio,
      direccion: cliente.direccion,
      telefono: cliente.telefono,
      correo: cliente.correo,
      notas: cliente.notas,
      estado: cliente.estado,
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData({
      ...editData,
      [name]: value,
    });
  };

  const handleEditSave = async (id) => {
    const clienteRef = doc(db, "clientes", id);
    try {
      await updateDoc(clienteRef, editData);
      toast.success("Cliente actualizado exitosamente");
      setEditModeId(null);
    } catch (error) {
      console.error("Error actualizando el cliente: ", error);
      toast.error("Error al actualizar el cliente");
    }
  };

  const handleEditCancel = () => {
    setEditModeId(null);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este cliente?");
    if (confirmDelete) {
      const clienteRef = doc(db, "clientes", id);
      try {
        await deleteDoc(clienteRef);
        toast.success("Cliente eliminado exitosamente");
      } catch (error) {
        console.error("Error eliminando el cliente: ", error);
        toast.error("Error al eliminar el cliente");
      }
    }
  };

  return (
    <div className="space-y-2 text-black">
      {items.map((cliente) => (
        <div key={cliente.id} className="border rounded">
          <div
            onClick={() => toggle(cliente.id)}
            className="flex justify-between items-center p-4 bg-gray-200 cursor-pointer"
          >
            <span>{cliente.nombre}</span>
            <span>{activeId === cliente.id ? "-" : "+"}</span>
          </div>
          {activeId === cliente.id && (
            <div className="p-4 bg-white">
              {editModeId === cliente.id ? (
                // Modo de Edición
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor={`nombre-${cliente.id}`}
                      className="block font-semibold"
                    >
                      Nombre:
                    </label>
                    <input
                      type="text"
                      id={`nombre-${cliente.id}`}
                      name="nombre"
                      value={editData.nombre}
                      onChange={handleEditChange}
                      className="w-full px-3 py-2 border rounded"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={`nombreNegocio-${cliente.id}`}
                      className="block font-semibold"
                    >
                      Nombre del Negocio:
                    </label>
                    <input
                      type="text"
                      id={`nombreNegocio-${cliente.id}`}
                      name="nombreNegocio"
                      value={editData.nombreNegocio}
                      onChange={handleEditChange}
                      className="w-full px-3 py-2 border rounded"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={`direccion-${cliente.id}`}
                      className="block font-semibold"
                    >
                      Dirección:
                    </label>
                    <input
                      type="text"
                      id={`direccion-${cliente.id}`}
                      name="direccion"
                      value={editData.direccion}
                      onChange={handleEditChange}
                      className="w-full px-3 py-2 border rounded"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={`telefono-${cliente.id}`}
                      className="block font-semibold"
                    >
                      Teléfono:
                    </label>
                    <input
                      type="tel"
                      id={`telefono-${cliente.id}`}
                      name="telefono"
                      value={editData.telefono}
                      onChange={handleEditChange}
                      className="w-full px-3 py-2 border rounded"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={`correo-${cliente.id}`}
                      className="block font-semibold"
                    >
                      Correo:
                    </label>
                    <input
                      type="email"
                      id={`correo-${cliente.id}`}
                      name="correo"
                      value={editData.correo}
                      onChange={handleEditChange}
                      className="w-full px-3 py-2 border rounded"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={`notas-${cliente.id}`}
                      className="block font-semibold"
                    >
                      Notas:
                    </label>
                    <textarea
                      id={`notas-${cliente.id}`}
                      name="notas"
                      value={editData.notas}
                      onChange={handleEditChange}
                      className="w-full px-3 py-2 border rounded"
                    ></textarea>
                  </div>
                  <div>
                    <label
                      htmlFor={`estado-${cliente.id}`}
                      className="block font-semibold"
                    >
                      Estado:
                    </label>
                    <select
                      id={`estado-${cliente.id}`}
                      name="estado"
                      value={editData.estado}
                      onChange={handleEditChange}
                      className="w-full px-3 py-2 border rounded"
                    >
                      <option value="Pendiente">Pendiente</option>
                      <option value="Desarrollando">Desarrollando</option>
                      <option value="Realizado">Realizado</option>
                    </select>
                  </div>
                  {/* Botones de Guardar y Cancelar */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditSave(cliente.id)}
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Guardar
                    </button>
                    <button
                      onClick={handleEditCancel}
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                // Modo de Visualización
                <div className="space-y-2">
                  <p>
                    <strong>Nombre del Negocio:</strong> {cliente.nombreNegocio}
                  </p>
                  <p>
                    <strong>Dirección:</strong> {cliente.direccion}
                  </p>
                  <p>
                    <strong>Teléfono:</strong> {cliente.telefono}
                  </p>
                  <p>
                    <strong>Correo:</strong> {cliente.correo}
                  </p>
                  <p>
                    <strong>Notas:</strong> {cliente.notas}
                  </p>
                  <div className="mt-2">
                    <label
                      htmlFor={`estado-${cliente.id}`}
                      className="block mb-1 font-semibold"
                    >
                      Estado:
                    </label>
                    <span
                      id={`estado-${cliente.id}`}
                      onChange={(e) =>
                        handleEstadoChange(cliente.id, e.target.value)
                      }
                      className="border p-2 rounded w-full"
                    >
                      {estado[cliente.id] || cliente.estado}
                    </span>
                  </div>
                  {/* Botones de Editar y Eliminar */}
                  <div className="flex space-x-2 mt-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Evita que el clic cierre el acordeón
                        handleEditClick(cliente);
                      }}
                      className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                      Editar
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Evita que el clic cierre el acordeón
                        handleDelete(cliente.id);
                      }}
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Accordion;
