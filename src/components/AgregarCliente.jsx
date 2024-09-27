/* eslint-disable react/prop-types */
// src/components/AgregarCliente.jsx
import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import { toast } from "react-toastify";

const AgregarCliente = ({ onClose }) => {
  const [cliente, setCliente] = useState({
    nombre: "",
    nombreNegocio: "",
    direccion: "",
    maps: "",
    telefono: "",
    correo: "",
    sitioWebActual: "",
    sitioWebAntiguo: "",
    notas: "",
    estado: "Pendiente",
    redesSociales: [],
  });

  const [selectedRedes, setSelectedRedes] = useState([]);

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
    setCliente({
      ...cliente,
      [e.target.name]: e.target.value,
    });
  };

  const handleRedesSelect = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedRedes([...selectedRedes, value]);
      setCliente({
        ...cliente,
        redesSociales: [...cliente.redesSociales, { tipo: value, url: "" }],
      });
    } else {
      setSelectedRedes(selectedRedes.filter((red) => red !== value));
      setCliente({
        ...cliente,
        redesSociales: cliente.redesSociales.filter(
          (red) => red.tipo !== value
        ),
      });
    }
  };

  const handleRedSocialChange = (index, field, value) => {
    const nuevasRedes = [...cliente.redesSociales];
    nuevasRedes[index][field] = value;
    setCliente({
      ...cliente,
      redesSociales: nuevasRedes,
    });
  };

  const handleRemoveRedSocial = (index) => {
    const nuevasRedes = [...cliente.redesSociales];
    nuevasRedes.splice(index, 1);
    setCliente({
      ...cliente,
      redesSociales: nuevasRedes,
    });
    const redTipo = selectedRedes[index];
    setSelectedRedes(selectedRedes.filter((red) => red !== redTipo));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "clientes"), cliente);
      toast.success("Cliente añadido exitosamente");
      setCliente({
        nombre: "",
        nombreNegocio: "",
        direccion: "",
        telefono: "",
        correo: "",
        sitioWebActual: "",
        sitioWebAntiguo: "",
        notas: "",
        estado: "Pendiente",
        redesSociales: [],
      });
      setSelectedRedes([]);
      onClose();
    } catch (error) {
      console.error("Error añadiendo cliente: ", error);
      toast.error("Error al añadir cliente");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 overflow-auto pt-24">
      <div className="bg-white text-black rounded-lg shadow-lg w-11/12 max-w-2xl mx-auto p-6 relative">
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

        <h2 className="text-2xl mb-4 text-center">Agregar Nuevo Cliente</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nombre" className="block font-semibold">
              Nombre del cliente: <span className="text-red-500">*</span>
            </label>
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
            <label htmlFor="nombreNegocio" className="block font-semibold">
              Nombre del Negocio: <span className="text-red-500">*</span>
            </label>
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
            <label htmlFor="direccion" className="block font-semibold">
              Dirección: <span className="text-red-500">*</span>
            </label>
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
            <label htmlFor="maps" className="block font-semibold">
              Dirección (URL Maps):
            </label>
            <input
              type="text"
              id="maps"
              name="maps"
              value={cliente.maps}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label htmlFor="telefono" className="block font-semibold">
              Teléfono: <span className="text-red-500">*</span>
            </label>
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
            <label htmlFor="correo" className="block font-semibold">
              Correo Electrónico: <span className="text-red-500">*</span>
            </label>
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

          {cliente.redesSociales.map((redSocial, index) => (
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
                  required
                />
              </div>
            </div>
          ))}

          <div>
            <label htmlFor="sitioWebActual" className="block font-semibold">
              Sitio Web Actual (URL):
            </label>
            <input
              type="url"
              id="sitioWebActual"
              name="sitioWebActual"
              value={cliente.sitioWebActual}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label htmlFor="sitioWebAntiguo" className="block font-semibold">
              Sitio Web Antiguo (URL):
            </label>
            <input
              type="text"
              id="sitioWebAntiguo"
              name="sitioWebAntiguo"
              value={cliente.sitioWebAntiguo}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label htmlFor="notas" className="block font-semibold">
              Notas:
            </label>
            <textarea
              id="notas"
              name="notas"
              value={cliente.notas}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            ></textarea>
          </div>
          <div>
            <label htmlFor="estado" className="block font-semibold">
              Estado:
            </label>
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
