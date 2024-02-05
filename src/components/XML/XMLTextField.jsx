import React, { useState, useEffect, useRef } from 'react';
import Tooltip from '@mui/material/Tooltip';
import Grid from '@mui/material/Grid';
import { useTranslation } from 'react-i18next';

function XMLTextInput({ value, onChange, rows }) {
  const { t } = useTranslation();
  const textAreaRef = useRef(null);
  const lineNumberRef = useRef(null);
  const [lineNumbers, setLineNumbers] = useState([]);

  useEffect(() => {
    const updateLineNumbers = () => {
      const lines = value.split('\n');
      setLineNumbers(lines);
    };

    updateLineNumbers();

    const handleScroll = () => {
      if (textAreaRef.current && lineNumberRef.current) {
        lineNumberRef.current.scrollTop = textAreaRef.current.scrollTop;
      }
    };

    const handleTextAreaScroll = () => {
      if (textAreaRef.current && lineNumberRef.current) {
        lineNumberRef.current.scrollTop = textAreaRef.current.scrollTop;
      }
    };

    const container = textAreaRef.current;

    container.addEventListener('scroll', handleScroll);
    container.addEventListener('scroll', handleTextAreaScroll);

    return () => {
      container.removeEventListener('scroll', handleScroll);
      container.removeEventListener('scroll', handleTextAreaScroll);
    };
  }, [value]);

  const lineHeight = 20;
  const lineNumberContainerHeight = rows * lineHeight;

  return (
    <Grid container style={{ height: `${lineNumberContainerHeight}px`, marginTop: '27px' }}>
      <Grid item xs={2} style={{ overflowY: 'hidden', borderRight: '1px solid #e0e0e0', height: '450px', marginLeft: '-110px' }} ref={lineNumberRef}>
        {lineNumbers.map((line, index) => (
          <div key={index} style={{ textAlign: 'right', padding: '3px 5px', height: `${lineHeight}px`, fontWeight: 'lighter', fontSize: '12px', marginBottom: '-1px', color: '#04809c' }}>
            {line.trim() === '' ? '\u00a0' : index + 1}
          </div>
        ))}
      </Grid>
      <Grid item xs={10}>
        <Tooltip title={value.trim() === '' ? t('xml_validator_view_insert_xml_file') : ''} arrow placement="top">
          <textarea
            ref={textAreaRef}
            value={value}
            onChange={onChange}
            rows={rows}
            style={{
              height: '450px',
              border: '2px solid #04809c',
              borderRadius: '5px',
              resize: 'none',
              fontFamily: 'inherit',
              overflowY: 'scroll',
              fontSize: '16px',
              width: '104%',
              marginLeft: '-18px'
            }}
          />
        </Tooltip>
      </Grid>
    </Grid>
  );
}

export default XMLTextInput