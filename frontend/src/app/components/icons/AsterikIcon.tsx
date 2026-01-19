import React from 'react';

const AsterikIcon = ({
  size = 30,
  color = '#FFFFFF',
  ...props
}): React.ReactElement => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M15 5.9375V24.0625"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.9375 15H24.0625"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.92894 7.92894L22.0711 22.0711"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.92894 22.0711L22.0711 7.92894"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default AsterikIcon;
