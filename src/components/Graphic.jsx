import './Graphic.css';
import Plot from 'react-plotly.js';
import PropTypes from 'prop-types';

const Graphic = ({ xValues, oilValues, waterValues }) => {
  const oilTrace = {
    x: xValues,
    y: oilValues,
    type: 'scatter',
    mode: 'lines+markers',
    marker: { color: '#ffcc33' },
    line: { color: '#ffcc33' },
    name: 'Oil',
  };

  const waterTrace = {
    x: xValues,
    y: waterValues,
    type: 'scatter',
    mode: 'lines+markers',
    marker: { color: '#4682b4' },
    line: { color: '#4682b4' },
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
      useResizeHandler={true}
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
