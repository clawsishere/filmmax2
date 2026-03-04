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
  res.send(`<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>MaxFilm</title><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"><style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:100%;height:100%}
body{font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f5f5f5;color:#111}

/* Screens */
.screen{display:none}
.screen.active{display:flex}

/* Auth */
.auth-screen{width:100%;height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#f5f5f5}
.auth-box{width:100%;max-width:360px;padding:40px 32px;background:#fff;border-radius:4px;border:1px solid #ddd;text-align:center}
.auth-box h1{font-size:24px;margin-bottom:8px;font-weight:600;letter-spacing:-0.3px}
.auth-tagline{color:#666;font-size:13px;margin-bottom:20px}
.form-group{margin-bottom:20px;text-align:left}
.form-group label{display:block;font-size:11px;font-weight:500;margin-bottom:6px;text-transform:uppercase;letter-spacing:0.6px;color:#777}
.form-group input{width:100%;padding:10px 9px;background:#fafafa;border-radius:3px;border:1px solid #d0d0d0;color:#111;font-size:14px}
.form-group input:focus{outline:0;border-color:#111;background:#fff}
.auth-btn{width:100%;padding:10px;background:#111;border-radius:3px;border:1px solid #111;color:#fff;font-weight:500;font-size:13px;cursor:pointer;text-transform:uppercase;letter-spacing:0.7px}
.auth-btn:hover{background:#000}
.auth-hint{margin-top:10px;font-size:11px;color:#999}

/* Layout */
.app-container{display:flex;width:100%;height:100vh}

/* Sidebar */
.sidebar{width:240px;background:#fff;border-right:1px solid #ddd;display:flex;flex-direction:column;overflow:hidden}
.sidebar-header{padding:14px 16px;border-bottom:1px solid #ddd}
.sidebar-header h2{font-size:15px;font-weight:600;letter-spacing:-0.3px}
.sidebar-sub{font-size:11px;color:#777;margin-top:4px}
.sidebar-nav{display:flex;gap:6px;margin-top:10px}
.sidebar-nav button{flex:1;padding:7px 6px;border-radius:3px;border:1px solid #ddd;background:#f6f6f6;font-size:11px;font-weight:500;cursor:pointer}
.sidebar-nav button.active{background:#111;color:#fff;border-color:#111}

/* Sidebar content */
.sidebar-content{flex:1;padding:10px 12px;overflow-y:auto}
.projects-label-row{display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;padding:0 2px}
.projects-label{font-size:10px;font-weight:600;color:#777;text-transform:uppercase;letter-spacing:0.6px}
.projects-count{font-size:10px;color:#999}
.project-search{margin-bottom:8px}
.project-search input{width:100%;padding:7px 8px;border-radius:999px;border:1px solid #ddd;font-size:11px;background:#fafafa}
.project-search input:focus{outline:0;border-color:#111;background:#fff}
.sidebar-projects{display:flex;flex-direction:column;gap:4px}
.sidebar-btn{width:100%;padding:8px 9px;background:#fafafa;border-radius:3px;border:1px solid #ddd;color:#111;font-size:12px;font-weight:500;cursor:pointer;text-align:left;display:flex;flex-direction:column;gap:2px}
.sidebar-btn:hover{background:#f0f0f0}
.sidebar-btn.active{background:#111;color:#fff;border-color:#111}
.sidebar-btn span{font-size:10px;opacity:.8}

/* Sidebar footer */
.sidebar-footer{margin-top:auto;padding:10px 12px;border-top:1px solid #ddd;display:flex;gap:8px}
.sidebar-footer button{flex:1;padding:8px 8px;border-radius:3px;border:1px solid #ddd;background:#f6f6f6;font-size:11px;font-weight:500;cursor:pointer;text-transform:uppercase}
.sidebar-footer button:first-child{background:#111;color:#fff;border-color:#111}
.sidebar-footer button:hover{background:#eee}

/* Main */
.main-content{flex:1;display:flex;flex-direction:column;overflow:hidden;background:#f5f5f5}
.header{padding:12px 18px;background:#fff;border-bottom:1px solid #ddd;display:flex;justify-content:space-between;align-items:center}
.header-left{display:flex;flex-direction:column;gap:2px}
.header-title{font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px}
.header-breadcrumb{font-size:11px;color:#777}
.header-actions{display:flex;gap:8px}
.btn{padding:8px 11px;background:#111;border-radius:3px;border:1px solid #111;color:#fff;font-size:11px;font-weight:500;cursor:pointer;text-transform:uppercase;letter-spacing:0.4px}
.btn.secondary{background:#f6f6f6;color:#111;border-color:#ddd}
.btn.secondary:hover{background:#eee}
.btn:hover{background:#000}

/* Content wrapper */
.content{flex:1;overflow:hidden;background:#f5f5f5;display:flex;flex-direction:column}

/* Dashboard */
.dashboard{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:12px}
.dashboard-row{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:12px}
.welcome-card,.hint-card{background:#fff;border-radius:3px;border:1px solid #ddd;padding:12px 12px;font-size:11px;color:#555}
.welcome-card h3{font-size:13px;font-weight:600;margin-bottom:4px}
.welcome-steps li{margin-left:14px;margin-bottom:3px}

/* Projects grid */
.projects-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:12px}
.project-card{background:#fff;border-radius:3px;border:1px solid #ddd;padding:10px 11px;cursor:pointer;display:flex;flex-direction:column;gap:6px}
.project-card:hover{border-color:#999}
.project-card-header{display:flex;justify-content:space-between;align-items:flex-start;gap:6px}
.project-card h4{font-size:13px;font-weight:600}
.project-chip{font-size:10px;padding:2px 6px;border-radius:2px;background:#f0f0f0;color:#555;font-weight:500}
.project-meta{font-size:10px;color:#999}
.project-card-actions{display:flex;gap:6px;margin-top:4px}
.project-card-actions button{flex:1;padding:5px 0;border-radius:2px;background:#f6f6f6;border:1px solid #ddd;color:#111;font-size:9px;cursor:pointer;text-transform:uppercase}
.project-card-actions button:hover{background:#eee}

/* Tabs */
.tabs{display:flex;gap:0;border-bottom:1px solid #ddd;background:#fff;padding:0 16px}
.tab{padding:9px 10px;background:transparent;border:none;border-bottom:2px solid transparent;color:#777;font-size:11px;font-weight:500;cursor:pointer;text-transform:uppercase}
.tab.active{color:#111;border-bottom-color:#111}

/* Save indicator */
.save-indicator{font-size:9px;color:#777;padding:6px 16px;background:#f5f5f5;border-bottom:1px solid #ddd}

/* Scripts: upload-only */
#scriptsTab{display:flex;flex:1;flex-direction:column}
.scripts-header{padding:12px 16px;background:#fff;border-bottom:1px solid #ddd;font-size:12px;font-weight:600}
.scripts-body{padding:14px 16px;display:flex;flex-direction:column;gap:10px}
.scripts-actions{display:flex;align-items:center;gap:10px}
.scripts-hint{font-size:11px;color:#777}
.scripts-list{margin-top:6px;border-top:1px solid #ddd}
.script-row{display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #eee;font-size:11px}
.script-name{font-weight:500}
.script-meta{font-size:10px;color:#777}
.script-actions{display:flex;gap:6px}

/* Table shared */
.data-table{width:100%;border-collapse:collapse;background:#fff}
.data-table th{background:#fafafa;padding:8px;text-align:left;font-size:10px;font-weight:600;text-transform:uppercase;border-bottom:1px solid #ddd;color:#777}
.data-table td{padding:8px;border-bottom:1px solid #eee;font-size:11px}
.data-table input{width:100%;background:transparent;border:none;color:#111;font-size:11px}
.data-table input:focus{outline:0;background:#fafafa}

/* Storyboards */
#storyboardsTab,#budgetTab,#shootingTab,#chatTab{flex:1;flex-direction:column}
.storyboards-toolbar{display:flex;justify-content:space-between;align-items:center;padding:12px 16px;background:#fff;border-bottom:1px solid #ddd}
.storyboards-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:10px;padding:14px 16px}
.storyboard-card{background:#fff;border-radius:3px;border:1px solid #ddd;overflow:hidden}
.storyboard-image{width:100%;aspect-ratio:16/9;background:#f6f6f6;display:flex;align-items:center;justify-content:center;cursor:pointer;border-bottom:1px solid #eee;font-size:11px;color:#777}
.storyboard-image img{width:100%;height:100%;object-fit:cover}
.storyboard-notes{padding:8px}
.storyboard-notes textarea{width:100%;background:#fafafa;color:#111;padding:6px;border-radius:3px;border:1px solid #ddd;font-size:10px;min-height:50px;font-family:inherit}
.storyboard-notes textarea:focus{outline:0;border-color:#111;background:#fff}

/* Budget / Shooting */
.budget-header{padding:12px 16px;background:#fff;border-bottom:1px solid #ddd;display:flex;justify-content:space-between;align-items:center}
.budget-currency{padding:6px 9px;background:#fafafa;border-radius:3px;border:1px solid #ddd;font-size:11px}
.budget-total{padding:10px 16px;background:#f5f5f5;border-bottom:1px solid #ddd;font-weight:600;font-size:12px;display:flex;justify-content:space-between}
.delete-btn{background:#f6f6f6;border-radius:2px;border:1px solid #ddd;color:#777;padding:3px 6px;font-size:9px;cursor:pointer;text-transform:uppercase}
.delete-btn:hover{background:#eee}

/* Chat */
.chat-container{display:flex;flex-direction:column;height:100%;padding:14px 16px;gap:8px}
.chat-header-row{display:flex;justify-content:space-between;align-items:center}
.chat-title{font-size:12px;font-weight:600}
.chat-sub{font-size:11px;color:#777}
.chat-scope-toggle{display:flex;gap:8px;margin-top:6px}
.chat-scope-toggle button{flex:0 0 auto;padding:5px 9px;font-size:10px;border-radius:999px;border:1px solid #ddd;background:#f6f6f6;color:#333;cursor:pointer;text-transform:uppercase;font-weight:500}
.chat-scope-toggle button.active{background:#111;color:#fff;border-color:#111}
.chat-help{font-size:10px;color:#777;margin-top:3px}
.messages-area{flex:1;overflow-y:auto;margin-top:6px;margin-bottom:8px;background:#fff;padding:10px;border-radius:3px;border:1px solid #ddd}
.message-item{margin-bottom:10px;padding-bottom:8px;border-bottom:1px solid #eee}
.message-text{font-size:11px;color:#111;margin-bottom:4px;word-break:break-word}
.message-file{display:inline-block;padding:5px 8px;background:#f6f6f6;border-radius:999px;border:1px solid #ddd;font-size:10px;text-decoration:none;color:#111;margin:3px 0;cursor:pointer}
.message-file:hover{background:#eee}
.message-meta{font-size:9px;color:#777}
.input-area{background:#fff;border-radius:3px;border:1px solid #ddd;padding:9px;display:flex;gap:8px;flex-wrap:wrap;align-items:flex-start}
.message-input{flex:1;padding:7px 8px;border-radius:3px;border:1px solid #ddd;background:#fafafa;font-size:12px;min-height:36px}
.file-preview{padding:5px 8px;background:#fafafa;border-radius:999px;border:1px solid #ddd;font-size:10px;display:flex;justify-content:space-between;align-items:center;width:100%}
.file-preview button{background:transparent;border:none;color:#777;cursor:pointer;font-weight:600}
.attach-btn{padding:7px 9px;background:#f6f6f6;border-radius:3px;border:1px solid #ddd;cursor:pointer;font-size:11px;font-weight:500}
.send-btn{padding:7px 10px;background:#111;border-radius:3px;border:1px solid #111;color:#fff;cursor:pointer;font-size:11px;font-weight:500}

/* Misc */
::-webkit-scrollbar{width:8px}
::-webkit-scrollbar-track{background:#f5f5f5}
::-webkit-scrollbar-thumb{background:#cfcfcf;border-radius:4px}
::-webkit-scrollbar-thumb:hover{background:#999}
input[type="file"]{display:none}
.empty-text{font-size:11px;color:#777}

/* Settings */
#settingsView{display:none;flex:1;overflow-y:auto;padding:16px}
.settings-card{background:#fff;border-radius:3px;border:1px solid #ddd;padding:12px 13px;margin-bottom:10px;font-size:11px;color:#555}
.settings-card h3{font-size:13px;margin-bottom:4px}
</style></head><body>

<div id="authScreen" class="screen active">
  <div class="auth-screen">
    <div class="auth-box">
      <h1>MAXFILM</h1>
      <div class="auth-tagline">Producing & Production Management</div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" placeholder="Enter password" onkeypress="if(event.key==='Enter') app.login()">
      </div>
      <button class="auth-btn" onclick="app.login()">Enter</button>
      <div class="auth-hint">Default password is <b>MAX</b>. Change it in the code.</div>
    </div>
  </div>
</div>

<div id="appScreen" class="screen">
  <div class="app-container">
    <!-- Sidebar -->
    <div class="sidebar">
      <div class="sidebar-header">
        <h2>MAXFILM</h2>
        <div class="sidebar-sub">Projects, budgets and schedule</div>
        <div class="sidebar-nav">
          <button id="navDashboard" class="active" onclick="app.showMainView('dashboard')">Dashboard</button>
          <button id="navSettings" onclick="app.showMainView('settings')">Help</button>
        </div>
      </div>

      <div class="sidebar-content">
        <div class="projects-label-row">
          <span class="projects-label">Projects</span>
          <span class="projects-count" id="projectsCountLabel">0</span>
        </div>
        <div class="project-search">
          <input id="projectSearchInput" type="text" placeholder="Search projects" oninput="app.filterProjects()">
        </div>
        <div class="sidebar-projects" id="projectsList"></div>
      </div>

      <div class="sidebar-footer">
        <button onclick="app.openNewProjectModal()">New</button>
        <button onclick="app.logout()">Logout</button>
      </div>
    </div>

    <!-- Main -->
    <div class="main-content">
      <div class="header">
        <div class="header-left">
          <div class="header-title" id="headerTitle">Dashboard</div>
          <div class="header-breadcrumb" id="headerBreadcrumb">All projects</div>
        </div>
        <div class="header-actions">
          <button class="btn secondary" onclick="app.openNewProjectModal()">New Project</button>
          <button class="btn secondary" onclick="app.showMainView('dashboard')">Projects</button>
        </div>
      </div>

      <div class="save-indicator" id="saveIndicator">Auto-saving while you work.</div>

      <div class="content">
        <!-- Dashboard -->
        <div id="dashboardView" style="display:flex;flex:1;flex-direction:column">
          <div class="dashboard">
            <div class="dashboard-row">
              <div class="welcome-card">
                <h3>Producing overview</h3>
                <p>Use MaxFilm to keep track of projects, scripts, budgets, days and notes in one place.</p>
                <ul class="welcome-steps">
                  <li>Create a project.</li>
                  <li>Upload finished scripts and key materials.</li>
                  <li>Use budget, shooting days and chat as things move.</li>
                </ul>
              </div>
              <div class="hint-card">
                Start with a rough plan and budget. Update as locations, cast and schedule change.
              </div>
            </div>

            <div style="font-size:12px;font-weight:600;margin-top:6px;">All projects</div>
            <div id="allProjects" class="projects-grid" style="margin-top:4px;"></div>
          </div>
        </div>

        <!-- Editor -->
        <div id="editorView" style="display:none;flex:1;flex-direction:column">
          <div class="tabs">
            <button class="tab active" onclick="app.switchTab('scripts')">Scripts</button>
            <button class="tab" onclick="app.switchTab('storyboards')">Storyboards</button>
            <button class="tab" onclick="app.switchTab('budget')">Budget</button>
            <button class="tab" onclick="app.switchTab('shooting')">Shooting</button>
            <button class="tab" onclick="app.switchTab('chat')">Chat</button>
          </div>

          <div class="content">
            <!-- Scripts: upload/download only -->
            <div id="scriptsTab">
              <div class="scripts-header">Script files</div>
              <div class="scripts-body">
                <div class="scripts-actions">
                  <button class="btn secondary" onclick="document.getElementById('scriptFileInput').click()">Upload script file</button>
                  <input type="file" id="scriptFileInput" accept=".pdf,.fdx,.fdr,.doc,.docx,.txt" onchange="app.handleScriptUpload()">
                </div>
                <div class="scripts-hint">Attach finished screenplay files from your writing tool. Files stay attached to this project and can be downloaded.</div>
                <div class="scripts-list" id="scriptsList"></div>
              </div>
            </div>

            <!-- Storyboards / references -->
            <div id="storyboardsTab" style="display:none">
              <div class="storyboards-toolbar">
                <div style="font-size:12px;font-weight:600;">Visual references</div>
                <button class="btn secondary" onclick="app.addStoryboard()">Add frame</button>
              </div>
              <div class="storyboards-grid" id="storyboardsList"></div>
            </div>

            <!-- Budget -->
            <div id="budgetTab" style="display:none">
              <div class="budget-header">
                <div>Budget</div>
                <select class="budget-currency" id="currencySelect" onchange="app.changeCurrency()">
                  <option value="NOK">NOK</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="SEK">SEK</option>
                  <option value="DKK">DKK</option>
                </select>
              </div>
              <div style="flex:1;overflow-y:auto">
                <table class="data-table">
                  <thead>
                    <tr><th>Category</th><th>Description</th><th>Amount</th><th></th></tr>
                  </thead>
                  <tbody id="budgetList"></tbody>
                </table>
              </div>
              <div class="budget-total">
                <span>Total</span>
                <span><span id="currencySymbol">kr</span> <span id="budgetTotal">0.00</span></span>
              </div>
              <button class="btn secondary" style="margin:8px 16px 12px 16px" onclick="app.addBudgetLine()">Add line</button>
            </div>

            <!-- Shooting -->
            <div id="shootingTab" style="display:none">
              <div style="flex:1;overflow-y:auto;padding:14px 16px">
                <table class="data-table">
                  <thead>
                    <tr><th>Date</th><th>Location</th><th>Scenes</th><th>Notes</th><th></th></tr>
                  </thead>
                  <tbody id="shootingList"></tbody>
                </table>
              </div>
              <button class="btn secondary" style="margin:8px 16px 12px 16px" onclick="app.addShootingDay()">Add day</button>
            </div>

            <!-- Chat -->
            <div id="chatTab" style="display:none">
              <div class="chat-container">
                <div class="chat-header-row">
                  <div>
                    <div class="chat-title" id="chatTitle">Chat</div>
                    <div class="chat-sub" id="chatSubtitle">Project notes or shared room.</div>
                  </div>
                  <div style="font-size:10px;color:#777">Files stay with messages.</div>
                </div>

                <div class="chat-scope-toggle">
                  <button id="projectChatBtn" class="active" onclick="app.setChatScope('project')">Project chat</button>
                  <button id="publicChatBtn" onclick="app.setChatScope('public')">Public room</button>
                </div>
                <div class="chat-help">
                  Project chat is tied to this project and removed if the project is deleted. Public room is shared by everything.
                </div>

                <div class="messages-area" id="messagesArea"></div>

                <div class="input-area" id="inputArea">
                  <input type="text" id="messageInput" class="message-input" placeholder="Write a message">
                  <button class="attach-btn" onclick="document.getElementById('fileInput').click()">Attach</button>
                  <button class="send-btn" onclick="app.sendMessage()">Send</button>
                  <input type="file" id="fileInput" onchange="app.handleFileSelect()">
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Settings / Help -->
        <div id="settingsView">
          <div class="settings-card">
            <h3>Focus</h3>
            <p>MaxFilm is for producing and production management: tracking projects, finished scripts, budgets, shooting days and decisions. Do the actual writing in your preferred screenwriting software, then upload the files here.</p>
          </div>
          <div class="settings-card">
            <h3>Typical workflow</h3>
            <p>Create a project, upload the script and reference frames, keep a simple budget and list of days, and use chat for notes and decisions.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- New project modal -->
<div id="newProjectModal" style="position:fixed;inset:0;display:none;align-items:center;justify-content:center;background:rgba(0,0,0,.35);z-index:50">
  <div style="background:#fff;border-radius:3px;padding:16px 16px 12px 16px;border:1px solid #ddd;min-width:260px;max-width:340px">
    <div style="font-size:13px;font-weight:600;margin-bottom:6px">New project</div>
    <div style="font-size:11px;color:#777;margin-bottom:10px">Name your production.</div>
    <input id="newProjectNameInput" type="text" placeholder="Title" style="width:100%;padding:8px 8px;border-radius:3px;border:1px solid #ddd;font-size:12px;margin-bottom:10px">
    <div style="display:flex;justify-content:flex-end;gap:8px">
      <button onclick="app.closeNewProjectModal()" style="padding:6px 9px;border-radius:3px;border:1px solid #ddd;background:#f6f6f6;font-size:11px;cursor:pointer">Cancel</button>
      <button onclick="app.createProjectFromModal()" style="padding:6px 11px;border-radius:3px;border:1px solid #111;background:#111;color:#fff;font-size:11px;font-weight:500;cursor:pointer">Create</button>
    </div>
  </div>
</div>

<script>
var app = {
  authenticated: false,
  currentProject: null,
  projects: [],
  publicMessages: [],
  projectMessages: [],
  selectedFile: null,
  autoSaveInterval: null,
  currentChatScope: "project",
  projectFilter: "",

  init: function() {},

  login: function() {
    var value = document.getElementById("password").value;
    if (value === "MAX") {
      this.authenticated = true;
      this.showApp();
      this.loadProjects();
      this.loadPublicMessages();
      this.startAutoSave();
    } else {
      alert("Wrong password");
    }
  },

  logout: function() {
    this.authenticated = false;
    this.currentProject = null;
    this.projects = [];
    this.publicMessages = [];
    this.projectMessages = [];
    document.getElementById("password").value = "";
    location.reload();
  },

  showApp: function() {
    document.getElementById("authScreen").classList.remove("active");
    document.getElementById("appScreen").classList.add("active");
  },

  showMainView: function(view) {
    var dashboard = document.getElementById("dashboardView");
    var editor = document.getElementById("editorView");
    var settings = document.getElementById("settingsView");

    document.getElementById("navDashboard").classList.remove("active");
    document.getElementById("navSettings").classList.remove("active");

    if (view === "dashboard") {
      dashboard.style.display = "flex";
      editor.style.display = this.currentProject ? "flex" : "none";
      settings.style.display = "none";
      document.getElementById("navDashboard").classList.add("active");
      document.getElementById("headerTitle").textContent = this.currentProject ? "Project" : "Dashboard";
      if (this.currentProject) {
        document.getElementById("headerBreadcrumb").textContent = "Editing project • " + this.currentProject.name;
      } else {
        document.getElementById("headerBreadcrumb").textContent = "All projects";
      }
    } else if (view === "settings") {
      dashboard.style.display = "none";
      editor.style.display = "none";
      settings.style.display = "block";
      document.getElementById("navSettings").classList.add("active");
      document.getElementById("headerTitle").textContent = "Help";
      document.getElementById("headerBreadcrumb").textContent = "How to use MaxFilm";
    }
  },

  startAutoSave: function() {
    var self = this;
    this.autoSaveInterval = setInterval(function() {
      if (self.currentProject) self.autoSaveProject();
    }, 5000);
  },

  autoSaveProject: async function() {
    if (!this.currentProject) return;
    this.currentProject.updatedAt = new Date().toLocaleDateString();
    await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(this.currentProject)
    });
    document.getElementById("saveIndicator").textContent = "Auto-saved";
  },

  loadProjects: async function() {
    var res = await fetch("/api/projects");
    this.projects = await res.json();
    this.renderDashboard();
  },

  loadPublicMessages: async function() {
    var res = await fetch("/api/messages?scope=public");
    this.publicMessages = await res.json();
  },

  loadProjectMessages: async function() {
    if (!this.currentProject) return;
    var res = await fetch("/api/messages?scope=project&projectId=" + this.currentProject.id);
    this.projectMessages = await res.json();
  },

  renderDashboard: function() {
    var countLabel = document.getElementById("projectsCountLabel");
    countLabel.textContent = this.projects.length + " total";

    var filtered = this.getFilteredProjects();
    var html = filtered.map(function(p) {
      return '' +
        '<div class="project-card" onclick="app.openProject(' + "'" + p.id + "'" + ')">' +
          '<div class="project-card-header">' +
            '<div>' +
              '<h4>' + p.name + '</h4>' +
              '<div class="project-meta">Updated ' + (p.updatedAt || "-") + '</div>' +
            '</div>' +
            '<span class="project-chip">' + ((p.shooting && p.shooting.length) ? "In progress" : "Planning") + '</span>' +
          '</div>' +
          '<div class="project-card-actions">' +
            '<button onclick="event.stopPropagation();app.openProject(' + "'" + p.id + "'" + ')">Open</button>' +
            '<button onclick="event.stopPropagation();app.deleteProject(' + "'" + p.id + "'" + ')">Delete</button>' +
          '</div>' +
        '</div>';
    }).join("");
    document.getElementById("allProjects").innerHTML = html || '<div class="empty-text">No projects yet. Create one to start.</div>';
    this.renderSidebar();
  },

  renderSidebar: function() {
    var container = document.getElementById("projectsList");
    var filtered = this.getFilteredProjects();
    var html = filtered.map(function(p) {
      var isActive = (app.currentProject && app.currentProject.id == p.id) ? " active" : "";
      return '' +
        '<button class="sidebar-btn' + isActive + '" onclick="app.openProject(' + "'" + p.id + "'" + ')">' +
          '<div>' + p.name + '</div>' +
          '<span>' + (p.updatedAt || "Not saved yet") + '</span>' +
        '</button>';
    }).join("");
    container.innerHTML = html || '<div class="empty-text" style="padding:4px 4px 0 4px;">No projects</div>';
  },

  getFilteredProjects: function() {
    if (!this.projectFilter) return this.projects;
    var f = this.projectFilter.toLowerCase();
    return this.projects.filter(function(p) {
      return (p.name || "").toLowerCase().indexOf(f) !== -1;
    });
  },

  filterProjects: function() {
    var value = document.getElementById("projectSearchInput").value || "";
    this.projectFilter = value;
    this.renderDashboard();
  },

  openNewProjectModal: function() {
    document.getElementById("newProjectNameInput").value = "";
    document.getElementById("newProjectModal").style.display = "flex";
    setTimeout(function() {
      document.getElementById("newProjectNameInput").focus();
    }, 20);
  },

  closeNewProjectModal: function() {
    document.getElementById("newProjectModal").style.display = "none";
  },

  createProjectFromModal: function() {
    var name = document.getElementById("newProjectNameInput").value.trim();
    if (!name) return;
    this.closeNewProjectModal();
    this.createProject(name);
  },

  createProject: function(name) {
    this.currentProject = {
      id: Date.now(),
      name: name,
      scripts: [],
      storyboards: [],
      budget: { currency: "NOK", items: [] },
      shooting: [],
      updatedAt: new Date().toLocaleDateString()
    };
    this.showEditor();
    this.renderEditor();
    this.loadProjectMessages();
  },

  showEditor: function() {
    document.getElementById("dashboardView").style.display = "flex";
    document.getElementById("editorView").style.display = "flex";
    document.getElementById("settingsView").style.display = "none";
    document.getElementById("navDashboard").classList.add("active");
    document.getElementById("navSettings").classList.remove("active");
    document.getElementById("headerTitle").textContent = "Project";
    document.getElementById("headerBreadcrumb").textContent = "Editing project • " + this.currentProject.name;
  },

  openProject: function(id) {
    this.currentProject = this.projects.find(function(p) { return p.id == id; });
    if (!this.currentProject.scripts) this.currentProject.scripts = [];
    this.showEditor();
    this.renderEditor();
    this.loadProjectMessages();
  },

  deleteProject: async function(id) {
    if (!confirm("Delete this project and its project chat?")) return;
    await fetch("/api/projects/" + id, { method: "DELETE" });
    this.projects = this.projects.filter(function(p) { return p.id != id; });
    if (this.currentProject && this.currentProject.id == id) {
      this.currentProject = null;
      document.getElementById("editorView").style.display = "none";
      document.getElementById("headerTitle").textContent = "Dashboard";
      document.getElementById("headerBreadcrumb").textContent = "All projects";
    }
    this.renderDashboard();
  },

  switchTab: function(tab) {
    if (tab === "chat") {
      this.setChatScope("project");
      this.renderChat();
    }
    var tabs = document.querySelectorAll('[id$="Tab"]');
    for (var i = 0; i < tabs.length; i++) {
      tabs[i].style.display = "none";
    }
    var tabButtons = document.querySelectorAll(".tab");
    for (var j = 0; j < tabButtons.length; j++) {
      tabButtons[j].classList.remove("active");
    }
    document.getElementById(tab + "Tab").style.display = "block";
    event.target.classList.add("active");
  },

  /* Scripts upload */
  handleScriptUpload: function() {
    if (!this.currentProject) return;
    var input = document.getElementById("scriptFileInput");
    var file = input.files[0];
    if (!file) return;
    var self = this;
    var reader = new FileReader();
    reader.onload = function(e) {
      if (!self.currentProject.scripts) self.currentProject.scripts = [];
      self.currentProject.scripts.push({
        id: Date.now(),
        name: file.name,
        size: file.size,
        type: file.type,
        data: e.target.result,
        uploadedAt: new Date().toLocaleString()
      });
      self.renderScripts();
      input.value = "";
    };
    reader.readAsDataURL(file);
  },

  renderScripts: function() {
    var list = document.getElementById("scriptsList");
    var scripts = this.currentProject && this.currentProject.scripts ? this.currentProject.scripts : [];
    if (!scripts.length) {
      list.innerHTML = '<div class="empty-text" style="padding:8px 0;">No scripts uploaded.</div>';
      return;
    }
    var html = scripts.map(function(s) {
      return '' +
        '<div class="script-row">' +
          '<div>' +
            '<div class="script-name">' + s.name + '</div>' +
            '<div class="script-meta">' + Math.round(s.size / 1024) + ' KB · ' + (s.uploadedAt || '') + '</div>' +
          '</div>' +
          '<div class="script-actions">' +
            '<button class="btn secondary" style="padding:3px 6px;font-size:10px" onclick="app.downloadScript(' + s.id + ')">Download</button>' +
            '<button class="btn secondary" style="padding:3px 6px;font-size:10px" onclick="app.deleteScript(' + s.id + ')">Remove</button>' +
          '</div>' +
        '</div>';
    }).join("");
    list.innerHTML = html;
  },

  downloadScript: function(id) {
    if (!this.currentProject || !this.currentProject.scripts) return;
    var s = this.currentProject.scripts.find(function(x) { return x.id === id; });
    if (!s) return;
    var a = document.createElement("a");
    a.href = s.data;
    a.download = s.name;
    a.click();
  },

  deleteScript: function(id) {
    if (!this.currentProject || !this.currentProject.scripts) return;
    this.currentProject.scripts = this.currentProject.scripts.filter(function(x) { return x.id !== id; });
    this.renderScripts();
  },

  /* Other editor sections */
  renderEditor: function() {
    document.getElementById("currencySelect").value = this.currentProject.budget.currency || "NOK";
    this.updateCurrencySymbol();
    this.renderScripts();
    this.renderStoryboards();
    this.renderBudget();
    this.renderShooting();
    this.currentChatScope = "project";
    this.setChatScope("project");
  },

  addStoryboard: function() {
    this.currentProject.storyboards.push({ id: Date.now(), image: null, notes: "" });
    this.renderStoryboards();
  },

  renderStoryboards: function() {
    var items = this.currentProject.storyboards || [];
    var html = items.map(function(sb) {
      return '' +
        '<div class="storyboard-card">' +
          '<label class="storyboard-image">' +
            (sb.image ? '<img src="' + sb.image + '">' : 'Upload frame') +
            '<input type="file" accept="image/*" onchange="app.uploadStoryboard(' + sb.id + ', this)">' +
          '</label>' +
          '<div class="storyboard-notes">' +
            '<textarea placeholder="Notes" onchange="app.updateStoryNotes(' + sb.id + ', this.value)">' + (sb.notes || "") + '</textarea>' +
          '</div>' +
        '</div>';
    }).join("");
    document.getElementById("storyboardsList").innerHTML = html || '<div class="empty-text">No frames. Add key visual references.</div>';
  },

  uploadStoryboard: function(id, input) {
    var file = input.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function(e) {
      var item = app.currentProject.storyboards.find(function(s) { return s.id === id; });
      if (item) {
        item.image = e.target.result;
        app.renderStoryboards();
      }
    };
    reader.readAsDataURL(file);
  },

  updateStoryNotes: function(id, value) {
    var item = this.currentProject.storyboards.find(function(s) { return s.id === id; });
    if (item) item.notes = value;
  },

  changeCurrency: function() {
    var value = document.getElementById("currencySelect").value;
    this.currentProject.budget.currency = value;
    this.updateCurrencySymbol();
    this.renderBudget();
  },

  updateCurrencySymbol: function() {
    var value = document.getElementById("currencySelect").value;
    var map = { NOK: "kr", USD: "$", EUR: "€", GBP: "£", SEK: "kr", DKK: "kr" };
    document.getElementById("currencySymbol").textContent = map[value] || "$";
  },

  addBudgetLine: function() {
    this.currentProject.budget.items.push({ id: Date.now(), category: "", description: "", amount: 0 });
    this.renderBudget();
  },

  renderBudget: function() {
    var items = this.currentProject.budget.items || [];
    var rows = items.map(function(item) {
      return '' +
        '<tr>' +
          '<td><input type="text" value="' + item.category + '" onchange="app.updateBudget(' + item.id + ', ' + "'category'" + ', this.value)"></td>' +
          '<td><input type="text" value="' + item.description + '" onchange="app.updateBudget(' + item.id + ', ' + "'description'" + ', this.value)"></td>' +
          '<td><input type="number" value="' + item.amount + '" onchange="app.updateBudget(' + item.id + ', ' + "'amount'" + ', this.value)"></td>' +
          '<td><button class="delete-btn" onclick="app.deleteBudgetLine(' + item.id + ')">Delete</button></td>' +
        '</tr>';
    }).join("");
    document.getElementById("budgetList").innerHTML = rows || '<tr><td colspan="4" class="empty-text">No budget lines yet.</td></tr>';
    var total = items.reduce(function(sum, i) {
      return sum + (parseFloat(i.amount) || 0);
    }, 0);
    document.getElementById("budgetTotal").textContent = total.toFixed(2);
  },

  updateBudget: function(id, field, value) {
    var item = this.currentProject.budget.items.find(function(i) { return i.id === id; });
    if (!item) return;
    if (field === "amount") {
      item[field] = parseFloat(value) || 0;
    } else {
      item[field] = value;
    }
    this.renderBudget();
  },

  deleteBudgetLine: function(id) {
    this.currentProject.budget.items = this.currentProject.budget.items.filter(function(i) { return i.id !== id; });
    this.renderBudget();
  },

  addShootingDay: function() {
    this.currentProject.shooting.push({ id: Date.now(), date: "", location: "", scenes: "", notes: "" });
    this.renderShooting();
  },

  renderShooting: function() {
    var days = this.currentProject.shooting || [];
    var rows = days.map(function(day) {
      return '' +
        '<tr>' +
          '<td><input type="text" value="' + day.date + '" onchange="app.updateShooting(' + day.id + ', ' + "'date'" + ', this.value)"></td>' +
          '<td><input type="text" value="' + day.location + '" onchange="app.updateShooting(' + day.id + ', ' + "'location'" + ', this.value)"></td>' +
          '<td><input type="text" value="' + day.scenes + '" onchange="app.updateShooting(' + day.id + ', ' + "'scenes'" + ', this.value)"></td>' +
          '<td><input type="text" value="' + day.notes + '" onchange="app.updateShooting(' + day.id + ', ' + "'notes'" + ', this.value)"></td>' +
          '<td><button class="delete-btn" onclick="app.deleteShootingDay(' + day.id + ')">Delete</button></td>' +
        '</tr>';
    }).join("");
    document.getElementById("shootingList").innerHTML = rows || '<tr><td colspan="5" class="empty-text">No shooting days yet.</td></tr>';
  },

  updateShooting: function(id, field, value) {
    var day = this.currentProject.shooting.find(function(d) { return d.id === id; });
    if (day) day[field] = value;
  },

  deleteShootingDay: function(id) {
    this.currentProject.shooting = this.currentProject.shooting.filter(function(d) { return d.id !== id; });
    this.renderShooting();
  },

  /* Chat */
  handleFileSelect: function() {
    var file = document.getElementById("fileInput").files[0];
    if (!file) return;
    this.selectedFile = { name: file.name, type: file.type, size: file.size };
    var reader = new FileReader();
    var self = this;
    reader.onload = function(e) {
      self.selectedFile.data = e.target.result;
      self.showFilePreview();
    };
    reader.readAsDataURL(file);
  },

  showFilePreview: function() {
    var inputArea = document.getElementById("inputArea");
    var existing = inputArea.querySelector(".file-preview");
    if (existing) existing.remove();
    var div = document.createElement("div");
    div.className = "file-preview";
    div.innerHTML = "File: " + this.selectedFile.name + ' <button onclick="app.removeFile()" type="button">x</button>';
    inputArea.insertBefore(div, inputArea.querySelector(".message-input").nextSibling);
  },

  removeFile: function() {
    this.selectedFile = null;
    document.getElementById("fileInput").value = "";
    var existing = document.getElementById("inputArea").querySelector(".file-preview");
    if (existing) existing.remove();
  },

  sendMessage: async function() {
    var text = document.getElementById("messageInput").value;
    if (!text && !this.selectedFile) return;
    var scope = this.currentChatScope === "public" ? "public" : "project";
    var projectId = (scope === "project" && this.currentProject) ? this.currentProject.id : null;

    await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: Date.now(),
        text: text,
        file: this.selectedFile,
        timestamp: new Date().toLocaleString(),
        scope: scope,
        projectId: projectId
      })
    });

    document.getElementById("messageInput").value = "";
    this.removeFile();

    if (scope === "public") {
      await this.loadPublicMessages();
    } else {
      await this.loadProjectMessages();
    }
    this.renderChat();
  },

  downloadFile: function(data, name) {
    var a = document.createElement("a");
    a.href = data;
    a.download = name;
    a.click();
  },

  setChatScope: function(scope) {
    this.currentChatScope = scope;
    var projectBtn = document.getElementById("projectChatBtn");
    var publicBtn = document.getElementById("publicChatBtn");
    if (projectBtn && publicBtn) {
      projectBtn.classList.remove("active");
      publicBtn.classList.remove("active");
      if (scope === "project") projectBtn.classList.add("active");
      else publicBtn.classList.add("active");
    }
    if (scope === "project") {
      this.loadProjectMessages().then(this.renderChat.bind(this));
    } else {
      this.loadPublicMessages().then(this.renderChat.bind(this));
    }
  },

  renderChat: function() {
    var messages;
    var title;
    if (this.currentChatScope === "public") {
      messages = this.publicMessages;
      title = "Public room";
    } else {
      messages = this.projectMessages;
      title = this.currentProject ? "Project chat · " + this.currentProject.name : "Project chat";
    }
    var html = messages.map(function(m) {
      var fileHtml = "";
      if (m.file) {
        fileHtml = '<br><a class="message-file" onclick="app.downloadFile(' + "'" + m.file.data + "'" + ',' + "'" + m.file.name + "'" + ')">File: ' + m.file.name + '</a>';
      }
      return '' +
        '<div class="message-item">' +
          '<div class="message-text">' +
            (m.text || "") + fileHtml +
          '</div>' +
          '<div class="message-meta">' + m.timestamp + '</div>' +
        '</div>';
    }).join("");
    document.getElementById("messagesArea").innerHTML = html || '<div class="empty-text">' + title + ' is empty.</div>';
    var area = document.getElementById("messagesArea");
    area.scrollTop = area.scrollHeight;
    document.getElementById("chatTitle").textContent = title;
  }
};

app.init();
</script>
</body></html>`);
});

/* API */

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
    project.name = name;
    project.scripts = scripts;
    project.storyboards = storyboards;
    project.budget = budget;
    project.shooting = shooting;
    project.updatedAt = updatedAt;
  }

  saveDB(db);
  res.json({ success: true });
});

app.delete('/api/projects/:id', (req, res) => {
  const db = loadDB();
  const id = String(req.params.id);

  db.projects = db.projects.filter(p => String(p.id) !== id);

  // delete project chat messages for this project
  if (db.messages && Array.isArray(db.messages)) {
    db.messages = db.messages.filter(
      m => !(m.scope === 'project' && String(m.projectId) === id)
    );
  }

  saveDB(db);
  res.json({ success: true });
});

app.get('/api/messages', (req, res) => {
  const db = loadDB();
  const scope = req.query.scope;
  const projectId = req.query.projectId;

  let messages = db.messages || [];

  if (scope) {
    messages = messages.filter(m => m.scope === scope);
  }
  if (scope === 'project' && projectId) {
    messages = messages.filter(m => String(m.projectId) === String(projectId));
  }

  res.json(messages);
});

app.post('/api/messages', (req, res) => {
  const db = loadDB();
  if (!db.messages) db.messages = [];

  const message = req.body || {};
  if (!message.scope) {
    message.scope = 'public';
  }

  db.messages.push(message);
  saveDB(db);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`MaxFilm running on port ${PORT}`);
});
