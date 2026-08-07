import './TeamSection.css';

export default function TeamSection({ team }) {
  if (!team || !team.members || team.members.length === 0) return null;

  return (
    <section className="team-section section-padding">
      <div className="container">
        <div className="section-header text-center animate-fade-in">
          <span className="eyebrow-badge">OUR EXPERTS</span>
          <h2 className="section-title">{team.title || 'Meet Our IT & Engineering Team'}</h2>
          <p className="section-subtitle">
            {team.description || 'The dedicated experts leading reliability, training, cloud architecture, and compliance across ASEPH.'}
          </p>
        </div>

        <div className="team-grid">
          {team.members.map((member, idx) => (
            <div
              key={member.id || idx}
              className="team-card glass-card animate-card-float"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="team-avatar-wrapper">
                <img
                  src={member.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'}
                  alt={member.name}
                  className="team-avatar"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80';
                  }}
                />
                <span className="team-status-dot" title="Active Lead"></span>
              </div>

              <div className="team-card-content">
                <h3 className="team-member-name">{member.name}</h3>
                <span className="team-member-role">{member.role}</span>
                {member.bio && <p className="team-member-bio">{member.bio}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
