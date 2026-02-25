interface ClockCircleLinearIconProps extends React.SVGProps<SVGSVGElement> {}

export const ClockCircleLinearIcon = (props: ClockCircleLinearIconProps) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="0.8em"
      role="presentation"
      viewBox="0 0 24 24"
      width="0.8em"
      {...props}
    >
      <g fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" />
        <path
          d="M12 8v4l2.5 2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};
