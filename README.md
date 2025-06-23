# AI-Friendly Coverage Reporter for Jest

I found that agentic IDEs work best when they're asked to do small, granular tasks. However, when I tried asking them to improve the test coverage of specific functions, they couldn't do it confidently. This is because the default Jest coverage reporters output verbose information with a lot of human-friendly formatting, which unnecessarily spams the AI's context window.

## Solution

This reporter trims the noise, it gathers coverage only for the function you care about and outputs a concise JSON report that's easy for AI to parse.

## Install

```bash
npm install --save‑dev jest‑ai‑friendly‑reporter
```

## Usage

You can specify the reporter directly from the command line using the `--reporters` flag:
```bash
npx jest \
  --coverage \
  --coverageReporters="none" \
  --reporters="jest-ai-friendly-reporter" \
  --filePath="calculator.js" \
  --functionName="divide"
```

Note: The `--coverageReporters="none"` flag is important, otherwise Jest will emit its default reports on top of ours.

## CLI options

| Flag             | Type      | Required  | Default | Description                                                          |
| ---------------- | --------- | --------- | ------- | -------------------------------------------------------------------- |
| `--filePath`     | `string`  | Yes       |         | Absolute/relative path of the module containing the target function. |
| `--functionName` | `string`  | Yes       |         | Name of the function to analyse.                                     |

## Recommended Setup

I recommended to add an npm script to your `package.json` for easier usage:
```json
{
  "scripts": {
    "test:coverage-ai": "jest --coverage --coverageReporters=\"none\" --reporters=\"jest-ai-friendly-reporter\""
  }
}
```

Then you can run it with additional parameters like this:
```bash
npm run test:coverage-ai -- \
  --filePath="calculator.js" \
  --functionName="divide"
```

## Integrating with agentic IDEs

Add a custom rule so the agent automatically uses the reporter when it needs coverage data:
```
When checking test coverage for a specific function, 
use 'npm run test:coverage-ai -- --filePath=\"$FILE\" --functionName=\"$FUNCTION\"'
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