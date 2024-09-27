/* eslint-disable react/prop-types */
// src/components/Accordion.jsx
import { useState, memo } from "react";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaPhoneAlt, FaWhatsapp } from "react-icons/fa";

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
        toast.success("Estado actualizado");
      })
      .catch((error) => {
        console.error("Error actualizando el estado: ", error);
        toast.error("Error al actualizar el estado");
      });
  };

  const handleEditClick = (cliente) => {
    setEditModeId(cliente.id);
    setEditData({
      nombre: cliente.nombre,
      nombreNegocio: cliente.nombreNegocio,
      direccion: cliente.direccion,
      sitioWebActual: cliente.sitioWebActual,
      sitioWebAntiguo: cliente.sitioWebAntiguo,
      maps: cliente.maps,
      telefono: cliente.telefono,
      correo: cliente.correo,
      notas: cliente.notas,
      estado: cliente.estado,
      redesSociales: cliente.redesSociales || [],
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData({
      ...editData,
      [name]: value,
    });
  };

  const handleRedSocialChange = (index, field, value) => {
    const nuevasRedes = [...editData.redesSociales];
    nuevasRedes[index][field] = value;
    setEditData({
      ...editData,
      redesSociales: nuevasRedes,
    });
  };

  const handleAddRedSocial = () => {
    setEditData({
      ...editData,
      redesSociales: [...editData.redesSociales, { tipo: "", url: "" }],
    });
  };

  const handleRemoveRedSocial = (index) => {
    const nuevasRedes = [...editData.redesSociales];
    nuevasRedes.splice(index, 1);
    setEditData({
      ...editData,
      redesSociales: nuevasRedes,
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
    const confirmDelete = window.confirm(
      "¿Estás seguro de que deseas eliminar este cliente?"
    );
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
    <div className="space-y-2 text-black max-w-[600px]">
      {items.map((cliente) => (
        <div key={cliente.id} className="border rounded">
          <div
            onClick={() => toggle(cliente.id)}
            className="flex justify-between items-center p-4 bg-[#2c94ea] text-white cursor-pointer"
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
                      Nombre del cliente:{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id={`nombre-${cliente.id}`}
                      name="nombre"
                      value={editData.nombre}
                      onChange={handleEditChange}
                      className="w-full px-3 py-2 border rounded"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={`nombreNegocio-${cliente.id}`}
                      className="block font-semibold"
                    >
                      Nombre del Negocio:{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id={`nombreNegocio-${cliente.id}`}
                      name="nombreNegocio"
                      value={editData.nombreNegocio}
                      onChange={handleEditChange}
                      className="w-full px-3 py-2 border rounded"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={`direccion-${cliente.id}`}
                      className="block font-semibold"
                    >
                      Dirección: <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id={`direccion-${cliente.id}`}
                      name="direccion"
                      value={editData.direccion}
                      onChange={handleEditChange}
                      className="w-full px-3 py-2 border rounded"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="maps" className="block font-semibold">
                      Dirección (URL Maps):
                    </label>
                    <input
                      type="text"
                      id={`maps-${cliente.id}`}
                      name="maps"
                      value={editData.maps}
                      onChange={handleEditChange}
                      className="w-full px-3 py-2 border rounded"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={`telefono-${cliente.id}`}
                      className="block font-semibold"
                    >
                      Teléfono: <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id={`telefono-${cliente.id}`}
                      name="telefono"
                      value={editData.telefono}
                      onChange={handleEditChange}
                      className="w-full px-3 py-2 border rounded"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={`correo-${cliente.id}`}
                      className="block font-semibold"
                    >
                      Correo Electrónico:{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id={`correo-${cliente.id}`}
                      name="correo"
                      value={editData.correo}
                      onChange={handleEditChange}
                      className="w-full px-3 py-2 border rounded"
                      required
                    />
                  </div>

                  {/* Redes Sociales en Edición */}
                  <div>
                    <label className="block font-semibold mb-2">
                      Redes Sociales:
                    </label>
                    {editData.redesSociales.map((redSocial, index) => (
                      <div key={index} className="border p-3 rounded mb-2">
                        <div className="flex justify-between items-center">
                          <h4 className="font-semibold">
                            {redSocial.tipo || "Tipo"}
                          </h4>
                          <button
                            type="button"
                            onClick={() => handleRemoveRedSocial(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                        <div className="mt-2">
                          <label className="block font-semibold">
                            Tipo de Red Social:
                          </label>
                          <select
                            value={redSocial.tipo}
                            onChange={(e) =>
                              handleRedSocialChange(
                                index,
                                "tipo",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border rounded"
                            required
                          >
                            <option value="">Seleccione</option>
                            <option value="Facebook">Facebook</option>
                            <option value="Instagram">Instagram</option>
                            <option value="Twitter">Twitter</option>
                            <option value="LinkedIn">LinkedIn</option>
                            <option value="Pinterest">Pinterest</option>
                            <option value="TikTok">TikTok</option>
                            <option value="YouTube">YouTube</option>
                            <option value="Otra">Otra</option>
                          </select>
                        </div>
                        <div className="mt-2">
                          <label className="block font-semibold">URL:</label>
                          <input
                            type="url"
                            value={redSocial.url}
                            onChange={(e) =>
                              handleRedSocialChange(
                                index,
                                "url",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border rounded"
                            required
                          />
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={handleAddRedSocial}
                      className="mt-2 px-4 py-2 bg-[#2c94ea] text-white rounded hover:bg-[#19578a]"
                    >
                      Agregar Red Social
                    </button>
                  </div>

                  <div>
                    <label
                      htmlFor={`sitioWebActual-${cliente.id}`}
                      className="block font-semibold"
                    >
                      Sitio Web Actual (URL):
                    </label>
                    <input
                      type="url"
                      id={`sitioWebActual-${cliente.id}`}
                      name="sitioWebActual"
                      value={editData.sitioWebActual}
                      onChange={handleEditChange}
                      className="w-full px-3 py-2 border rounded"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={`sitioWebAntiguo-${cliente.id}`}
                      className="block font-semibold"
                    >
                      Sitio Web Antiguo (URL):
                    </label>
                    <input
                      type="text"
                      id={`sitioWebAntiguo-${cliente.id}`}
                      name="sitioWebAntiguo"
                      value={editData.sitioWebAntiguo}
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
                    <strong>Dirección (URL Maps):</strong>{" "}
                    <a
                      href={cliente.maps}
                      className="text-blue-500 underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Link a Maps
                    </a>
                  </p>
                  <p className="flex flex-wrap gap-2">
                    <strong>Teléfono:</strong>
                    <div className="flex gap-1 items-center">
                      <FaWhatsapp color="#25D366" size={20} />{" "}
                      <a
                        href={`https://wa.me/${cliente.telefono.replace(/\s+/g, '')}`}
                        className="text-[#25D366] underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {cliente.telefono}
                      </a>
                    </div>
                    <div className="flex gap-1 items-center">
                      <FaPhoneAlt color="#2c94ea" size={16} />
                      <a
                        href={`tel://${cliente.telefono.replace(/\s+/g, '')}`}
                        className="text-[#2c94ea] underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {cliente.telefono}
                      </a>
                    </div>
                  </p>
                  <p>
                    <strong>Correo:</strong> <a
                      href={`mailto:${cliente.correo}`}
                      className="text-blue-500 underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {cliente.correo}
                    </a>
                  </p>
                  <p>
                    <strong>Sitio Web Actual:</strong>{" "}
                    <a
                      href={cliente.sitioWebActual}
                      className="text-blue-500 underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {cliente.sitioWebActual}
                    </a>
                  </p>
                  <p>
                    <strong>Sitio Web Antiguo:</strong>{" "}
                    {cliente.sitioWebAntiguo ? (
                      <a
                        href={cliente.sitioWebAntiguo}
                        className="text-blue-500 underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {cliente.sitioWebAntiguo}
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </p>
                  <p>
                    <strong>Notas:</strong> {cliente.notas}
                  </p>
                  <div>
                    <strong>Redes Sociales:</strong>
                    <ul className="list-disc list-inside">
                      {cliente.redesSociales &&
                      cliente.redesSociales.length > 0 ? (
                        cliente.redesSociales.map((red, idx) => (
                          <li key={idx}>
                            {red.tipo}:{" "}
                            <a
                              href={red.url}
                              className="text-blue-500 underline"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {red.tipo}
                            </a>
                          </li>
                        ))
                      ) : (
                        <li>No tiene redes sociales.</li>
                      )}
                    </ul>
                  </div>
                  <div className="mt-2">
                    <label
                      htmlFor={`estado-${cliente.id}`}
                      className="block mb-1 font-semibold"
                    >
                      Estado:
                    </label>
                    <select
                      id={`estado-${cliente.id}`}
                      value={estado[cliente.id] || cliente.estado}
                      onChange={(e) =>
                        handleEstadoChange(cliente.id, e.target.value)
                      }
                      className="border p-2 rounded w-full"
                    >
                      <option value="Pendiente">Pendiente</option>
                      <option value="Desarrollando">Desarrollando</option>
                      <option value="Realizado">Realizado</option>
                    </select>
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

export default memo(Accordion);
