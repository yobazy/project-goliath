import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { Grommet, Box, Button, TextInput, Text, Paragraph } from 'grommet';
import icon from '../../assets/icon.svg';
import './App.css';

const theme = {
  global: {
    font: {
      // family: "Roboto",
      size: '18px',
      height: '20px',
    },
  },
};

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
    <Grommet theme={theme} full>
      <Box align="center" pad="medium">
        <Box align="center">
          <Box id="logo-container" className="Hello">
            <img width="100" alt="icon" src={icon} />
          </Box>
          <Text size="xlarge" weight="bold">
            PROJECT-DESTROY
          </Text>
        </Box>
        <Box className="create-file-container">
          <Box id="soundcloud-folder" className="input-group">
            <Text htmlFor="folderPath">SoundCloud folder location: </Text>
            <TextInput
              id="folderPath"
              type="text"
              value={folderPath || ''}
              placeholder="No folder selected"
              readOnly
            />
            <Button primary label="browse" onClick={handleFolderSelection} />
            <Text>{fileCounter} files detected</Text>
          </Box>
          <Box>
            <Text htmlFor="folderPath">SoundCloud Playlist URL: </Text>
            <TextInput
              id="sc-playlist-url"
              type="text"
              value={scUrl}
              onChange={handleScUrlChange}
              placeholder="enter soundcloud url"
            />
          </Box>
        </Box>
        <Button
          primary
          label="start"
          style={{ width: '10%', height: 48 }}
          // eslint-disable-next-line react/jsx-no-bind
          onClick={handleStart}
        />
        <Box>
          {filenames.map((filename) => (
            <div key={filename}>{filename}</div>
          ))}
        </Box>
        <Box>
          {screenLog.map((log) => (
            <div key={log}>{log}</div>
          ))}
        </Box>
      </Box>
    </Grommet>
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
