import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parsePcapBuffer } from './src/utils/pcapEngine.js';
import { extractFlowFeatures } from './src/utils/flowFeatureExtractor.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const pcapPath = path.join(__dirname, 'demo 1.pcapng');
  const buffer = fs.readFileSync(pcapPath);
  const packets = parsePcapBuffer(buffer);
  const flows = extractFlowFeatures(packets);
  
  const reportPath = path.join(__dirname, 'Flow_engine', 'reports');
  if (!fs.existsSync(reportPath)) {
    fs.mkdirSync(reportPath, { recursive: true });
  }
  
  fs.writeFileSync(
    path.join(reportPath, 'demo1_extracted_features.json'),
    JSON.stringify(flows, null, 2)
  );
  console.log(`Extracted ${flows.length} flows and saved to demo1_extracted_features.json`);
}

main().catch(console.error);
