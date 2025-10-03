// BJT Simulation Logic
export class BJTSimulator {
    constructor() {
        this.transistorData = {
            "SL100": {
                "type": "NPN",
                "package": "TO-39",
                "IS": 1e-14,
                "VT": 0.026,
                "VA": 100,
                "beta": 150,
                "VCEO": 50,
                "VCBO": 60,
                "VEBO": 5,
                "IC_max": 500,
                "VBE_on": 0.65
            },
            "BC107": {
                "type": "NPN", 
                "package": "TO-18",
                "IS": 5e-15,
                "VT": 0.026,
                "VA": 80,
                "beta": 250,
                "VCEO": 45,
                "VCBO": 50,
                "VEBO": 6,
                "IC_max": 100,
                "VBE_on": 0.6
            }
        };
    }

    // BJT Physics Calculations
    calculateCollectorCurrent(VBE, VCE, transistorParams) {
        const { IS, VT, VA } = transistorParams;
        
        if (VBE < 0.1) return 0;
        
        try {
            // Shockley equation with Early effect
            const exponential = Math.exp(VBE / VT);
            const IC = IS * (exponential - 1) * (1 + VCE / VA);
            
            // Limit current to maximum rating and ensure positive
            return Math.max(0, Math.min(IC, transistorParams.IC_max * 1e-3));
        } catch (error) {
            console.warn('Error in calculateCollectorCurrent:', error);
            return 0;
        }
    }

    calculateBaseCurrent(IC, transistorParams) {
        if (IC <= 0) return 0;
        return IC / transistorParams.beta;
    }

    calculateVBE(IB, VCE, transistorParams) {
        const { IS, VT, VA, beta } = transistorParams;
        const IC = IB * beta;
        
        if (IC <= IS || IC <= 0) return 0;
        
        try {
            // Inverse of Shockley equation
            const argument = IC / (IS * (1 + VCE / VA)) + 1;
            return VT * Math.log(Math.max(1, argument));
        } catch (error) {
            console.warn('Error in calculateVBE:', error);
            return 0;
        }
    }

    // Measurement Functions
    runInputCharacteristics(VCE, transistorType) {
        const transistor = this.transistorData[transistorType];
        const data = [];
        
        // Generate VBE range from 0 to 1V in 0.05V steps
        for (let VBE = 0; VBE <= 1; VBE += 0.05) {
            const IC = this.calculateCollectorCurrent(VBE, VCE, transistor);
            const IB = this.calculateBaseCurrent(IC, transistor);
            
            data.push({
                VBE: parseFloat(VBE.toFixed(3)),
                IB: parseFloat((IB * 1e6).toFixed(2)) // Convert to microamps
            });
        }
        
        return { data, VCE };
    }

    runOutputCharacteristics(IB_uA, transistorType) {
        const transistor = this.transistorData[transistorType];
        const IB = IB_uA * 1e-6; // Convert from microamps to amps
        const data = [];
        
        // Generate VCE range from 0 to 20V in 0.5V steps
        for (let VCE = 0; VCE <= 20; VCE += 0.5) {
            // When VCE is 0 or very close to 0, collector current should be 0
            // This is the saturation region behavior
            if (VCE < 0.1) {
                data.push({
                    VCE: parseFloat(VCE.toFixed(2)),
                    IC: 0 // Collector current is 0 at VCE = 0
                });
                continue;
            }
            
            const VBE = this.calculateVBE(IB, VCE, transistor);
            const IC = this.calculateCollectorCurrent(VBE, VCE, transistor);
            
            data.push({
                VCE: parseFloat(VCE.toFixed(2)),
                IC: parseFloat((IC * 1000).toFixed(2)) // Convert to milliamps
            });
        }
        
        return { data, IB: IB_uA };
    }

    runTransferCharacteristics(VCE, transistorType) {
        const transistor = this.transistorData[transistorType];
        const data = [];
        
        // Generate IB range from 0 to 200 microamps in 10 microamp steps
        for (let IB_uA = 0; IB_uA <= 200; IB_uA += 10) {
            const IB = IB_uA * 1e-6; // Convert from microamps to amps
            const VBE = this.calculateVBE(IB, VCE, transistor);
            const IC = this.calculateCollectorCurrent(VBE, VCE, transistor);
            
            data.push({
                IB: parseFloat(IB_uA.toFixed(1)),
                IC: parseFloat((IC * 1000).toFixed(2)) // Convert to milliamps
            });
        }
        
        return { data, VCE };
    }

    calculateParameters(inputData, outputData, transferData, transistorType) {
        const transistor = this.transistorData[transistorType];
        
        // Calculate input impedance (from input characteristics)
        let inputImpedance = 0;
        if (inputData && inputData.data.length > 1) {
            const midPoint = Math.floor(inputData.data.length / 2);
            const vbe1 = inputData.data[midPoint - 1].VBE;
            const vbe2 = inputData.data[midPoint + 1].VBE;
            const ib1 = inputData.data[midPoint - 1].IB * 1e-6; // Convert back to amps
            const ib2 = inputData.data[midPoint + 1].IB * 1e-6;
            
            if (ib2 - ib1 !== 0) {
                inputImpedance = (vbe2 - vbe1) / (ib2 - ib1);
                inputImpedance = inputImpedance / 1000; // Convert to kilohms
            }
        }
        
        // Calculate output impedance (from output characteristics)
        let outputImpedance = 0;
        if (outputData && outputData.data.length > 1) {
            const midPoint = Math.floor(outputData.data.length / 2);
            const vce1 = outputData.data[midPoint - 1].VCE;
            const vce2 = outputData.data[midPoint + 1].VCE;
            const ic1 = outputData.data[midPoint - 1].IC * 1e-3; // Convert back to amps
            const ic2 = outputData.data[midPoint + 1].IC * 1e-3;
            
            if (ic2 - ic1 !== 0) {
                outputImpedance = (vce2 - vce1) / (ic2 - ic1);
                outputImpedance = outputImpedance / 1000; // Convert to kilohms
            }
        }
        
        // Calculate current gain (from transfer characteristics or use beta)
        let currentGain = transistor.beta;
        if (transferData && transferData.data.length > 1) {
            const midPoint = Math.floor(transferData.data.length / 2);
            if (midPoint > 0 && transferData.data[midPoint].IB > 0) {
                currentGain = transferData.data[midPoint].IC / (transferData.data[midPoint].IB * 1e-3);
            }
        }
        
        return {
            inputImpedance: parseFloat(inputImpedance.toFixed(2)),
            outputImpedance: parseFloat(outputImpedance.toFixed(2)),
            currentGain: parseFloat(currentGain.toFixed(1))
        };
    }
}