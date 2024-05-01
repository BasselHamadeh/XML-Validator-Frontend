import React from 'react';
import Tooltip from '@mui/material/Tooltip';
import Grid from '@mui/material/Grid';
import { useTranslation } from 'react-i18next';

function XMLTextInput({ value, onChange, rows }) {
  const { t } = useTranslation();

  return (
    <Grid container>
      <Grid item xs={12}>
        <Tooltip title={value.trim() === '' ? t('xml_validator_view_insert_xml_file') : ''} arrow placement="top">
          <textarea
            className="XMLInputField"
            value={value}
            onChange={onChange}
            rows={rows}
            style={{
              width: '95%',
              height: '452px',
              marginTop: '25px',
              marginLeft: "27px",
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

export default XMLTextInput