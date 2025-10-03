import React from 'react';

const ResultsSection = ({ parameters, exportData }) => {
  return (
    <section className="results-section">
      <div className="card">
        <div className="card__header">
          <h2>Output Module - Calculated Parameters</h2>
        </div>
        <div className="card__body">
          <div className="results-grid">
            <div className="result-item">
              <label>Input Impedance (Zin):</label>
              <span>{parameters?.inputImpedance ? `${parameters.inputImpedance} kΩ` : '-- kΩ'}</span>
            </div>
            <div className="result-item">
              <label>Output Impedance (Zo):</label>
              <span>{parameters?.outputImpedance ? `${parameters.outputImpedance} kΩ` : '-- kΩ'}</span>
            </div>
            <div className="result-item">
              <label>Current Gain (β):</label>
              <span>{parameters?.currentGain ? parameters.currentGain : '--'}</span>
            </div>
          </div>
          <div className="export-controls">
            <button className="btn btn--secondary" onClick={exportData}>Export Data as CSV</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResultsSection;