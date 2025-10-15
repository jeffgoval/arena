/**
 * Clipboard utilities with fallback for environments where Clipboard API is blocked
 */

/**
 * Safely copies text to clipboard with fallback
 * @param text - Text to copy
 * @returns Promise that resolves to true if successful, false otherwise
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  // Try modern Clipboard API first (requires HTTPS or localhost)
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.warn('Clipboard API failed, trying fallback:', err);
      // Fall through to fallback method
    }
  }

  // Fallback method using deprecated document.execCommand
  // This works in more environments but is less reliable
  return fallbackCopyToClipboard(text);
}

/**
 * Fallback clipboard copy using deprecated execCommand
 * @param text - Text to copy
 * @returns true if successful, false otherwise
 */
function fallbackCopyToClipboard(text: string): boolean {
  try {
    // Create a temporary textarea element
    const textArea = document.createElement('textarea');
    textArea.value = text;
    
    // Make it invisible and prevent scrolling
    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = '0';
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';
    textArea.setAttribute('readonly', '');
    textArea.style.opacity = '0';
    
    document.body.appendChild(textArea);
    
    // Select and copy
    textArea.focus();
    textArea.select();
    
    let successful = false;
    try {
      successful = document.execCommand('copy');
    } catch (err) {
      console.error('Fallback copy failed:', err);
    }
    
    // Clean up
    document.body.removeChild(textArea);
    
    return successful;
  } catch (err) {
    console.error('Could not copy text:', err);
    return false;
  }
}

/**
 * Check if clipboard write is supported
 */
export function isClipboardSupported(): boolean {
  return !!(
    (navigator.clipboard && window.isSecureContext) ||
    document.queryCommandSupported?.('copy')
  );
}
