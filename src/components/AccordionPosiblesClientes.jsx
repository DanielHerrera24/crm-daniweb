/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
// src/components/AccordionPosiblesClientes.jsx
import { useState, memo } from "react";
import {
  doc,
  updateDoc,
  deleteDoc,
  Timestamp,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { toast } from "react-toastify";
import AgregarActividad from "./AgregarActividad";
import { FaPhoneAlt, FaWhatsapp } from "react-icons/fa";

const AccordionPosiblesClientes = ({ items }) => {
  const [activeId, setActiveId] = useState(null);
  const [estado, setEstado] = useState({});
  const [editModeId, setEditModeId] = useState(null);
  const [editData, setEditData] = useState({});
  const [notaActual, setNotaActual] = useState("");
  const [agregandoActividad, setAgregandoActividad] = useState(false);
  const [estadoCliente, setEstadoCliente] = useState({});

  const availableRedes = [
    "Facebook",
    "Instagram",
    "Twitter",
    "LinkedIn",
    "Pinterest",
    "TikTok",
    "YouTube",
    "Otra",
  ];

  const toggleAgregandoActividad = () => {
    setAgregandoActividad((prev) => !prev);
  };

  const toggle = (id) => {
    // Si el cliente está en modo de edición, salir del modo de edición al cerrar el acordeón
    if (editModeId === id) {
      setEditModeId(null);
    }
    setActiveId(activeId === id ? null : id);
  };

  const handleClienteEstadoChange = async (clienteId, nuevoEstado) => {
    // Actualizamos el estado del cliente en el estado local
    setEstadoCliente((prevEstado) => ({
      ...prevEstado,
      [clienteId]: nuevoEstado,
    }));

    // Referencia al cliente en Firestore
    const clienteRef = doc(db, "posiblesClientes", clienteId);

    // Actualizamos el estado en Firestore
    try {
      await updateDoc(clienteRef, {
        estado: nuevoEstado,
        fechaActualizacion: Timestamp.now(),
      });
      toast.success("Estado del cliente actualizado");
    } catch (error) {
      console.error("Error al actualizar el estado del cliente: ", error);
      toast.error("Error al actualizar el estado del cliente");
    }
  };

  const handleEstadoChange = async (clienteId, actividadId, nuevoEstado) => {
    try {
      // Obtenemos el documento del cliente actual
      const clienteRef = doc(db, "posiblesClientes", clienteId);
      const clienteDocSnapshot = await getDoc(clienteRef);

      if (clienteDocSnapshot.exists()) {
        const clienteData = clienteDocSnapshot.data();

        // Encuentra la actividad por su id en lugar de su índice
        const actividadIndex = clienteData.actividades.findIndex(
          (actividad) => actividad.id === actividadId
        );

        if (actividadIndex !== -1) {
          const actividadActual = clienteData.actividades[actividadIndex];

          // Creamos una nueva actividad con toda la información existente, pero con el nuevo estado y fecha de realización si aplica
          const actividadActualizada = {
            ...actividadActual,
            estado: nuevoEstado,
            fechaRealizacion: nuevoEstado === "Realizado" ? new Date() : null, // Asignamos la fecha actual solo si está realizado
          };

          // Actualizamos solo la actividad específica manteniendo el resto de las actividades intactas
          const actividadesActualizadas = clienteData.actividades.map(
            (actividad, idx) =>
              idx === actividadIndex ? actividadActualizada : actividad
          );

          // Actualizamos el documento en Firestore con las actividades actualizadas
          await updateDoc(clienteRef, { actividades: actividadesActualizadas });

          toast.success("Estado de la actividad actualizado correctamente");
        } else {
          toast.error("Actividad no encontrada");
        }
      }
    } catch (error) {
      console.error("Error al actualizar el estado: ", error);
      toast.error("Error al actualizar el estado");
    }
  };

  const handleEditClick = (cliente) => {
    setEditModeId(cliente.id);
    setEditData({
      nombre: cliente.nombre,
      nombreNegocio: cliente.nombreNegocio,
      direccion: cliente.direccion,
      telefono: cliente.telefono,
      correo: cliente.correo,
      estado: cliente.estado,
      maps: cliente.maps,
      leadScore: cliente.leadScore || 0,
      redesSociales: cliente.redesSociales || [],
      actividades: cliente.actividades || [],
      tareas: cliente.tareas || [],
      notas: cliente.notas || [],
      fechaActualizacion: Timestamp.now(),
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData({
      ...editData,
      [name]: value,
      fechaActualizacion: Timestamp.now(),
    });
  };

  const handleRedSocialChange = (index, field, value) => {
    const nuevasRedes = [...editData.redesSociales];
    nuevasRedes[index][field] = value;
    setEditData({
      ...editData,
      redesSociales: nuevasRedes,
      fechaActualizacion: Timestamp.now(),
    });
  };

  const handleAddRedSocial = () => {
    setEditData({
      ...editData,
      redesSociales: [...editData.redesSociales, { tipo: "", url: "" }],
      fechaActualizacion: Timestamp.now(),
    });
  };

  const handleRemoveRedSocial = (index) => {
    const nuevasRedes = [...editData.redesSociales];
    nuevasRedes.splice(index, 1);
    setEditData({
      ...editData,
      redesSociales: nuevasRedes,
      fechaActualizacion: Timestamp.now(),
    });
  };

  const handleAgregarNota = () => {
    if (notaActual.trim() === "") {
      toast.error("La nota no puede estar vacía");
      return;
    }

    const nuevaNota = {
      contenido: notaActual.trim(),
      timestamp: Timestamp.now(),
    };

    setEditData({
      ...editData,
      notas: [nuevaNota, ...(editData.notas || [])],
      fechaActualizacion: Timestamp.now(),
    });

    setNotaActual("");
  };

  const handleEliminarNota = (index) => {
    const nuevasNotas = [...(editData.notas || [])];
    nuevasNotas.splice(index, 1);
    setEditData({
      ...editData,
      notas: nuevasNotas,
      fechaActualizacion: Timestamp.now(),
    });
  };

  const handleEditSave = async (id) => {
    const clienteRef = doc(db, "posiblesClientes", id);

    try {
      // Obtener el documento actual del cliente
      const clienteDocSnapshot = await getDoc(clienteRef);

      if (clienteDocSnapshot.exists()) {
        const clienteData = clienteDocSnapshot.data();

        // Verificamos si editData.actividades existe y es un array
        const actividadesNuevas = Array.isArray(editData.actividades)
          ? editData.actividades.filter(
              (actividad) =>
                !clienteData.actividades.some(
                  (actExistente) =>
                    actExistente.titulo === actividad.titulo &&
                    actExistente.descripcion === actividad.descripcion &&
                    actExistente.fecha === actividad.fecha
                )
            )
          : [];

        // Combina solo las nuevas actividades que no existen con las actividades existentes
        const actividadesActualizadas = [
          ...(clienteData.actividades || []),
          ...actividadesNuevas,
        ];

        // Limpia el objeto editData para eliminar cualquier valor `undefined`
        const cleanEditData = Object.fromEntries(
          Object.entries(editData).filter(([_, value]) => value !== undefined)
        );

        // Actualizar Firestore con el resto de los datos de `editData` y las actividades combinadas
        await updateDoc(clienteRef, {
          ...cleanEditData,
          actividades: actividadesActualizadas,
        });

        toast.success("Posible cliente actualizado exitosamente");
        setEditModeId(null);
      } else {
        toast.error("El cliente no existe");
      }
    } catch (error) {
      console.error("Error actualizando el posible cliente: ", error);
      toast.error("Error al actualizar el posible cliente");
    }
  };

  const handleEditCancel = () => {
    setEditModeId(null);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de que deseas eliminar este posible cliente?"
    );
    if (confirmDelete) {
      const clienteRef = doc(db, "posiblesClientes", id);
      try {
        await deleteDoc(clienteRef);
        toast.success("Posible cliente eliminado exitosamente");
      } catch (error) {
        console.error("Error eliminando el posible cliente: ", error);
        toast.error("Error al eliminar el posible cliente");
      }
    }
  };

  const handleFechaRealizacionChange = (
    clienteId,
    actividadIdx,
    nuevaFecha
  ) => {
    const clienteRef = db.collection("posiblesClientes").doc(clienteId);

    const actividadRef = `actividades[${actividadIdx}].fechaRealizacion`;
    clienteRef.update({
      [actividadRef]: new Date(nuevaFecha), // Convertimos la fecha a un objeto Date
    });
  };

  return (
    <div className="space-y-2 text-black">
      {items.map((cliente) => (
        <div key={cliente.id} className="border rounded shadow-md">
          <div
            onClick={() => toggle(cliente.id)}
            className="flex justify-between items-center p-4 bg-gray-200 cursor-pointer"
          >
            <span className="font-semibold">{cliente.nombre}</span>
            <span>{activeId === cliente.id ? "-" : "+"}</span>
          </div>
          {activeId === cliente.id && (
            <div className="p-4 bg-white">
              {editModeId === cliente.id ? (
                // Modo de Edición
                <div className="space-y-4">
                  {/* Campos del Posible Cliente */}
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
                    />
                  </div>

                  {/* Redes Sociales en Edición */}
                  <div>
                    <label className="block font-semibold mb-2">
                      Redes Sociales:
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {availableRedes.map((red) => (
                        <label
                          key={red}
                          className="flex items-center space-x-2"
                        >
                          <input
                            type="checkbox"
                            value={red}
                            checked={editData.redesSociales.some(
                              (rs) => rs.tipo === red
                            )}
                            onChange={(e) => {
                              const { value, checked } = e.target;
                              if (checked) {
                                setEditData({
                                  ...editData,
                                  redesSociales: [
                                    ...editData.redesSociales,
                                    { tipo: value, url: "" },
                                  ],
                                  fechaActualizacion: Timestamp.now(),
                                });
                              } else {
                                setEditData({
                                  ...editData,
                                  redesSociales: editData.redesSociales.filter(
                                    (rs) => rs.tipo !== value
                                  ),
                                  fechaActualizacion: Timestamp.now(),
                                });
                              }
                            }}
                          />
                          <span>{red}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {editData.redesSociales &&
                    editData.redesSociales.length > 0 && (
                      <div className="space-y-2">
                        {editData.redesSociales.map((redSocial, index) => (
                          <div key={index} className="border p-3 rounded">
                            <div className="flex justify-between items-center">
                              <h4 className="font-semibold">
                                {redSocial.tipo || "Tipo de Red"}
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
                                URL de {redSocial.tipo}:
                              </label>
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
                              />
                            </div>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={handleAddRedSocial}
                          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          Agregar Red Social
                        </button>
                      </div>
                    )}

                  <button
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-200"
                    onClick={toggleAgregandoActividad}
                  >
                    Agregar Actividad
                  </button>
                  {agregandoActividad && (
                    <AgregarActividad
                      onClose={toggleAgregandoActividad}
                      clienteId={cliente.id}
                    />
                  )}

                  {/* Editar y visualizar actividades */}
                  <ul>
                    <h3 className="font-bold text-lg">
                      Actividades Pendientes
                    </h3>
                    {cliente.actividades && cliente.actividades.length > 0 ? (
                      cliente.actividades
                        .filter((actividad) => actividad.estado === "Pendiente")
                        .map((actividad, index) => (
                          <li
                            key={index}
                            className="p-4 rounded shadow-md transition duration-200 bg-gray-100"
                          >
                            <h4 className="font-bold text-md">
                              {actividad.titulo}
                            </h4>
                            <p className="text-sm">{actividad.descripcion}</p>
                            <p className="text-xs text-gray-500">
                              Fecha:{" "}
                              {actividad.fecha && actividad.fecha.toDate
                                ? actividad.fecha.toDate().toLocaleDateString()
                                : "Fecha no disponible"}
                            </p>
                            <p className="text-xs text-gray-500">
                              Notas: {actividad.notas}
                            </p>

                            {/* Estado de la actividad con opciones */}
                            <div className="mt-2">
                              <label className="mr-2">Estado:</label>
                              <select
                                className="border rounded p-1"
                                value={actividad.estado || "Pendiente"}
                                onChange={(e) =>
                                  handleEstadoChange(
                                    cliente.id,
                                    index,
                                    e.target.value
                                  )
                                }
                              >
                                <option value="Pendiente">Pendiente</option>
                                <option value="Realizado">Realizado</option>
                              </select>
                            </div>

                            {/* Mostrar campo para ingresar fecha si la actividad está realizada */}
                            {actividad.estado === "Realizado" && (
                              <div className="mt-2">
                                <label className="block text-sm text-gray-600">
                                  Fecha de realización:
                                </label>
                                <input
                                  type="date"
                                  className="border rounded p-1"
                                  value={
                                    actividad.fechaRealizacion &&
                                    actividad.fechaRealizacion.toDate
                                      ? actividad.fechaRealizacion
                                          .toDate()
                                          .toISOString()
                                          .split("T")[0]
                                      : ""
                                  }
                                  onChange={(e) =>
                                    handleFechaRealizacionChange(
                                      cliente.id,
                                      index,
                                      new Date(e.target.value)
                                    )
                                  }
                                />
                              </div>
                            )}
                          </li>
                        ))
                    ) : (
                      <p className="text-gray-500">
                        No hay actividades pendientes.
                      </p>
                    )}

                    {/* Sección de actividades realizadas */}
                    <h3 className="font-bold text-lg mt-4">
                      Actividades Realizadas
                    </h3>
                    {cliente.actividades && cliente.actividades.length > 0 ? (
                      cliente.actividades
                        .filter((actividad) => actividad.estado === "Realizado")
                        .map((actividad, index) => (
                          <li
                            key={index}
                            className="bg-green-100 p-4 rounded shadow-md hover:bg-green-200 transition duration-200"
                          >
                            <h4 className="font-bold text-md">
                              {actividad.titulo}
                            </h4>
                            <p className="text-sm">{actividad.descripcion}</p>
                            <p className="text-xs text-gray-500">
                              Fecha de realización:{" "}
                              {actividad.fechaRealizacion &&
                              actividad.fechaRealizacion.toDate
                                ? actividad.fechaRealizacion
                                    .toDate()
                                    .toLocaleDateString()
                                : "No disponible"}
                            </p>
                            <p className="text-xs text-gray-500">
                              Notas: {actividad.notas}
                            </p>
                          </li>
                        ))
                    ) : (
                      <p className="text-gray-500">
                        No hay actividades realizadas.
                      </p>
                    )}
                  </ul>

                  {/* Sección para Agregar Notas */}
                  <div>
                    <label className="block font-semibold mb-2">Notas:</label>
                    <div className="flex flex-col sm:flex-row items-start gap-2">
                      <textarea
                        value={notaActual}
                        onChange={(e) => setNotaActual(e.target.value)}
                        className="flex-1 px-3 py-2 border rounded"
                        placeholder="Escribe una nota..."
                      ></textarea>
                      <button
                        type="button"
                        onClick={handleAgregarNota}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mt-2 sm:mt-0"
                      >
                        Agregar Nota
                      </button>
                    </div>
                    <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
                      {editData.notas && editData.notas.length > 0 ? (
                        editData.notas.map((nota, index) => (
                          <div
                            key={index}
                            className="bg-gray-100 p-3 rounded shadow"
                          >
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">
                                {nota.timestamp.toDate().toLocaleString()}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleEliminarNota(index)}
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
                            <p className="mt-2">{nota.contenido}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500">No hay notas agregadas.</p>
                      )}
                    </div>
                  </div>

                  {/* Estado */}
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
                      <option value="Nuevo">Nuevo</option>
                      <option value="Contactado">Contactado</option>
                      <option value="Propuesta Enviada">
                        Propuesta Enviada
                      </option>
                      <option value="Rechazo">Rechazo</option>
                      <option value="Cerrado">Cerrado</option>
                    </select>
                  </div>

                  {/* Botones de Acción */}
                  <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
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
                  {/* Nombre del Negocio */}
                  {cliente.nombreNegocio && (
                    <div className="flex gap-1 wrap">
                      <strong>Nombre del Negocio:</strong>{" "}
                      <p>{cliente.nombreNegocio}</p>
                    </div>
                  )}

                  {/* Dirección (URL Maps) */}
                  {cliente.maps && (
                    <div className="wrap">
                      <strong>Dirección (URL Maps):</strong>{" "}
                      <a
                        href={cliente.maps}
                        className="text-blue-500 underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Link a Maps
                      </a>
                    </div>
                  )}

                  {/* Teléfono */}
                  {cliente.telefono && (
                    <div className="telefono flex flex-wrap gap-2">
                      <strong>Teléfono:</strong>
                      <div className="flex gap-1 items-center">
                        <FaWhatsapp color="#25D366" size={20} />{" "}
                        <a
                          href={`https://wa.me/${cliente.telefono.replace(
                            /\s+/g,
                            ""
                          )}`}
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
                          href={`tel://${cliente.telefono.replace(/\s+/g, "")}`}
                          className="text-[#2c94ea] underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {cliente.telefono}
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Correo */}
                  {cliente.correo && (
                    <p>
                      <strong>Correo:</strong>{" "}
                      <a
                        href={`mailto:${cliente.correo}`}
                        className="text-blue-500 underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {cliente.correo}
                      </a>
                    </p>
                  )}

                  {/* Estado */}
                  {cliente.estado && (
                    <div className="flex gap-1">
                      <strong>Estado:</strong>
                      <p
                        className=""
                      >
                        {estadoCliente[cliente.id] || cliente.estado}
                      </p>
                    </div>
                  )}

                  {/* Redes Sociales */}
                  <div>
                    <strong>Redes Sociales:</strong>
                    <ul>
                      {cliente.redesSociales &&
                      cliente.redesSociales.length > 0 ? (
                        cliente.redesSociales.map((red, idx) => (
                          <li key={idx}>
                            {red.tipo}:{" "}
                            {red.url ? (
                              <a
                                href={red.url}
                                className="text-blue-500 underline"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {red.url}
                              </a>
                            ) : (
                              "N/A"
                            )}
                          </li>
                        ))
                      ) : (
                        <li>No tiene redes sociales.</li>
                      )}
                    </ul>
                  </div>

                  {/* Actividades */}
                  <div>
                    <strong>Actividades Pendientes:</strong>
                    <div className="space-y-2 max-w-[600px]">
                      {cliente.actividades && cliente.actividades.length > 0 ? (
                        cliente.actividades
                          .filter(
                            (actividad) => actividad.estado !== "Realizado"
                          )
                          .map((actividad) => (
                            <div
                              key={actividad.id} // Asegúrate de usar un ID único aquí
                              className="bg-gray-100 p-3 rounded shadow"
                            >
                              <h2 className="mt-2 text-xl">
                                {actividad.titulo}
                              </h2>
                              <p className="mt-2">{actividad.descripcion}</p>
                              <p className="text-xs text-gray-600">
                                Fecha de creación:{" "}
                                {actividad.timestamp &&
                                actividad.timestamp.toDate
                                  ? actividad.timestamp
                                      .toDate()
                                      .toLocaleDateString()
                                  : "No disponible"}
                              </p>

                              <div className="mt-2">
                                <label className="mr-2">Estado:</label>
                                <select
                                  className="border rounded p-1"
                                  value={actividad.estado || "Pendiente"}
                                  onChange={
                                    (e) =>
                                      handleEstadoChange(
                                        cliente.id,
                                        actividad.id,
                                        e.target.value
                                      ) // Usar el ID de la actividad
                                  }
                                >
                                  <option value="Pendiente">Pendiente</option>
                                  <option value="Realizado">Realizado</option>
                                </select>
                              </div>

                              {actividad.estado === "Realizado" && (
                                <div className="mt-2">
                                  <label className="block text-sm text-gray-600">
                                    Fecha de realización:
                                  </label>
                                  <input
                                    type="date"
                                    className="border rounded p-1"
                                    value={
                                      actividad.fechaRealizacion &&
                                      actividad.fechaRealizacion.toDate
                                        ? actividad.fechaRealizacion
                                            .toDate()
                                            .toISOString()
                                            .split("T")[0]
                                        : ""
                                    }
                                    onChange={(e) =>
                                      handleFechaRealizacionChange(
                                        cliente.id,
                                        actividad.id, // Usar el ID de la actividad
                                        new Date(e.target.value)
                                      )
                                    }
                                  />
                                </div>
                              )}
                            </div>
                          ))
                      ) : (
                        <p className="text-gray-500">
                          No hay actividades pendientes.
                        </p>
                      )}
                    </div>

                    <strong>Actividades Realizadas:</strong>
                    <div className="space-y-2 max-w-[600px]">
                      {cliente.actividades && cliente.actividades.length > 0 ? (
                        cliente.actividades
                          .filter(
                            (actividad) => actividad.estado === "Realizado"
                          )
                          .map((actividad) => (
                            <div
                              key={actividad.id} // Usar un ID único para cada actividad
                              className="bg-green-100 p-3 rounded shadow"
                            >
                              <h2 className="mt-2 text-xl">
                                {actividad.titulo}
                              </h2>
                              <p className="mt-2">{actividad.descripcion}</p>
                              <p className="text-xs text-gray-600">
                                Fecha de realización:{" "}
                                {actividad.fechaRealizacion &&
                                actividad.fechaRealizacion.toDate
                                  ? actividad.fechaRealizacion
                                      .toDate()
                                      .toLocaleDateString()
                                  : "No disponible"}
                              </p>
                            </div>
                          ))
                      ) : (
                        <p className="text-gray-500">
                          No hay actividades realizadas.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Notas */}
                  <div>
                    <strong>Notas:</strong>
                    <div className="mt-2 space-y-2 max-w-[600px]">
                      {cliente.notas && cliente.notas.length > 0 ? (
                        cliente.notas
                          .sort(
                            (a, b) =>
                              b.timestamp.toDate() - a.timestamp.toDate()
                          )
                          .map((nota, idx) => (
                            <div
                              key={idx}
                              className="bg-gray-100 p-3 rounded shadow"
                            >
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">
                                  {nota.timestamp.toDate().toLocaleString()}
                                </span>
                                <span className="font-semibold">
                                  Nota #{cliente.notas.length - idx}
                                </span>
                              </div>
                              <p className="mt-2">{nota.contenido}</p>
                            </div>
                          ))
                      ) : (
                        <p className="text-gray-500">No hay notas.</p>
                      )}
                    </div>
                  </div>

                  {/* Botones de Editar y Eliminar */}
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mt-4">
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

export default memo(AccordionPosiblesClientes);
