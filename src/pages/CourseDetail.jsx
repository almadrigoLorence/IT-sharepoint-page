import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAcademy } from '../context/DataContext.jsx';
import useLoading from '../hooks/useLoading.js';
import Button from '../components/Button.jsx';
import Spinner from '../components/Spinner.jsx';
import './CourseDetail.css';

export default function CourseDetail() {
  const { id } = useParams();
  const { data } = useAcademy();
  const navigate = useNavigate();
  const loading = useLoading([id]);
  const [registering, setRegistering] = useState(false);
  const [registered, setRegistered] = useState(false);

  const course = data.courses.find((c) => c.id === id);

  if (!loading && !course) {
    return (
      <div className="container section">
        <div className="empty-state">
          <h3>Course not found</h3>
          <p>It may have been removed or renamed.</p>
          <Button as={Link} to="/catalog" variant="secondary" style={{ marginTop: 16 }}>Back to catalog</Button>
        </div>
      </div>
    );
  }

  function handleRegister() {
    setRegistering(true);
    setTimeout(() => {
      setRegistering(false);
      setRegistered(true);
    }, 700);
  }

  return (
    <div>
      <div className="course-banner">
        <div className="container">
          {loading ? (
            <div className="skeleton skeleton-line" style={{ width: 260, height: 28 }} />
          ) : (
            <>
              <button className="back-link" onClick={() => navigate(-1)}>← Back</button>
              <div className="course-banner-badges">
                <span className="badge">{course.category}</span>
                <span className="badge amber">{course.level}</span>
                <span className="badge neutral">{course.duration}</span>
              </div>
              <h1>{course.title}</h1>
            </>
          )}
        </div>
      </div>

      {!loading && course && (
        <div className="container section course-layout fade-up">
          <div className="course-main">
            <section className="course-block">
              <h2>About this course</h2>
              <p className="course-audience">{course.audience}</p>
              <ul className="objectives">
                {course.objectives.map((o, i) => <li key={i}>{o}</li>)}
              </ul>
            </section>

            <section className="course-block">
              <h2>Modules / outline</h2>
              <ol className="modules">
                {course.modules.map((m, i) => <li key={i}><span>{i + 1}</span>{m}</li>)}
              </ol>
            </section>

            <section className="course-block">
              <h2>Materials</h2>
              {course.materials.length === 0 ? (
                <p className="course-audience">No materials uploaded yet.</p>
              ) : (
                <ul className="materials-list">
                  {course.materials.map((m) => (
                    <li key={m.id}>
                      <span className="badge neutral">{m.type}</span>
                      {m.dataUrl ? (
                        <a href={m.dataUrl} download={m.name}>{m.name}</a>
                      ) : (
                        <span>{m.name}</span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="course-block">
              <h2>Quiz / assessment</h2>
              <p className="course-audience">Microsoft Forms–style quiz embed. Score feeds the completion tracker on My Progress.</p>
              <div className="quiz-embed">Assessment embed placeholder</div>
            </section>
          </div>

          <aside className="course-sidebar card">
            <h3>At a glance</h3>
            <dl>
              <dt>Trainer</dt><dd>{course.trainer}</dd>
              <dt>Prerequisites</dt><dd>{course.prerequisites || 'None'}</dd>
              <dt>Next session</dt><dd>{course.nextSession}</dd>
            </dl>
            <Button
              onClick={handleRegister}
              loading={registering}
              disabled={registered}
              variant={registered ? 'secondary' : 'primary'}
              size="lg"
              style={{ width: '100%' }}
            >
              {registered ? 'Registered ✓' : 'Register'}
            </Button>
            {registered && <p className="register-note">You're on the list — an invite will follow.</p>}
          </aside>
        </div>
      )}

      {loading && (
        <div className="page-loader"><Spinner /> <span>Loading course…</span></div>
      )}
    </div>
  );
}
