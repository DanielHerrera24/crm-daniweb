// src/components/AgregarCliente.jsx
import { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

const AgregarCliente = () => {
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
      setCliente({
        nombre: '',
        nombreNegocio: '',
        direccion: '',
        telefono: '',
        correo: '',
        notas: '',
        estado: 'Pendiente'
      });
      alert("Cliente añadido exitosamente");
    } catch (error) {
      console.error("Error añadiendo cliente: ", error);
    }
  };

  return (
    <div className="bg-gray-600 p-4 mb-10">
      <h2 className="text-2xl mb-4">Agregar Nuevo Cliente</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={cliente.nombre}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="nombreNegocio"
          placeholder="Nombre del Negocio"
          value={cliente.nombreNegocio}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="direccion"
          placeholder="Dirección"
          value={cliente.direccion}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="tel"
          name="telefono"
          placeholder="Teléfono"
          value={cliente.telefono}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="email"
          name="correo"
          placeholder="Correo Electrónico"
          value={cliente.correo}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          name="notas"
          placeholder="Notas"
          value={cliente.notas}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        ></textarea>
        <button type="submit" className="bg-green-500 text-white p-2 rounded">
          Añadir Cliente
        </button>
      </form>
    </div>
  );
};

export default AgregarCliente;
