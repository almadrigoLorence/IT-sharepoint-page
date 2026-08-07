import { useState, useEffect } from 'react';
import Button from './Button.jsx';
import './Carousel.css';

export default function Carousel({ slides }) {
  const [activeIdx, setActiveIdx] = useState(0);

  const slideList = slides && slides.length > 0 ? slides : [
    {
      id: 'default-1',
      title: 'SharePoint & IT Training Hub',
      subtitle: 'Accelerate your technical mastery in security, reliability, and enterprise tools.',
      image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&auto=format&fit=crop&q=80',
      buttonText: 'Explore Courses',
      buttonUrl: '/catalog'
    }
  ];

  useEffect(() => {
    if (slideList.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % slideList.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slideList.length]);

  const current = slideList[activeIdx] || slideList[0];

  return (
    <div className="hero-carousel">
      <div
        className="carousel-bg"
        style={{ backgroundImage: `linear-gradient(to bottom, rgba(11, 15, 25, 0.4), rgba(11, 15, 25, 0.95)), url(${current.image})` }}
      />
      <div className="container carousel-container">
        <div className="carousel-content animate-slide-up" key={current.id || activeIdx}>
          <span className="hero-badge">FEATURED HUB</span>
          <h1 className="hero-title">{current.title}</h1>
          <p className="hero-subtitle">{current.subtitle}</p>
          {current.buttonText && (
            <div className="hero-actions">
              <Button variant="primary" size="lg" to={current.buttonUrl || '/catalog'}>
                {current.buttonText} →
              </Button>
            </div>
          )}
        </div>

        {slideList.length > 1 && (
          <div className="carousel-indicators">
            {slideList.map((s, idx) => (
              <button
                key={s.id || idx}
                className={`indicator-dot ${idx === activeIdx ? 'active' : ''}`}
                onClick={() => setActiveIdx(idx)}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
