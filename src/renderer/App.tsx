import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useState, useEffect } from 'react'; // Import useState hook
import icon from '../../assets/icon.svg';
import './App.css';

function Hello() {
  const [folderPath, setFolderPath] = useState(""); // State to hold the selected folder
  const [filenames, setFilenames] = useState([]); // Add this line to store filenames
  const [fileCounter, setFileCounter] = useState(0);
  const [scUrl, setScUrl] = useState("");
  const [screenLog, setScreenLog] = useState([]);


  useEffect(() => {
    console.log('Folder path updated:', folderPath);
  }, [folderPath]);

  // Function to handle folder selection
  const handleFolderSelection = async () => {
    const result = await window.electron.selectDirectory();
    if (result.length > 0) {
      const filenames = await window.electron.getFilenames(result[0]);
      setFolderPath(result[0]);
      setFileCounter(filenames.length);
    }
  };

  const handleScUrlChange = (event) => {
    setScUrl(event.target.value);
  };

  async function handleStart() {
    setScreenLog([]);
    if (!folderPath) {
      console.log('No folder selected');
      setScreenLog([...screenLog, 'No folder selected']);
      return;
    }
    if (!scUrl) {
      console.log('No SoundCloud URL provided');
      setScreenLog([...screenLog, 'No SoundCloud URL provided']);
      return;
    }
    const filenames = await window.electron.getFilenames(folderPath); // Assuming getFilenames is correctly implemented in your preload and main process
    setFilenames(filenames); // Update state with filenames
    console.log(scUrl, folderPath);
    const playlistResult = await window.electron.downloadPlaylist(scUrl, folderPath);
    console.log('playlist downloaded');
    setScreenLog([...screenLog, `success ${playlistResult.downloadCounter} files downloaded / ${playlistResult.skipCounter} skipped`]);

  };


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
          <label>{fileCounter} files detected</label>
        </div>
        <div>
        <label htmlFor="folderPath">SoundCloud Playlist URL: </label>
        <input
          id="sc-playlist-url"
          type="text"
          value={scUrl}
          onChange={handleScUrlChange}
          placeholder="enter soundcloud url"
          // readOnly
        />
        </div>
      </div>
      <button onClick={handleStart}>Start</button>
      <div>
      {filenames.map((filename) => (
        <div key={filename}>{filename}</div>
      ))}
      </div>
      <div>
      {screenLog.map((log) => (
        <div key={log}>{log}</div>
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
