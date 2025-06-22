import { CoverageReporter } from '@jest/reporters';
import type { Config } from '@jest/types';
import type { CoverageMap, FileCoverage } from 'istanbul-lib-coverage';
import yargsParser from 'yargs-parser';

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
    const parsedArgs = yargsParser(process.argv.slice(2));
    this.customFlags = {
      functionName: (parsedArgs.functionName as string) || null,
      fileName: (parsedArgs.fileName as string) || null,
    };
  }

  onTestResult(test: any, testResult: any): void {
    if (this.disabled) {
      return;
    }
    super.onTestResult(test, testResult);
  }

  async onRunComplete(testContexts: any, results: any): Promise<void> {
    const report: { [key: string]: any } = {};

    if (this.disabled) {
      report.summary = 'Coverage collection is disabled';
      console.log(JSON.stringify(report, null, 2));
      return;
    }

    // Call parent to let Jest do its normal coverage processing
    await super.onRunComplete(testContexts, results);

    // Access the coverage map from the parent class
    const coverageMap = (this as any)._coverageMap as CoverageMap | undefined;

    if (!coverageMap || coverageMap.files().length === 0) {
      report.summary = 'No coverage data available';
      console.log(JSON.stringify(report, null, 2));
      return;
    }

    // Generate the coverage results and output to console
    try {
      const files = coverageMap.files();
      const filteredFiles = this.customFlags.fileName
        ? files.filter((filePath: string) =>
            filePath.includes(this.customFlags.fileName!)
          )
        : files;

      const fileReports: { [key: string]: any } = {};

      filteredFiles.forEach((filePath: string) => {
        const fileCoverage: FileCoverage =
          coverageMap.fileCoverageFor(filePath);
        const fnMap: FunctionMap = fileCoverage.fnMap as FunctionMap;

        if (!this.customFlags.functionName) {
          fileReports[filePath] = {
            status: 'processing',
          };
          return;
        }

        const targetFunction = Object.values(fnMap).find(
          (fn) => fn.name === this.customFlags.functionName
        );

        if (!targetFunction) {
          fileReports[filePath] = {
            status: 'function_not_found',
            functionName: this.customFlags.functionName,
          };
          return;
        }

        const {
          loc: {
            start: { line: start },
            end: { line: end },
          },
        } = targetFunction;
        const lineCoverage = fileCoverage.getLineCoverage();
        const uncoveredLines = Object.entries(lineCoverage)
          .filter(([lineNumber, coverage]) => {
            const lineNum = parseInt(lineNumber, 10);
            return coverage === 0 && lineNum >= start && lineNum <= end;
          })
          .map(([lineNumber]) => parseInt(lineNumber, 10));

        if (uncoveredLines.length > 0) {
          fileReports[filePath] = {
            status: 'uncovered_lines',
            uncoveredLines: uncoveredLines,
          };
        } else {
          fileReports[filePath] = {
            status: 'all_lines_covered',
            uncoveredLines: [],
          };
        }
      });
      report.results = fileReports;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      report.error = `Failed to generate coverage report: ${errorMessage}`;
    }

    console.log(JSON.stringify(report, null, 2));
  }
}

export default CustomCoverageReporter;
export { CustomCoverageReporter }; 