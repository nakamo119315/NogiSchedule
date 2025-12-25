// 許可するHTMLタグ
const ALLOWED_TAGS = ['a', 'br', 'p', 'strong', 'em', 'b', 'i', 'u', 'span'];

// 許可する属性
const ALLOWED_ATTRS: Record<string, string[]> = {
  a: ['href', 'target', 'rel'],
  span: ['class'],
};

// 属性をサニタイズ
function sanitizeAttributes(tag: string, attrs: string): string {
  const allowedAttrs = ALLOWED_ATTRS[tag] || [];
  if (allowedAttrs.length === 0) return '';

  const result: string[] = [];
  const attrRegex = /(\w+)=["']([^"']*)["']/g;
  let match;

  while ((match = attrRegex.exec(attrs)) !== null) {
    const [, attrName, attrValue] = match;
    if (allowedAttrs.includes(attrName)) {
      // href属性のjavascript:プロトコルをブロック
      if (attrName === 'href') {
        const cleanValue = attrValue.trim().toLowerCase();
        if (cleanValue.startsWith('javascript:') || cleanValue.startsWith('data:')) {
          continue;
        }
      }
      result.push(`${attrName}="${attrValue}"`);

      // 外部リンクにはrel="noopener noreferrer"を追加
      if (attrName === 'href' && tag === 'a') {
        if (!attrs.includes('rel=')) {
          result.push('rel="noopener noreferrer"');
        }
        if (!attrs.includes('target=')) {
          result.push('target="_blank"');
        }
      }
    }
  }

  return result.length > 0 ? ' ' + result.join(' ') : '';
}

// HTMLをサニタイズ
export function sanitizeHtml(html: string): string {
  if (!html) return '';

  // スクリプトタグとイベントハンドラを完全に削除
  let clean = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/on\w+\s*=\s*[^\s>]*/gi, '');

  // 許可されたタグのみを保持
  clean = clean.replace(/<\/?(\w+)([^>]*)>/g, (match, tag, attrs) => {
    const lowerTag = tag.toLowerCase();
    if (ALLOWED_TAGS.includes(lowerTag)) {
      const sanitizedAttrs = sanitizeAttributes(lowerTag, attrs);
      if (match.startsWith('</')) {
        return `</${lowerTag}>`;
      }
      return `<${lowerTag}${sanitizedAttrs}>`;
    }
    return '';
  });

  return clean;
}

// HTMLをプレーンテキストに変換
export function htmlToText(html: string): string {
  if (!html) return '';

  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

// React用の安全なHTML表示コンポーネント用props
export function createSafeHtmlProps(html: string): { dangerouslySetInnerHTML: { __html: string } } {
  return {
    dangerouslySetInnerHTML: {
      __html: sanitizeHtml(html),
    },
  };
}
