import React, { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import VerifiedIcon from '@mui/icons-material/Verified';
import GetAppIcon from '@mui/icons-material/GetApp';
import ErrorAlertXML from '../components/XML/XMLErrorAlert';
import ErrorAlertXSD from '../components/XSD/XSDErrorAlert';
import XMLContainer from '../components/XML/XMLConatiner';
import XSDContainer from '../components/XSD/XSDContainer';
import ButtonAppBar from '../components/ButtonAppBar';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import ErrorTextField from '../components/ErrorTextfield';
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
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const [validationErrors, setValidationErrors] = useState([]);
  const [isValidationSuccess, setIsValidationSuccess] = useState(null);

  useEffect(() => {
    document.title = 'XML Validator';
  }, []);

  const handleFileSelectXML = () => xmlFileInputRef.current.click();

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

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

  const handleTextChangeXML = (e) => setInputXMLText(e.target.value);
  const handleTextChangeXSD = (e) => setInputXSDText(e.target.value);

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

  const handleValidateWithoutXSD = () => {
    const parser = new DOMParser();
    let isValid = true;
    let errors = [];
  
    try {
      const xmlDoc = parser.parseFromString(inputXMLText, 'application/xml');
  
      if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
        isValid = false;
        const parserErrors = xmlDoc.getElementsByTagName('parsererror')[0];
        const errorMessage = parserErrors.textContent.trim();
  
        const containsFirstErrorMessage = errorMessage.includes("Below is a rendering of the page up to the first error.");
        const containsSecondErrorMessage = errorMessage.includes("This page contains the following errors:");
  
        if (containsFirstErrorMessage && containsSecondErrorMessage) {
          errors.push(errorMessage.replace("Below is a rendering of the page up to the first error.", "").replace("This page contains the following errors:", "").trim());
        } else {
          errors.push(errorMessage);
        }
      }
    } catch (error) {
      isValid = false;
      errors.push(t('xml_validator_view_validation_error'));
      console.error('Validation error:', error);
    }
  
    setIsValidationSuccess(isValid);
    setValidationErrors(errors);
  
    if (isValid) {
      setSnackbarOpen(true);
    }
  };
  

  const handleDownloadXML = () => {
    const blob = new Blob([inputXMLText], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'validated_file.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setSnackbarOpen(false);
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
    <Grid container spacing={3} className="Body" onDragOver={handleDragOver}>
      <Grid item xs={12}>
        <ButtonAppBar title="XML Validator View" />
      </Grid>
      <Grid item xs={6}>
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
        <Button
          className="ValidateButton"
          variant="contained"
          style={{ marginTop: '20px', textTransform: 'none', width: '180px', marginLeft: '70px' }}
        >
          <VerifiedIcon style={{ marginRight: '10px' }} /> {t('xml_validator_view_validate')}
        </Button>
        <Button
          className="ValidateButton"
          onClick={handleValidateWithoutXSD}
          variant="contained"
          style={{ marginTop: '20px', textTransform: 'none', width: '220px', marginLeft: '20px' }}
        >
          <VerifiedIcon style={{ marginRight: '10px' }} /> {t('xml_validator_view_validate_without_xsd')}
        </Button>
          <ErrorTextField errors={validationErrors} onClose={handleSnackbarClose} />
        {isValidationSuccess && (
  <Snackbar
    open={snackbarOpen}
    onClose={handleSnackbarClose}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'left',
    }}
  >
    <Paper elevation={3} style={{ border: '2px solid #008000', width: '226px', borderRadius: '5px', marginLeft: '44px' }}>
      <Typography style={{ color: '#008000', display: 'flex', alignItems: 'center', marginLeft: '12px' }}>
        {t('xml_validator_view_validation_success')}
        <IconButton
          color="inherit"
          onClick={handleDownloadXML}
          edge="end"
          style={{ marginLeft: '10px' }}
        >
          <GetAppIcon />
        </IconButton>
      </Typography>
    </Paper>
  </Snackbar>
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