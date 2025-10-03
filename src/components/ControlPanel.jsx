import React from 'react';

const ControlPanel = ({ 
  transistorType, 
  setTransistorType, 
  transistorData,
  vceConstant,
  setVceConstant,
  ibConstant,
  setIbConstant,
  vceTransfer,
  setVceTransfer,
  runInputCharacteristics,
  runOutputCharacteristics,
  runTransferCharacteristics
}) => {
  // Physics-themed colors for transistor types
  const electronColor = '#4361ee'; // NPN
  const protonColor = '#ef476f';   // PNP
  
  const currentTransistor = transistorData[transistorType];

  return (
    <section className="control-panel">
      <div className="card">
        <div className="card__header">
          <h2>Input Module</h2>
        </div>
        <div className="card__body">
          <div className="control-row">
            <div className="form-group">
              <label className="form-label" htmlFor="transistor-select">Select Transistor:</label>
              <select 
                id="transistor-select" 
                className="form-control"
                value={transistorType}
                onChange={(e) => setTransistorType(e.target.value)}
              >
                <option value="SL100">SL100</option>
                <option value="BC107">BC107</option>
              </select>
            </div>
            <div className="transistor-specs">
              <h4>Specifications:</h4>
              <div className="specs-grid">
                <span>Type: <span style={{color: currentTransistor.type === 'NPN' ? electronColor : protonColor}}>{currentTransistor.type}</span></span>
                <span>Package: <span>{currentTransistor.package}</span></span>
                <span>β: <span>{currentTransistor.beta}</span></span>
                <span>VCEO: <span>{currentTransistor.VCEO}V</span></span>
              </div>
            </div>
          </div>

          <div className="measurement-controls">
            <div className="measurement-group">
              <h3>Input Characteristics</h3>
              <div className="control-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="vce-constant">VCE (constant):</label>
                  <input 
                    type="number" 
                    id="vce-constant" 
                    className="form-control" 
                    value={vceConstant}
                    onChange={(e) => setVceConstant(parseFloat(e.target.value))}
                    min="0" 
                    max="20" 
                    step="0.1"
                  />
                  <span className="unit">V</span>
                </div>
                <button 
                  className="btn btn--primary" 
                  onClick={runInputCharacteristics}
                >
                  Run Input Characteristics
                </button>
              </div>
            </div>

            <div className="measurement-group">
              <h3>Output Characteristics</h3>
              <div className="control-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="ib-constant">IB (constant):</label>
                  <input 
                    type="number" 
                    id="ib-constant" 
                    className="form-control" 
                    value={ibConstant}
                    onChange={(e) => setIbConstant(parseFloat(e.target.value))}
                    min="0" 
                    max="200" 
                    step="10"
                  />
                  <span className="unit">μA</span>
                </div>
                <button 
                  className="btn btn--primary" 
                  onClick={runOutputCharacteristics}
                >
                  Run Output Characteristics
                </button>
              </div>
            </div>

            <div className="measurement-group">
              <h3>Transfer Characteristics</h3>
              <div className="control-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="vce-transfer">VCE (constant):</label>
                  <input 
                    type="number" 
                    id="vce-transfer" 
                    className="form-control" 
                    value={vceTransfer}
                    onChange={(e) => setVceTransfer(parseFloat(e.target.value))}
                    min="0" 
                    max="20" 
                    step="0.1"
                  />
                  <span className="unit">V</span>
                </div>
                <button 
                  className="btn btn--primary" 
                  onClick={runTransferCharacteristics}
                >
                  Run Transfer Characteristics
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ControlPanel;