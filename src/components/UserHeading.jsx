import React from 'react';
import { useTranslation } from 'react-i18next';

const Heading = () => {
  const { t } = useTranslation();

  return (
    <div style={{ textAlign: 'left',
                  color: '#04809c',
                  textIndent: '20px',
                  marginTop: '-15px',
                  marginBottom: '-7px' }}>
      <h1>{t("xml_validator_view_view_user")}</h1>
    </div>
  );
};

export default Heading