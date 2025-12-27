import React, { useState } from 'react';
import LegalModal from '../components/legal/LegalModal';

export default function LegalTestPage() {
  const [open, setOpen] = useState(false);
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Prueba LegalModal</h1>
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
      >
        Abrir modal legal
      </button>

      <LegalModal name="Términos y Condiciones" open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
