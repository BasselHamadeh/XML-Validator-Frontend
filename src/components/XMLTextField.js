import React from 'react';

function TextInput({ value, onChange, rows }) {
  return (
    <textarea
      className="InputField"
      value={value}
      onChange={onChange}
      rows={rows}
    />
  );
}

export default TextInput