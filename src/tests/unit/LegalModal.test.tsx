import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mock } from 'vitest';

vi.mock('../../app/services/legal.service', () => ({
  default: {
    getLegalByName: vi.fn(),
  },
}));

import LegalService from '../../app/services/legal.service';
import LegalModal from '../../components/legal/LegalModal';
import userEvent from '@testing-library/user-event';

const mockDoc = {
  id: 1,
  name: 'Términos y Condiciones',
  content: '# Hola\nTexto de prueba\n- item1\n- item2',
  version: 'v1.0',
  active: true,
  createdAt: '2025-01-01T00:00:00.000Z',
  updatedAt: '2025-01-01T00:00:00.000Z',
};

describe('LegalModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading then content and calls onClose', async () => {
    (LegalService.getLegalByName as unknown as Mock) = vi.fn().mockResolvedValue(mockDoc);

    const onClose = vi.fn();

    render(<LegalModal name="Términos y Condiciones" open={true} onClose={onClose} />);

    expect(screen.getByText(/Cargando/i)).toBeInTheDocument();

    await waitFor(() =>
      expect(LegalService.getLegalByName).toHaveBeenCalledWith('Términos y Condiciones')
    );

    await waitFor(() => expect(screen.getByText('Hola')).toBeInTheDocument());
    expect(screen.getByText('Texto de prueba')).toBeInTheDocument();

    const closeBtn = screen.getByRole('button', { name: /Cerrar/i });
    await userEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalled();
  });

  it('shows error message if fetch fails', async () => {
    (LegalService.getLegalByName as unknown as Mock) = vi.fn().mockRejectedValue(new Error('fail'));

    render(<LegalModal name="NoExiste" open={true} onClose={() => {}} />);

    expect(screen.getByText(/Cargando/i)).toBeInTheDocument();

    await waitFor(() =>
      expect(screen.getByText(/No se pudo cargar el documento/i)).toBeInTheDocument()
    );
  });
});
