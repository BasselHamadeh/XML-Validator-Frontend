import React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTranslation } from 'react-i18next';

function CustomAccordion() {
  const { t } = useTranslation();

  return (
    <div>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography style={{ color: '#04809c', fontWeight: 'bold' }}>{t('xml_validator_what_is_xml')}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            {t('xml_validator_xml_description')}
          </Typography>
        </AccordionDetails>
      </Accordion>
      <div style={{ marginBottom: '20px' }}></div>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography style={{ fontWeight: 'bold', color: '#04809c' }}>{t('xml_validator_what_is_xsd')}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography style={{ marginBottom: '10px' }}>
            {t('xml_validator_xsd_description')} 
          </Typography>
        </AccordionDetails>
      </Accordion>
      <div style={{ marginBottom: '20px' }}></div>
    </div>
  );
}

export default CustomAccordion