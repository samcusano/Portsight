import { useState, useCallback, useEffect } from 'react';

interface Comment {
  id: string;
  variant: string;
  selector: string;
  description: string;
  text: string;
  x: number;
  y: number;
}

interface FeedbackOverlayProps {
  targetName: string;
}

export function FeedbackOverlay({ targetName }: FeedbackOverlayProps) {
  const [active, setActive] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [pending, setPending] = useState<Omit<Comment, 'id' | 'text'> | null>(null);
  const [inputText, setInputText] = useState('');
  const [overall, setOverall] = useState('');
  const [copied, setCopied] = useState(false);
  const [showSubmit, setShowSubmit] = useState(false);

  const getVariant = (el: Element): string => {
    let node: Element | null = el;
    while (node) {
      const v = node.getAttribute('data-variant');
      if (v) return v;
      node = node.parentElement;
    }
    return 'Unknown';
  };

  const getSelector = (el: Element): string => {
    if (el.id) return `#${el.id}`;
    const testId = el.getAttribute('data-testid');
    if (testId) return `[data-testid="${testId}"]`;
    const cls = Array.from(el.classList).slice(0, 2).join('.');
    return cls ? `.${cls}` : el.tagName.toLowerCase();
  };

  const getDescription = (el: Element): string => {
    const role = el.getAttribute('role') || el.tagName.toLowerCase();
    const label = el.getAttribute('aria-label') || el.textContent?.trim().slice(0, 40) || '';
    return `${role}${label ? ` with "${label}"` : ''}`;
  };

  const handleClick = useCallback((e: MouseEvent) => {
    if (!active) return;
    const target = e.target as Element;
    if (target.closest('[data-feedback-ui]')) return;

    e.preventDefault();
    e.stopPropagation();

    setPending({
      variant: getVariant(target),
      selector: getSelector(target),
      description: getDescription(target),
      x: e.clientX,
      y: e.clientY,
    });
    setInputText('');
  }, [active]);

  useEffect(() => {
    if (active) {
      document.addEventListener('click', handleClick, true);
      document.body.style.cursor = 'crosshair';
    } else {
      document.removeEventListener('click', handleClick, true);
      document.body.style.cursor = '';
    }
    return () => {
      document.removeEventListener('click', handleClick, true);
      document.body.style.cursor = '';
    };
  }, [active, handleClick]);

  const saveComment = () => {
    if (!pending || !inputText.trim()) return;
    setComments(prev => [...prev, { ...pending, id: crypto.randomUUID(), text: inputText.trim() }]);
    setPending(null);
    setInputText('');
  };

  const formatFeedback = () => {
    const byVariant = comments.reduce<Record<string, Comment[]>>((acc, c) => {
      (acc[c.variant] = acc[c.variant] || []).push(c);
      return acc;
    }, {});

    let out = `## Design Lab Feedback\n\n**Target:** ${targetName}\n**Comments:** ${comments.length}\n\n`;
    for (const [variant, items] of Object.entries(byVariant)) {
      out += `### Variant ${variant}\n`;
      items.forEach((c, i) => {
        out += `${i + 1}. **${c.description}** (\`${c.selector}\`)\n   "${c.text}"\n\n`;
      });
    }
    out += `### Overall Direction\n${overall || '(none provided)'}`;
    return out;
  };

  const handleSubmit = async () => {
    const text = formatFeedback();
    await navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
    setShowSubmit(false);
  };

  const s = {
    fab: {
      position: 'fixed' as const,
      bottom: '24px',
      right: '24px',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'flex-end',
      gap: '8px',
    },
    btn: (on: boolean) => ({
      padding: '10px 18px',
      border: 'none',
      borderRadius: '2px',
      background: on ? '#D94F2E' : '#1C1917',
      color: '#F0EDE4',
      fontSize: '11px',
      letterSpacing: '0.08em',
      fontFamily: "'JetBrains Mono', monospace",
      cursor: 'pointer',
      boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
    }),
    badge: {
      background: '#D94F2E',
      color: '#fff',
      borderRadius: '50%',
      width: '18px',
      height: '18px',
      fontSize: '10px',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: '6px',
    },
    popup: {
      position: 'fixed' as const,
      left: Math.min(pending?.x ?? 0, window.innerWidth - 280) + 12,
      top: Math.min(pending?.y ?? 0, window.innerHeight - 160) + 12,
      zIndex: 99999,
      background: '#1C1917',
      border: '1px solid rgba(240,237,228,0.15)',
      padding: '12px',
      width: '260px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
    },
    popupLabel: {
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: '8px',
      letterSpacing: '0.1em',
      color: 'rgba(240,237,228,0.4)',
      textTransform: 'uppercase' as const,
      marginBottom: '8px',
      display: 'block',
    },
    textarea: {
      width: '100%',
      background: 'rgba(240,237,228,0.05)',
      border: '1px solid rgba(240,237,228,0.12)',
      color: '#F0EDE4',
      padding: '8px',
      fontSize: '12px',
      fontFamily: "'Inter', sans-serif",
      resize: 'none' as const,
      outline: 'none',
      minHeight: '60px',
      boxSizing: 'border-box' as const,
    },
    submitPanel: {
      position: 'fixed' as const,
      bottom: '80px',
      right: '24px',
      zIndex: 9998,
      background: '#1C1917',
      border: '1px solid rgba(240,237,228,0.12)',
      padding: '16px',
      width: '300px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
    },
  };

  return (
    <>
      {/* Comment popup */}
      {pending && (
        <div data-feedback-ui style={s.popup}>
          <span style={s.popupLabel}>
            Variant {pending.variant} · {pending.description.slice(0, 30)}
          </span>
          <textarea
            style={s.textarea}
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder="What do you think about this element?"
            autoFocus
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); saveComment(); } if (e.key === 'Escape') setPending(null); }}
          />
          <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
            <button
              style={{ ...s.btn(false), flex: 1, fontSize: '10px', background: '#C9A84C', color: '#1C1917' }}
              onClick={saveComment}
            >
              Save ↵
            </button>
            <button
              style={{ ...s.btn(false), background: 'transparent', border: '1px solid rgba(240,237,228,0.12)' }}
              onClick={() => setPending(null)}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Submit panel */}
      {showSubmit && (
        <div data-feedback-ui style={s.submitPanel}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', letterSpacing: '0.1em', color: '#C9A84C', marginBottom: '12px' }}>
            SUBMIT FEEDBACK ({comments.length} comment{comments.length !== 1 ? 's' : ''})
          </div>
          <textarea
            style={{ ...s.textarea, marginBottom: '10px' }}
            value={overall}
            onChange={e => setOverall(e.target.value)}
            placeholder="Overall direction — which variant wins? What would you change?"
            rows={4}
          />
          <div style={{ display: 'flex', gap: '6px' }}>
            <button style={{ ...s.btn(true), flex: 1 }} onClick={handleSubmit}>
              {copied ? '✓ Copied!' : 'Copy & Submit'}
            </button>
            <button style={{ ...s.btn(false), background: 'transparent', border: '1px solid rgba(240,237,228,0.12)' }} onClick={() => setShowSubmit(false)}>✕</button>
          </div>
          <div style={{ fontSize: '10px', color: 'rgba(240,237,228,0.3)', marginTop: '8px', fontFamily: "'JetBrains Mono', monospace" }}>
            Paste result in terminal to continue
          </div>
        </div>
      )}

      {/* FAB */}
      <div data-feedback-ui style={s.fab}>
        {comments.length > 0 && !active && (
          <button style={s.btn(false)} onClick={() => setShowSubmit(true)}>
            Submit{' '}
            <span style={s.badge}>{comments.length}</span>
          </button>
        )}
        <button style={s.btn(active)} onClick={() => { setActive(a => !a); setPending(null); }}>
          {active ? '✕ Cancel' : '+ Add Feedback'}
        </button>
      </div>

      {active && (
        <div data-feedback-ui style={{ position: 'fixed', top: '12px', left: '50%', transform: 'translateX(-50%)', zIndex: 9998, background: '#1C1917', border: '1px solid rgba(240,237,228,0.15)', padding: '7px 16px', fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: 'rgba(240,237,228,0.6)', letterSpacing: '0.06em', pointerEvents: 'none' }}>
          Click any element to comment · ESC or ✕ to cancel
        </div>
      )}
    </>
  );
}
