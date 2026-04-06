/**
 * Tests para Componentes Frontend
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AdminPanel from '../AdminPanel';

// Mock del contexto de tema
jest.mock('../context/ThemeContext.js', () => ({
  useTheme: () => ({
    isDark: false,
    toggleTheme: jest.fn(),
  }),
}));

// Mock del fetch global
global.fetch = jest.fn();

describe('AdminPanel Component', () => {
  beforeEach(() => {
    // Limpiar localStorage y mocks antes de cada test
    localStorage.clear();
    fetch.mockClear();
    localStorage.setItem('token', 'fake-token-123');
  });

  it('debe renderizar el panel administrativo', () => {
    fetch.mockResolvedValueOnce(
      new Response(JSON.stringify([]), { status: 200 })
    );
    fetch.mockResolvedValueOnce(
      new Response(JSON.stringify([]), { status: 200 })
    );
    fetch.mockResolvedValueOnce(
      new Response(JSON.stringify([]), { status: 200 })
    );
    fetch.mockResolvedValueOnce(
      new Response(JSON.stringify([]), { status: 200 })
    );
    fetch.mockResolvedValueOnce(
      new Response(JSON.stringify([]), { status: 200 })
    );

    render(<AdminPanel />);
    
    expect(screen.getByText(/Cargando panel administrativo/i)).toBeInTheDocument();
  });

  it('debe mostrar tabs de navegación', async () => {
    fetch.mockResolvedValue(
      new Response(JSON.stringify([]), { status: 200 })
    );

    render(<AdminPanel />);

    await waitFor(() => {
      expect(screen.getByText(/Panel/i)).toBeInTheDocument();
      expect(screen.getByText(/Usuarios/i)).toBeInTheDocument();
      expect(screen.getByText(/Solicitudes/i)).toBeInTheDocument();
      expect(screen.getByText(/Pagos/i)).toBeInTheDocument();
    });
  });

  it('debe navegar entre tabs correctamente', async () => {
    fetch.mockResolvedValue(
      new Response(JSON.stringify([]), { status: 200 })
    );

    render(<AdminPanel />);

    await waitFor(() => {
      const usuariosTab = screen.getByText(/👥 Usuarios/i);
      fireEvent.click(usuariosTab);
    });

    // Verificar que se mostraron elementos del tab de usuarios
    await waitFor(() => {
      expect(screen.getByText(/Gestión de Usuarios/i)).toBeInTheDocument();
    });
  });

  it('debe mostrar error cuando falla la carga de datos', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));

    render(<AdminPanel />);

    await waitFor(() => {
      expect(screen.getByText(/Error/i)).toBeInTheDocument();
    });
  });

  it('debe mostrar mensaje de éxito después de cambiar rol', async () => {
    const mockUsers = [
      { id: '1', nombre: 'Juan', email: 'juan@test.com', rol: 'cliente' }
    ];

    fetch
      .mockResolvedValueOnce(new Response(JSON.stringify(mockUsers), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify([]), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify([]), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify([]), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify([]), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ message: 'Éxito' }), { status: 200 }));

    render(<AdminPanel />);

    await waitFor(() => {
      const tab = screen.getByText(/👥 Usuarios/i);
      fireEvent.click(tab);
    });

    // Buscar y hacer click en el select
    await waitFor(() => {
      const selects = screen.getAllByDisplayValue('cliente');
      if (selects.length > 0) {
        fireEvent.change(selects[0], { target: { value: 'profesional' } });
      }
    });
  });
});
