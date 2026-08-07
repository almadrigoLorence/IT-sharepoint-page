import { useState } from 'react';
import { useAcademy } from '../../context/DataContext.jsx';
import Button from '../../components/Button.jsx';
import FileUpload from '../../components/FileUpload.jsx';
import './AdminTeam.css';

export default function AdminTeam() {
  const { data, updateTeamSettings, addTeamMember, updateTeamMember, removeTeamMember } = useAcademy();
  const team = data.team || { title: '', description: '', members: [] };

  const [title, setTitle] = useState(team.title || 'Meet Our IT & Engineering Team');
  const [description, setDescription] = useState(
    team.description || 'The dedicated experts leading reliability, training, cloud architecture, and compliance across ASEPH.'
  );
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
    <div className="admin-team-page">
      {/* Top Page Header */}
      <div className="team-admin-header">
        <div>
          <span className="team-eyebrow">HOME PAGE CUSTOMIZATION</span>
          <h1>Team Presentation Management</h1>
          <p>Add team members, assign roles, upload avatars, and edit section titles displayed on the Home page.</p>
        </div>
        <Button variant="primary" size="md" onClick={() => setCreating((c) => !c)}>
          {creating ? 'Close Form' : '+ Add Team Member'}
        </Button>
      </div>

      {savedNotice && (
        <div className="team-alert-banner">
          ⚡ Team section settings successfully saved to database!
        </div>
      )}

      {/* Section Header Editor Box */}
      <div className="admin-team-card-box">
        <div className="box-head">
          <span className="box-icon">🏷️</span>
          <h2>Team Section Header Settings</h2>
        </div>
        <form onSubmit={handleSaveHeader} className="team-header-form">
          <div className="form-group-row">
            <div className="field-group">
              <label>Section Title</label>
              <input
                type="text"
                className="custom-admin-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Meet Our IT & Engineering Team"
                required
              />
            </div>
            <div className="field-group">
              <label>Section Subtitle / Description</label>
              <input
                type="text"
                className="custom-admin-input"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of your team..."
              />
            </div>
          </div>
          <div className="form-action-right">
            <Button type="submit" variant="secondary" size="sm">
              Save Section Header
            </Button>
          </div>
        </form>
      </div>

      {/* New Member Form + Live Card Preview */}
      {creating && (
        <div className="admin-team-card-box highlight-box animate-fade-in">
          <div className="box-head">
            <span className="box-icon">👤</span>
            <h2>New Team Member</h2>
          </div>

          <div className="side-by-side-layout">
            <form onSubmit={handleAddMember} className="team-member-form">
              <div className="field-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  className="custom-admin-input"
                  value={memberForm.name}
                  onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })}
                  placeholder="e.g. J. Ramirez"
                  required
                />
              </div>

              <div className="field-group">
                <label>Role / Position *</label>
                <input
                  type="text"
                  className="custom-admin-input"
                  value={memberForm.role}
                  onChange={(e) => setMemberForm({ ...memberForm, role: e.target.value })}
                  placeholder="e.g. Lead Reliability Engineer"
                  required
                />
              </div>

              <div className="field-group">
                <label>Avatar Image URL or Upload File</label>
                <input
                  type="text"
                  className="custom-admin-input mb-2"
                  value={memberForm.avatar}
                  onChange={(e) => setMemberForm({ ...memberForm, avatar: e.target.value })}
                  placeholder="https://..."
                />
                <FileUpload
                  onDataUrl={(url) => setMemberForm({ ...memberForm, avatar: url })}
                  accept="image/*"
                  label="Upload Image File"
                />
              </div>

              <div className="field-group">
                <label>Short Bio / Specialties</label>
                <textarea
                  rows="3"
                  className="custom-admin-textarea"
                  value={memberForm.bio}
                  onChange={(e) => setMemberForm({ ...memberForm, bio: e.target.value })}
                  placeholder="Specializes in TCT, HAST testing standards..."
                />
              </div>

              <div className="form-action-right gap-2">
                <Button type="button" variant="ghost" size="sm" onClick={() => setCreating(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Add Member
                </Button>
              </div>
            </form>

            {/* Live Member Card Preview */}
            <div className="card-preview-column">
              <span className="preview-tag">LIVE CARD PREVIEW</span>
              <div className="member-preview-card">
                <img src={memberForm.avatar} alt="Preview Avatar" className="preview-avatar" />
                <h3 className="preview-name">{memberForm.name || 'Member Name'}</h3>
                <span className="preview-role">{memberForm.role || 'Assigned Role'}</span>
                <p className="preview-bio">{memberForm.bio || 'Short member bio or specialties will appear here.'}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Members Directory List */}
      <div className="admin-team-card-box">
        <div className="box-head">
          <span className="box-icon">👥</span>
          <h2>Active Team Members ({team.members?.length || 0})</h2>
        </div>

        <div className="members-directory-grid">
          {(team.members || []).map((member) => (
            <div key={member.id} className="team-member-item-card">
              {editingId === member.id ? (
                <EditMemberInlineForm
                  member={member}
                  onSave={(updated) => {
                    updateTeamMember(member.id, updated);
                    setEditingId(null);
                  }}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <div className="member-item-inner">
                  <div className="member-info-group">
                    <img src={member.avatar} alt={member.name} className="member-item-avatar" />
                    <div className="member-item-text">
                      <h3>{member.name}</h3>
                      <span className="member-item-role">{member.role}</span>
                      {member.bio && <p className="member-item-bio">{member.bio}</p>}
                    </div>
                  </div>
                  <div className="member-item-actions">
                    <button className="icon-edit-btn" onClick={() => setEditingId(member.id)} title="Edit Member">
                      ✎ Edit
                    </button>
                    <button className="icon-delete-btn" onClick={() => removeTeamMember(member.id)} title="Delete Member">
                      🗑 Delete
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

function EditMemberInlineForm({ member, onSave, onCancel }) {
  const [form, setForm] = useState(member);

  return (
    <div className="inline-edit-form">
      <h4>Edit Team Member Info</h4>
      <div className="form-group-row mb-3">
        <div className="field-group">
          <label>Full Name</label>
          <input
            type="text"
            className="custom-admin-input"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div className="field-group">
          <label>Role</label>
          <input
            type="text"
            className="custom-admin-input"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          />
        </div>
      </div>

      <div className="field-group mb-3">
        <label>Avatar URL or File Upload</label>
        <input
          type="text"
          className="custom-admin-input mb-2"
          value={form.avatar}
          onChange={(e) => setForm({ ...form, avatar: e.target.value })}
        />
        <FileUpload onDataUrl={(url) => setForm({ ...form, avatar: url })} accept="image/*" label="Upload Avatar File" />
      </div>

      <div className="field-group mb-3">
        <label>Bio</label>
        <textarea
          rows="2"
          className="custom-admin-textarea"
          value={form.bio || ''}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
        />
      </div>

      <div className="form-action-right gap-2">
        <Button size="sm" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button size="sm" variant="primary" onClick={() => onSave(form)}>
          Save Member
        </Button>
      </div>
    </div>
  );
}
