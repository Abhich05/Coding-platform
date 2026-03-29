/**
 * Generate a unique invitation token
 */
export const generateInvitationToken = () => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

/**
 * Calculate time difference in minutes
 */
export const getTimeDifference = (startDate, endDate) => {
  const diff = endDate - startDate;
  return Math.floor(diff / 1000 / 60); // Convert to minutes
};

/**
 * Format date to readable string
 */
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Calculate percentage score
 */
export const calculateScore = (passedTests, totalTests) => {
  if (totalTests === 0) return 0;
  return Math.round((passedTests / totalTests) * 100);
};

/**
 * Sanitize user input
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.trim().replace(/[<>]/g, '');
};
