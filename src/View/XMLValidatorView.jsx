import React, { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import DeleteIcon from '@mui/icons-material/Delete';
import ErrorAlertXML from '../components/XML/XMLErrorAlert';
import ErrorAlertXSD from '../components/XSD/XSDErrorAlert';
import XMLDateiAuswählenButton from '../components/XML/XMLDateiAuswählenButton';
import XMLTextField from '../components/XML/XMLTextField';
import XSDTextInput from '../components/XSD/XSDTextfield';
import XSDDateiAuswählenButton from '../components/XSD/XSDDateiAuswählenButton';
import ButtonAppBar from '../components/ButtonAppBar';
import Dropdown from '../components/XSD/XSDDropdown';
import VerifiedIcon from '@mui/icons-material/Verified';
import Heading from '../components/Heading/HomeHeading';
import '../style.css';

function XMLValidatorView() {
  const xmlFileInputRef = useRef(null);
  const xsdFileInputRef = useRef(null);
  const { t } = useTranslation();
  const [selectedXMLFileName, setSelectedXMLFileName] = useState(t('xml_validator_view_no_file_selected'));
  const [selectedXSDFileName, setSelectedXSDFileName] = useState(t('xml_validator_view_no_file_selected'));
  const [showInsertXMLButton, setShowInsertXMLButton] = useState(false);
  const [showInsertXSDButton, setShowInsertXSDButton] = useState(false);
  const [inputXMLText, setInputXMLText] = useState('');
  const [inputXSDText, setInputXSDText] = useState('');
  const [errorAlertXML, setErrorAlertXML] = useState(null);
  const [errorAlertXSD, setErrorAlertXSD] = useState(null);
  const [isFileAddedByDrop, setIsFileAddedByDrop] = useState(false);

  useEffect(() => {
    document.title = 'XML Validator';
  }, []);

  const handleFileSelectXML = () => {
    xmlFileInputRef.current.click();
  };

  const handleFileSelectXSD = () => {
    xsdFileInputRef.current.click();
  };

  const handleFileChangeXML = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile && selectedFile.name.endsWith('.xml')) {
      setSelectedXMLFileName(t('xml_validator_view_selected_file', { fileName: selectedFile.name }));
      setShowInsertXMLButton(true);
      setIsFileAddedByDrop(false);
      console.log(t('xml_validator_view_selected_file', { fileName: selectedFile.name }));
    } else {
      setSelectedXMLFileName(t('no_file_selected'));
      setShowInsertXMLButton(false);
      setIsFileAddedByDrop(false);
      console.log(t('xml_validator_view_invalid_file'));
    }
  };

  const handleFileChangeXSD = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile && selectedFile.name.endsWith('.xsd')) {
      setSelectedXSDFileName(t('xml_validator_view_selected_file', { fileName: selectedFile.name }));
      setShowInsertXSDButton(true);
      console.log(t('xml_validator_view_selected_file', { fileName: selectedFile.name }));
    } else {
      setSelectedXSDFileName(t('xml_validator_view_no_file_selected'));
      setShowInsertXSDButton(false);
      console.log(t('xml_validator_view_invalid_file'));
    }
  };

  const handleInsertXML = () => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const fileContent = event.target.result;
      setInputXMLText(fileContent);
    };

    reader.readAsText(xmlFileInputRef.current.files[0]);
  };

  const handleInsertXSD = async () => {
    const reader = new FileReader();
  
    reader.onload = async (event) => {
      try {
        const arrayBuffer = await new Response(xsdFileInputRef.current.files[0]).arrayBuffer();
        const text = new TextDecoder().decode(arrayBuffer);
        console.log('XSD Text Content:', text);
        setInputXSDText(text);
      } catch (error) {
        console.error('Error handling XSD file:', error);
      }
    };
  
    try {
      const arrayBuffer = await new Response(xsdFileInputRef.current.files[0]).arrayBuffer();
      reader.readAsArrayBuffer(new Blob([arrayBuffer]));
    } catch (error) {
      console.error('Error fetching XSD content:', error);
    }
  };
  

  const handleTextChangeXML = (e) => {
    setInputXMLText(e.target.value);
  };

  const handleTextChangeXSD = (e) => {
    setInputXSDText(e.target.value);
  };

  const handleClearXML = () => {
    setInputXMLText('');
    setSelectedXMLFileName(t('xml_validator_view_no_file_selected'));
    setShowInsertXMLButton(false);
  };

  const handleClearXSD = () => {
    setInputXSDText('');
    setSelectedXSDFileName(t('xml_validator_view_no_file_selected'));
    setShowInsertXSDButton(false);
    xsdFileInputRef.current.value = '';
  };

  const handleValidate = () => {
    console.log('Validierung ausführen...');
  };

  const handleValidateXSD = () => {
    console.log('Validierung ohne XSD ausführen...');
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDropXML = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    setIsFileAddedByDrop(true);
    handleDroppedFile(file, 'xml', 'XMLInputContainer');
    setShowInsertXSDButton(false);
  };

  const handleDropXSD = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    setIsFileAddedByDrop(true);
    handleDroppedFile(file, 'xsd', 'XSDInputContainer');
    setShowInsertXSDButton(false);
  };

  const handleDroppedFile = (file, fileType, containerId) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const fileContent = event.target.result;

      if (fileType === 'xml') {
        if (!file.name.endsWith('.xml')) {
          displayErrorAlertXML(t('xml_validator_view_drag_drop_xml'));
          return;
        }

        setInputXMLText(fileContent);
        setSelectedXMLFileName(t('xml_validator_view_selected_file', { fileName: file.name }));
        setShowInsertXMLButton(true);
      } else if (fileType === 'xsd') {
        if (!file.name.endsWith('.xsd')) {
          displayErrorAlertXSD(t('xml_validator_view_drag_drop_xsd'));
          return;
        }

        setInputXSDText(fileContent);
        setSelectedXSDFileName(t('xml_validator_view_selected_file', { fileName: file.name }));
        setShowInsertXSDButton(true);
      }
    };

    reader.readAsText(file);

    const dropContainer = document.getElementById(containerId);
    if (dropContainer) {
      dropContainer.style.border = '2px solid green';
      setTimeout(() => {
        dropContainer.style.border = '2px solid black';
      }, 1000);
    }
  };

  const displayErrorAlertXML = (errorMessage) => {
    setErrorAlertXML(
      <ErrorAlertXML message={errorMessage} />
    );

    setTimeout(() => {
      setErrorAlertXML(null);
    }, 5000);
  };

  const displayErrorAlertXSD = (errorMessage) => {
    setErrorAlertXSD(
      <ErrorAlertXSD message={errorMessage} />
    );

    setTimeout(() => {
      setErrorAlertXSD(null);
    }, 5000);
  };

  return (
    <Grid container spacing={3} className="Body" onDragOver={handleDragOver}>
      <Grid item xs={12}>
        <ButtonAppBar title="XML Validator View"/>
      </Grid>
      <Grid item xs={6}>
        <div className="XMLContainer">
          <Heading />
          <div className="XMLDescription">
            <p style={{ marginLeft: '30px', marginBottom: '30px' }}>{t('xml_validator_view_upload_xml_files')}</p>
            <XMLDateiAuswählenButton
              onClick={handleFileSelectXML}
              selectedFileName={selectedXMLFileName}
              showInsertButton={showInsertXMLButton}
              onInsert={handleInsertXML}
            >
              {t('xml_validator_view_select_file')}
            </XMLDateiAuswählenButton>
            <input
              type="file"
              ref={xmlFileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChangeXML}
              accept=".xml"
            />
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12}>
                <div className="XMLInputContainer" onDrop={handleDropXML}>
                  <XMLTextField value={inputXMLText} onChange={handleTextChangeXML} rows={4} />
                </div>
                <div className="XMLErrorAlertContainer">
                  {errorAlertXML}
                </div>
              </Grid>
              <Grid item xs={12}>
                <div className="XMLButtonGrid">
                  <Button
                    className="XMLClearButton"
                    onClick={handleClearXML}
                    variant="outlined"
                    startIcon={<DeleteIcon />}
                    style={{ textTransform: 'none', marginLeft: '30px', marginTop: '10px' }}
                  >
                    {t('xml_validator_view_clear_files')}
                  </Button>
                </div>
              </Grid>
            </Grid>
            <Button
              className="ValidateButton"
              onClick={handleValidate}
              variant="contained"
              style={{ marginTop: '20px', textTransform: 'none', width: '180px', marginLeft: '70px' }}
            >
              <VerifiedIcon style={{ marginRight: '10px' }} /> {t('xml_validator_view_validate')}
            </Button>
            <Button
              className="ValidateButton"
              onClick={handleValidateXSD}
              variant="contained"
              style={{ marginTop: '20px', textTransform: 'none', width: '220px', marginLeft: '20px' }}
            >
              <VerifiedIcon style={{ marginRight: '10px' }} /> {t('xml_validator_view_validatexsd')}
            </Button>
          </div>
        </div>
      </Grid>

      <Grid item xs={6}>
        <div className="XSDContainer">
          <div className="XSDDescription">
            <p style={{ marginBottom: '30px' }}>{t('xml_validator_view_upload_xsd_files')}</p>
            <XSDDateiAuswählenButton
              onClick={handleFileSelectXSD}
              selectedFileName={selectedXSDFileName}
              showInsertButton={showInsertXSDButton}
              onInsert={handleInsertXSD}
            >
              {t('xml_validator_view_select_file')}
            </XSDDateiAuswählenButton>
            <input
              type="file"
              ref={xsdFileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChangeXSD}
              accept=".xsd"
            />
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12}>
                <div className="Dropdown">
                  <Dropdown onSelectXSD={handleInsertXSD} />
                </div>
              </Grid>
              <Grid item xs={12}>
                <div className="XSDInputContainer" onDrop={handleDropXSD}>
                  <XSDTextInput value={inputXSDText} onChange={handleTextChangeXSD} rows={4} disabled={inputXSDText.length > 50} />
                </div>
                <div className="XSDErrorAlertContainer">
                  {errorAlertXSD}
                </div>
              </Grid>
              <Grid item xs={12}>
                <div className="XSDButtonGrid">
                  <Button
                    className="XSDClearButton"
                    onClick={handleClearXSD}
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
      </Grid>
    </Grid>
  );
}

export default XMLValidatorView