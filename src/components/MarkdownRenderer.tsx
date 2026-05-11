// src/components/MarkdownRenderer.tsx
import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const parseMarkdown = (markdown: string) => {
    let html = markdown;
    
    // Headers
    html = html.replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold mt-6 mb-3 text-gray-800">$1</h3>');
    html = html.replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold mt-8 mb-4 pb-2 border-b border-gray-200 text-gray-900">$1</h2>');
    html = html.replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mt-6 mb-4 text-gray-900">$1</h1>');
    
    // Bold and Italic
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');
    
    // Code blocks
    html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (match, lang, code) => {
      return `<pre class="bg-gray-90 rounded-lg p-4 overflow-x-auto my-4"><code class="text-sm text-gray-100 font-mono">${escapeHtml(code.trim())}</code></pre>`;
    });
    
    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-100 text-pink-600 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>');
    
    // Blockquotes
    html = html.replace(/^> (.*$)/gm, '<blockquote class="border-l-4 border-blue-500 bg-blue-50 p-3 my-4 rounded-r"><p class="text-blue-800 text-sm">$1</p></blockquote>');
    
    // Tables
    html = html.replace(/\|(.+)\|/g, (match) => {
      const cells = match.split('|').filter(cell => cell.trim());
      if (cells[0]?.includes('---')) return '<tr class="bg-gray-50">';
      return `<tr>${cells.map(cell => `<td class="border border-gray-200 px-3 py-2 text-sm">${cell.trim()}</td>`).join('')}</tr>`;
    });
    
    // Lists
    html = html.replace(/^\- (.*$)/gm, '<li class="ml-4 mb-1 text-gray-700">• $1</li>');
    html = html.replace(/^\d+\. (.*$)/gm, '<li class="ml-4 mb-1 text-gray-700">$1</li>');
    
    // Paragraphs
    html = html.replace(/^(?!<[hrh]|<li|<tr|<pre|<blockquote)(.*$)/gm, (match) => {
      if (match.trim() && !match.startsWith('<')) {
        return `<p class="text-gray-0 leading-relaxed mb-4">${match}</p>`;
      }
      return match;
    });
    
    // Horizontal rules
    html = html.replace(/^---$/gm, '<hr class="my-6 border-gray-200" />');
    
    return html;
  };
  
  const escapeHtml = (text: string) => {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  };
  
  return (
    <div 
      className="prose prose-sm max-w-none"
      dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }}
    />
  );
};

export default MarkdownRenderer;