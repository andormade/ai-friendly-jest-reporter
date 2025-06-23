import { CoverageReporter } from '@jest/reporters';
import type { Config } from '@jest/types';
import type { CoverageMap, FileCoverage } from 'istanbul-lib-coverage';
import yargsParser from 'yargs-parser';
import path from 'path';

interface CustomFlags {
  functionName: string | null;
  filePath: string | null;
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
  private customFlags: CustomFlags;
  private projectRoot: string;

  constructor(
    globalConfig: Config.GlobalConfig,
    reporterOptions?: any,
    reporterContext?: any
  ) {
    super(globalConfig, reporterContext);
    this.projectRoot = process.cwd();

    // Parse custom CLI flags
    const parsedArgs = yargsParser(process.argv.slice(2));
    this.customFlags = {
      functionName: (parsedArgs.functionName as string) || null,
      filePath: (parsedArgs.filePath as string) || null,
    };
  }

  private getRelativePath(absolutePath: string): string {
    return path.relative(this.projectRoot, absolutePath);
  }

  onTestResult(test: any, testResult: any): void {
    super.onTestResult(test, testResult);
  }

  async onRunComplete(testContexts: any, results: any): Promise<void> {
    const report: { [key: string]: any } = {};

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
      const filteredFiles = this.customFlags.filePath
        ? files.filter((filePath: string) =>
          filePath.endsWith(this.customFlags.filePath!)
        )
        : files;

      const fileReports: { [key: string]: any } = {};

      filteredFiles.forEach((filePath: string) => {
        const fileCoverage: FileCoverage =
          coverageMap.fileCoverageFor(filePath);
        const fnMap: FunctionMap = fileCoverage.fnMap as FunctionMap;
        const relativePath = this.getRelativePath(filePath);

        const targetFunction = Object.values(fnMap).find(
          (fn) => fn.name === this.customFlags.functionName
        );

        if (!targetFunction) {
          fileReports[relativePath] = {
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
          fileReports[relativePath] = {
            status: 'uncovered_lines',
            uncoveredLines: uncoveredLines,
          };
        } else {
          fileReports[relativePath] = {
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