export class CodeValidator {
  // Dangerous patterns to detect
  static DANGEROUS_PATTERNS = {
    python: [
      /\_\_import\_\_\s*\(\s*["']os["']/i,
      /exec\s*\(/i,
      /eval\s*\(/i,
      /compile\s*\(/i,
      /open\s*\(/i,
      /subprocess/i,
      /socket/i,
      /urllib/i,
      /requests/i,
      /pickle/i,
    ],
    javascript: [
      /require\s*\(\s*["']fs["']/i,
      /require\s*\(\s*["']child_process["']/i,
      /eval\s*\(/i,
      /Function\s*\(/i,
      /require\s*\(\s*["']http["']/i,
      /require\s*\(\s*["']https["']/i,
    ],
  };

  static MAX_CODE_LENGTH = 65536; // 64 KB
  static MAX_LINE_LENGTH = 1000;
  static MAX_LINES = 500;

  static validateCode(code, language) {
    if (code.length > this.MAX_CODE_LENGTH) {
      return {
        isValid: false,
        errorMessage: `Code exceeds maximum length of ${this.MAX_CODE_LENGTH} characters`,
      };
    }

    const lines = code.split('\n');
    if (lines.length > this.MAX_LINES) {
      return {
        isValid: false,
        errorMessage: `Code exceeds maximum of ${this.MAX_LINES} lines`,
      };
    }

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].length > this.MAX_LINE_LENGTH) {
        return {
          isValid: false,
          errorMessage: `Line ${i + 1} exceeds maximum length of ${this.MAX_LINE_LENGTH} characters`,
        };
      }
    }

    // Check for dangerous patterns
    const patterns = this.DANGEROUS_PATTERNS[language.toLowerCase()];
    if (patterns) {
      for (const pattern of patterns) {
        if (pattern.test(code)) {
          return {
            isValid: false,
            errorMessage: 'Code contains potentially dangerous operations',
          };
        }
      }
    }

    // Check for excessive loops (basic check)
    const loopCount = (code.match(/\bwhile\b/g) || []).length + (code.match(/\bfor\b/g) || []).length;
    if (loopCount > 20) {
      return {
        isValid: false,
        errorMessage: 'Too many loops detected',
      };
    }

    return { isValid: true };
  }

  static sanitizeInput(inputData) {
    // Remove any null bytes
    let sanitized = inputData.replace(/\x00/g, '');

    // Limit length
    if (sanitized.length > 10000) {
      sanitized = sanitized.substring(0, 10000);
    }

    return sanitized;
  }
}
