import { CoverageReporter } from '@jest/reporters';
import type { Config } from '@jest/types';
import type { CoverageMap, FileCoverage } from 'istanbul-lib-coverage';

interface CustomFlags {
  functionName: string | null;
  fileName: string | null;
}

interface ReporterOptions {
  [key: string]: any;
}

interface FunctionMap {
  [key: string]: {
    name: string;
    loc: {
      start: { line: number; column: number };
      end: { line: number; column: number };
    };
    decl: {
      start: { line: number; column: number };
      end: { line: number; column: number };
    };
  };
}

class CustomCoverageReporter extends CoverageReporter {
  private disabled: boolean;
  private reporterOptions: ReporterOptions;
  private customFlags: CustomFlags;

  constructor(
    globalConfig: Config.GlobalConfig,
    reporterOptions?: ReporterOptions,
    reporterContext?: any
  ) {
    super(globalConfig, reporterContext);
    this.disabled = !globalConfig.collectCoverage;
    this.reporterOptions = reporterOptions || {};

    // Parse custom CLI flags
    this.customFlags = this.parseCustomFlags();
  }

  private parseCustomFlags(): CustomFlags {
    const args = process.argv;
    const flags: CustomFlags = {
      functionName: null,
      fileName: null
    };

    for (let i = 0; i < args.length; i++) {
      const arg = args[i];

      // Parse --function-name flag
      if (arg.startsWith('--function-name=')) {
        flags.functionName = arg.split('=')[1];
      } else if (arg === '--function-name' && i + 1 < args.length) {
        flags.functionName = args[i + 1];
        i++; // Skip the next argument since we consumed it
      }

      // Parse --file-name flag
      if (arg.startsWith('--file-name=')) {
        flags.fileName = arg.split('=')[1];
      } else if (arg === '--file-name' && i + 1 < args.length) {
        flags.fileName = args[i + 1];
        i++; // Skip the next argument since we consumed it
      }
    }

    return flags;
  }

  onTestResult(test: any, testResult: any): void {
    if (this.disabled) {
      return;
    }
    super.onTestResult(test, testResult);
  }

  async onRunComplete(testContexts: any, results: any): Promise<void> {
    if (this.disabled) {
      console.log('Coverage collection is disabled');
      return;
    }

    // Call parent to let Jest do its normal coverage processing
    await super.onRunComplete(testContexts, results);

    // Now we have access to the coverage data!
    console.log('\n🎯 Custom Coverage Reporter');
    console.log('═══════════════════════════');

    // Access the coverage map from the parent class
    const coverageMap = (this as any)._coverageMap as CoverageMap | undefined;

    if (!coverageMap || coverageMap.files().length === 0) {
      console.log('No coverage data available');
      return;
    }

    // Display and optionally save the coverage results
    try {
      const files = coverageMap.files();
      const filteredFiles = this.customFlags.fileName 
        ? files.filter((filePath: string) => filePath.includes(this.customFlags.fileName!))
        : files;

      filteredFiles.forEach((filePath: string) => {
        const fileCoverage: FileCoverage = coverageMap.fileCoverageFor(filePath);
        const fnMap: FunctionMap = fileCoverage.fnMap as FunctionMap;
        
        if (!this.customFlags.functionName) {
          console.log(`Processing file: ${filePath}`);
          return;
        }

        const targetFunction = Object.values(fnMap).find(fn => fn.name === this.customFlags.functionName);
        
        if (!targetFunction) {
          console.log(`Function '${this.customFlags.functionName}' not found in ${filePath}`);
          return;
        }

        const { loc: { start: { line: start }, end: { line: end } } } = targetFunction;
        const lineCoverage = fileCoverage.getLineCoverage();
        const uncoveredLines = Object.entries(lineCoverage)
          .filter(([lineNumber, coverage]) => {
            const lineNum = parseInt(lineNumber, 10);
            return coverage === 0 && lineNum >= start && lineNum <= end;
          })
          .map(([lineNumber]) => parseInt(lineNumber, 10));

        if (uncoveredLines.length > 0) {
          console.log(`Uncovered lines in ${filePath}: ${uncoveredLines.join(', ')}`);
        } else {
          console.log(`All lines in ${filePath} are covered`);
        }
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ Failed to write coverage report:', errorMessage);
    }
  }
}

export default CustomCoverageReporter;
export { CustomCoverageReporter }; 