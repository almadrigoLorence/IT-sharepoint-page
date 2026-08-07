import { useState } from 'react';
import { useAcademy } from '../../context/DataContext.jsx';
import Button from '../../components/Button.jsx';
import FileUpload from '../../components/FileUpload.jsx';
import './AdminLayout.css';
import './admin-shared.css';

export default function AdminTeam() {
  const { data, updateTeamSettings, addTeamMember, updateTeamMember, removeTeamMember } = useAcademy();
  const team = data.team || { title: '', description: '', members: [] };

  const [title, setTitle] = useState(team.title || 'Meet Our IT & Engineering Team');
  const [description, setDescription] = useState(team.description || 'The dedicated experts leading reliability, training, cloud architecture, and compliance across ASEPH.');
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [savedNotice, setSavedNotice] = useState(false);

  const [memberForm, setMemberForm] = useState({
    name: '',
    role: '',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    bio: '',
  });

  function handleSaveHeader(e) {
    e.preventDefault();
    updateTeamSettings({ title, description });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  }

  function handleAddMember(e) {
    e.preventDefault();
    if (!memberForm.name || !memberForm.role) return;
    addTeamMember(memberForm);
    setMemberForm({
      name: '',
      role: '',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      bio: '',
    });
    setCreating(false);
  }

  return (
    <div>
      <div className="admin-page-head">
        <div>
          <span className="eyebrow">Home Page Customization</span>
          <h1>Team Presentation Management</h1>
          <p>Add team members, assign roles, upload avatars, and edit section titles displayed on the Home page.</p>
        </div>
        <Button variant="primary" onClick={() => setCreating((c) => !c)}>
          {creating ? 'Close Form' : '+ Add Team Member'}
        </Button>
      </div>

      {savedNotice && (
        <div className="admin-notice success">
          ⚡ Team section settings saved to database!
        </div>
      )}

      {/* Section Title & Description */}
      <form className="admin-panel mb-6" onSubmit={handleSaveHeader}>
        <h2>Team Section Header</h2>
        <div className="admin-form-grid">
          <label>
            Section Title
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Meet Our IT & Engineering Team"
              required
            />
          </label>

          <label>
            Section Subtitle / Description
            <textarea
              rows="2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of your team..."
            />
          </label>
        </div>

        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
          <Button type="submit" variant="secondary" size="sm">
            Save Section Header
          </Button>
        </div>
      </form>

      {/* New Member Form */}
      {creating && (
        <form className="admin-panel mb-6" onSubmit={handleAddMember}>
          <h2>New Team Member</h2>
          <div className="admin-form-grid">
            <label>
              Full Name *
              <input
                type="text"
                value={memberForm.name}
                onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })}
                placeholder="e.g. J. Ramirez"
                required
              />
            </label>

            <label>
              Role / Position *
              <input
                type="text"
                value={memberForm.role}
                onChange={(e) => setMemberForm({ ...memberForm, role: e.target.value })}
                placeholder="e.g. Lead Reliability Engineer"
                required
              />
            </label>

            <label>
              Avatar Image URL / Upload
              <input
                type="text"
                value={memberForm.avatar}
                onChange={(e) => setMemberForm({ ...memberForm, avatar: e.target.value })}
                placeholder="https://..."
              />
              <FileUpload
                onDataUrl={(url) => setMemberForm({ ...memberForm, avatar: url })}
                accept="image/*"
                label="Upload Avatar Image"
              />
            </label>

            <label>
              Short Bio / Specialties
              <textarea
                rows="2"
                value={memberForm.bio}
                onChange={(e) => setMemberForm({ ...memberForm, bio: e.target.value })}
                placeholder="Specializes in TCT, HAST testing standards..."
              />
            </label>
          </div>

          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
            <Button type="button" variant="ghost" onClick={() => setCreating(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Add Member
            </Button>
          </div>
        </form>
      )}

      {/* Members Grid List */}
      <div className="admin-panel">
        <h2>Team Members ({team.members?.length || 0})</h2>
        <div className="admin-entity-list" style={{ marginTop: '1rem' }}>
          {(team.members || []).map((member) => (
            <div key={member.id} className="admin-entity-row" style={{ padding: '1.25rem' }}>
              {editingId === member.id ? (
                <EditMemberForm
                  member={member}
                  onSave={(updated) => {
                    updateTeamMember(member.id, updated);
                    setEditingId(null);
                  }}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <img
                      src={member.avatar}
                      alt={member.name}
                      style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', border: '2px solid #0078d4' }}
                    />
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#f3f4f6' }}>{member.name}</h3>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: '#0078d4', fontWeight: 600 }}>{member.role}</p>
                      {member.bio && <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: '#9ca3af' }}>{member.bio}</p>}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="admin-icon-btn" onClick={() => setEditingId(member.id)} title="Edit Member">
                      ✎
                    </button>
                    <button className="admin-icon-btn danger" onClick={() => removeTeamMember(member.id)} title="Delete Member">
                      🗑
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function EditMemberForm({ member, onSave, onCancel }) {
  const [form, setForm] = useState(member);

  return (
    <div>
      <h3 style={{ marginBottom: '1rem' }}>Edit Team Member</h3>
      <div className="admin-form-grid">
        <label>
          Full Name
          <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </label>
        <label>
          Role
          <input type="text" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
        </label>
        <label>
          Avatar Image
          <input type="text" value={form.avatar} onChange={(e) => setForm({ ...form, avatar: e.target.value })} />
          <FileUpload onDataUrl={(url) => setForm({ ...form, avatar: url })} accept="image/*" label="Upload Avatar" />
        </label>
        <label>
          Bio
          <textarea rows="2" value={form.bio || ''} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
        </label>
      </div>
      <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
        <Button size="sm" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button size="sm" variant="primary" onClick={() => onSave(form)}>Save Changes</Button>
      </div>
    </div>
  );
}
