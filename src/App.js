import React, { useRef, useState } from 'react';
import './App.css';

function App() {
  const fileInputRef = useRef(null);
  const [selectedFileName, setSelectedFileName] = useState('Keine ausgewählte Datei');
  const [showInsertButton, setShowInsertButton] = useState(false);
  const [inputText, setInputText] = useState('');

  const handleFileSelect = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile && selectedFile.name.endsWith('.xml')) {
      setSelectedFileName(selectedFile.name);
      setShowInsertButton(true);
      console.log(`Ausgewählte XML-Datei: ${selectedFile.name}`);
    } else {
      setSelectedFileName('Keine ausgewählte Datei');
      setShowInsertButton(false);
      console.log('Ungültige Datei ausgewählt. Bitte wählen Sie eine XML-Datei aus.');
    }
  };

  const handleInsert = () => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const fileContent = event.target.result;
      setInputText(fileContent);
    };

    reader.readAsText(fileInputRef.current.files[0]);
  };

  const handleTextChange = (e) => {
    setInputText(e.target.value);
  };

  const handleClear = () => {
    setInputText('');
  };

  const handleValidate = () => {
    console.log('Validierung ausführen...');
  };

  return (
    <div className="App">
      <div className="Heading">
        <h1>XML Validator</h1>
      </div>
      <div className="Description">
        <p>Laden Sie XML-Dateien hoch und führen Sie Validierungen durch.</p>
        <div className="ButtonContainer">
          <div>
            <button onClick={handleFileSelect}>Datei auswählen</button>
          </div>
          <div>{selectedFileName}</div>
          {showInsertButton && (
            <>
              <button className="InsertButton" onClick={handleInsert}>
                Einfügen
              </button>
            </>
          )}
        </div>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
          accept=".xml"
        />
        <div className="InputContainer">
          <textarea
            className="InputField"
            value={inputText}
            onChange={handleTextChange}
            rows={4}
          />
          <div className="ButtonGrid">
            <button className="ClearButton" onClick={handleClear}>
              Leeren
            </button>
          </div>
          <button className="ValidateButton" onClick={handleValidate}>
            Validieren
          </button>
        </div>
      </div>
    </div>
  );
}

export default App