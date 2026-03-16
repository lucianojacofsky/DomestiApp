import React, { useState } from "react";

function WorkerForm({ onWorkerAdded }) {
  const [nombre, setNombre] = useState("");
  const [oficio, setOficio] = useState("");
  const [telefono, setTelefono] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newWorker = { nombre, oficio, telefono };

    try {
      const res = await fetch("http://localhost:5000/workers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newWorker),
      });

      if (res.ok) {
        const savedWorker = await res.json();
        onWorkerAdded(savedWorker);
        setNombre("");
        setOficio("");
        setTelefono("");
      } else {
        const error = await res.json();
        alert("Error: " + error.error);
      }
    } catch (err) {
      console.error("Error al crear trabajador:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Agregar Trabajador</h2>
      <input
        type="text"
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Oficio"
        value={oficio}
        onChange={(e) => setOficio(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Teléfono"
        value={telefono}
        onChange={(e) => setTelefono(e.target.value)}
        required
      />
      <button type="submit">Guardar</button>
    </form>
  );
}

export default WorkerForm;