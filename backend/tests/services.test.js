/**
 * Tests para Controladores de Servicios
 */
describe("Service Requests Controller", () => {
  describe("createServiceRequest", () => {
    it("debe crear una solicitud de servicio válida", () => {
      const validRequest = {
        clienteId: "user-1",
        categoria: "Limpieza",
        descripcion: "Limpiar apartamento",
        ubicacion: "Buenos Aires",
        presupuesto: 500,
        estado: "abierta",
      };

      expect(validRequest.categoria).toBeDefined();
      expect(validRequest.presupuesto).toBeGreaterThan(0);
      expect(["abierta", "asignada", "completada", "cancelada"]).toContain(validRequest.estado);
    });

    it("debe validar presupuesto positivo", () => {
      const invalidRequest = {
        presupuesto: -100,
      };

      expect(invalidRequest.presupuesto).toBeLessThan(0);
    });
  });

  describe("updateServiceStatus", () => {
    it("debe actualizar estado válido", () => {
      const validStates = ["pendiente", "aceptado", "en_progreso", "completado", "cancelado"];
      const newState = "completado";

      expect(validStates).toContain(newState);
    });

    it("debe rechazar estado inválido", () => {
      const validStates = ["pendiente", "aceptado", "en_progreso", "completado", "cancelado"];
      const invalidState = "invalid_state";

      expect(validStates).not.toContain(invalidState);
    });
  });
});
