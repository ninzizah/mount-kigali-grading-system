'use client';

/**
 * Creates and triggers a download for a text-based file.
 * @param content The content of the file.
 * @param filename The desired name for the downloaded file.
 */
export function downloadTextFile(content: string, filename: string) {
  const element = document.createElement('a');
  const file = new Blob([content], { type: 'text/plain' });
  element.href = URL.createObjectURL(file);
  element.download = filename;
  document.body.appendChild(element); // Required for this to work in FireFox
  element.click();
  document.body.removeChild(element);
}
