import React from "react";

function WorkersList({ workers }) {
  return (
    <div>
      <h2>Lista de Trabajadores</h2>
      <ul>
        {workers.map((worker, index) => (
          <li key={index}>
            {worker.nombre} - {worker.oficio} - {worker.telefono}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default WorkersList;