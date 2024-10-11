/* eslint-disable react/prop-types */
// src/components/AgregarActividad.jsx
import { useState } from "react";
import { db } from "../firebase"; // Asegúrate de importar Firestore
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify"; // Opción para mostrar notificaciones si usas react-toastify

const AgregarActividad = ({ clienteId, onClose }) => {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fecha, setFecha] = useState(""); // Ahora es un campo de texto
  const [notas, setNotas] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // Estado para evitar doble envío

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar que no haya campos vacíos
    if (!titulo || !descripcion || !fecha) {
      toast.error("Todos los campos son obligatorios"); // Si usas react-toastify para mostrar mensajes
      return;
    }

    setIsSubmitting(true); // Evitar múltiples envíos

    try {
      // Crea la nueva actividad con los datos ingresados
      const newActivity = { titulo, descripcion, fecha, notas };

      // Referencia al documento del cliente en Firestore
      const clienteDoc = doc(db, "posiblesClientes", clienteId);

      // Actualiza el documento del cliente añadiendo la nueva actividad
      await updateDoc(clienteDoc, {
        actividades: arrayUnion(newActivity), // Añade la nueva actividad al array de actividades
      });

      toast.success("Actividad agregada correctamente"); // Mensaje de éxito si usas react-toastify
      onClose(); // Cierra el modal después de agregar la actividad
    } catch (error) {
      console.error("Error al agregar actividad:", error);
      toast.error("Error al agregar actividad"); // Mensaje de error si usas react-toastify
    } finally {
      setIsSubmitting(false); // Habilitar el botón de nuevo
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Agregar Actividad</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Título de la actividad"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            
            className="border border-gray-300 rounded p-2 mb-4 w-full"
          />
          <textarea
            placeholder="Descripción"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            
            className="border border-gray-300 rounded p-2 mb-4 w-full"
          />
          {/* Campo de texto para la fecha */}
          <input
            type="text"
            placeholder="Fecha (dd/mm/yyyy)"
            value={fecha} // No se formatea automáticamente, se ingresa como texto
            onChange={(e) => setFecha(e.target.value)}
            
            className="border border-gray-300 rounded p-2 mb-4 w-full"
          />
          <textarea
            placeholder="Notas adicionales"
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            className="border border-gray-300 rounded p-2 mb-4 w-full"
          />
          <div className="flex justify-between">
            <button
              type="submit"
              className={`bg-blue-500 text-white rounded p-2 hover:bg-blue-600 transition duration-200 ${
                isSubmitting && "opacity-50 cursor-not-allowed"
              }`}
              disabled={isSubmitting} // Desactivar el botón mientras se envía
            >
              {isSubmitting ? "Agregando..." : "Agregar"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-red-500 text-white rounded p-2 hover:bg-red-600 transition duration-200"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AgregarActividad;
