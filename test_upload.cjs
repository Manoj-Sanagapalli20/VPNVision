const fs = require('fs');
const path = require('path');

async function testUpload() {
  const fileName = process.argv[2] || 'demo 1.pcapng';
  const filePath = path.join(__dirname, fileName);
  const fileData = fs.readFileSync(filePath);
  
  const formData = new FormData();
  formData.append('pcap', new Blob([fileData]), fileName);
  
  try {
    console.log('Uploading PCAP...');
    const response = await fetch('http://localhost:8000/api/upload', {
      method: 'POST',
      body: formData
    });
    const result = await response.json();
    console.log('Upload response:', result);
    
    if (result.taskId) {
      console.log('Polling status...');
      while (true) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const statusRes = await fetch(`http://localhost:8000/api/analysis/status/${result.taskId}`);
        const status = await statusRes.json();
        
        console.log(`Progress: ${status.progress}% - ${status.currentStep}`);
        
        if (status.error) {
          console.error('Error:', status.error);
          break;
        }
        
        if (status.completed) {
          console.log('\n--- Final Analysis Result ---');
          const finalRes = await fetch('http://localhost:8000/api/analysis/result');
          const finalData = await finalRes.json();
          
          console.log('\n==================================================');
          console.log('DEBUG MODE: VALIDATION TRACE');
          console.log('==================================================');
          
          console.log('PCAP:');
          console.log(finalData.fileName || 'demo 1.pcapng');
          
          console.log('\nPACKETS:');
          const packets = finalData.flows || []; // Note: pcapEngine parses raw packets into 'flows' array which actually represents packet types before grouping
          const totalPkts = packets.length;
          const espPkts = packets.filter(p => p.protocol.includes('ESP')).length;
          const ikePkts = packets.filter(p => p.protocol.includes('ISAKMP')).length;
          const tcpPkts = packets.filter(p => p.protocol.includes('TCP')).length;
          const udpPkts = packets.filter(p => p.protocol.includes('UDP') && !p.protocol.includes('ISAKMP')).length;
          
          console.log(`total = ${totalPkts}`);
          console.log(`ESP = ${espPkts}`);
          console.log(`IKE = ${ikePkts}`);
          console.log(`TCP = ${tcpPkts}`);
          console.log(`UDP = ${udpPkts}`);

          console.log('\nFLOWS (after Feature Extraction):');
          const mlFlows = finalData.mlFlows || [];
          console.log(`total = ${mlFlows.length}`);
          
          mlFlows.forEach((flow, i) => {
            console.log(`\nFLOW #${i + 1}:`);
            console.log(`src = ${flow.metadata.srcIp}`);
            console.log(`dst = ${flow.metadata.dstIp}`);
            console.log(`protocol = ${flow.metadata.protocol}`);
            console.log(`SPI = ${flow.metadata.spi || '0x0'}`);
            console.log(`duration = ${flow.features.duration}`);
            console.log(`packetCount = ${flow.metadata.packetCount}`);
            console.log(`flowPktsPerSecond = ${flow.features.flowPktsPerSecond}`);
            console.log(`flowBytesPerSecond = ${flow.features.flowBytesPerSecond}`);
            
            console.log('\nFEATURE VECTOR:');
            console.log(JSON.stringify(flow.features, null, 2));
            
            if (flow.aiResult) {
                console.log('\nMODEL PREDICTION:');
                console.log(`classification = ${flow.aiResult.classification}`);
                console.log(`confidence = ${flow.aiResult.confidence}%`);
                console.log(`anomalyScore = ${flow.aiResult.anomalyScore}`);
                console.log(`anomalyStatus = ${flow.aiResult.anomalyStatus}`);
            } else {
                console.log('\nMODEL PREDICTION: N/A');
            }
          });
          
          console.log('\n==================================================');
          
          const reportPath = path.join(__dirname, 'Flow_engine', 'reports', 'demo1_end_to_end_validation.json');
          fs.writeFileSync(reportPath, JSON.stringify(finalData, null, 2));
          console.log(`Saved API result to ${reportPath}`);
          
          break;
        }
      }
    }
  } catch (err) {
    console.error('Upload failed:', err);
  }
}

testUpload();
