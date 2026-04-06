/**
 * Tests para Validadores
 * Lógica de validación sin dependencias complejas
 */

describe("Validadores", () => {
  describe("Validación de Usuario", () => {
    const validateUser = (user) => {
      return (
        user.nombre &&
        user.nombre.length >= 3 &&
        user.email &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email) &&
        user.password &&
        user.password.length >= 6 &&
        ["cliente", "profesional", "admin"].includes(user.rol)
      );
    };

    it("debe validar usuario correcto", () => {
      const user = {
        nombre: "Juan Pérez",
        email: "juan@example.com",
        password: "password123",
        rol: "cliente",
      };
      expect(validateUser(user)).toBe(true);
    });

    it("debe rechazar email inválido", () => {
      const user = {
        nombre: "Juan",
        email: "invalid-email",
        password: "password123",
        rol: "cliente",
      };
      expect(validateUser(user)).toBe(false);
    });

    it("debe rechazar password muy corta", () => {
      const user = {
        nombre: "Juan",
        email: "juan@example.com",
        password: "123",
        rol: "cliente",
      };
      expect(validateUser(user)).toBe(false);
    });

    it("debe rechazar rol inválido", () => {
      const user = {
        nombre: "Juan",
        email: "juan@example.com",
        password: "password123",
        rol: "superadmin",
      };
      expect(validateUser(user)).toBe(false);
    });

    it("debe rechazar nombre muy corto", () => {
      const user = {
        nombre: "Jo",
        email: "juan@example.com",
        password: "password123",
        rol: "cliente",
      };
      expect(validateUser(user)).toBe(false);
    });
  });

  describe("Validación de Servicio", () => {
    const validateService = (service) => {
      return !!(
        service.categoria &&
        service.descripcion &&
        service.descripcion.length >= 10 &&
        service.presupuesto > 0 &&
        service.ubicacion
      );
    };

    it("debe validar servicio correcto", () => {
      const service = {
        categoria: "Limpieza",
        descripcion: "Necesito limpiar mi apartamento completamente",
        presupuesto: 500,
        ubicacion: "Buenos Aires",
      };
      expect(validateService(service)).toBe(true);
    });

    it("debe rechazar presupuesto negativo", () => {
      const service = {
        categoria: "Limpieza",
        descripcion: "Necesito limpiar mi apartamento completamente",
        presupuesto: -500,
        ubicacion: "Buenos Aires",
      };
      expect(validateService(service)).toBe(false);
    });

    it("debe rechazar descripción muy corta", () => {
      const service = {
        categoria: "Limpieza",
        descripcion: "Limpiar",
        presupuesto: 500,
        ubicacion: "Buenos Aires",
      };
      expect(validateService(service)).toBe(false);
    });

    it("debe rechazar presupuesto cero", () => {
      const service = {
        categoria: "Limpieza",
        descripcion: "Necesito limpiar mi apartamento completamente",
        presupuesto: 0,
        ubicacion: "Buenos Aires",
      };
      expect(validateService(service)).toBe(false);
    });
  });

  describe("Validación de Transacción", () => {
    const validateTransaction = (tx) => {
      const validStates = ["pendiente", "aprobada", "rechazada"];
      return (
        tx.servicioId &&
        tx.montoTotal > 0 &&
        tx.comisionPorcentaje >= 0 &&
        tx.comisionPorcentaje <= 100 &&
        validStates.includes(tx.estado)
      );
    };

    it("debe validar transacción correcta", () => {
      const tx = {
        servicioId: "service-123",
        montoTotal: 1000,
        comisionPorcentaje: 10,
        estado: "aprobada",
      };
      expect(validateTransaction(tx)).toBe(true);
    });

    it("debe validar comisión entre 0 y 100", () => {
      const txAlta = {
        servicioId: "service-123",
        montoTotal: 1000,
        comisionPorcentaje: 150,
        estado: "aprobada",
      };
      expect(validateTransaction(txAlta)).toBe(false);

      const txBaja = {
        servicioId: "service-123",
        montoTotal: 1000,
        comisionPorcentaje: -10,
        estado: "aprobada",
      };
      expect(validateTransaction(txBaja)).toBe(false);
    });

    it("debe rechazar monto negativo", () => {
      const tx = {
        servicioId: "service-123",
        montoTotal: -1000,
        comisionPorcentaje: 10,
        estado: "aprobada",
      };
      expect(validateTransaction(tx)).toBe(false);
    });

    it("debe rechazar estado inválido", () => {
      const tx = {
        servicioId: "service-123",
        montoTotal: 1000,
        comisionPorcentaje: 10,
        estado: "no_valido",
      };
      expect(validateTransaction(tx)).toBe(false);
    });
  });

  describe("Validación de Comisión", () => {
    const calcularComision = (monto, porcentaje) => {
      if (porcentaje < 0 || porcentaje > 100) return null;
      if (monto <= 0) return null;
      return monto * (porcentaje / 100);
    };

    it("debe calcular comisión correctamente", () => {
      expect(calcularComision(1000, 10)).toBe(100);
      expect(calcularComision(500, 20)).toBe(100);
    });

    it("debe rechazar porcentaje inválido", () => {
      expect(calcularComision(1000, 150)).toBeNull();
      expect(calcularComision(1000, -10)).toBeNull();
    });

    it("debe rechazar monto inválido", () => {
      expect(calcularComision(0, 10)).toBeNull();
      expect(calcularComision(-500, 10)).toBeNull();
    });
  });
});
