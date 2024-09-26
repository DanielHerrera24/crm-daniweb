/* eslint-disable react/prop-types */
// src/components/Accordion.jsx
import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

const Accordion = ({ items }) => {
  const [activeId, setActiveId] = useState(null);
  const [estado, setEstado] = useState({});

  const toggle = (id) => {
    setActiveId(activeId === id ? null : id);
  };

  const handleChange = (id, newEstado) => {
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
              <p><strong>Nombre del Negocio:</strong> {cliente.nombreNegocio}</p>
              <p><strong>Dirección:</strong> {cliente.direccion}</p>
              <p><strong>Teléfono:</strong> {cliente.telefono}</p>
              <p><strong>Correo:</strong> {cliente.correo}</p>
              <p><strong>Notas:</strong> {cliente.notas}</p>
              <div className="mt-2">
                <label htmlFor={`estado-${cliente.id}`} className="block mb-1">
                  Estado:
                </label>
                <select
                  id={`estado-${cliente.id}`}
                  value={estado[cliente.id] || cliente.estado}
                  onChange={(e) => handleChange(cliente.id, e.target.value)}
                  className="border p-2 rounded w-full"
                >
                  <option value="Pendiente">Pendiente</option>
                  <option value="Desarrollando">Desarrollando</option>
                  <option value="Realizado">Realizado</option>
                </select>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Accordion;
