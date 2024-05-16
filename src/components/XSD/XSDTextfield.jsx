import React from 'react';
import Tooltip from '@mui/material/Tooltip';
import Grid from '@mui/material/Grid';
import { useTranslation } from 'react-i18next';

function XSDTextInput({ value, onChange, rows }) {
  const { t } = useTranslation();

  return (
    <Grid container>
      <Grid item xs={12}>
        <Tooltip title={value.trim() === '' ? t('xml_validator_view_insert_xsd_file') : ''} arrow placement="top">
          <textarea
            className="XSDInputField"
            value={value}
            onChange={onChange}
            rows={rows}
            readOnly
            style={{
              width: '95%',
              height: '373px',
              marginTop: '-32px',
              padding: '10px',
              border: '2px solid #04809c',
              borderRadius: '5px',
              resize: 'none',
              transition: 'border-color 0.3s ease',
            }}
          />
        </Tooltip>
      </Grid>
    </Grid>
  );
}

export default XSDTextInput