const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

const DB_FILE = 'data.json';

function loadDB() {
  if (!fs.existsSync(DB_FILE)) {
    return { projects: [], messages: [] };
  }
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  } catch {
    return { projects: [], messages: [] };
  }
}

function saveDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

app.get('/', (req, res) => {
  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>MaxFilm</title><style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:100%;height:100%}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#050608;color:#f5f5f5;overflow:hidden}
.screen{display:none}.screen.active{display:flex}
.app-wrapper{display:flex;width:100%;height:100vh}

/* Auth */
.auth-screen{width:100%;height:100%;align-items:center;justify-content:center}
.auth-box{width:100%;max-width:360px;padding:32px 28px;background:#0e1014;border-radius:4px;border:1px solid #252731;text-align:center}
.auth-box h1{font-size:22px;margin-bottom:6px;font-weight:600;letter-spacing:0.16em;text-transform:uppercase}
.auth-tagline{color:#a0a0ab;font-size:12px;margin-bottom:18px}
.form-group{margin-bottom:18px;text-align:left}
.form-group label{display:block;font-size:10px;font-weight:500;margin-bottom:6px;text-transform:uppercase;letter-spacing:0.16em;color:#8a8b93}
.form-group input{width:100%;padding:9px 9px;background:#101219;border-radius:3px;border:1px solid #2b2d39;color:#f5f5f5;font-size:13px}
.form-group input:focus{outline:0;border-color:#f5f5f5}
.auth-btn{width:100%;padding:9px;background:#f5f5f5;border-radius:3px;border:1px solid #f5f5f5;color:#050608;font-weight:500;font-size:12px;cursor:pointer;text-transform:uppercase;letter-spacing:0.16em}
.auth-btn:hover{background:#ffffff}

/* Sidebar */
.sidebar{width:240px;background:#050608;border-right:1px solid #1c1e26;display:flex;flex-direction:column;overflow-y:auto;height:100vh}
.sidebar-header{padding:12px 14px;border-bottom:1px solid #1c1e26}
.sidebar-header h2{font-size:13px;font-weight:600;letter-spacing:0.18em;text-transform:uppercase}
.sidebar-nav{display:flex;gap:6px;margin-top:8px}
.sidebar-nav button{flex:1;padding:6px 6px;border-radius:3px;border:1px solid #262833;background:#101218;font-size:9px;font-weight:500;cursor:pointer;color:#d8d9e0;text-transform:uppercase}
.sidebar-nav button.active{background:#f5f5f5;color:#050608;border-color:#f5f5f5}
.sidebar-content{flex:1;padding:10px 10px;overflow-y:auto}
.projects-label{font-size:9px;font-weight:500;color:#6b6c76;text-transform:uppercase;letter-spacing:0.16em;margin-bottom:6px;padding:0 2px}
.project-search{margin-bottom:8px}
.project-search input{width:100%;padding:7px 8px;border-radius:999px;border:1px solid #262833;font-size:11px;background:#101218;color:#f5f5f5}
.project-search input:focus{outline:0;border-color:#f5f5f5}
.sidebar-projects{display:flex;flex-direction:column;gap:4px}
.sidebar-btn{width:100%;padding:7px 8px;background:#0e1014;border-radius:3px;border:1px solid #1d1f28;color:#f5f5f5;font-size:10px;font-weight:500;cursor:pointer;text-align:left}
.sidebar-btn:hover{border-color:#3b3d49}
.sidebar-btn.active{background:#f5f5f5;color:#050608;border-color:#f5f5f5}
.sidebar-footer{margin-top:auto;padding:10px 10px;border-top:1px solid #1c1e26;display:flex;gap:8px}
.sidebar-footer button{flex:1;padding:7px 8px;border-radius:3px;border:1px solid #262833;background:#101218;font-size:9px;font-weight:500;cursor:pointer;text-transform:uppercase;color:#e5e6ee}
.sidebar-footer button:first-child{background:#f5f5f5;color:#050608;border-color:#f5f5f5}

/* Main */
.main{flex:1;display:flex;flex-direction:column;overflow:hidden;background:#050608;height:100vh}
.header{padding:12px 18px;background:#050608;border-bottom:1px solid #1c1e26;display:flex;justify-content:space-between;align-items:center;min-height:50px}
.header-title{font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.16em}
.header-actions{display:flex;gap:8px}
.btn{padding:7px 11px;background:#f5f5f5;border-radius:3px;border:1px solid #f5f5f5;color:#050608;font-size:10px;font-weight:500;cursor:pointer;text-transform:uppercase;letter-spacing:0.12em}
.btn.secondary{background:transparent;color:#e5e6ee;border-color:#3a3c46}
.btn.secondary:hover{background:#111219}
.btn:hover{background:#ffffff}
.save-indicator{font-size:9px;color:#6b6c76}

/* Content area */
.content-area{flex:1;overflow:hidden;display:flex;flex-direction:column;background:#050608}

/* Dashboard */
#dashboardView{display:flex;flex-direction:column;padding:16px 18px;overflow-y:auto;gap:12px}
.stats-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;margin-bottom:12px}
.stat-card{background:#0b0d12;border-radius:3px;border:1px solid #1c1e26;padding:12px;display:flex;flex-direction:column;gap:4px}
.stat-label{font-size:9px;font-weight:600;text-transform:uppercase;letter-spacing:0.16em;color:#6b6c76}
.stat-value{font-size:24px;font-weight:700;color:#d4c6b3}
.stat-sub{font-size:10px;color:#8a8b93}
.dashboard-title{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.16em;color:#d4c6b3;margin-top:8px}
.projects-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:12px}
.project-card{background:#0b0d12;border-radius:3px;border:1px solid #1c1e26;padding:12px;cursor:pointer;display:flex;flex-direction:column;gap:6px}
.project-card:hover{border-color:#3b3d49}
.project-card-header{display:flex;justify-content:space-between;align-items:flex-start}
.project-card h4{font-size:12px;font-weight:600}
.project-chip{font-size:9px;padding:2px 6px;border-radius:2px;background:#151823;color:#d4c6b3;font-weight:500;text-transform:uppercase}
.project-meta{font-size:9px;color:#77798a}
.project-card-actions{display:flex;gap:6px}
.project-card-actions button{flex:1;padding:5px;border-radius:2px;background:#101218;border:1px solid #262833;color:#f5f5f5;font-size:9px;cursor:pointer;text-transform:uppercase}
.project-card-actions button:hover{border-color:#3b3d49}

/* Tabs */
.tabs{display:flex;gap:0;border-bottom:1px solid #1c1e26;background:#050608;padding:0 18px;flex-wrap:wrap}
.tab{padding:10px 12px;background:transparent;border:none;border-bottom:2px solid transparent;color:#6b6c76;font-size:10px;font-weight:500;cursor:pointer;text-transform:uppercase;letter-spacing:0.12em}
.tab.active{color:#f5f5f5;border-bottom-color:#f5f5f5}

/* Tab content */
.tab-content{flex:1;overflow-y:auto;padding:16px 18px;display:none}
.tab-content.active{display:block}

/* Budget */
.budget-top{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;margin-bottom:16px}
.budget-stat{background:#0b0d12;border-radius:3px;border:1px solid #1c1e26;padding:12px}
.budget-stat-label{font-size:9px;font-weight:600;text-transform:uppercase;color:#6b6c76;margin-bottom:6px}
.budget-stat-value{font-size:20px;font-weight:700;color:#d4c6b3}
.budget-controls{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;gap:12px}
.budget-currency{padding:7px 9px;background:#101218;border-radius:3px;border:1px solid #262833;font-size:10px;color:#f5f5f5}
.budget-table-wrap{background:#0b0d12;border-radius:3px;border:1px solid #1c1e26;overflow-x:auto;margin-bottom:12px}
.data-table{width:100%;border-collapse:collapse}
.data-table th{background:#0e1014;padding:9px;text-align:left;font-size:9px;font-weight:700;text-transform:uppercase;border-bottom:1px solid #1c1e26;color:#8a8b93}
.data-table td{padding:8px 9px;border-bottom:1px solid #161924;font-size:11px}
.data-table input{width:100%;background:transparent;border:none;color:#f5f5f5;font-size:10px}
.data-table input:focus{outline:0;background:#101218}
.delete-btn{background:#101218;border-radius:2px;border:1px solid #262833;color:#a0a1af;padding:4px 6px;font-size:9px;cursor:pointer;text-transform:uppercase}
.delete-btn:hover{border-color:#3b3d49}

/* Shooting */
.shooting-top{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px;margin-bottom:16px}
.shooting-stat{background:#0b0d12;border-radius:3px;border:1px solid #1c1e26;padding:10px}
.shooting-stat-label{font-size:9px;font-weight:600;text-transform:uppercase;color:#6b6c76;margin-bottom:4px}
.shooting-stat-value{font-size:18px;font-weight:700;color:#d4c6b3}

/* Scripts */
.scripts-upload{background:#0b0d12;border-radius:3px;border:2px dashed #262833;padding:16px;text-align:center;cursor:pointer;margin-bottom:12px}
.scripts-upload:hover{border-color:#3b3d49}
.scripts-list-card{background:#0b0d12;border-radius:3px;border:1px solid #1c1e26;padding:12px;display:flex;flex-direction:column;gap:6px;margin-bottom:12px}
.script-item{padding:6px;background:#0e1014;border-radius:2px;border:1px solid #1d1f28;font-size:10px;cursor:pointer}
.script-item:hover{border-color:#3b3d49}
.scripts-viewer{background:#0b0d12;border-radius:3px;border:1px solid #1c1e26;padding:12px;flex:1;display:flex;flex-direction:column}
#scriptIframe{width:100%;flex:1;border:none;border-radius:2px;background:#050608}

/* Visuals */
.visuals-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px}
.visual-card{background:#0b0d12;border-radius:3px;border:1px solid #1c1e26;overflow:hidden;display:flex;flex-direction:column}
.visual-image{width:100%;aspect-ratio:16/9;background:#0e1014;display:flex;align-items:center;justify-content:center;border-bottom:1px solid #1c1e26;font-size:11px;color:#6b6c76;cursor:pointer}
.visual-image img{width:100%;height:100%;object-fit:cover}
.visual-notes{padding:8px}
.visual-notes textarea{width:100%;background:#0e1014;color:#f5f5f5;padding:6px;border-radius:2px;border:1px solid #262833;font-size:10px;min-height:40px;font-family:inherit}
.visual-notes textarea:focus{outline:0;border-color:#f5f5f5}

/* Chat */
.chat-container{display:flex;flex-direction:column;height:100%;gap:8px}
.chat-toggle{display:flex;gap:8px;margin-bottom:8px}
.chat-toggle button{padding:6px 10px;border-radius:3px;border:1px solid #262833;background:#101218;font-size:9px;color:#e5e6ee;cursor:pointer;text-transform:uppercase}
.chat-toggle button.active{background:#f5f5f5;color:#050608;border-color:#f5f5f5}
.messages-area{flex:1;overflow-y:auto;background:#0b0d12;border-radius:3px;border:1px solid #1c1e26;padding:12px}
.message-item{margin-bottom:8px;padding-bottom:8px;border-bottom:1px solid #161924}
.message-text{font-size:11px;color:#f5f5f5;margin-bottom:3px;word-break:break-word}
.message-file{display:inline-block;padding:4px 7px;background:#101218;border-radius:999px;border:1px solid #262833;font-size:9px;text-decoration:none;color:#f5f5f5;margin:3px 0;cursor:pointer}
.message-file:hover{border-color:#3b3d49}
.message-meta{font-size:9px;color:#77798a}
.input-area{background:#0b0d12;border-radius:3px;border:1px solid #1c1e26;padding:8px;display:flex;gap:8px;flex-wrap:wrap}
.message-input{flex:1;padding:7px 8px;border-radius:3px;border:1px solid #262833;background:#101218;font-size:11px;min-height:32px;color:#f5f5f5;min-width:200px}
.file-preview{padding:6px 8px;background:#101218;border-radius:999px;border:1px solid #262833;font-size:9px;display:flex;gap:6px;align-items:center}
.file-preview button{background:transparent;border:none;color:#a0a1af;cursor:pointer}
.attach-btn{padding:6px 8px;background:#101218;border-radius:3px;border:1px solid #262833;cursor:pointer;font-size:9px;color:#e5e6ee;text-transform:uppercase}
.send-btn{padding:6px 9px;background:#f5f5f5;border-radius:3px;border:1px solid #f5f5f5;color:#050608;cursor:pointer;font-size:9px;font-weight:500;text-transform:uppercase}

::-webkit-scrollbar{width:8px}
::-webkit-scrollbar-track{background:#050608}
::-webkit-scrollbar-thumb{background:#2b2d38;border-radius:4px}
::-webkit-scrollbar-thumb:hover{background:#3e404c}
input[type="file"]{display:none}
.empty-text{font-size:10px;color:#6b6c76;padding:16px;text-align:center}
</style></head><body>

<div id="authScreen" class="screen active">
  <div class="auth-screen">
    <div class="auth-box">
      <h1>MAXFILM</h1>
      <div class="auth-tagline">Production Management</div>
      <div class="form-group">
        <label>Password</label>
        <input type="password" id="password" placeholder="Enter password" onkeypress="if(event.key==='Enter') app.login()">
      </div>
      <button class="auth-btn" onclick="app.login()">Enter</button>
    </div>
  </div>
</div>

<div id="appScreen" class="screen">
  <div class="app-wrapper">
    <div class="sidebar">
      <div class="sidebar-header">
        <h2>MAXFILM</h2>
        <div class="sidebar-nav">
          <button id="navProjects" class="active" onclick="app.showDashboard()">Projects</button>
          <button id="navProject" style="display:none" onclick="app.openCurrentProject()">Editing</button>
        </div>
      </div>

      <div class="sidebar-content">
        <div class="projects-label">My projects</div>
        <div class="project-search">
          <input id="projectSearchInput" type="text" placeholder="Search" oninput="app.filterProjects()">
        </div>
        <div class="sidebar-projects" id="projectsList"></div>
      </div>

      <div class="sidebar-footer">
        <button onclick="app.openNewProjectModal()">New Project</button>
        <button onclick="app.logout()">Logout</button>
      </div>
    </div>

    <div class="main">
      <div class="header">
        <div class="header-title" id="headerTitle">Projects Dashboard</div>
        <div class="header-actions">
          <span class="save-indicator" id="saveIndicator">Auto-save on</span>
          <button class="btn secondary" id="backBtn" style="display:none" onclick="app.showDashboard()">Back</button>
        </div>
      </div>

      <div class="content-area">
        <div id="dashboardView">
          <div class="stats-grid">
            <div class="stat-card"><div class="stat-label">Total Projects</div><div class="stat-value" id="totalProjects">0</div></div>
            <div class="stat-card"><div class="stat-label">Total Budget</div><div class="stat-value" id="totalBudget">—</div></div>
            <div class="stat-card"><div class="stat-label">Shooting Days</div><div class="stat-value" id="totalDays">0</div></div>
          </div>
          <div class="dashboard-title">All Projects</div>
          <div class="projects-grid" id="projectsGrid"></div>
        </div>

        <div id="projectEditorView" style="display:none;flex:1;flex-direction:column">
          <div class="tabs">
            <button class="tab active" onclick="app.switchTab('budget')">Budget</button>
            <button class="tab" onclick="app.switchTab('shooting')">Shooting</button>
            <button class="tab" onclick="app.switchTab('scripts')">Scripts</button>
            <button class="tab" onclick="app.switchTab('visuals')">Visuals</button>
            <button class="tab" onclick="app.switchTab('chat')">Notes</button>
          </div>

          <div class="content-area">
            <div id="budgetTab" class="tab-content active">
              <div class="budget-top">
                <div class="budget-stat"><div class="budget-stat-label">Total</div><div class="budget-stat-value"><span id="currencySymbol">kr</span> <span id="budgetTotal">0.00</span></div></div>
                <div class="budget-stat"><div class="budget-stat-label">Categories</div><div class="budget-stat-value" id="budgetCategories">0</div></div>
              </div>
              <div class="budget-controls">
                <select class="budget-currency" id="currencySelect" onchange="app.changeCurrency()">
                  <option value="NOK">NOK</option><option value="USD">USD</option><option value="EUR">EUR</option>
                </select>
                <button class="btn secondary" onclick="app.addBudgetLine()">Add</button>
              </div>
              <div class="budget-table-wrap">
                <table class="data-table"><thead><tr><th>Category</th><th>Description</th><th>Amount</th><th></th></tr></thead><tbody id="budgetList"></tbody></table>
              </div>
            </div>

            <div id="shootingTab" class="tab-content">
              <div class="shooting-top">
                <div class="shooting-stat"><div class="shooting-stat-label">Days</div><div class="shooting-stat-value" id="totalShootingDays">0</div></div>
                <div class="shooting-stat"><div class="shooting-stat-label">Locations</div><div class="shooting-stat-value" id="uniqueLocations">0</div></div>
              </div>
              <button class="btn secondary" style="margin-bottom:12px" onclick="app.addShootingDay()">Add Day</button>
              <div class="budget-table-wrap">
                <table class="data-table"><thead><tr><th>Date</th><th>Location</th><th>Scenes</th><th>Notes</th><th></th></tr></thead><tbody id="shootingList"></tbody></table>
              </div>
            </div>

            <div id="scriptsTab" class="tab-content">
              <label class="scripts-upload" onclick="document.getElementById('scriptFileInput').click()">
                <div>Upload Scripts</div>
                <input type="file" id="scriptFileInput" accept=".pdf,.doc,.docx,.txt" onchange="app.handleScriptUpload()">
              </label>
              <div class="scripts-list-card"><div style="font-size:9px;font-weight:600;color:#6b6c76;margin-bottom:6px">Uploaded</div><div id="scriptsList"></div></div>
              <div class="scripts-viewer"><div id="scriptViewerEmpty">Select a PDF</div><iframe id="scriptIframe"></iframe></div>
            </div>

            <div id="visualsTab" class="tab-content">
              <button class="btn secondary" style="margin-bottom:12px" onclick="app.addStoryboard()">Add Frame</button>
              <div class="visuals-grid" id="storyboardsList"></div>
            </div>

            <div id="chatTab" class="tab-content">
              <div class="chat-container">
                <div class="chat-toggle"><button class="active" id="projectChatBtn" onclick="app.setChatScope('project')">Project</button><button id="publicChatBtn" onclick="app.setChatScope('public')">Public</button></div>
                <div class="messages-area" id="messagesArea"></div>
                <div class="input-area"><input type="text" id="messageInput" class="message-input" placeholder="Add note"><button class="attach-btn" onclick="document.getElementById('fileInput').click()">Attach</button><button class="send-btn" onclick="app.sendMessage()">Send</button><input type="file" id="fileInput" onchange="app.handleFileSelect()"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<div id="newProjectModal" style="position:fixed;inset:0;display:none;align-items:center;justify-content:center;background:rgba(0,0,0,0.55);z-index:50">
  <div style="background:#0b0d12;border-radius:3px;padding:14px;border:1px solid #1c1e26">
    <div style="font-size:11px;font-weight:600;text-transform:uppercase;margin-bottom:8px">New Project</div>
    <input id="newProjectNameInput" type="text" placeholder="Project name" style="width:100%;padding:8px;border-radius:3px;border:1px solid #262833;background:#101218;font-size:12px;margin-bottom:10px;color:#f5f5f5">
    <div style="display:flex;justify-content:flex-end;gap:8px"><button onclick="app.closeNewProjectModal()" style="padding:6px 10px;border:1px solid #262833;background:#101218;cursor:pointer;color:#e5e6ee">Cancel</button><button onclick="app.createProjectFromModal()" style="padding:6px 12px;background:#f5f5f5;color:#050608;cursor:pointer">Create</button></div>
  </div>
</div>

<script>
const app = {
  authenticated: false,
  currentProject: null,
  projects: [],
  publicMessages: [],
  projectMessages: [],
  selectedFile: null,
  autoSaveInterval: null,
  currentChatScope: 'project',
  projectFilter: '',

  login() {
    const pwd = document.getElementById('password').value;
    if (pwd === 'MAX') {
      this.authenticated = true;
      this.showApp();
      this.loadProjects();
      this.loadPublicMessages();
      this.startAutoSave();
    } else {
      alert('Wrong password');
    }
  },

  logout() {
    this.authenticated = false;
    location.reload();
  },

  showApp() {
    document.getElementById('authScreen').classList.remove('active');
    document.getElementById('appScreen').classList.add('active');
  },

  startAutoSave() {
    this.autoSaveInterval = setInterval(() => {
      if (this.currentProject) this.autoSaveProject();
    }, 5000);
  },

  async autoSaveProject() {
    if (!this.currentProject) return;
    this.currentProject.updatedAt = new Date().toLocaleDateString();
    await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(this.currentProject)
    });
    document.getElementById('saveIndicator').textContent = 'Saved ' + new Date().toLocaleTimeString();
  },

  async loadProjects() {
    const res = await fetch('/api/projects');
    this.projects = await res.json();
    this.renderDashboard();
  },

  async loadPublicMessages() {
    const res = await fetch('/api/messages?scope=public');
    this.publicMessages = await res.json();
  },

  async loadProjectMessages() {
    if (!this.currentProject) return;
    const res = await fetch('/api/messages?scope=project&projectId=' + this.currentProject.id);
    this.projectMessages = await res.json();
  },

  showDashboard() {
    this.currentProject = null;
    document.getElementById('dashboardView').style.display = 'block';
    document.getElementById('projectEditorView').style.display = 'none';
    document.getElementById('headerTitle').textContent = 'Projects Dashboard';
    this.renderDashboard();
  },

  renderDashboard() {
    const totalBudget = this.projects.reduce((sum, p) => sum + (p.budget?.items || []).reduce((s, i) => s + (parseFloat(i.amount) || 0), 0), 0);
    const totalDays = this.projects.reduce((sum, p) => sum + (p.shooting?.length || 0), 0);

    document.getElementById('totalProjects').textContent = this.projects.length;
    document.getElementById('totalBudget').textContent = totalBudget > 0 ? 'kr ' + totalBudget.toFixed(0) : '—';
    document.getElementById('totalDays').textContent = totalDays;

    const filtered = this.getFilteredProjects();
    let html = '';
    filtered.forEach(p => {
      html += '<div class="project-card" onclick="app.openProject(' + p.id + ')" style="cursor:pointer"><div class="project-card-header"><div><h4>' + (p.name || 'Untitled') + '</h4><div class="project-meta">Updated ' + (p.updatedAt || '-') + '</div></div><span class="project-chip">' + ((p.shooting && p.shooting.length) ? 'Shooting' : 'Planning') + '</span></div><div class="project-card-actions"><button onclick="event.stopPropagation();app.openProject(' + p.id + ')">Open</button><button onclick="event.stopPropagation();app.deleteProject(' + p.id + ')">Delete</button></div></div>';
    });
    document.getElementById('projectsGrid').innerHTML = html || '<div class="empty-text">No projects</div>';
    this.renderSidebar();
  },

  renderSidebar() {
    const filtered = this.getFilteredProjects();
    let html = '';
    filtered.forEach(p => {
      const isActive = this.currentProject && this.currentProject.id === p.id ? ' active' : '';
      html += '<button class="sidebar-btn' + isActive + '" onclick="app.openProject(' + p.id + ')" style="cursor:pointer">' + (p.name || 'Untitled') + '</button>';
    });
    document.getElementById('projectsList').innerHTML = html || '<div class="empty-text">No projects</div>';
  },

  getFilteredProjects() {
    if (!this.projectFilter) return this.projects;
    const f = this.projectFilter.toLowerCase();
    return this.projects.filter(p => (p.name || '').toLowerCase().includes(f));
  },

  filterProjects() {
    this.projectFilter = document.getElementById('projectSearchInput').value || '';
    this.renderDashboard();
  },

  openNewProjectModal() {
    document.getElementById('newProjectNameInput').value = '';
    document.getElementById('newProjectModal').style.display = 'flex';
    setTimeout(() => document.getElementById('newProjectNameInput').focus(), 20);
  },

  closeNewProjectModal() {
    document.getElementById('newProjectModal').style.display = 'none';
  },

  createProjectFromModal() {
    const name = document.getElementById('newProjectNameInput').value.trim();
    if (!name) return;
    this.closeNewProjectModal();
    this.currentProject = {
      id: Date.now(),
      name: name,
      scripts: [],
      storyboards: [],
      budget: { currency: 'NOK', items: [] },
      shooting: [],
      updatedAt: new Date().toLocaleDateString()
    };
    this.showProjectEditor();
    this.renderProjectEditor();
  },

  openProject(id) {
    this.currentProject = this.projects.find(p => p.id == id);
    if (!this.currentProject) return;
    if (!this.currentProject.scripts) this.currentProject.scripts = [];
    this.showProjectEditor();
    this.renderProjectEditor();
    this.loadProjectMessages();
  },

  showProjectEditor() {
    document.getElementById('dashboardView').style.display = 'none';
    document.getElementById('projectEditorView').style.display = 'flex';
    document.getElementById('headerTitle').textContent = this.currentProject.name;
  },

  openCurrentProject() {
    if (this.currentProject) this.showProjectEditor();
  },

  async deleteProject(id) {
    if (!confirm('Delete?')) return;
    await fetch('/api/projects/' + id, { method: 'DELETE' });
    this.projects = this.projects.filter(p => p.id != id);
    if (this.currentProject && this.currentProject.id == id) this.showDashboard();
    else this.renderDashboard();
  },

  switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.getElementById(tabName + 'Tab').classList.add('active');
    event.target.classList.add('active');
  },

  renderProjectEditor() {
    document.getElementById('currencySelect').value = this.currentProject.budget.currency || 'NOK';
    this.updateCurrencySymbol();
    this.renderBudget();
    this.renderShooting();
    this.renderScripts();
    this.renderStoryboards();
  },

  addBudgetLine() {
    this.currentProject.budget.items.push({ id: Date.now(), category: '', description: '', amount: 0 });
    this.renderBudget();
  },

  renderBudget() {
    const items = this.currentProject.budget.items || [];
    let rows = '';
    items.forEach(item => {
      rows += '<tr><td><input type="text" value="' + item.category + '" onchange="app.updateBudget(' + item.id + ',\'category\',this.value)"></td><td><input type="text" value="' + item.description + '" onchange="app.updateBudget(' + item.id + ',\'description\',this.value)"></td><td><input type="number" value="' + item.amount + '" onchange="app.updateBudget(' + item.id + ',\'amount\',this.value)"></td><td><button class="delete-btn" onclick="app.deleteBudgetLine(' + item.id + ')">Delete</button></td></tr>';
    });
    document.getElementById('budgetList').innerHTML = rows || '<tr><td colspan="4" class="empty-text">No items</td></tr>';
    const total = items.reduce((sum, i) => sum + (parseFloat(i.amount) || 0), 0);
    document.getElementById('budgetTotal').textContent = total.toFixed(2);
    document.getElementById('budgetCategories').textContent = new Set(items.map(i => i.category)).size;
  },

  updateBudget(id, field, value) {
    const item = this.currentProject.budget.items.find(i => i.id == id);
    if (!item) return;
    item[field] = field === 'amount' ? parseFloat(value) || 0 : value;
    this.renderBudget();
  },

  deleteBudgetLine(id) {
    this.currentProject.budget.items = this.currentProject.budget.items.filter(i => i.id != id);
    this.renderBudget();
  },

  changeCurrency() {
    const value = document.getElementById('currencySelect').value;
    this.currentProject.budget.currency = value;
    this.updateCurrencySymbol();
  },

  updateCurrencySymbol() {
    const value = document.getElementById('currencySelect').value;
    const map = { NOK: 'kr', USD: '$', EUR: '€', GBP: '£', SEK: 'kr', DKK: 'kr' };
    document.getElementById('currencySymbol').textContent = map[value] || '$';
  },

  addShootingDay() {
    this.currentProject.shooting.push({ id: Date.now(), date: '', location: '', scenes: '', notes: '' });
    this.renderShooting();
  },

  renderShooting() {
    const days = this.currentProject.shooting || [];
    let rows = '';
    days.forEach(day => {
      rows += '<tr><td><input type="text" value="' + day.date + '" onchange="app.updateShooting(' + day.id + ',\'date\',this.value)"></td><td><input type="text" value="' + day.location + '" onchange="app.updateShooting(' + day.id + ',\'location\',this.value)"></td><td><input type="text" value="' + day.scenes + '" onchange="app.updateShooting(' + day.id + ',\'scenes\',this.value)"></td><td><input type="text" value="' + day.notes + '" onchange="app.updateShooting(' + day.id + ',\'notes\',this.value)"></td><td><button class="delete-btn" onclick="app.deleteShootingDay(' + day.id + ')">Delete</button></td></tr>';
    });
    document.getElementById('shootingList').innerHTML = rows || '<tr><td colspan="5" class="empty-text">No days</td></tr>';
    document.getElementById('totalShootingDays').textContent = days.length;
    const locs = new Set(days.map(d => d.location).filter(l => l));
    document.getElementById('uniqueLocations').textContent = locs.size;
  },

  updateShooting(id, field, value) {
    const day = this.currentProject.shooting.find(d => d.id == id);
    if (day) day[field] = value;
  },

  deleteShootingDay(id) {
    this.currentProject.shooting = this.currentProject.shooting.filter(d => d.id != id);
    this.renderShooting();
  },

  handleScriptUpload() {
    const file = document.getElementById('scriptFileInput').files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      this.currentProject.scripts.push({
        id: Date.now(),
        name: file.name,
        size: file.size,
        type: file.type,
        data: e.target.result,
        uploadedAt: new Date().toLocaleString()
      });
      this.renderScripts();
      document.getElementById('scriptFileInput').value = '';
    };
    reader.readAsDataURL(file);
  },

  renderScripts() {
    const scripts = this.currentProject.scripts || [];
    let html = '';
    scripts.forEach(s => {
      html += '<div class="script-item" onclick="app.showScript(' + s.id + ')" style="cursor:pointer">' + s.name + ' <button onclick="event.stopPropagation();app.deleteScript(' + s.id + ')" style="float:right;background:none;border:none;color:#a0a1af;cursor:pointer">x</button></div>';
    });
    document.getElementById('scriptsList').innerHTML = html || '<div class="empty-text">No scripts</div>';
  },

  showScript(id) {
    const s = this.currentProject.scripts.find(x => x.id == id);
    if (!s) return;
    if ((s.type && s.type.indexOf('pdf') !== -1) || (s.name && s.name.endsWith('.pdf'))) {
      document.getElementById('scriptViewerEmpty').style.display = 'none';
      document.getElementById('scriptIframe').style.display = 'block';
      document.getElementById('scriptIframe').src = s.data;
    } else {
      document.getElementById('scriptViewerEmpty').style.display = 'block';
      document.getElementById('scriptViewerEmpty').innerHTML = 'Preview not available';
      document.getElementById('scriptIframe').style.display = 'none';
    }
  },

  deleteScript(id) {
    this.currentProject.scripts = this.currentProject.scripts.filter(x => x.id != id);
    this.renderScripts();
  },

  addStoryboard() {
    this.currentProject.storyboards.push({ id: Date.now(), image: null, notes: '' });
    this.renderStoryboards();
  },

  renderStoryboards() {
    const items = this.currentProject.storyboards || [];
    let html = '';
    items.forEach(sb => {
      html += '<div class="visual-card"><label class="visual-image" style="cursor:pointer">' + (sb.image ? '<img src="' + sb.image + '">' : 'Upload') + '<input type="file" accept="image/*" onchange="app.uploadStoryboard(' + sb.id + ',this)"></label><div class="visual-notes"><textarea placeholder="Notes" onchange="app.updateStoryNotes(' + sb.id + ',this.value)">' + (sb.notes || '') + '</textarea></div></div>';
    });
    document.getElementById('storyboardsList').innerHTML = html || '<div class="empty-text">No frames</div>';
  },

  uploadStoryboard(id, input) {
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const item = this.currentProject.storyboards.find(s => s.id == id);
      if (item) {
        item.image = e.target.result;
        this.renderStoryboards();
      }
    };
    reader.readAsDataURL(file);
  },

  updateStoryNotes(id, value) {
    const item = this.currentProject.storyboards.find(s => s.id == id);
    if (item) item.notes = value;
  },

  handleFileSelect() {
    const file = document.getElementById('fileInput').files[0];
    if (!file) return;
    this.selectedFile = { name: file.name, type: file.type, size: file.size };
    const reader = new FileReader();
    reader.onload = (e) => {
      this.selectedFile.data = e.target.result;
      this.showFilePreview();
    };
    reader.readAsDataURL(file);
  },

  showFilePreview() {
    const inputArea = document.getElementById('inputArea');
    const existing = inputArea.querySelector('.file-preview');
    if (existing) existing.remove();
    const div = document.createElement('div');
    div.className = 'file-preview';
    div.innerHTML = this.selectedFile.name + ' <button onclick="app.removeFile()" type="button">x</button>';
    inputArea.insertBefore(div, inputArea.querySelector('.message-input').nextSibling);
  },

  removeFile() {
    this.selectedFile = null;
    document.getElementById('fileInput').value = '';
    const existing = document.getElementById('inputArea').querySelector('.file-preview');
    if (existing) existing.remove();
  },

  async sendMessage() {
    const text = document.getElementById('messageInput').value;
    if (!text && !this.selectedFile) return;
    const scope = this.currentChatScope;
    const projectId = scope === 'project' ? this.currentProject.id : null;

    await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: Date.now(),
        text: text,
        file: this.selectedFile,
        timestamp: new Date().toLocaleString(),
        scope: scope,
        projectId: projectId
      })
    });

    document.getElementById('messageInput').value = '';
    this.removeFile();
    if (scope === 'public') await this.loadPublicMessages();
    else await this.loadProjectMessages();
    this.renderChat();
  },

  downloadFile(data, name) {
    const a = document.createElement('a');
    a.href = data;
    a.download = name;
    a.click();
  },

  setChatScope(scope) {
    this.currentChatScope = scope;
    document.getElementById('projectChatBtn').classList.remove('active');
    document.getElementById('publicChatBtn').classList.remove('active');
    if (scope === 'project') {
      document.getElementById('projectChatBtn').classList.add('active');
      this.loadProjectMessages().then(() => this.renderChat());
    } else {
      document.getElementById('publicChatBtn').classList.add('active');
      this.renderChat();
    }
  },

  renderChat() {
    const messages = this.currentChatScope === 'public' ? this.publicMessages : this.projectMessages;
    let html = '';
    messages.forEach(m => {
      const fileHtml = m.file ? '<br><a class="message-file" onclick="app.downloadFile(\'' + m.file.data + '\',\'' + m.file.name + '\')">File: ' + m.file.name + '</a>' : '';
      html += '<div class="message-item"><div class="message-text">' + (m.text || '') + fileHtml + '</div><div class="message-meta">' + m.timestamp + '</div></div>';
    });
    document.getElementById('messagesArea').innerHTML = html || '<div class="empty-text">No notes</div>';
    const area = document.getElementById('messagesArea');
    area.scrollTop = area.scrollHeight;
  }
};
</script></body></html>`;
  res.send(html);
});

app.get('/api/projects', (req, res) => {
  const db = loadDB();
  res.json(db.projects || []);
});

app.post('/api/projects', (req, res) => {
  const db = loadDB();
  const { id, name, scripts, storyboards, budget, shooting, updatedAt } = req.body;

  let project = db.projects.find(p => p.id === id);
  if (!project) {
    project = { id, name, scripts, storyboards, budget, shooting, updatedAt };
    db.projects.push(project);
  } else {
    Object.assign(project, { name, scripts, storyboards, budget, shooting, updatedAt });
  }

  saveDB(db);
  res.json({ success: true });
});

app.delete('/api/projects/:id', (req, res) => {
  const db = loadDB();
  const id = String(req.params.id);
  db.projects = db.projects.filter(p => String(p.id) !== id);
  if (db.messages && Array.isArray(db.messages)) {
    db.messages = db.messages.filter(m => !(m.scope === 'project' && String(m.projectId) === id));
  }
  saveDB(db);
  res.json({ success: true });
});

app.get('/api/messages', (req, res) => {
  const db = loadDB();
  const scope = req.query.scope;
  const projectId = req.query.projectId;
  let messages = db.messages || [];
  if (scope) messages = messages.filter(m => m.scope === scope);
  if (scope === 'project' && projectId) messages = messages.filter(m => String(m.projectId) === String(projectId));
  res.json(messages);
});

app.post('/api/messages', (req, res) => {
  const db = loadDB();
  if (!db.messages) db.messages = [];
  const message = req.body || {};
  if (!message.scope) message.scope = 'public';
  db.messages.push(message);
  saveDB(db);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log('MaxFilm running on port ' + PORT);
});
