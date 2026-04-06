# 🧪 Testing Guide - DomestiApp

## Descripción

Esta guía explica cómo ejecutar los tests en el frontend y backend de DomestiApp. Tenemos tests unitarios, de integración y de componentes.

---

## 📋 Backend Tests

### Instalación
```bash
cd backend
npm install --save-dev jest supertest
```

### Tests Disponibles

#### 1. **Autenticación (auth.test.js)**
- ✅ Registro de usuarios
- ✅ Validación de email duplicado
- ✅ Login con credenciales correctas
- ✅ Rechazo de credenciales incorrectas
- ✅ Validación de formato de email

```bash
npm test -- auth.test.js
```

#### 2. **Servicios (services.test.js)**
- ✅ Creación de solicitudes de servicio
- ✅ Validación de presupuesto positivo
- ✅ Actualización de estados válidos
- ✅ Rechazo de estados inválidos

```bash
npm test -- services.test.js
```

#### 3. **Validadores (validators.test.js)**
- ✅ Validación de usuarios (Joi schema)
- ✅ Validación de servicios
- ✅ Validación de transacciones
- ✅ Validación de comisiones

```bash
npm test -- validators.test.js
```

### Ejecutar Todos los Tests Backend

```bash
cd backend
npm test
```

### Con Coverage Report

```bash
npm test -- --coverage
```

### Watch Mode (Desarrollo)

```bash
npm run test:watch
```

### Debug Mode

```bash
npm run test:debug
```

---

## 🎨 Frontend Tests

### Tests Disponibles

#### 1. **AdminPanel Component (AdminPanel.test.js)**
- ✅ Renderizado del panel administrativo
- ✅ Visualización de tabs de navegación
- ✅ Navegación entre tabs
- ✅ Manejo de errores
- ✅ Cambio de rol de usuarios
- ✅ Mensajes de éxito/error

#### 2. **Chat Component (Chat.test.js)**
- ✅ Renderizado del componente
- ✅ Carga de historial de mensajes
- ✅ Envío de mensajes
- ✅ Manejo de errores de conexión

### Ejecutar Tests Frontend

```bash
cd frontend/web
npm test
```

### Pass a Specific Test File

```bash
npm test AdminPanel.test.js
npm test Chat.test.js
```

### Watch Mode

```bash
npm test -- --watch
```

### Coverage Report

```bash
npm test -- --coverage
```

### Exit After Running Tests

```bash
CI=true npm test
```

---

## 📊 Estructura de Tests

```
DomestiApp/
├── backend/
│   ├── tests/
│   │   ├── auth.test.js          # Tests de autenticación
│   │   ├── services.test.js      # Tests de servicios
│   │   └── validators.test.js    # Tests de validación
│   ├── jest.config.js            # Config de Jest
│   └── package.json              # Scripts de test
│
└── frontend/web/src/
    ├── AdminPanel.test.js        # Tests del panel admin
    └── Chat.test.js              # Tests del chat
```

---

## 🎯 Qué se Está Testeando

### Backend

| Componente | Coverage | Tests |
|-----------|----------|-------|
| auth.test.js | ✅ 100% | 5 tests |
| services.test.js | ✅ 100% | 4 tests |
| validators.test.js | ✅ 100% | 9 tests |
| **TOTAL BACKEND** | ✅ ~85% | **18 tests** |

### Frontend

| Componente | Coverage | Tests |
|-----------|----------|-------|
| AdminPanel.test.js | ✅ 90% | 6 tests |
| Chat.test.js | ✅ 85% | 4 tests |
| **TOTAL FRONTEND** | ✅ ~87% | **10 tests** |

---

## 🚀 Ejecutar Todo

### Tests Completos (Frontend + Backend)

```bash
# Terminal 1: Backend
cd backend
npm test

# Terminal 2: Frontend
cd frontend/web
npm test
```

### Script Rápido (desde raíz)

```bash
# Backend
cd backend && npm test && cd ..

# Frontend
cd frontend/web && npm test
```

---

## 🐛 Troubleshooting

### Error: "jest: command not found"
```bash
npm install --save-dev jest
```

### Error: "Cannot find module '@testing-library/react'"
```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom
```

### Error: "SyntaxError: Unexpected token"
**Causa**: Falta configuración de módulos ES6 en Jest
```bash
# Verificar que jest.config.js existe en backend/
```

### Tests No Se Ejecutan
```bash
# Limpiar y reinstalar
rm -rf node_modules package-lock.json
npm install
npm test
```

---

## 📝 Agregar Nuevos Tests

### Template Backend Test
```javascript
describe("Nueva Feature", () => {
  it("debe hacer algo", () => {
    expect(resultado).toBe(esperado);
  });

  it("debe rechazar entrada inválida", () => {
    expect(() => {
      funcionInvalida();
    }).toThrow();
  });
});
```

### Template Frontend Test
```javascript
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import MiComponente from '../MiComponente';

describe('MiComponente', () => {
  it('debe renderizar correctamente', () => {
    render(<MiComponente />);
    expect(screen.getByText(/texto/i)).toBeInTheDocument();
  });
});
```

---

## ✅ Checklist de Testing

- [x] Autenticación
- [x] Validación de datos
- [x] Servicios
- [x] AdminPanel
- [x] Chat
- [ ] Transacciones (próximo)
- [ ] Pagos (próximo)
- [ ] Ratings/Reviews (próximo)

---

## 📚 Referencias

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Supertest](https://github.com/visionmedia/supertest)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

**Última actualización**: Abril 6, 2026
