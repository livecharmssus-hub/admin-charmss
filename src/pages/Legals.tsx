import React, { useEffect, useState } from 'react';
import LegalService from '../app/services/legal.service';
import type { LegalDocument } from '../app/types/legal.types';
import LegalCard from '../components/legal/LegalCard';
import LegalModal from '../components/legal/LegalModal';
import LegalFormModal from '../components/legal/LegalFormModal';

export default function Legals() {
  const [legals, setLegals] = useState<LegalDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewName, setViewName] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editDoc, setEditDoc] = useState<LegalDocument | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const resp = await LegalService.getLegals();
        if (mounted) setLegals(resp);
      } catch (err) {
        console.error(err);
        if (mounted) setError('No se pudo cargar los documentos');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const handleDelete = async (id: number) => {
    const ok = window.confirm('¿Borrar documento?');
    if (!ok) return;
    try {
      await LegalService.deleteLegal(id);
      setLegals((s) => s.filter((d) => d.id !== id));
    } catch (err) {
      console.error(err);
      alert('Error al borrar');
    }
  };

  const handleSaved = (doc: LegalDocument) => {
    const exists = legals.find((d) => d.id === doc.id);
    if (exists) {
      setLegals((s) => s.map((d) => (d.id === doc.id ? doc : d)));
    } else {
      setLegals((s) => [doc, ...s]);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Documentos legales</h1>
        <div>
          <button
            data-testid="create-legal"
            className="px-4 py-2 rounded bg-blue-600 text-white text-sm"
            onClick={() => {
              setEditDoc(null);
              setFormOpen(true);
            }}
          >
            Crear documento
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center text-gray-500">Cargando...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : (
        <div className="flex flex-col space-y-4">
          {legals.map((doc) => (
            <LegalCard
              key={doc.id}
              doc={doc}
              onView={(name) => setViewName(name)}
              onEdit={(d) => {
                setEditDoc(d);
                setFormOpen(true);
              }}
              onDelete={(id) => handleDelete(id)}
            />
          ))}
        </div>
      )}

      <LegalModal
        name={viewName ?? ''}
        open={Boolean(viewName)}
        onClose={() => setViewName(null)}
      />

      <LegalFormModal
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditDoc(null);
        }}
        onSaved={handleSaved}
        initial={editDoc}
      />
    </div>
  );
}
