import React from 'react';
import ImageUploader from './components/ImageUploader/Uploader';
import './App.css'

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <ImageUploader />
    </div>
  );
};

export default App;