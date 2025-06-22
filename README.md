# AI-Friendly Jest Coverage Reporter

## Problem

Standard coverage reports are built for people, not for language models. They list every file, every branch, and every line. When you pair 
program with an AI agent this flood of data wastes context and hides the point. I only want to know whether this function is covered.

## Solution

This reporter trims the noise. It gathers coverage only for the function you care about and outputs a concise JSON report that's easy for AI to parse.

## Install

```bash
npm install --save‑dev jest‑ai‑friendly‑reporter
```

## Usage

You can specify the reporter directly from the command line using the `--reporters` flag:
```bash
npx jest \
  --coverage \
  --coverageReporters="json" \
  --reporters="jest-ai-friendly-reporter" \
  --fileName="calculator.js" \
  --functionName="divide"
```

## Recommended Setup

I recommended to add an npm script to your `package.json` for easier usage:

```json
{
  "scripts": {
    "test:coverage-ai": "jest --coverage --coverageReporters=\"json\" --reporters=\"jest-ai-friendly-reporter\""
  }
}
```

Then you can run it with additional parameters like this:
```bash
npm run test:coverage-ai -- \
  --fileName="calculator.js" \
  --functionName="divide"
```

For the best experience I recommend adding a custom rule to your agentic IDE (like Cursor) to instruct the agent to use this npm script when it needs to check coverage for specific files or functions:

Example rule:
```
When checking test coverage for a specific function, 
use 'npm run test:coverage-ai -- --fileName=\"$FILE\" --functionName=\"$FUNCTION\"'
instead of running Jest directly.
```

## Output

The reporter outputs a JSON report directly to the console with the following format:

```json
{
  "results": {
    "calculator.js": {
      "status": "uncovered_lines",
      "uncoveredLines": [45, 48, 49, 50, 54]
    }
  }
}
```