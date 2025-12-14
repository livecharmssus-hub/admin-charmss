import React from 'react';
import { useNavigate } from 'react-router-dom';
import HelpModal from '../components/help/HelpModal';

const Help: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="p-4">
      {/* Render the help modal as a full page view; onClose navigates back */}
      <HelpModal onClose={() => navigate(-1)} />
    </div>
  );
};

export default Help;
