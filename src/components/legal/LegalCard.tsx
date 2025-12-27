import React from 'react';
import { motion } from 'framer-motion';
import { Eye, Edit, Trash } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { LegalDocument } from '../../app/types/legal.types';

interface Props {
  doc: LegalDocument;
  onView: (name: string) => void;
  onEdit: (doc: LegalDocument) => void;
  onDelete: (id: number) => void;
}

export default function LegalCard({ doc, onView, onEdit, onDelete }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.18 }}
      className="bg-white dark:bg-slate-800 rounded-xl shadow-md border border-gray-100 dark:border-slate-700 p-4 flex items-start gap-4 w-full"
      data-testid={`legal-card-${doc.id}`}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{doc.name}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">v{doc.version}</p>
          </div>
        </div>

        <div className="mt-2 text-sm text-gray-700 dark:text-gray-300 overflow-y-auto max-h-28 prose prose-slate dark:prose-invert">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{doc.content}</ReactMarkdown>
        </div>

        <div className="mt-3 text-xs text-gray-400">
          {doc.updatedAt ? `Actualizado: ${new Date(doc.updatedAt).toLocaleString()}` : ''}
        </div>
      </div>

      <div className="flex flex-col items-center justify-start gap-2">
        <button
          aria-label="Ver"
          title="Ver"
          onClick={() => onView(doc.name)}
          className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
        >
          <Eye className="h-4 w-4 text-gray-600 dark:text-gray-200" />
        </button>
        <button
          aria-label="Editar"
          title="Editar"
          onClick={() => onEdit(doc)}
          className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
        >
          <Edit className="h-4 w-4 text-gray-600 dark:text-gray-200" />
        </button>
        <button
          aria-label="Borrar"
          title="Borrar"
          onClick={() => onDelete(doc.id)}
          className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
        >
          <Trash className="h-4 w-4 text-red-600" />
        </button>
      </div>
    </motion.div>
  );
}
