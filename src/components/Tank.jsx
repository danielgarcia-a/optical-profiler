/**
 * Tank.jsx
 *
 * Visual representation of a tank showing oil and water fill levels
 * as colored layers, along with a dashed operational capacity line
 * and a label panel displaying percentages for each substance.
 */

import PropTypes from 'prop-types';
import './Tank.css';

// Clamps a value to the [0, 100] range. Returns 0 for non-finite values.
const clampPercent = (v) => Math.max(0, Math.min(100, Number.isFinite(v) ? v : 0));

/**
 * @param {number[]} levels - [oil%, water%] as percentages of tank height.
 * @param {number} operationalCapacity - Operational capacity in the same unit as totalHeight.
 * @param {number} totalHeight - Total physical height of the tank.
 */
const Tank = ({
  levels = [0, 0],
  operationalCapacity = null,
  totalHeight = null
}) => {
  const oil = clampPercent(levels[0] ?? 0);
  const water = clampPercent(levels[1] ?? 0);
  const filled = Math.min(100, oil + water);
  const empty = Math.max(0, 100 - filled);

  // Operational line position as percentage of tank height
  const operationalLinePercent =
    operationalCapacity != null && totalHeight
      ? clampPercent((operationalCapacity / totalHeight) * 100)
      : null;

  return (
    <div className="tank-wrapper">
      <div className="tank-container">
        {/* Fluid layers rendered from bottom: oil → water */}
        <div className="layer oil" style={{ height: `${oil}%` }} />
        <div className="layer water" style={{ height: `${water}%` }} />

        {/* Dashed line indicating operational capacity */}
        {operationalLinePercent !== null && (
          <div
            className="operational-line"
            style={{ bottom: `${operationalLinePercent}%` }}
          />
        )}
      </div>

      {/* Label panel */}
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
  levels: PropTypes.arrayOf(PropTypes.number).isRequired,
  operationalCapacity: PropTypes.number.isRequired,
  totalHeight: PropTypes.number.isRequired,
};

export default Tank;