/**
 * Date formatting utility function
 */

// Format date for display - only showing the date without time
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString();
};
