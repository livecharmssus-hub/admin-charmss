import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import type { Mock } from 'vitest';
import OnboardingModal from '../../components/performers/OnboardingModal';
import * as onboardingService from '../../app/services/onBoarding.service';
import type { OnboardingData } from '../../types/onboarding';

vi.mock('../../app/services/onBoarding.service');

const sample = {
  id: 2,
  firstName: 'Luis',
  middleName: 'Gabriel Corredor',
  lastName: 'Combita',
  emailAddress: 'luis.corredor@macrodatum.com',
  nickName: 'luis',
  birthDate: '1978-07-16T00:00:00.000Z',
  countryCode: 'CO',
  gender: 1,
  requestDate: '2025-12-17T23:29:59.200Z',
  performerId: 2,
  studioId: 2,
  identificationNumber: '79999378',
  identificationType: 'CE',
  statusCardFrontFile: 2,
  statusCardBackFile: 2,
  statusCardFrontFaceFile: 2,
  statusCardBackFaceFile: 2,
  statusProfileImageFile: 2,
  sign: 'https://example.com/sign.png',
  requestDocuments: [
    {
      id: 7,
      requestPerformerId: 2,
      fileName: 'https://example.com/doc1.png',
      documentType: 1,
      documentName: 'Front',
      loadDate: new Date().toISOString(),
    },
    {
      id: 8,
      requestPerformerId: 2,
      fileName: 'https://example.com/doc2.png',
      documentType: 2,
      documentName: 'Back',
      loadDate: new Date().toISOString(),
    },
    {
      id: 9,
      requestPerformerId: 2,
      fileName: 'https://example.com/doc3.png',
      documentType: 3,
      documentName: 'FrontFace',
      loadDate: new Date().toISOString(),
    },
    {
      id: 10,
      requestPerformerId: 2,
      fileName: 'https://example.com/doc4.png',
      documentType: 4,
      documentName: 'BackFace',
      loadDate: new Date().toISOString(),
    },
    {
      id: 11,
      requestPerformerId: 2,
      fileName: 'https://example.com/doc5.png',
      documentType: 5,
      documentName: 'ProfileImage',
      loadDate: new Date().toISOString(),
    },
    {
      id: 12,
      requestPerformerId: 2,
      fileName: 'https://example.com/contract.png',
      documentType: 6,
      documentName: 'Contract',
      loadDate: new Date().toISOString(),
    },
  ],
  contractAcceptedByPerformer: true,
} as unknown as OnboardingData;

describe('OnboardingModal', () => {
  afterEach(() => vi.resetAllMocks());

  it('renders loading and then displays documents, signature and details', async () => {
    (onboardingService.getOnboardingData as unknown as Mock).mockResolvedValueOnce(sample);
    (onboardingService.decideOnboarding as unknown as Mock).mockResolvedValueOnce({
      ...sample,
      status: 3,
    } as unknown as OnboardingData);

    render(<OnboardingModal performerId={2} onClose={vi.fn()} />);

    expect(screen.getByText(/Cargando documentos/i)).toBeInTheDocument();

    await waitFor(() => expect(screen.getByText(/Documentos/i)).toBeInTheDocument());

    // Check documents are rendered (should show 5 images of types 1..5)
    expect(screen.getByText('Front')).toBeInTheDocument();
    expect(screen.getByText('Back')).toBeInTheDocument();
    expect(screen.getByText('FrontFace')).toBeInTheDocument();
    expect(screen.getByText('BackFace')).toBeInTheDocument();
    expect(screen.getByText('ProfileImage')).toBeInTheDocument();

    // Signature should be visible
    expect(screen.getByAltText('Firma')).toBeInTheDocument();

    // Details should be visible
    expect(screen.getAllByText('Luis Gabriel Corredor Combita').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/luis.corredor@macrodatum.com/)).toBeInTheDocument();
  });

  it('opens preview modal when clicking a document', async () => {
    (onboardingService.getOnboardingData as unknown as Mock).mockResolvedValueOnce(sample);

    render(<OnboardingModal performerId={2} onClose={vi.fn()} />);

    await waitFor(() => expect(screen.getByText('Front')).toBeInTheDocument());

    const img = screen.getByAltText('Front');
    expect(img).toBeInTheDocument();

    fireEvent.click(img);

    // AssetPreviewModal should open and display close button with aria-label
    await waitFor(() => expect(screen.getByLabelText('Cerrar preview')).toBeInTheDocument());
  });

  it('approve flow shows confirm and sets approval state', async () => {
    (onboardingService.getOnboardingData as unknown as Mock).mockResolvedValueOnce(sample);
    (onboardingService.decideOnboarding as unknown as Mock).mockResolvedValueOnce({
      ...sample,
      status: 2,
    } as unknown as OnboardingData);

    render(<OnboardingModal performerId={2} onClose={vi.fn()} />);

    await waitFor(() => expect(screen.getByText(/Aprobar inscripción/i)).toBeInTheDocument());

    const approveBtn = screen.getByRole('button', { name: /Aprobar inscripción/i });
    fireEvent.click(approveBtn);

    // Confirm modal should appear
    await waitFor(() => expect(screen.getByText(/Confirmar aprobación/i)).toBeInTheDocument());

    // Click approve in confirm (exact button)
    fireEvent.click(screen.getByRole('button', { name: /^Aprobar$/ }));

    // After action, header should show approval message
    await waitFor(() => expect(screen.getByText(/Inscripción aprobada/i)).toBeInTheDocument());
  });

  it('reject flow opens textarea and sets rejected state', async () => {
    (onboardingService.getOnboardingData as unknown as Mock).mockResolvedValueOnce(sample);
    (onboardingService.decideOnboarding as unknown as Mock).mockResolvedValueOnce({
      ...sample,
      status: 3,
    } as unknown as OnboardingData);

    render(<OnboardingModal performerId={2} onClose={vi.fn()} />);

    await waitFor(() => expect(screen.getByText(/Rechazar inscripción/i)).toBeInTheDocument());

    const rejectBtn = screen.getByRole('button', { name: /Rechazar inscripción/i });
    fireEvent.click(rejectBtn);

    await waitFor(() =>
      expect(screen.getByText(/Indica la causa del rechazo/i)).toBeInTheDocument()
    );

    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: 'Documento ilegible' } });

    fireEvent.click(screen.getByText(/Confirmar rechazo/i));

    await waitFor(() => expect(screen.getByText(/Inscripción rechazada/i)).toBeInTheDocument());
  });

  it('returns null when no performerId passed', () => {
    const { container } = render(<OnboardingModal performerId={null} onClose={vi.fn()} />);
    expect(container.firstChild).toBeNull();
  });
});
