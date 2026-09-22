import { useEffect } from 'react';
import { createPortal } from 'react-dom';

export function DemoCredentialsModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onClose]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div className="modal-backdrop credentials-modal-backdrop" onMouseDown={onClose}>
      <div
        className="modal-card credentials-modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="demo-credentials-title"
        onMouseDown={event => event.stopPropagation()}
      >
        <button className="credentials-modal-close" type="button" onClick={onClose} aria-label="Close demo credentials">×</button>
        <div className="kicker">Try the backend safely</div>
        <h3 id="demo-credentials-title">Demo credentials are built in</h3>
        <p>Use <strong>admin@onix.demo</strong> and password <strong>onix24</strong> to test the administration area.</p>
        <div className="notice-bar">Everything you edit lives in a separate 10-minute sandbox and automatically rolls back. There is deliberately no action that can publish demo edits onto the protected portfolio copy.</div>
        <button className="btn dark" type="button" onClick={onClose}>Got it</button>
      </div>
    </div>,
    document.body,
  );
}
