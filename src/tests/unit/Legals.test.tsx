import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Legals from '../../pages/Legals';
import LegalService from '../../app/services/legal.service';
import type { LegalDocument } from '../../app/types/legal.types';
import { vi } from 'vitest';

const mockDocs: LegalDocument[] = [
  {
    id: 1,
    name: 'Términos',
    content: 'Contenido 1',
    version: '1.0',
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: 'Política',
    content: 'Contenido 2',
    version: '2.0',
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

describe('Legals page', () => {
  beforeEach(() => {
    vi.spyOn(LegalService, 'getLegals').mockResolvedValue(mockDocs);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders list of legal cards', async () => {
    render(<Legals />);

    expect(screen.getByText(/Cargando/i)).toBeInTheDocument();

    await waitFor(() => expect(screen.getByText('Términos')).toBeInTheDocument());
    expect(screen.getByText('Política')).toBeInTheDocument();
  });

  it('can open create modal and create a document', async () => {
    const created: LegalDocument = {
      id: 3,
      name: 'Nuevo',
      content: 'nuevo',
      version: '1.0',
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    vi.spyOn(LegalService, 'createLegal').mockResolvedValue(created);

    render(<Legals />);
    await waitFor(() => expect(screen.getByText('Términos')).toBeInTheDocument());

    fireEvent.click(screen.getByTestId('create-legal'));

    const nameInput = screen.getByLabelText(/Nombre/i);
    const versionInput = screen.getByLabelText(/Versión/i);
    const contentInput = screen.getByLabelText(/Contenido/i);

    fireEvent.change(nameInput, { target: { value: 'Nuevo' } });
    fireEvent.change(versionInput, { target: { value: '1.0' } });
    fireEvent.change(contentInput, { target: { value: 'nuevo' } });

    fireEvent.click(screen.getByText('Guardar'));

    await waitFor(() => expect(screen.getByText('Nuevo')).toBeInTheDocument());
  });

  it('opens view modal and displays full content', async () => {
    vi.spyOn(LegalService, 'getLegalByName').mockResolvedValue(mockDocs[0]);

    render(<Legals />);
    await waitFor(() => expect(screen.getByText('Términos')).toBeInTheDocument());

    const viewButton = screen.getAllByLabelText('Ver')[0];
    fireEvent.click(viewButton);

    await waitFor(() => expect(screen.getByText('Contenido 1')).toBeInTheDocument());
  });

  it('deletes a document', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    vi.spyOn(LegalService, 'deleteLegal').mockResolvedValue();

    render(<Legals />);
    await waitFor(() => expect(screen.getByText('Términos')).toBeInTheDocument());

    const deleteButtons = screen.getAllByLabelText('Borrar');
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => expect(LegalService.deleteLegal).toHaveBeenCalled());
  });
});
