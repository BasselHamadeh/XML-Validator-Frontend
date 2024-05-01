import React from 'react';
import { useTranslation } from 'react-i18next';

const Heading = () => {
  const { t } = useTranslation();

  return (
    <div style={{ textAlign: 'left',
                  color: '#04809c',
                  textIndent: '20px',
                  marginTop: '-4px',
                  marginBottom: '4px' }}>
      <h1>{t("xml_validator_user_heading")}</h1>
    </div>
  );
};

export default Heading