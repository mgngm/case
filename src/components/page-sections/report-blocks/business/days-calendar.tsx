const DaysCalendar = ({
  avgDaysLost,
  primaryColor = '#53387E',
  secondaryColor = '#3F2871',
}: {
  avgDaysLost: number;
  primaryColor?: string;
  secondaryColor?: string;
}) => {
  const days = Math.floor(avgDaysLost);
  const daysMax = Math.ceil(avgDaysLost);
  const daysFractional = avgDaysLost - days;

  const fill = (i: number) => {
    if (i < days) {
      return 'white';
    }

    if (i === daysMax - 1) {
      return 'url(#grad1)';
    }

    return secondaryColor;
  };

  const generateRects = () => {
    const init = { x: 7, y: 25 };

    return [...Array(23)].map((el, i) => {
      const col = i % 5;
      const row = Math.floor(i / 5);

      return <rect key={i} x={col * 12 + init.x} y={25 + row * 12} width="10" height="10" fill={fill(i)} />;
    });
  };

  return (
    <svg viewBox="0 0 96 97">
      {generateRects()}

      {/* weekends */}
      <rect x="67" y="25" width="10" height="10" fill={secondaryColor} />
      <rect x="67" y="37" width="10" height="10" fill={secondaryColor} />
      <rect x="67" y="49" width="10" height="10" fill={secondaryColor} />
      <rect x="67" y="61" width="10" height="10" fill={secondaryColor} />
      <rect x="79" y="25" width="10" height="10" fill={secondaryColor} />
      <rect x="79" y="61" width="10" height="10" fill={secondaryColor} />
      <rect x="79" y="37" width="10" height="10" fill={secondaryColor} />
      <rect x="79" y="49" width="10" height="10" fill={secondaryColor} />
      <path
        d="M0 0V-15H-1V0H0ZM96 0H97V-15H96V0ZM96 96.669V97.669H97V96.669H96ZM0 96.669H-1V97.669H0V96.669ZM0 15H96V-15H0V15ZM95 0V96.669H97V0H95ZM96 95.669H0V97.669H96V95.669ZM1 96.669V0H-1V96.669H1Z"
        mask="url(#path-1-inside-1_1004_5013)"
        fill={primaryColor}
      />
      <defs>
        <linearGradient id="grad1" x2="1" y2="1">
          <stop offset={daysFractional} stopColor="white" />
          <stop offset={daysFractional} stopColor={secondaryColor} />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default DaysCalendar;
