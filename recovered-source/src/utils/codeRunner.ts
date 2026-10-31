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

/**
 * Arbitrary JavaScript must never run in the application page context.
 * A real judge requires an isolated execution service (container/VM) with
 * CPU, memory, time, filesystem and network restrictions. Until configured,
 * fail closed rather than using eval(), new Function(), or a fake sandbox.
 */
export function executeUserCode(_userCode: string, testCases: TestCase[]): RunResult {
  return {
    success: false,
    logs: [],
    testResults: testCases.map((tc) => ({
      testId: tc.id,
      passed: false,
      inputDescription: tc.inputDescription,
      expectedOutput: tc.expectedOutput,
      actualOutput: 'Not executed',
      error: 'Code execution is temporarily disabled for security. A server-side isolated sandbox is required.',
      hidden: tc.hidden,
    })),
    runtimeError: 'Secure code execution is not configured. Your code was not executed.',
  };
}
