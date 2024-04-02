import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useState, useEffect } from 'react'; // Import useState hook
import icon from '../../assets/icon.svg';
import './App.css';

function Hello() {
  const [folderPath, setFolderPath] = useState(""); // State to hold the selected folder
  const [filenames, setFilenames] = useState([]); // Add this line to store filenames
  const [fileCounter, setFileCounter] = useState(0);


  useEffect(() => {
    console.log('Folder path updated:', folderPath);
  }, [folderPath]);

  // Function to handle folder selection
  const handleFolderSelection = async () => {
    const result = await window.electron.selectDirectory();
    console.log(result)
    if (result.length > 0) {
      setFolderPath(result[0]);
    }
  };

  async function handleStart() {
    if (!folderPath) {
      console.log('No folder selected');
      return;
    }
    const filenames = await window.electron.getFilenames(folderPath); // Assuming getFilenames is correctly implemented in your preload and main process
    setFilenames(filenames); // Update state with filenames
  }


  return (
    <div>
      <div className="Hello">
        <img width="200" alt="icon" src={icon} />
      </div>
      <h1>PROJECT-DESTROY</h1>

      <div className="create-file-container">
        <div id="soundcloud-folder" className="input-group">
        <label htmlFor="folderPath">SoundCloud folder location: </label>
        <input
          id="folderPath"
          type="text"
          value={folderPath || ''}
          placeholder="No folder selected"
          readOnly
        />
          <button onClick={handleFolderSelection}>Select Folder</button>
          <div>{fileCounter} files detected</div>
        </div>
        {/* <div id="spotify-folder" className="input-group">
        <label htmlFor="folderPath">Spotify folder location: </label>
        <input
          id="folderPath"
          type="text"
          value={folderPath || ''}
          placeholder="No folder selected"
          readOnly
        />
          <button onClick={handleFolderSelection}>Select Folder</button>
        </div> */}
      </div>
      <button onClick={handleStart}>Start</button>
      <div>
      {filenames.map((filename) => (
        <div key={filename}>{filename}</div>
      ))}
      </div>
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
