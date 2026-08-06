import { useState } from 'react';
import { useAcademy } from '../context/DataContext.jsx';
import useLoading from '../hooks/useLoading.js';
import Button from '../components/Button.jsx';
import './Events.css';

export default function Events() {
  const { data } = useAcademy();
  const loading = useLoading([]);
  const [registeredIds, setRegisteredIds] = useState([]);
  const [pendingId, setPendingId] = useState(null);

  const sorted = [...data.events].sort((a, b) => new Date(a.date) - new Date(b.date));
  const next = sorted[0];

  function register(id) {
    setPendingId(id);
    setTimeout(() => {
      setRegisteredIds((r) => [...r, id]);
      setPendingId(null);
    }, 650);
  }

  return (
    <div className="container">
      <div className="page-head">
        <span className="eyebrow">Events &amp; Calendar</span>
        <h1>Upcoming training sessions</h1>
        <p className="lede">Register → get an Outlook invite → attend → completion logged automatically.</p>
      </div>

      <div className="section events-layout">
        <div>
          {loading ? (
            <div className="stack">
              {[0, 1, 2, 3].map((i) => <div key={i} className="skeleton" style={{ height: 70 }} />)}
            </div>
          ) : (
            <ul className="calendar-list stagger">
              {sorted.map((e) => {
                const isRegistered = registeredIds.includes(e.id);
                return (
                  <li key={e.id} className="calendar-item card card-hover">
                    <div className="calendar-date">
                      <span>{new Date(e.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                      <strong>{new Date(e.date).getDate()}</strong>
                    </div>
                    <div className="calendar-info">
                      <h3>{e.title}</h3>
                      <p>{e.time} · {e.venue} · {e.seats} seats</p>
                    </div>
                    <Button
                      variant={isRegistered ? 'secondary' : 'primary'}
                      size="sm"
                      loading={pendingId === e.id}
                      disabled={isRegistered}
                      onClick={() => register(e.id)}
                    >
                      {isRegistered ? 'Registered ✓' : 'Register'}
                    </Button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {next && (
          <aside className="next-session card">
            <span className="badge">Next session</span>
            <h3>{next.title}</h3>
            <p>{new Date(next.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · {next.time}</p>
            <div className="how-it-works">
              <h4>How it works</h4>
              <p>Register → get Outlook invite → attend → completion logged</p>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
