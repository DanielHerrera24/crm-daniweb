// src/components/ClientesActuales.jsx
import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import Accordion from './Accordion';
import AgregarCliente from './AgregarCliente';

const ClientesActuales = () => {
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "clientes"), where("estado", "in", ["Pendiente", "Desarrollando", "Realizado"]));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const clientesData = [];
      querySnapshot.forEach((doc) => {
        clientesData.push({ id: doc.id, ...doc.data() });
      });
      setClientes(clientesData);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-[50vh] bg-gray-100 p-4">
      <h2 className="text-2xl mb-4 text-black">Clientes Actuales</h2>
      <AgregarCliente/>
      <Accordion items={clientes} />
    </div>
  );
};

export default ClientesActuales;
