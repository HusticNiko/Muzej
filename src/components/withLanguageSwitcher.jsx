import React from 'react';
import LanguageSwitcher from './LanguageSwitcher';

const withLanguageSwitcher = (WrappedComponent, options = {}) => {
  const {
    position = 'top-right',
    variant = 'toggle',
    showInMobile = true
  } = options;

  return function WithLanguageSwitcherComponent(props) {
    const getPositionStyles = () => {
      const baseStyles = {
        position: 'fixed',
        zIndex: 1000,
        padding: '10px'
      };

      switch (position) {
        case 'top-right':
          return { ...baseStyles, top: 0, right: 0 };
        case 'top-left':
          return { ...baseStyles, top: 0, left: 0 };
        case 'bottom-right':
          return { ...baseStyles, bottom: 0, right: 0 };
        case 'bottom-left':
          return { ...baseStyles, bottom: 0, left: 0 };
        default:
          return { ...baseStyles, top: 0, right: 0 };
      }
    };

    return (
      <>
        <div 
          style={getPositionStyles()}
          className={!showInMobile ? 'hidden-mobile' : ''}
        >
          <LanguageSwitcher variant={variant} />
        </div>
        <WrappedComponent {...props} />
      </>
    );
  };
};

export default withLanguageSwitcher;