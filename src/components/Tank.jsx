import PropTypes from 'prop-types';
import './Tank.css';

const clampPercent = (v) => Math.max(0, Math.min(100, Number.isFinite(v) ? v : 0));

const Tank = ({
  levels = [0, 0],            // [oil%, water%] as percentages
  operationalCapacity = null, // operational capacity (same unit as totalHeight)
  totalHeight = null          // total tank height
}) => {
  const oil    = clampPercent(levels[0] ?? 0);
  const water  = clampPercent(levels[1] ?? 0);
  const filled = Math.min(100, oil + water);
  const empty  = Math.max(0, 100 - filled);

  // Operational line position as percentage of tank height
  const operationalLinePercent =
    operationalCapacity != null && totalHeight
      ? clampPercent((operationalCapacity / totalHeight) * 100)
      : null;

  return (
    <div className="tank-wrapper">
      <div className="tank-container">
        {/* Physical order from bottom: oil → water */}
        <div className="layer oil"   style={{ height: `${oil}%` }} />
        <div className="layer water" style={{ height: `${water}%` }} />

        {operationalLinePercent !== null && (
          <div
            className="operational-line"
            style={{ bottom: `${operationalLinePercent}%` }}
          />
        )}
      </div>

      <div className="tank-labels">
        <div className="tank-label">
          <span className="color-indicator" style={{ backgroundColor: '#ffcc33' }} />
          Oil: {oil.toFixed(1)}%
        </div>
        <div className="tank-label">
          <span className="color-indicator" style={{ backgroundColor: '#4682b4' }} />
          Water: {water.toFixed(1)}%
        </div>
        <div className="tank-label">
          <span
            className="color-indicator"
            style={{ background: 'linear-gradient(to bottom, rgba(240,240,240,0.6), rgba(220,220,220,0.4))' }}
          />
          Empty: {empty.toFixed(1)}%
        </div>
      </div>
    </div>
  );
};

Tank.propTypes = {
  levels:               PropTypes.arrayOf(PropTypes.number).isRequired,
  operationalCapacity:  PropTypes.number.isRequired,
  totalHeight:          PropTypes.number.isRequired,
};

export default Tank;
