import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const GraphSection = ({ inputData, outputData, transferData }) => {
  // Physics-themed colors for graphs
  const electronColor = '#4361ee';
  const protonColor = '#ef476f';
  const energyColor = '#06d6a0';
  const quantumColor = '#118ab2';
  
  const inputChartRef = useRef(null);
  const outputChartRef = useRef(null);
  const transferChartRef = useRef(null);
  
  const inputChartInstance = useRef(null);
  const outputChartInstance = useRef(null);
  const transferChartInstance = useRef(null);

  // Common chart options with physics theme
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          font: {
            family: 'Inter, sans-serif'
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(200, 200, 200, 0.2)'
        },
        title: {
          display: true,
          font: {
            family: 'Inter, sans-serif'
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(200, 200, 200, 0.2)'
        },
        title: {
          display: true,
          font: {
            family: 'Inter, sans-serif'
          }
        }
      }
    }
  };

  const inputChartConfig = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      title: {
        display: true,
        text: 'Input Characteristics (IB vs VBE)',
        font: {
          family: 'Inter, sans-serif',
          size: 16,
          weight: 'bold'
        },
        color: electronColor
      }
    },
    scales: {
      ...chartOptions.scales,
      x: {
        ...chartOptions.scales.x,
        title: {
          ...chartOptions.scales.x.title,
          text: 'VBE (V)',
          color: electronColor
        }
      },
      y: {
        ...chartOptions.scales.y,
        title: {
          ...chartOptions.scales.y.title,
          text: 'IB (μA)',
          color: electronColor
        }
      }
    }
  };

  const outputChartConfig = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      title: {
        display: true,
        text: 'Output Characteristics (IC vs VCE)',
        font: {
          family: 'Inter, sans-serif',
          size: 16,
          weight: 'bold'
        },
        color: protonColor
      }
    },
    scales: {
      ...chartOptions.scales,
      x: {
        ...chartOptions.scales.x,
        title: {
          ...chartOptions.scales.x.title,
          text: 'VCE (V)',
          color: protonColor
        }
      },
      y: {
        ...chartOptions.scales.y,
        title: {
          ...chartOptions.scales.y.title,
          text: 'IC (mA)',
          color: protonColor
        }
      }
    }
  };

  const transferChartConfig = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      title: {
        display: true,
        text: 'Transfer Characteristics (IC vs IB)',
        font: {
          family: 'Inter, sans-serif',
          size: 16,
          weight: 'bold'
        },
        color: energyColor
      }
    },
    scales: {
      ...chartOptions.scales,
      x: {
        ...chartOptions.scales.x,
        title: {
          ...chartOptions.scales.x.title,
          text: 'IB (μA)',
          color: energyColor
        }
      },
      y: {
        ...chartOptions.scales.y,
        title: {
          ...chartOptions.scales.y.title,
          text: 'IC (mA)',
          color: energyColor
        }
      }
    }
  };
  
  useEffect(() => {
    // Initialize charts
    if (inputChartRef.current) {
      if (inputChartInstance.current) {
        inputChartInstance.current.destroy();
      }
      
      const ctx = inputChartRef.current.getContext('2d');
      inputChartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          datasets: []
        },
        options: inputChartConfig
      });
    }

    if (outputChartRef.current) {
      if (outputChartInstance.current) {
        outputChartInstance.current.destroy();
      }
      
      const ctx = outputChartRef.current.getContext('2d');
      outputChartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          datasets: []
        },
        options: outputChartConfig
      });
    }

    if (transferChartRef.current) {
      if (transferChartInstance.current) {
        transferChartInstance.current.destroy();
      }
      
      const ctx = transferChartRef.current.getContext('2d');
      transferChartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          datasets: []
        },
        options: transferChartConfig
      });
    }

    return () => {
      if (inputChartInstance.current) {
        inputChartInstance.current.destroy();
      }
      if (outputChartInstance.current) {
        outputChartInstance.current.destroy();
      }
      if (transferChartInstance.current) {
        transferChartInstance.current.destroy();
      }
    };
  }, []);

  // Update charts when data changes
  useEffect(() => {
    if (inputData && inputChartInstance.current) {
      inputChartInstance.current.data.datasets = [{
        label: `Input Characteristics (VCE = ${inputData.VCE}V)`,
        data: inputData.data.map(point => ({ x: point.VBE, y: point.IB })),
        borderColor: electronColor,
        backgroundColor: `${electronColor}33`,
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
        tension: 0.4
      }];
      inputChartInstance.current.update();
    }
  }, [inputData]);

  useEffect(() => {
    if (outputData && outputChartInstance.current) {
      inputChartInstance.current.data.datasets = [{
        label: `Output Characteristics (IB = ${outputData.IB}μA)`,
        data: outputData.data.map(point => ({ x: point.VCE, y: point.IC })),
        borderColor: protonColor,
        backgroundColor: `${protonColor}33`,
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
        tension: 0.4
      }];
      outputChartInstance.current.update();
    }
  }, [outputData]);

  useEffect(() => {
    if (transferData && transferChartInstance.current) {
      transferChartInstance.current.data.datasets = [{
        label: `Transfer Characteristics (VCE = ${transferData.VCE}V)`,
        data: transferData.data.map(point => ({ x: point.IB, y: point.IC })),
        borderColor: energyColor,
        backgroundColor: `${energyColor}33`,
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
        tension: 0.4
      }];
      transferChartInstance.current.update();
    }
  }, [transferData]);

  return (
    <section className="graphs-section">
      <div className="graphs-grid">
        <div className="card graph-card">
          <div className="card__header">
            <h3>Input Characteristics (IB vs VBE)</h3>
          </div>
          <div className="card__body">
            <div className="chart-container" style={{ position: 'relative', height: '300px' }}>
              <canvas ref={inputChartRef}></canvas>
            </div>
          </div>
        </div>

        <div className="card graph-card">
          <div className="card__header">
            <h3>Output Characteristics (IC vs VCE)</h3>
          </div>
          <div className="card__body">
            <div className="chart-container" style={{ position: 'relative', height: '300px' }}>
              <canvas ref={outputChartRef}></canvas>
            </div>
          </div>
        </div>

        <div className="card graph-card">
          <div className="card__header">
            <h3>Transfer Characteristics (IC vs IB)</h3>
          </div>
          <div className="card__body">
            <div className="chart-container" style={{ position: 'relative', height: '300px' }}>
              <canvas ref={transferChartRef}></canvas>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GraphSection;