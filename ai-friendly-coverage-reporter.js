const { CoverageReporter } = require('@jest/reporters');

class CustomCoverageReporter extends CoverageReporter {
    constructor(globalConfig, reporterOptions, reporterContext) {
        super(globalConfig, reporterContext);
        this.disabled = !globalConfig.collectCoverage;
        this.reporterOptions = reporterOptions || {};

        // Parse custom CLI flags
        this.customFlags = this.parseCustomFlags();
    }

    parseCustomFlags() {
        const args = process.argv;
        const flags = {
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

            // Parse --inspect-mode flag
            if (arg.startsWith('--file-name=')) {
                flags.fileName = arg.split('=')[1];
            } else if (arg === '--file-name' && i + 1 < args.length) {
                flags.fileName = args[i + 1];
                i++; // Skip the next argument since we consumed it
            }
        }

        return flags;
    }

    onTestResult() {
        if (this.disabled) {
            return;
        }
        super.onTestResult.apply(this, arguments);
    }

    async onRunComplete(testContexts, results) {
        if (this.disabled) {
            console.log('Coverage collection is disabled');
            return;
        }

        // Call parent to let Jest do its normal coverage processing
        await super.onRunComplete(testContexts, results);

        // Now we have access to the coverage data!
        console.log('\n🎯 Custom Coverage Reporter');
        console.log('═══════════════════════════');

        if (!this._coverageMap || this._coverageMap.files().length === 0) {
            console.log('No coverage data available');
            return;
        }

        // Display and optionally save the coverage results
        try {
            const files = this._coverageMap.files();
            files.filter(filePath => filePath.includes(this.customFlags.fileName)).forEach(filePath => {
                const { fnMap } = this._coverageMap.fileCoverageFor(filePath);
                const { loc: { start: { line: start }, end: { line: end } } } = Object.values(fnMap).filter(fn => fn.name === this.customFlags.functionName)[0];
                const lineCoverage = this._coverageMap.fileCoverageFor(filePath).getLineCoverage();
                const uncoveredLines = Object.entries(lineCoverage).filter(([lineNumber, coverage]) => {
                    return coverage === 0 && parseInt(lineNumber, 10) >= start && parseInt(lineNumber, 10) <= end;
                }).map(([lineNumber]) => parseInt(lineNumber, 10));

                if (uncoveredLines.length > 0) {
                    console.log(`Uncovered lines in ${filePath}: ${uncoveredLines.join(', ')}`);
                }
                else {
                    console.log(`All lines in ${filePath} are covered`);
                }
            });
        } catch (error) {
            console.error('❌ Failed to write coverage report:', error.message);
        }
    }
}

module.exports = CustomCoverageReporter; 