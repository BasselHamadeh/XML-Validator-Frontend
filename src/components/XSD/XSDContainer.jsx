import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import DeleteIcon from '@mui/icons-material/Delete';
import XSDDateiAuswählenButton from './XSDDateiAuswählenButton';
import XSDDropdown from './XSDDropdown';
import XSDTextInput from './XSDTextfield';

const XSDContainer = ({
  selectedFileName,
  showInsertButton,
  onInsert,
  onFileChange,
  inputXSDText,
  onTextChange,
  onClear,
  onDrop,
  errorAlertXSD,
  setInputXSDText,
  setSelectedXSDFileName,
  setShowInsertXSDButton,
}) => {
  const { t } = useTranslation();
  const xsdFileInputRef = useRef(null);

  const handleInsertXSD = async () => {
    const reader = new FileReader();

    reader.onload = async (event) => {
      const fileContent = event.target.result;

      // Statt onInsert(fileContent) den Inhalt direkt ins Textfeld einfügen
      setInputXSDText(fileContent);

      setSelectedXSDFileName(t('xml_validator_view_selected_file', { fileName: xsdFileInputRef.current.files[0].name }));
      setShowInsertXSDButton(true);
    };

    try {
      reader.readAsText(xsdFileInputRef.current.files[0]);
    } catch (error) {
      console.error('Error handling XSD file:', error);
    }
  };

  const handleClearXSD = () => {
    setInputXSDText('');
    setSelectedXSDFileName(t('xml_validator_view_no_file_selected'));
    setShowInsertXSDButton(false);

    if (xsdFileInputRef.current) {
      xsdFileInputRef.current.value = null;
    }
  };

  return (
    <div className="XSDContainer">
      <div className="XSDDescription">
        <p style={{ marginBottom: '30px' }}>{t('xml_validator_view_upload_xsd_files')}</p>
        <XSDDateiAuswählenButton
          onClick={() => xsdFileInputRef.current.click()}
          selectedFileName={selectedFileName}
          showInsertButton={showInsertButton}
          onInsert={() => handleInsertXSD()}
        >
          {t('xml_validator_view_select_file')}
        </XSDDateiAuswählenButton>
        <input
          type="file"
          ref={xsdFileInputRef}
          style={{ display: 'none' }}
          onChange={onFileChange}
          accept=".xsd"
        />
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12}>
            <div className="Dropdown">
              <XSDDropdown onSelectXSD={(xsdContent) => setInputXSDText(xsdContent)} />
            </div>
          </Grid>
          <Grid item xs={12}>
            <div className="XSDInputContainer" onDrop={(e) => onDrop(e, 'xsd', 'XSDInputContainer')}>
              <XSDTextInput
                value={inputXSDText}
                onChange={onTextChange}
                rows={4}
                disabled={inputXSDText.length > 50}
              />
            </div>
            <div className="XSDErrorAlertContainer">{errorAlertXSD}</div>
          </Grid>
          <Grid item xs={12}>
            <div className="XSDButtonGrid">
              <Button
                className="XSDClearButton"
                onClick={() => {
                  handleClearXSD();
                  onFileChange({ target: { files: [] } });
                }}
                variant="outlined"
                startIcon={<DeleteIcon />}
                style={{ textTransform: 'none' }}
              >
                {t('xml_validator_view_clear_files')}
              </Button>
            </div>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default XSDContainer