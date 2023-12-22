import React from 'react';

const XMLDateiAuswählenButton = ({ onClick, selectedFileName, showInsertButton, onInsert }) => {
  return (
    <div className="ButtonContainer">
      <div>
        <button onClick={onClick}>Datei auswählen</button>
      </div>
      <div>{selectedFileName}</div>
      {showInsertButton && (
        <>
          <button className="InsertButton" onClick={onInsert}>
            Einfügen
          </button>
        </>
      )}
    </div>
  );
};

export default XMLDateiAuswählenButton