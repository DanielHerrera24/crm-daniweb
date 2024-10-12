/* eslint-disable react/prop-types */
// src/components/AgregarPosibleCliente.jsx
import { useState } from "react";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../firebase";
import { toast } from "react-toastify";

const AgregarPosibleCliente = ({ onClose }) => {
  const [posibleCliente, setPosibleCliente] = useState({
    nombre: "",
    nombreNegocio: "",
    direccion: "",
    telefono: "",
    correo: "",
    estado: "Nuevo",
    leadScore: 0,
    actividades: [],
    tareas: [],
    notas: [],
    fechaCreacion: Timestamp.now(),
    fechaActualizacion: Timestamp.now(),
  });

  const [selectedRedes, setSelectedRedes] = useState([]);
  const [notaActual, setNotaActual] = useState("");

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

  const handleChange = (e) => {
    setPosibleCliente({
      ...posibleCliente,
      [e.target.name]: e.target.value,
      fechaActualizacion: Timestamp.now(),
    });
  };

  const handleRedesSelect = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedRedes([...selectedRedes, value]);
      setPosibleCliente({
        ...posibleCliente,
        redesSociales: [...(posibleCliente.redesSociales || []), { tipo: value, url: "" }],
      });
    } else {
      setSelectedRedes(selectedRedes.filter((red) => red !== value));
      setPosibleCliente({
        ...posibleCliente,
        redesSociales: (posibleCliente.redesSociales || []).filter(
          (red) => red.tipo !== value
        ),
      });
    }
  };

  const handleRedSocialChange = (index, field, value) => {
    const nuevasRedes = [...(posibleCliente.redesSociales || [])];
    nuevasRedes[index][field] = value;
    setPosibleCliente({
      ...posibleCliente,
      redesSociales: nuevasRedes,
      fechaActualizacion: Timestamp.now(),
    });
  };

  const handleRemoveRedSocial = (index) => {
    const nuevasRedes = [...(posibleCliente.redesSociales || [])];
    nuevasRedes.splice(index, 1);
    setPosibleCliente({
      ...posibleCliente,
      redesSociales: nuevasRedes,
      fechaActualizacion: Timestamp.now(),
    });
    const redTipo = selectedRedes[index];
    setSelectedRedes(selectedRedes.filter((red) => red !== redTipo));
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
  
    // Ejemplo: Incrementar leadScore por cada nota agregada
    const nuevoLeadScore = (posibleCliente.leadScore || 0) + 10;
  
    setPosibleCliente({
      ...posibleCliente,
      notas: [nuevaNota, ...(posibleCliente.notas || [])],
      leadScore: nuevoLeadScore,
      fechaActualizacion: Timestamp.now(),
    });
  
    setNotaActual("");
  };

  const handleEliminarNota = (index) => {
    const nuevasNotas = [...(posibleCliente.notas || [])];
    nuevasNotas.splice(index, 1);
    setPosibleCliente({
      ...posibleCliente,
      notas: nuevasNotas,
      fechaActualizacion: Timestamp.now(),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar campos obligatorios
    if (
      !posibleCliente.nombre ||
      !posibleCliente.nombreNegocio ||
      !posibleCliente.direccion ||
      !posibleCliente.telefono ||
      !posibleCliente.correo
    ) {
      toast.error("Por favor, completa todos los campos obligatorios.");
      return;
    }

    try {
      await addDoc(collection(db, "posiblesClientes"), posibleCliente);
      toast.success("Posible cliente añadido exitosamente");
      setPosibleCliente({
        nombre: "",
        nombreNegocio: "",
        direccion: "",
        telefono: "",
        correo: "",
        sitioWeb: "",
        estado: "Nuevo",
        plan: "Inicial",
        leadScore: 0,
        actividades: [],
        tareas: [],
        notas: [],
        fechaCreacion: Timestamp.now(),
        fechaActualizacion: Timestamp.now(),
      });
      setSelectedRedes([]);
      setNotaActual("");
      onClose();
    } catch (error) {
      console.error("Error añadiendo posible cliente: ", error);
      toast.error("Error al añadir posible cliente");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 overflow-auto pt-24 px-4">
      <div className="bg-white text-black rounded-lg shadow-lg w-full max-w-3xl mx-auto p-6 relative">
        {/* Botón de cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
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

        <h2 className="text-2xl mb-4 text-center">Agregar Posible Cliente</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campos del Posible Cliente */}
          <div>
            <label htmlFor="nombre" className="block font-semibold">
              Nombre del cliente: 
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={posibleCliente.nombre}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              
            />
          </div>
          <div>
            <label htmlFor="nombreNegocio" className="block font-semibold">
              Nombre del Negocio: 
            </label>
            <input
              type="text"
              id="nombreNegocio"
              name="nombreNegocio"
              value={posibleCliente.nombreNegocio}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              
            />
          </div>
          <div>
            <label htmlFor="direccion" className="block font-semibold">
              Dirección: 
            </label>
            <input
              type="text"
              id="direccion"
              name="direccion"
              value={posibleCliente.direccion}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              
            />
          </div>
          <div>
            <label htmlFor="telefono" className="block font-semibold">
              Teléfono: 
            </label>
            <input
              type="tel"
              id="telefono"
              name="telefono"
              value={posibleCliente.telefono}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              
            />
          </div>
          <div>
            <label htmlFor="correo" className="block font-semibold">
              Correo Electrónico: 
            </label>
            <input
              type="email"
              id="correo"
              name="correo"
              value={posibleCliente.correo}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              
            />
          </div>

          {/* Redes Sociales */}
          <div>
            <label className="block font-semibold mb-2">Redes Sociales:</label>
            <div className="flex flex-wrap gap-2">
              {availableRedes.map((red) => (
                <label key={red} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={red}
                    checked={selectedRedes.includes(red)}
                    onChange={handleRedesSelect}
                  />
                  <span>{red}</span>
                </label>
              ))}
            </div>
          </div>

          {posibleCliente.redesSociales && posibleCliente.redesSociales.length > 0 && (
            <div className="space-y-2">
              {posibleCliente.redesSociales.map((redSocial, index) => (
                <div key={index} className="border p-3 rounded">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold">{redSocial.tipo}</h4>
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
                        handleRedSocialChange(index, "url", e.target.value)
                      }
                      className="w-full px-3 py-2 border rounded"
                      
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

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
              {posibleCliente.notas && posibleCliente.notas.length > 0 ? (
                posibleCliente.notas.map((nota, index) => (
                  <div key={index} className="bg-gray-100 p-3 rounded shadow">
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
            <label htmlFor="estado" className="block font-semibold">
              Estado:
            </label>
            <select
              id="estado"
              name="estado"
              value={posibleCliente.estado}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="Nuevo">Nuevo</option>
              <option value="Contactado">Contactado</option>
              <option value="Calificado">Calificado</option>
              <option value="Propuesta Enviada">Propuesta Enviada</option>
              <option value="Cerrado">Cerrado</option>
            </select>
          </div>

          {/* Botones de Acción */}
          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
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
              Añadir Posible Cliente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AgregarPosibleCliente;
