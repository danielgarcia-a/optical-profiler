/**
 * Graphic.jsx
 *
 * Renders an interactive line chart displaying oil and water level
 * history over time using Plotly.js.
 *
 * Note: Graphic.css is intentionally empty. All chart styles (colors,
 * lines, markers) are handled internally by Plotly. Container layout
 * is controlled by the .graphic-wrapper class in Home.css.
 */

import './Graphic.css';
import Plot from 'react-plotly.js';
import PropTypes from 'prop-types';

// Chart colors
const COLOR_OIL = '#ffcc33';
const COLOR_WATER = '#4682b4';

/**
 * @param {string[]} xValues - Array of UTC timestamps for the x-axis.
 * @param {number[]} oilValues - Array of oil level readings in cm.
 * @param {number[]} waterValues - Array of water level readings in cm.
 */
const Graphic = ({ xValues, oilValues, waterValues }) => {

  // Oil trace — yellow line
  const oilTrace = {
    x: xValues,
    y: oilValues,
    type: 'scatter',
    mode: 'lines+markers',
    marker: { color: COLOR_OIL },
    line:   { color: COLOR_OIL },
    name: 'Oil',
  };

  // Water trace — blue line
  const waterTrace = {
    x: xValues,
    y: waterValues,
    type: 'scatter',
    mode: 'lines+markers',
    marker: { color: COLOR_WATER },
    line:   { color: COLOR_WATER },
    name: 'Water',
  };

  return (
    <Plot
      data={[oilTrace, waterTrace]}
      layout={{
        autosize: true,
        height: 370,
        xaxis: {
          title: { text: 'Timestamp (UTC)' },
          type: 'date',
        },
        yaxis: {
          title: { text: 'Level (cm)' },
          automargin: true,
        },
        legend: {
          orientation: 'v',
          x: 1,
          xanchor: 'right',
          y: 1,
          yanchor: 'top',
          bgcolor: 'rgba(255,255,255,0.7)',
          bordercolor: '#ccc',
          borderwidth: 1,
        },
        margin: { t: 10, b: 60, l: 60, r: 20 },
      }}
      useResizeHandler={true} // Adapts chart width on window resize
      style={{ width: '100%', height: '100%' }}
      config={{ responsive: true }}
    />
  );
};

Graphic.propTypes = {
  xValues:     PropTypes.arrayOf(PropTypes.string).isRequired,
  oilValues:   PropTypes.arrayOf(PropTypes.number).isRequired,
  waterValues: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default Graphic;
