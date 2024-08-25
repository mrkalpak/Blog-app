import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import the styles

const RichTextEditor = ({ value, onChange }) => {
  const handleChange = (content) => {
    onChange(content);
  };

  return (
    <div>
      <ReactQuill value={value} onChange={handleChange} />
    </div>
  );
};

export default RichTextEditor;
