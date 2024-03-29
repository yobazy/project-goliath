import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useState, useEffect } from 'react'; // Import useState hook
import icon from '../../assets/icon.svg';
import './App.css';

function Hello() {
  const [folderPath, setFolderPath] = useState(""); // State to hold the selected folder

  useEffect(() => {
    console.log('Folder path updated:', folderPath);
  }, [folderPath]);

  // Function to handle folder selection
  const handleFolderSelection = async () => {
    const result = await window.electron.selectDirectory();
    if (result.length > 0) {
      setFolderPath(result[0]);
    }
  };


  return (
    <div>
      <div className="Hello">
        <img width="200" alt="icon" src={icon} />
      </div>
      <h1>PROJECT-DESTROY</h1>

      <div className="create-file-container">
      <div className="input-group">
        <label htmlFor="folderPath">Folder path</label>
        <input
          id="folderPath"
          type="text"
          value={folderPath || ''}
          placeholder="No folder selected"
          readOnly
        />
          <button onClick={handleFolderSelection}>Soundcloud Folder</button>
      </div>
      {/* Additional inputs for file name and file content can be added here */}
    </div>
    <button onClick={handleFolderSelection}>Start</button>

    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
