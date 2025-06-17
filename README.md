# AI-Friendly Jest Coverage Reporter

## Problem

Standard coverage reports are built for people, not for language models. They list every file, every branch, and every line. When you pair 
program with an AI agent this flood of data wastes context and hides the point. I only want to know whether this function is covered.

## Solution

This reporter trims the noise. It gathers coverage only for the function you care about and writes a short XML report with no colours, no padding, and no decoration. The output is tiny, and very easy for an AI to parse.

## Install

```bash
npm install --save‑dev jest‑ai‑friendly‑reporter
```

## Configure

Add the reporter to jest.config.js:

```javascript
module.exports = {
  reporters: [
    "json",    // keep anything you still need
    "jest-ai-friendly-reporter"
  ],
};
```

## Output

The reporter writes coverage/ai-report.xml

```xml
<coverage file="src/cart.js" function="calculateTotal" covered="12" total="17" percent="70.6">
  <missing line="45" />
  <missing line="48" />
  <missing line="49" />
  <missing line="50" />
  <missing line="54" />
</coverage>
```