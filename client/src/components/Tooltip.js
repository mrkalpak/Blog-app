import React from 'react';
import './Tooltip.css'; // Make sure to include the CSS file

const Tooltip = ({ children, text }) => {
  return (
    <div className="tooltip-container">
      {children}
      <div className="tooltip-text">{text}</div>
    </div>
  );
};

export default Tooltip;
