import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

interface LatexRendererProps {
  content: string;
  block?: boolean;
}

/**
 * Renders LaTeX content. Supports both inline and block math.
 * 
 * Usage:
 * - Inline: <LatexRenderer content="E = mc^2" />
 * - Block: <LatexRenderer content="\\int_0^1 x^2 dx" block />
 * 
 * Supports mixed content with LaTeX delimiters:
 * - Inline: $...$ or \(...\)
 * - Block: $$...$$ or \[...\]
 */
export function LatexRenderer({ content, block = false }: LatexRendererProps) {
  // Pattern to match LaTeX expressions
  const inlinePattern = /\$([^$]+)\$|\\\(([^)]+)\\\)/g;
  const blockPattern = /\$\$([^$]+)\$\$|\\\[([^\]]+)\\\]/g;
  
  // Check if content contains LaTeX (create new regex to avoid state issues)
  const hasInlineMath = /\$([^$]+)\$|\\\(([^)]+)\\\)/.test(content);
  const hasBlockMath = /\$\$([^$]+)\$\$|\\\[([^\]]+)\\\]/.test(content);
  
  // If no LaTeX, just return plain text
  if (!hasInlineMath && !hasBlockMath) {
    return <span>{content}</span>;
  }
  
  // Split content by block math first
  const parts: (string | JSX.Element)[] = [];
  let lastIndex = 0;
  let match;
  
  // Process block math ($$...$$ or \[...\])
  const blockRegex = /\$\$([^$]+)\$\$|\\\[([^\]]+)\\\]/g;
  let blockMatch;
  const tempParts: Array<{ type: 'text' | 'block'; content: string; index: number }> = [];
  
  while ((blockMatch = blockRegex.exec(content)) !== null) {
    if (blockMatch.index > lastIndex) {
      tempParts.push({
        type: 'text',
        content: content.slice(lastIndex, blockMatch.index),
        index: lastIndex
      });
    }
    tempParts.push({
      type: 'block',
      content: blockMatch[1] || blockMatch[2],
      index: blockMatch.index
    });
    lastIndex = blockRegex.lastIndex;
  }
  
  if (lastIndex < content.length) {
    tempParts.push({
      type: 'text',
      content: content.slice(lastIndex),
      index: lastIndex
    });
  }
  
  // If no block math found, process as inline only
  if (tempParts.length === 0) {
    return <LatexInline content={content} />;
  }
  
  // Render parts
  return (
    <div>
      {tempParts.map((part, idx) => {
        if (part.type === 'block') {
          try {
            return (
              <BlockMath key={idx} math={part.content} />
            );
          } catch (error) {
            return <span key={idx} className="text-destructive">[LaTeX Error]</span>;
          }
        } else {
          return <LatexInline key={idx} content={part.content} />;
        }
      })}
    </div>
  );
}

/**
 * Renders inline LaTeX within text
 */
function LatexInline({ content }: { content: string }) {
  const parts: (string | JSX.Element)[] = [];
  const inlinePattern = /\$([^$]+)\$|\\\(([^)]+)\\\)/g;
  let lastIndex = 0;
  let match;
  
  while ((match = inlinePattern.exec(content)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push(content.slice(lastIndex, match.index));
    }
    
    // Add the LaTeX math
    const mathContent = match[1] || match[2];
    try {
      parts.push(
        <InlineMath key={match.index} math={mathContent} />
      );
    } catch (error) {
      parts.push(<span key={match.index} className="text-destructive">[LaTeX Error]</span>);
    }
    
    lastIndex = inlinePattern.lastIndex;
  }
  
  // Add remaining text
  if (lastIndex < content.length) {
    parts.push(content.slice(lastIndex));
  }
  
  // If no matches, return plain text
  if (parts.length === 0) {
    return <span>{content}</span>;
  }
  
  return <span>{parts}</span>;
}
