export class TestCaseJudge {
  /**
   * Normalize output by removing trailing whitespace and normalizing newlines
   */
  normalizeDefault(output) {
    const lines = output.trim().split('\n');
    return lines.map(line => line.trimEnd()).join('\n');
  }

  /**
   * Normalize floating point numbers to specified precision
   */
  normalizeFloat(output, precision = 6) {
    return output.replace(/-?\d+\.\d+/g, (match) => {
      return parseFloat(match).toFixed(precision);
    });
  }

  /**
   * Remove all whitespace for comparison
   */
  normalizeIgnoreWhitespace(output) {
    return output.replace(/\s+/g, '');
  }

  /**
   * Convert to lowercase for case-insensitive comparison
   */
  normalizeCaseInsensitive(output) {
    return this.normalizeDefault(output).toLowerCase();
  }

  /**
   * Compare actual vs expected output
   */
  compareOutputs(
    actual,
    expected,
    comparisonMode = 'default',
    tolerance = 1e-6
  ) {
    let actualNorm;
    let expectedNorm;

    // Apply normalization based on comparison mode
    switch (comparisonMode) {
      case 'float':
        actualNorm = this.normalizeFloat(actual);
        expectedNorm = this.normalizeFloat(expected);
        break;
      case 'ignore_whitespace':
        actualNorm = this.normalizeIgnoreWhitespace(actual);
        expectedNorm = this.normalizeIgnoreWhitespace(expected);
        break;
      case 'case_insensitive':
        actualNorm = this.normalizeCaseInsensitive(actual);
        expectedNorm = this.normalizeCaseInsensitive(expected);
        break;
      default:
        actualNorm = this.normalizeDefault(actual);
        expectedNorm = this.normalizeDefault(expected);
    }

    if (actualNorm === expectedNorm) {
      return { isCorrect: true };
    }

    // For float comparison, check tolerance
    if (comparisonMode === 'float') {
      try {
        const actualVals = actualNorm.split(/\s+/).map(parseFloat);
        const expectedVals = expectedNorm.split(/\s+/).map(parseFloat);

        if (actualVals.length !== expectedVals.length) {
          return {
            isCorrect: false,
            errorMessage: `Different number of values: expected ${expectedVals.length}, got ${actualVals.length}`,
          };
        }

        for (let i = 0; i < actualVals.length; i++) {
          if (Math.abs(actualVals[i] - expectedVals[i]) > tolerance) {
            return {
              isCorrect: false,
              errorMessage: `Value at position ${i}: expected ${expectedVals[i]}, got ${actualVals[i]}`,
            };
          }
        }

        return { isCorrect: true };
      } catch (error) {
        return {
          isCorrect: false,
          errorMessage: `Invalid float format: ${error.message}`,
        };
      }
    }

    // Calculate similarity for better error messages
    const similarity = this.calculateSimilarity(actualNorm, expectedNorm);

    if (similarity > 0.9) {
      return {
        isCorrect: false,
        errorMessage: 'Output is very close but not exact - check formatting',
      };
    }

    return { isCorrect: false };
  }

  /**
   * Calculate similarity between two strings (0 to 1)
   */
  calculateSimilarity(str1, str2) {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;

    if (longer.length === 0) {
      return 1.0;
    }

    const editDistance = this.levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  }

  /**
   * Calculate Levenshtein distance between two strings
   */
  levenshteinDistance(str1, str2) {
    const matrix = [];

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    return matrix[str2.length][str1.length];
  }

  /**
   * Judge a complete submission against all test cases
   */
  judgeSubmission(results) {
    // Add percentile calculation (mock - in production, query from database)
    if (results.verdict === 'Accepted') {
      results.runtimePercentile = this.calculatePercentile(results.maxRuntime, 'runtime');
      results.memoryPercentile = this.calculatePercentile(results.maxMemory, 'memory');
    }

    return results;
  }

  /**
   * Calculate percentile (mock implementation)
   */
  calculatePercentile(value, type) {
    // In production, this would query the database for all submissions
    // and calculate the actual percentile
    // For now, return a mock value
    const random = Math.random();
    return Math.floor(random * 100);
  }
}

export const testCaseJudge = new TestCaseJudge();
