/**
 * Simulation Worker with Real Solidity Compilation
 * Uses robust fetch+eval loading for solc-js compatibility
 */

import { SimpleEVM, hexToBytes } from '../sim/SimpleEVM';

// Declare globals that will be populated by the loaded script
declare const Module: any;

// EVMState type expected by visualizers
interface EVMState {
    stack: string[];
    memory: string[];
    storage: Record<string, string>;
    pc: number;
    logs: string[];
    opcode?: string;
    gasUsed?: number;
    gasRemaining?: number;
}

interface CompilationResult {
    bytecode: string;
    abi: any[];
    errors: string[];
    warnings: string[];
}

// Solc wrapper
let solcInstance: any = null;
let loadPromise: Promise<any> | null = null;

// Robust loader that bypasses importScripts/module limitations
async function loadSolc(): Promise<any> {
    if (solcInstance) return solcInstance;
    if (loadPromise) return loadPromise;

    loadPromise = new Promise((resolve, reject) => {
        (async () => {
            try {
                console.log('[Worker] Starting Solc load...');
                const version = 'v0.8.26+commit.8a97fa7a';
                const url = `https://binaries.soliditylang.org/bin/soljson-${version}.js`;

                const response = await fetch(url);
                if (!response.ok) throw new Error(`Failed to fetch compiler: ${response.statusText}`);
                const scriptContent = await response.text();

                const globalEval = eval;
                globalEval(scriptContent);

                if (typeof Module === 'undefined') {
                    throw new Error('Module not active after script execution');
                }

                const wrapper = (module: any) => {
                    const compile = module.cwrap('solidity_compile', 'string', ['string', 'number', 'number']);
                    return { compile };
                };

                if (Module.onRuntimeInitialized) {
                    const original = Module.onRuntimeInitialized;
                    Module.onRuntimeInitialized = () => {
                        if (original) original();
                        solcInstance = wrapper(Module);
                        resolve(solcInstance);
                    };
                } else {
                    solcInstance = wrapper(Module);
                    resolve(solcInstance);
                }

                setTimeout(() => {
                    if (!solcInstance && Module.cwrap) {
                        solcInstance = wrapper(Module);
                        resolve(solcInstance);
                    }
                }, 100);
            } catch (err) {
                console.error('[Worker] Fatal error loading solc:', err);
                reject(err);
            }
        })();
    });

    return loadPromise;
}

// Compile Solidity source code using standard JSON input
function compileSolidity(compiler: any, sourceCode: string): CompilationResult {
    const input = {
        language: 'Solidity',
        sources: {
            'contract.sol': {
                content: sourceCode
            }
        },
        settings: {
            outputSelection: {
                '*': {
                    '*': ['abi', 'evm.bytecode.object', 'evm.deployedBytecode.object']
                }
            },
            optimizer: {
                enabled: false,
                runs: 200
            }
        }
    };

    console.log('[Worker] Invoking compiler...');
    const outputJson = compiler.compile(JSON.stringify(input), 0, 0);
    const output = JSON.parse(outputJson);

    const result: CompilationResult = {
        bytecode: '',
        abi: [],
        errors: [],
        warnings: []
    };

    // Check for errors
    if (output.errors) {
        for (const error of output.errors) {
            if (error.severity === 'error') {
                result.errors.push(error.formattedMessage || error.message);
            } else {
                result.warnings.push(error.formattedMessage || error.message);
            }
        }
    }

    if (result.errors.length > 0) return result;

    // Extract bytecode
    if (output.contracts && output.contracts['contract.sol']) {
        const contracts = output.contracts['contract.sol'];
        // Get first contract name
        const contractNames = Object.keys(contracts);
        if (contractNames.length > 0) {
            const contract = contracts[contractNames[0]];
            // Use bytecode (Creation Code) to execute constructor logic
            const bytecode = contract.evm?.bytecode?.object;

            if (bytecode) {
                result.bytecode = bytecode;
                result.abi = contract.abi || [];
            }
        }
    }

    return result;
}

self.onmessage = async (e: MessageEvent) => {
    const { type, payload } = e.data;

    if (type === 'COMPILE_AND_RUN') {
        try {
            const { code } = payload;
            const result = await compileAndRun(code);
            self.postMessage({ type: 'SUCCESS', payload: result });
        } catch (err: any) {
            console.error('[Worker Error]', err);
            self.postMessage({ type: 'ERROR', payload: err.message || 'Unknown Worker Error' });
        }
    }
};

async function compileAndRun(sourceCode: string): Promise<{ steps: EVMState[], bytecode: string, abi: any[], warnings: string[] }> {
    console.log('[Worker] Received source code, length:', sourceCode.length);

    // 1. Load Compiler
    self.postMessage({ type: 'STATUS', payload: 'Loading compiler (v0.8.26)...' });
    const compiler = await loadSolc();

    // 2. Compile
    self.postMessage({ type: 'STATUS', payload: 'Compiling Solidity...' });
    const compilation = compileSolidity(compiler, sourceCode);

    if (compilation.errors.length > 0) {
        throw new Error('Compilation Failed:\n' + compilation.errors.join('\n'));
    }

    if (!compilation.bytecode || compilation.bytecode.length === 0) {
        throw new Error('No bytecode generated. Ensure your contract is valid.');
    }

    console.log('[Worker] Compilation successful, bytecode len:', compilation.bytecode.length);
    self.postMessage({ type: 'STATUS', payload: 'Executing...' });

    // 3. Execute
    const bytecode = hexToBytes(compilation.bytecode);
    const evm = new SimpleEVM(2000000); // 2M gas
    const result = evm.execute(bytecode);

    if (!result.success) {
        console.warn('[Worker] Execution ended with error:', result.error);
    }

    // Transform steps
    const transformedSteps: EVMState[] = result.steps.map(step => ({
        stack: step.stack,
        memory: step.memory.map(byte => '0x' + byte.toString(16).padStart(2, '0')),
        storage: step.storage,
        pc: step.pc,
        logs: [],
        opcode: step.opcode,
        gasUsed: step.gasUsed,
        gasRemaining: step.gasRemaining
    }));

    return {
        steps: transformedSteps,
        bytecode: compilation.bytecode,
        abi: compilation.abi,
        warnings: compilation.warnings
    };
}
