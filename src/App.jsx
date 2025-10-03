import { useState, useEffect } from 'react'
import './App.css'
import Header from './components/Header'
import ControlPanel from './components/ControlPanel'
import GraphSection from './components/GraphSection'
import ResultsSection from './components/ResultsSection'
import { BJTSimulator } from './utils/BJTSimulator'

function App() {
  const [loading, setLoading] = useState(false);
  const [transistorType, setTransistorType] = useState('SL100');
  const [vceConstant, setVceConstant] = useState(5);
  const [ibConstant, setIbConstant] = useState(50);
  const [vceTransfer, setVceTransfer] = useState(5);
  
  const [inputData, setInputData] = useState(null);
  const [outputData, setOutputData] = useState(null);
  const [transferData, setTransferData] = useState(null);
  const [parameters, setParameters] = useState(null);
  
  const simulator = new BJTSimulator();

  // Reset data when transistor changes
  useEffect(() => {
    setInputData(null);
    setOutputData(null);
    setTransferData(null);
    setParameters(null);
  }, [transistorType]);

  // Calculate parameters when any data changes
  useEffect(() => {
    if (inputData || outputData || transferData) {
      const params = simulator.calculateParameters(
        inputData, 
        outputData, 
        transferData, 
        transistorType
      );
      setParameters(params);
    }
  }, [inputData, outputData, transferData, transistorType]);

  const runInputCharacteristics = () => {
    setLoading(true);
    setTimeout(() => {
      const data = simulator.runInputCharacteristics(vceConstant, transistorType);
      setInputData(data);
      setLoading(false);
    }, 500);
  };

  const runOutputCharacteristics = () => {
    setLoading(true);
    setTimeout(() => {
      const data = simulator.runOutputCharacteristics(ibConstant, transistorType);
      setOutputData(data);
      setLoading(false);
    }, 500);
  };

  const runTransferCharacteristics = () => {
    setLoading(true);
    setTimeout(() => {
      const data = simulator.runTransferCharacteristics(vceTransfer, transistorType);
      setTransferData(data);
      setLoading(false);
    }, 500);
  };

  const exportData = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Add headers
    csvContent += "Measurement Type,X Value,Y Value\n";
    
    // Add input data
    if (inputData && inputData.data) {
      inputData.data.forEach(point => {
        csvContent += `Input (VCE=${inputData.VCE}V),${point.VBE},${point.IB}\n`;
      });
    }
    
    // Add output data
    if (outputData && outputData.data) {
      outputData.data.forEach(point => {
        csvContent += `Output (IB=${outputData.IB}μA),${point.VCE},${point.IC}\n`;
      });
    }
    
    // Add transfer data
    if (transferData && transferData.data) {
      transferData.data.forEach(point => {
        csvContent += `Transfer (VCE=${transferData.VCE}V),${point.IB},${point.IC}\n`;
      });
    }
    
    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `bjt_data_${transistorType}_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    
    // Trigger download
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container">
      <Header />
      
      <ControlPanel 
        transistorType={transistorType}
        setTransistorType={setTransistorType}
        transistorData={simulator.transistorData}
        vceConstant={vceConstant}
        setVceConstant={setVceConstant}
        ibConstant={ibConstant}
        setIbConstant={setIbConstant}
        vceTransfer={vceTransfer}
        setVceTransfer={setVceTransfer}
        runInputCharacteristics={runInputCharacteristics}
        runOutputCharacteristics={runOutputCharacteristics}
        runTransferCharacteristics={runTransferCharacteristics}
      />
      
      <GraphSection 
        inputData={inputData}
        outputData={outputData}
        transferData={transferData}
      />
      
      <ResultsSection 
        parameters={parameters}
        exportData={exportData}
      />
      
    {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <div className="loading-text">Simulating...</div>
        </div>
      )}
    </div>
  )
}

export default App
