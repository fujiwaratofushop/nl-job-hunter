/**
 * Script to inject code from referenced files into NL Jobs Unified Automation.json
 * This script reads the "NL Jobs Readable Automation.json" and transforms it
 * by replacing filePath references with actual JavaScript code.
 */

const fs = require('fs');
const path = require('path');

// Configuration
const SOURCE_FILE = 'NL Jobs Readable Automation.json';
const TARGET_FILE = 'NL Jobs Unified Automation.json';
const ROOT_DIR = path.join(__dirname, '..');
const SCRIPTS_DIR = path.join(ROOT_DIR, 'scripts');

// Map of filePath references to their actual script files
const SCRIPT_MAP = {
  'scripts/normalize-jobs.js': 'normalize-jobs.js',
  'scripts/filter-duplicates.js': 'filter-duplicates.js',
  'scripts/build-relocation-request.js': 'build-relocation-request.js',
  'scripts/build-cover-letter-request.js': 'build-cover-letter-request.js',
  'scripts/assemble-row.js': 'assemble-row.js'
};

/**
 * Read the source automation file
 */
function readSourceFile() {
  const filePath = path.join(ROOT_DIR, SOURCE_FILE);
  return fs.readFileSync(filePath, 'utf8');
}

/**
 * Extract code from a script file
 */
function getCodeFromScript(scriptName) {
  const filePath = path.join(SCRIPTS_DIR, scriptName);
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Remove shebang if present
  let code = content.trim();
  if (code.startsWith('#!')) {
    code = code.substring(2).trim();
  }
  
  return code;
}

/**
 * Transform the automation file by injecting code
 */
function transformAutomationFile(sourceContent) {
  let result = JSON.parse(sourceContent);
  
  // Process each node that has a filePath parameter
  result.nodes = result.nodes.map(node => {
    if (node.parameters && node.parameters.filePath) {
      const filePathRef = node.parameters.filePath;
      const actualScript = SCRIPT_MAP[filePathRef];
      
      if (actualScript) {
        const code = getCodeFromScript(actualScript);
        node.parameters.jsCode = code;
        delete node.parameters.filePath;
      }
    }
    return node;
  });
  
  return JSON.stringify(result, null, 2);
}

/**
 * Main execution
 */
function main() {
  console.log('Starting code injection process...');
  
  // Read source file
  console.log(`Reading ${SOURCE_FILE}...`);
  const sourceContent = readSourceFile();
  
  // Transform the file
  console.log('Injecting code from referenced scripts...');
  const transformedContent = transformAutomationFile(sourceContent);
  
  // Write to target file
  const targetPath = path.join(ROOT_DIR, TARGET_FILE);
  fs.writeFileSync(targetPath, transformedContent, 'utf8');
  
  console.log(`Successfully wrote ${TARGET_FILE}`);
  console.log('Code injection complete!');
}

// Run the script
try {
  main();
} catch (err) {
  console.error('Error during code injection:', err);
  process.exit(1);
}
