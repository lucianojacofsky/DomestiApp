import React, { useState, useEffect } from "react";
import WorkerForm from "./WorkerForm";
import WorkersList from "./WorkersList";

function App() {
  const [workers, setWorkers] = useState([]);

  // Cargar trabajadores al iniciar
  useEffect(() => {
    fetch("http://localhost:5000/workers")
      .then((res) => res.json())
      .then((data) => setWorkers(data))
      .catch((err) => console.error("Error al cargar trabajadores:", err));
  }, []);

  // Actualizar lista cuando se agrega uno nuevo
  const handleWorkerAdded = (newWorker) => {
    setWorkers((prev) => [...prev, newWorker]);
  };

  return (
    <div>
      <h1>DomestiApp</h1>
      <WorkerForm onWorkerAdded={handleWorkerAdded} />
      <WorkersList workers={workers} />
    </div>
  );
}

export default App;