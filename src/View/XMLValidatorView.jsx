import React, { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import VerifiedIcon from '@mui/icons-material/Verified';
import GetAppIcon from '@mui/icons-material/GetApp';
import DeleteIcon from '@mui/icons-material/Delete';
import ErrorAlertXML from '../components/XML/XMLErrorAlert';
import ErrorAlertXSD from '../components/XSD/XSDErrorAlert';
import XMLContainer from '../components/XML/XMLConatiner';
import XSDContainer from '../components/XSD/XSDContainer';
import ButtonAppBar from '../components/ButtonAppBar';
import ErrorTextField from '../components/ErrorTextfield';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
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
  const [setSnackbarOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);
  const [isValidationSuccess, setIsValidationSuccess] = useState(false);
  const [setAlertOpen] = useState(false);

  useEffect(() => {
    document.title = 'XML Validator';
  }, []);

  const handleFileSelectXML = () => xmlFileInputRef.current.click();

  const handleFileChangeXML = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile && selectedFile.name.endsWith('.xml')) {
      setSelectedXMLFileName(t('xml_validator_view_selected_file', { fileName: selectedFile.name }));
      setShowInsertXMLButton(true);
      console.log(t('xml_validator_view_selected_file', { fileName: selectedFile.name }));
    } else {
      setSelectedXMLFileName(t('no_file_selected'));
      setShowInsertXMLButton(false);
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
    setIsValidationSuccess(false);
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
    setIsValidationSuccess(false);
    setValidationErrors([]);
  };
  
  const handleTextChangeXSD = (e) => {
    setInputXSDText(e.target.value);
    setIsValidationSuccess(false);
    setValidationErrors([]);
  };

  const handleClearXML = () => {
    setInputXMLText('');
    setSelectedXMLFileName(t('xml_validator_view_no_file_selected'));
    setShowInsertXMLButton(false);
    setIsValidationSuccess(false);
    setValidationErrors([]);
  };

  const handleClearXSD = () => {
    setInputXSDText('');
    setSelectedXSDFileName(t('xml_validator_view_no_file_selected'));
    setShowInsertXSDButton(false);
    xsdFileInputRef.current.value = '';
    setIsValidationSuccess(false);
    setValidationErrors([]);
  };

  const handleValidateWithXSD = async () => {
    try {
      const response = await fetch('http://localhost:8080/validateWithXSD', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ xmlData: inputXMLText, xsdData: inputXSDText }),
      });
  
      if (response.ok) {
        const result = await response.json();
        console.log('Antwort vom Server:', result);
        setIsValidationSuccess(result.success);
        setSnackbarOpen(true);
        if (result.success) {
          setValidationErrors([]);
        } else if (result.errors && result.errors.length > 0) {
          const firstError = result.errors[0].startsWith(',') ? result.errors[0].substring(1) : result.errors[0];
          setValidationErrors([firstError, ...result.errors.slice(1)].map(error => error ? error.toString().replace(/\n/g, ' ') : 'Unknown Error'));
        }
      } else {
        const errorResponse = await response.json();
        console.error('Fehler beim Validieren:', response.statusText, errorResponse.errors);
  
        setValidationErrors(errorResponse.errors.map(error => error ? error.toString().replace(/\n/g, '\n') : 'Unknown Error'));
  
        console.error('Genauer Fehler:', errorResponse.errors[0]);
        setIsValidationSuccess(false);
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Fehler beim Validieren:', error);
    }
  };

  const handleValidateWithoutXSD = async () => {
    try {
      const response = await fetch('http://localhost:8080/validateWithoutXSD', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ xmlData: inputXMLText }),
      });
  
      if (response.ok) {
        try {
          const result = await response.json();
          console.log('Antwort vom Server:', result);
          setIsValidationSuccess(true);
          setSnackbarOpen(true);
  
          if (result.success) {
            setAlertOpen(true);
            setIsValidationSuccess(true);
          }
        } catch (jsonError) {
          console.error('Fehler beim Parsen der JSON-Antwort:', jsonError);
        }
      } else {
        const errorResponse = await response.json();
        console.error('Fehler beim Validieren:', response.statusText, errorResponse.errors);
  
        setValidationErrors(errorResponse.errors.map(error => error ? error.replace(/\n/g, ' ') : 'Unknown Error'));
  
        console.error('Genauer Fehler:', errorResponse.errors[0]);
      }
    } catch (error) {
      console.error('Fehler beim Validieren:', error);
    }
  }; 
  
  const handleDownloadXML = () => {
    const blob = new Blob([inputXMLText], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = selectedXMLFileName.includes('selected file: ') ? selectedXMLFileName.split('selected file: ')[1] : selectedXMLFileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleDropXML = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleDroppedFile(file, 'xml', 'XMLInputContainer');
    setShowInsertXSDButton(false);
  };

  const handleDropXSD = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleDroppedFile(file, 'xsd', 'XSDInputContainer');
    setShowInsertXSDButton(false);
  };

  const handleSnackbarClose = (reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
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
    setErrorAlertXML(<ErrorAlertXML message={errorMessage} />);

    setTimeout(() => {
      setErrorAlertXML(null);
    }, 5000);
  };

  const displayErrorAlertXSD = (errorMessage) => {
    setErrorAlertXSD(<ErrorAlertXSD message={errorMessage} />);

    setTimeout(() => {
      setErrorAlertXSD(null);
    }, 5000);
  };

  return (
    <Grid container spacing={3} className="Body" style={{ position: 'relative', minHeight: '100vh' }} onDragOver={handleDragOver}>
      <Grid item xs={12}>
        <ButtonAppBar title="XML Validator View" />
      </Grid>
      <Grid item xs={6} style={{ position: 'relative' }}>
        <XMLContainer
          onFileSelect={handleFileSelectXML}
          selectedFileName={selectedXMLFileName}
          showInsertButton={showInsertXMLButton}
          onInsert={handleInsertXML}
          onFileChange={handleFileChangeXML}
          inputXMLText={inputXMLText}
          onTextChange={handleTextChangeXML}
          onClear={handleClearXML}
          onDragOver={handleDragOver}
          onDrop={handleDropXML}
          errorAlertXML={errorAlertXML}
          setInputXMLText={setInputXMLText}
          setSelectedXMLFileName={setSelectedXMLFileName}
          setShowInsertXMLButton={setShowInsertXMLButton}
        />
        <div className="XMLButtonGrid">
          <Button
            className="XMLClearButton"
            onClick={handleClearXML}
            variant="outlined"
            startIcon={<DeleteIcon />}
            style={{ textTransform: 'none', marginLeft: '47px', marginTop: '30px' }}
          >
            {t('xml_validator_view_clear_files')}
          </Button>
        </div>
        <Button
          className="ValidateButton"
          onClick={handleValidateWithXSD}
          variant="contained"
          style={{ marginTop: '20px', textTransform: 'none', width: '180px', marginLeft: '47px' }}
        >
          <VerifiedIcon style={{ marginRight: '10px' }} /> {t('xml_validator_view_validate')}
        </Button>
        <Button
          className="ValidateButton"
          onClick={handleValidateWithoutXSD}
          variant="contained"
          style={{ marginTop: '20px', textTransform: 'none', width: '210px', marginLeft: '20px' }}
        >
          <VerifiedIcon style={{ marginRight: '10px' }} /> {t('xml_validator_view_validate_without_xsd')}
        </Button>
        {isValidationSuccess ? (
          <Tooltip title={t('xml_validator_view_download')} arrow>
            <IconButton
              className="DownloadButton"
              onClick={handleDownloadXML}
              style={{ marginTop: '20px', marginLeft: '20px', color: '#04809c' }}
            >
              <GetAppIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <Grid style={{ position: 'absolute', bottom: -15, left: '104%', transform: 'translateX(-50%)', width: '100%', textAlign: 'center' }}>
            {validationErrors.length > 0 && (
              <ErrorTextField errors={validationErrors} onClose={handleSnackbarClose} />
            )}
          </Grid>
        )}
      </Grid>
      <Grid item xs={6}>
        <XSDContainer
          selectedFileName={selectedXSDFileName}
          showInsertButton={showInsertXSDButton}
          onInsert={handleInsertXSD}
          onFileChange={handleFileChangeXSD}
          inputXSDText={inputXSDText}
          onTextChange={handleTextChangeXSD}
          onClear={handleClearXSD}
          onDrop={handleDropXSD}
          errorAlertXSD={errorAlertXSD}
          setInputXSDText={setInputXSDText}
          setSelectedXSDFileName={setSelectedXSDFileName}
          setShowInsertXSDButton={setShowInsertXSDButton}
        />
      </Grid>
    </Grid>
  );
}

export default XMLValidatorView