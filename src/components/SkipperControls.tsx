import React from 'react';

interface SkipperControlsProps {
  status: string;
  skipping: boolean;
  skippingCompleted: boolean;
  onSkip: () => void;
}

const SkipperControls: React.FC<SkipperControlsProps> = ({
  status,
  skipping,
  skippingCompleted,
  onSkip,
}) => {
  return (
    <div id="skipperControls">
      <h2>Run ReSkipper</h2>
      <div id="statusContainer">
        <p>Skipping status updates:</p>
        <div id="status">{status}</div>
        <button id="skipButton" onClick={onSkip} disabled={skipping}>
          {skippingCompleted
            ? 'Reload page'
            : skipping
            ? 'Skip-tracing...'
            : 'Skiptrace'}
        </button>
      </div>
    </div>
  );
};

export default SkipperControls;
