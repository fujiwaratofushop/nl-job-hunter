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
  'scripts/pre-filter.js': 'pre-filter.js',
  'scripts/build-cover-letter-request.js': 'build-cover-letter-request.js',
  'scripts/assemble-row.js': 'assemble-row.js'
};

/**
 * Read the source automation file with error handling
 */
function readSourceFile() {
  const filePath = path.join(ROOT_DIR, SOURCE_FILE);
  
  if (!fs.existsSync(filePath)) {
    throw new Error(`Source file not found: ${filePath}`);
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  console.log(`Source file size: ${content.length} bytes`);
  return content;
}

/**
 * Extract code from a script file with error handling
 */
function getCodeFromScript(scriptName) {
  const filePath = path.join(SCRIPTS_DIR, scriptName);
  
  if (!fs.existsSync(filePath)) {
    throw new Error(`Script file not found: ${filePath}`);
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Remove shebang if present
  let code = content.trim();
  if (code.startsWith('#!')) {
    code = code.substring(2).trim();
  }
  
  console.log(`Loaded ${scriptName}: ${code.length} bytes`);
  return code;
}

/**
 * Transform the automation file by injecting code
 */
function transformAutomationFile(sourceContent) {
  let result;
  try {
    result = JSON.parse(sourceContent);
  } catch (e) {
    throw new Error(`Failed to parse JSON: ${e.message}`);
  }
  
  let injectCount = 0;
  let totalNodes = result.nodes.length;
  
  // Process each node that has a filePath parameter
  result.nodes = result.nodes.map(node => {
    if (node.parameters && node.parameters.filePath) {
      const filePathRef = node.parameters.filePath;
      const actualScript = SCRIPT_MAP[filePathRef];
      
      if (actualScript) {
        console.log(`Injecting code for node "${node.name}" from ${filePathRef}`);
        const code = getCodeFromScript(actualScript);
        node.parameters.jsCode = code;
        delete node.parameters.filePath;
        injectCount++;
      }
    }
    return node;
  });
  
  console.log(`Injected ${injectCount} code blocks into ${totalNodes} nodes`);
  return JSON.stringify(result, null, 2);
}

/**
 * Main execution
 */
function main() {
  console.log('Starting code injection process...\n');
  
  try {
    // Read source file
    console.log(`Reading ${SOURCE_FILE}...`);
    const sourceContent = readSourceFile();
    
    // Transform the file
    console.log('\nInjecting code from referenced scripts...\n');
    const transformedContent = transformAutomationFile(sourceContent);
    
    // Write to target file
    const targetPath = path.join(ROOT_DIR, TARGET_FILE);
    fs.writeFileSync(targetPath, transformedContent, 'utf8');
    
    console.log(`\nSuccessfully wrote ${TARGET_FILE}`);
    console.log('Code injection complete!');
  } catch (err) {
    console.error('Error during code injection:', err.message);
    process.exit(1);
  }
}

// Run the script
main();
