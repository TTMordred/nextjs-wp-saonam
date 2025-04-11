// Function to clean up WordPress content
export function formatContent(content) {
  if (!content) return '';
  
  // Replace WordPress image URLs with Next.js Image component if needed
  // This is a simple example - you might want to use a proper HTML parser
  // like react-html-parser or html-react-parser for more complex transformations
  
  // For now, we'll just return the content as is
  return content;
}

// Function to extract excerpt from content
export function extractExcerpt(content, maxLength = 150) {
  if (!content) return '';
  
  // Remove HTML tags
  const plainText = content.replace(/<[^>]+>/g, '');
  
  // Trim and limit to maxLength
  if (plainText.length <= maxLength) return plainText;
  
  return plainText.substring(0, maxLength) + '...';
}

// Format date to a readable format
export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
