import React from 'react';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { useTranslation } from 'react-i18next';

const XSDDateiAuswählenButton = ({ onClick, selectedFileName, showInsertButton, onInsert }) => {
  const { t } = useTranslation();

  return (
    <Grid container spacing={2}>
      <Grid item>
        <Button
          onClick={onClick}
          variant="outlined"
          style={{ textTransform: 'none', marginTop: '-7px' }}
        >
          {t('xml_validator_view_select_file')}
        </Button>
      </Grid>
      <Grid item>
        <div>{t(selectedFileName)}</div>
      </Grid>
      {showInsertButton && (
        <Grid item>
          <Button
            onClick={onInsert}
            variant="outlined"
            style={{ textTransform: 'none', marginTop: '-7px' }}
          >
            {t('xml_validator_view_insert_xsd')}
          </Button>
        </Grid>
      )}
    </Grid>
  );
};

export default XSDDateiAuswählenButton