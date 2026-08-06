import { useRef, useState } from 'react';
import Spinner from './Spinner.jsx';
import './FileUpload.css';

const MAX_BYTES = 4 * 1024 * 1024; // 4MB, keeps browser localStorage happy

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * onAttached receives { name, size, type, dataUrl }
 */
export default function FileUpload({ onAttached, existing, onRemove, label = 'Attach a file' }) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function handleChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    if (file.size > MAX_BYTES) {
      setError('File is larger than 4MB — pick a smaller file for this demo storage.');
      e.target.value = '';
      return;
    }
    setBusy(true);
    try {
      const dataUrl = await readFileAsDataUrl(file);
      onAttached({ name: file.name, size: file.size, type: file.type || 'file', dataUrl });
    } catch {
      setError('Could not read that file — try again.');
    } finally {
      setBusy(false);
      e.target.value = '';
    }
  }

  return (
    <div className="file-upload">
      <input ref={inputRef} type="file" hidden onChange={handleChange} />
      {!existing && (
        <button
          type="button"
          className="file-upload-trigger"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
        >
          {busy ? <Spinner size={14} /> : <span className="file-upload-icon">＋</span>}
          <span>{busy ? 'Uploading…' : label}</span>
        </button>
      )}
      {existing && (
        <div className="file-chip">
          <span className="file-chip-icon">📎</span>
          <a href={existing.dataUrl} download={existing.name} className="file-chip-name" title="Download">
            {existing.name}
          </a>
          {onRemove && (
            <button type="button" className="file-chip-remove" onClick={onRemove} aria-label="Remove file">
              ×
            </button>
          )}
        </div>
      )}
      {error && <p className="file-upload-error">{error}</p>}
    </div>
  );
}
