import React from 'react';

/**
 * CardanoLoader - Custom loading animation using Cardano GIF
 * @param {number} size - Size of the loader in pixels (default: 24)
 * @param {string} className - Additional CSS classes
 * @param {object} style - Additional inline styles
 */
const CardanoLoader = ({ size = 24, className = '', style = {} }) => {
  return (
    <img
      src="/cardano-loading.gif"
      alt="Loading..."
      className={className}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        display: 'inline-block',
        ...style
      }}
    />
  );
};

export default CardanoLoader;

