import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Grid from '@mui/material/Grid';
import XMLDateiAuswählenButton from './XMLDateiAuswählenButton';
import XMLTextInput from './XMLTextField';
import Heading from '../Heading/HomeHeading';

const XMLContainer = ({
  selectedFileName,
  showInsertButton,
  onFileChange,
  setInputXMLText,
  setSelectedXMLFileName,
  setShowInsertXMLButton,
  inputXMLText,
  onTextChange,
  errorAlertXML,
  onDrop,
}) => {
  const { t } = useTranslation();
  const xmlFileInputRef = useRef(null);

  const handleFileChange = (e) => {
    onFileChange(e);
    const selectedFile = e.target.files[0];

    if (selectedFile && selectedFile.name.endsWith('.xml')) {
      setSelectedXMLFileName(t('xml_validator_view_selected_file', { fileName: selectedFile.name }));
      setShowInsertXMLButton(true);
    } else {
      setShowInsertXMLButton(false);
    }
  };

  const handleInsertXML = () => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const fileContent = event.target.result;
      setInputXMLText(fileContent);
    };

    reader.readAsText(xmlFileInputRef.current.files[0]);
    setSelectedXMLFileName(t('xml_validator_view_selected_file', { fileName: xmlFileInputRef.current.files[0].name }));
    setShowInsertXMLButton(false);
  };

  return (
    <div className="XMLContainer">
      <Heading />
      <div className="XMLDescription">
        <p style={{ marginLeft: '30px', marginBottom: '30px' }}>{t('xml_validator_view_upload_xml_files')}</p>
        <XMLDateiAuswählenButton
          onClick={() => xmlFileInputRef.current.click()}
          selectedFileName={selectedFileName}
          showInsertButton={showInsertButton}
          onInsert={handleInsertXML}
        >
          {t('xml_validator_view_select_file')}
        </XMLDateiAuswählenButton>
        <input
          type="file"
          ref={xmlFileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
          accept=".xml"
        />
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12}>
            <div className="XMLInputContainer" onDrop={(e) => onDrop(e, 'xml', 'XMLInputContainer')}>
              <XMLTextInput value={inputXMLText} onChange={onTextChange} rows={4} />
            </div>
            <div className="XMLErrorAlertContainer">{errorAlertXML}</div>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default XMLContainer