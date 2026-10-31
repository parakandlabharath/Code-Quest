import { TestCase } from '../types';

export interface TestResult {
  testId: string;
  passed: boolean;
  inputDescription: string;
  expectedOutput: string;
  actualOutput: string;
  error?: string;
  hidden?: boolean;
}

export interface RunResult {
  success: boolean;
  logs: string[];
  testResults: TestResult[];
  runtimeError?: string;
}

export function executeUserCode(userCode: string, testCases: TestCase[]): RunResult {
  const logs: string[] = [];

  // Custom console.log wrapper to capture logs
  const mockConsole = {
    log: (...args: any[]) => {
      logs.push(args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '));
    },
    error: (...args: any[]) => {
      logs.push('❌ Error: ' + args.map(a => String(a)).join(' '));
    },
    warn: (...args: any[]) => {
      logs.push('⚠️ Warning: ' + args.map(a => String(a)).join(' '));
    }
  };

  const testResults: TestResult[] = [];

  try {
    // Construct safe function scope
    // We execute user code and evaluate each test case
    const runner = new Function('console', `
      ${userCode}
      return {
        evalInput: function(inputExpr) {
          try {
            return eval(inputExpr);
          } catch(e) {
            return "ERROR: " + e.message;
          }
        }
      };
    `);

    const instance = runner(mockConsole);

    for (const tc of testCases) {
      try {
        const rawActual = instance.evalInput(tc.inputDescription);
        
        let actualStr = '';
        if (typeof rawActual === 'object' && rawActual !== null) {
          actualStr = JSON.stringify(rawActual);
        } else if (typeof rawActual === 'string') {
          actualStr = `"${rawActual}"`;
        } else {
          actualStr = String(rawActual);
        }

        // Clean expected string for comparison
        const cleanExpected = tc.expectedOutput.trim();
        const cleanActual = actualStr.trim();

        // Check matching
        let passed = false;
        if (cleanExpected === cleanActual) {
          passed = true;
        } else {
          // Normalize JSON for array/object comparisons
          try {
            const expParsed = JSON.parse(tc.expectedOutput);
            const actParsed = typeof rawActual === 'string' ? rawActual : rawActual;
            if (JSON.stringify(expParsed) === JSON.stringify(actParsed)) {
              passed = true;
            }
          } catch {
            passed = false;
          }
        }

        testResults.push({
          testId: tc.id,
          passed,
          inputDescription: tc.inputDescription,
          expectedOutput: tc.expectedOutput,
          actualOutput: actualStr,
          hidden: tc.hidden
        });
      } catch (err: any) {
        testResults.push({
          testId: tc.id,
          passed: false,
          inputDescription: tc.inputDescription,
          expectedOutput: tc.expectedOutput,
          actualOutput: 'Execution Error',
          error: err.message,
          hidden: tc.hidden
        });
      }
    }

    const allPassed = testResults.every(tr => tr.passed);

    return {
      success: allPassed,
      logs,
      testResults
    };
  } catch (globalErr: any) {
    return {
      success: false,
      logs,
      testResults: [],
      runtimeError: globalErr.message || 'Syntax or Runtime Error in JavaScript Code'
    };
  }
}
