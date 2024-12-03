import React from 'react';
import PropTypes from 'prop-types';
import './LoadingOverlay.css';

export const LoadingOverlay = ({ isLoading }) => {
  if (!isLoading) return null
  return (
    <div className="loading-overlay">
      <div className="loading-spinner"></div>
    </div>
  )
}

LoadingOverlay.propTypes = {
  isLoading: PropTypes.bool.isRequired,
};
