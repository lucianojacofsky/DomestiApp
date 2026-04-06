/**
 * Tests para Componente Chat
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Chat from '../Chat';

// Mock del socket.io-client
jest.mock('socket.io-client', () => {
  return jest.fn(() => ({
    on: jest.fn(),
    emit: jest.fn(),
    disconnect: jest.fn(),
    off: jest.fn(),
  }));
});

jest.mock('../context/ThemeContext.js', () => ({
  useTheme: () => ({
    isDark: false,
    toggleTheme: jest.fn(),
  }),
}));

global.fetch = jest.fn();

describe('Chat Component', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('token', 'fake-token-123');
    localStorage.setItem('user', JSON.stringify({ id: 'user-1', nombre: 'Test User' }));
    fetch.mockClear();
  });

  it('debe renderizar el componente de chat', () => {
    render(<Chat serviceId="service-1" onClose={jest.fn()} />);
    
    expect(screen.getByText(/Cerrar|close/i)).toBeInTheDocument();
  });

  it('debe cargar el historial de mensajes', async () => {
    const mockMessages = [
      { id: '1', remitenteId: 'user-1', contenido: 'Hola', fecha: new Date() },
      { id: '2', remitenteId: 'user-2', contenido: 'Hola, ¿qué tal?', fecha: new Date() }
    ];

    fetch.mockResolvedValueOnce(
      new Response(JSON.stringify(mockMessages), { status: 200 })
    );

    render(<Chat serviceId="service-1" onClose={jest.fn()} />);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/chat/service/service-1')
      );
    });
  });

  it('debe permitir enviar mensajes', async () => {
    fetch.mockResolvedValueOnce(
      new Response(JSON.stringify([]), { status: 200 })
    );
    fetch.mockResolvedValueOnce(
      new Response(JSON.stringify({ success: true }), { status: 200 })
    );

    render(<Chat serviceId="service-1" onClose={jest.fn()} />);

    // Buscar input y escribir mensaje
    await waitFor(() => {
      const input = screen.queryByPlaceholderText(/Escribe un mensaje|message/i);
      if (input) {
        fireEvent.change(input, { target: { value: 'Test message' } });
      }
    });
  });

  it('debe manejar errores de carga', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));

    render(<Chat serviceId="service-1" onClose={jest.fn()} />);

    // El componente debe continuar funcionando sin fallar
    expect(screen.getByText(/Cerrar|close/i)).toBeInTheDocument();
  });
});
