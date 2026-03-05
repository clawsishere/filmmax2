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
body{font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#050608;color:#f5f5f5}

/* Layout base */
.screen{display:none}
.screen.active{display:flex}
.app-container{display:flex;width:100%;height:100vh}

/* Auth */
.auth-screen{width:100%;height:100vh;display:flex;align-items:center;justify-content:center;background:#050608}
.auth-box{width:100%;max-width:360px;padding:32px 28px;background:#0e1014;border-radius:4px;border:1px solid #252731;text-align:center}
.auth-box h1{font-size:22px;margin-bottom:6px;font-weight:600;letter-spacing:0.16em;text-transform:uppercase}
.auth-tagline{color:#a0a0ab;font-size:12px;margin-bottom:18px}
.form-group{margin-bottom:18px;text-align:left}
.form-group label{display:block;font-size:10px;font-weight:500;margin-bottom:6px;text-transform:uppercase;letter-spacing:0.16em;color:#8a8b93}
.form-group input{width:100%;padding:9px 9px;background:#101219;border-radius:3px;border:1px solid #2b2d39;color:#f5f5f5;font-size:13px}
.form-group input:focus{outline:0;border-color:#f5f5f5;background:#111319}
.auth-btn{width:100%;padding:9px;background:#f5f5f5;border-radius:3px;border:1px solid #f5f5f5;color:#050608;font-weight:500;font-size:12px;cursor:pointer;text-transform:uppercase;letter-spacing:0.16em}
.auth-btn:hover{background:#ffffff}
.auth-hint{margin-top:10px;font-size:10px;color:#6b6c76}

/* Sidebar */
.sidebar{width:240px;background:#050608;border-right:1px solid #1c1e26;display:flex;flex-direction:column;overflow:hidden}
.sidebar-header{padding:14px 16px;border-bottom:1px solid #1c1e26}
.sidebar-header h2{font-size:13px;font-weight:600;letter-spacing:0.18em;text-transform:uppercase}
.sidebar-sub{font-size:10px;color:#6b6c76;margin-top:4px}
.sidebar-nav{display:flex;gap:6px;margin-top:10px}
.sidebar-nav button{flex:1;padding:6px 6px;border-radius:3px;border:1px solid #262833;background:#101218;font-size:10px;font-weight:500;cursor:pointer;color:#d8d9e0;text-transform:uppercase;letter-spacing:0.12em}
.sidebar-nav button.active{background:#f5f5f5;color:#050608;border-color:#f5f5f5}

/* Sidebar content */
.sidebar-content{flex:1;padding:10px 12px;overflow-y:auto}
.projects-label-row{display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;padding:0 2px}
.projects-label{font-size:9px;font-weight:500;color:#6b6c76;text-transform:uppercase;letter-spacing:0.16em}
.projects-count{font-size:9px;color:#494a55}
.project-search{margin-bottom:8px}
.project-search input{width:100%;padding:7px 8px;border-radius:999px;border:1px solid #262833;font-size:11px;background:#101218;color:#f5f5f5}
.project-search input:focus{outline:0;border-color:#f5f5f5;background:#0f1117}
.sidebar-projects{display:flex;flex-direction:column;gap:4px}
.sidebar-btn{width:100%;padding:7px 9px;background:#0e1014;border-radius:3px;border:1px solid #1d1f28;color:#f5f5f5;font-size:11px;font-weight:500;cursor:pointer;text-align:left;display:flex;flex-direction:column;gap:2px}
.sidebar-btn:hover{border-color:#3b3d49}
.sidebar-btn.active{background:#f5f5f5;color:#050608;border-color:#f5f5f5}
.sidebar-btn span{font-size:9px;color:#767787}

/* Sidebar footer */
.sidebar-footer{margin-top:auto;padding:10px 12px;border-top:1px solid #1c1e26;display:flex;gap:8px}
.sidebar-footer button{flex:1;padding:7px 8px;border-radius:3px;border:1px solid #262833;background:#101218;font-size:10px;font-weight:500;cursor:pointer;text-transform:uppercase;letter-spacing:0.12em;color:#e5e6ee}
.sidebar-footer button:first-child{background:#f5f5f5;color:#050608;border-color:#f5f5f5}
.sidebar-footer button:hover{border-color:#3b3d49}

/* Main */
.main-content{flex:1;display:flex;flex-direction:column;overflow:hidden;background:#050608}
.header{padding:10px 18px;background:#050608;border-bottom:1px solid #1c1e26;display:flex;justify-content:space-between;align-items:center}
.header-left{display:flex;flex-direction:column;gap:2px}
.header-title{font-size:11px;font-weight:500;text-transform:uppercase;letter-spacing:0.18em;color:#e5e6ee}
.header-breadcrumb{font-size:10px;color:#6b6c76}
.header-actions{display:flex;gap:8px}
.btn{padding:7px 11px;background:#f5f5f5;border-radius:3px;border:1px solid #f5f5f5;color:#050608;font-size:10px;font-weight:500;cursor:pointer;text-transform:uppercase;letter-spacing:0.12em}
.btn.secondary{background:transparent;color:#e5e6ee;border-color:#3a3c46}
.btn.secondary:hover{background:#111219}
.btn:hover{background:#ffffff}

/* Save indicator: small, in header-right (reused element) */
.save-indicator{font-size:9px;color:#6b6c76;margin-left:10px}

/* Content wrapper */
.content{flex:1;overflow:hidden;display:flex;flex-direction:column;background:#050608}

/* Dashboard */
.dashboard{flex:1;overflow-y:auto;padding:14px 18px;display:flex;flex-direction:column;gap:10px}
.dashboard-row{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:10px}
.welcome-card,.hint-card{background:#0b0d12;border-radius:3px;border:1px solid #1c1e26;padding:11px 12px;font-size:11px;color:#b1b2c0}
.welcome-card h3{font-size:12px;font-weight:500;margin-bottom:4px;letter-spacing:0.12em;text-transform:uppercase}
.welcome-steps li{margin-left:14px;margin-bottom:3px}

/* Projects grid */
.projects-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:10px}
.project-card{background:#0b0d12;border-radius:3px;border:1px solid #1c1e26;padding:9px 10px;cursor:pointer;display:flex;flex-direction:column;gap:5px}
.project-card:hover{border-color:#3b3d49}
.project-card-header{display:flex;justify-content:space-between;align-items:flex-start;gap:6px}
.project-card h4{font-size:12px;font-weight:500}
.project-chip{font-size:9px;padding:2px 6px;border-radius:2px;background:#151823;color:#d4c6b3;font-weight:500;text-transform:uppercase;letter-spacing:0.14em}
.project-meta{font-size:9px;color:#77798a}
.project-card-actions{display:flex;gap:6px;margin-top:3px}
.project-card-actions button{flex:1;padding:4px 0;border-radius:2px;background:#101218;border:1px solid #262833;color:#f5f5f5;font-size:9px;cursor:pointer;text-transform:uppercase;letter-spacing:0.12em}
.project-card-actions button:hover{border-color:#3b3d49}

/* Tabs */
.tabs{display:flex;gap:0;border-bottom:1px solid #1c1e26;background:#050608;padding:0 18px}
.tab{padding:8px 10px;background:transparent;border:none;border-bottom:2px solid transparent;color:#6b6c76;font-size:10px;font-weight:500;cursor:pointer;text-transform:uppercase;letter-spacing:0.12em}
.tab.active{color:#f5f5f5;border-bottom-color:#f5f5f5}

/* Common scrollbars */
::-webkit-scrollbar{width:8px}
::-webkit-scrollbar-track{background:#050608}
::-webkit-scrollbar-thumb{background:#2b2d38;border-radius:4px}
::-webkit-scrollbar-thumb:hover{background:#3e404c}
input[type="file"]{display:none}
.empty-text{font-size:11px;color:#6b6c76}

/* Scripts: split layout */
#scriptsTab{flex:1;display:flex;flex-direction:column;min-height:0}
.scripts-header{padding:10px 18px;background:#050608;border-bottom:1px solid #1c1e26;font-size:11px;font-weight:500;text-transform:uppercase;letter-spacing:0.16em;color:#d4c6b3}
.scripts-body{flex:1;display:flex;flex-direction:column;padding:10px 18px 14px 18px;gap:8px;min-height:0}
.scripts-layout{flex:1;display:flex;gap:10px;min-height:0}
.scripts-list-pane{width:260px;min-width:220px;max-width:320px;background:#0b0d12;border-radius:3px;border:1px solid #1c1e26;padding:9px 9px;display:flex;flex-direction:column;gap:6px;min-height:0}
.scripts-actions{display:flex;align-items:center;gap:8px}
.scripts-hint{font-size:10px;color:#77798a}
.scripts-list{flex:1;overflow-y:auto;margin-top:4px;border-top:1px solid #1c1e26}
.script-row{display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid #161924;font-size:11px;cursor:pointer}
.script-row-main{display:flex;flex-direction:column}
.script-row.active{background:#101218}
.script-name{font-weight:500}
.script-meta{font-size:9px;color:#77798a}
.script-row-actions{display:flex;gap:6px}
.script-row-actions button{padding:3px 5px;border-radius:2px;border:1px solid #262833;background:#101218;color:#f5f5f5;font-size:9px;text-transform:uppercase;cursor:pointer}
.script-row-actions button:hover{border-color:#3b3d49}
.scripts-viewer-pane{flex:1;background:#050608;border-radius:3px;border:1px solid #1c1e26;display:flex;flex-direction:column;min-width:0;min-height:0}
.scripts-viewer-header{padding:8px 10px;border-bottom:1px solid #1c1e26;font-size:10px;color:#77798a;display:flex;justify-content:space-between;align-items:center}
.scripts-viewer-body{flex:1;min-height:0}
#scriptViewerEmpty{font-size:11px;color:#6b6c76;padding:16px}
#scriptIframe{width:100%;height:100%;border:0;display:none;background:#111319}

/* Storyboards / Budget / Shooting / Chat share full height */
#storyboardsTab,#budgetTab,#shootingTab,#chatTab{flex:1;display:none;flex-direction:column;min-height:0}

/* Storyboards */
.storyboards-toolbar{display:flex;justify-content:space-between;align-items:center;padding:10px 18px;background:#050608;border-bottom:1px solid #1c1e26;font-size:11px}
.storyboards-grid{flex:1;overflow-y:auto;display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:10px;padding:10px 18px 14px 18px}
.storyboard-card{background:#0b0d12;border-radius:3px;border:1px solid #1c1e26;overflow:hidden}
.storyboard-image{width:100%;aspect-ratio:16/9;background:#101218;display:flex;align-items:center;justify-content:center;cursor:pointer;border-bottom:1px solid #161924;font-size:11px;color:#77798a}
.storyboard-image img{width:100%;height:100%;object-fit:cover}
.storyboard-notes{padding:8px}
.storyboard-notes textarea{width:100%;background:#101218;color:#f5f5f5;padding:6px;border-radius:3px;border:1px solid #262833;font-size:10px;min-height:50px;font-family:inherit}
.storyboard-notes textarea:focus{outline:0;border-color:#f5f5f5;background:#111319}

/* Budget */
.budget-header{padding:10px 18px;background:#050608;border-bottom:1px solid #1c1e26;display:flex;justify-content:space-between;align-items:center;font-size:11px}
.budget-currency{padding:6px 9px;background:#101218;border-radius:3px;border:1px solid #262833;font-size:11px;color:#f5f5f5}
.budget-table-wrap{flex:1;overflow-y:auto;padding:10px 18px 0 18px}
.budget-total{padding:8px 18px;background:#050608;border-top:1px solid #1c1e26;font-weight:500;font-size:11px;display:flex;justify-content:space-between;color:#d4c6b3}
.delete-btn{background:#101218;border-radius:2px;border:1px solid #262833;color:#a0a1af;padding:3px 6px;font-size:9px;cursor:pointer;text-transform:uppercase}
.delete-btn:hover{border-color:#3b3d49}

/* Shooting */
.shooting-wrap{flex:1;overflow-y:auto;padding:10px 18px 0 18px}

/* Chat */
.chat-container{flex:1;display:flex;flex-direction:column;padding:10px 18px 14px 18px;gap:8px;min-height:0}
.chat-header-row{display:flex;justify-content:space-between;align-items:center}
.chat-title{font-size:11px;font-weight:500;text-transform:uppercase;letter-spacing:0.16em}
.chat-sub{font-size:10px;color:#6b6c76}
.chat-scope-toggle{display:flex;gap:8px;margin-top:4px}
.chat-scope-toggle button{flex:0 0 auto;padding:5px 9px;font-size:9px;border-radius:999px;border:1px solid:#262833;background:#101218;color:#e5e6ee;cursor:pointer;text-transform:uppercase;letter-spacing:0.12em}
.chat-scope-toggle button.active{background:#f5f5f5;color:#050608;border-color:#f5f5f5}
.chat-help{font-size:9px;color:#6b6c76;margin-top:2px}
.messages-area{flex:1;overflow-y:auto;margin-top:4px;margin-bottom:8px;background:#0b0d12;padding:9px;border-radius:3px;border:1px solid #1c1e26}
.message-item{margin-bottom:8px;padding-bottom:7px;border-bottom:1px solid #161924}
.message-text{font-size:11px;color:#f5f5f5;margin-bottom:3px;word-break:break-word}
.message-file{display:inline-block;padding:4px 7px;background:#101218;border-radius:999px;border:1px solid #262833;font-size:10px;text-decoration:none;color:#f5f5f5;margin:3px 0;cursor:pointer}
.message-file:hover{border-color:#3b3d49}
.message-meta{font-size:9px;color:#77798a}
.input-area{background:#0b0d12;border-radius:3px;border:1px solid #1c1e26;padding:8px;display:flex;gap:8px;flex-wrap:wrap;align-items:flex-start}
.message-input{flex:1;padding:7px 8px;border-radius:3px;border:1px solid #262833;background:#101218;font-size:12px;min-height:32px;color:#f5f5f5}
.file-preview{padding:4px 7px;background:#101218;border-radius:999px;border:1px solid #262833;font-size:10px;display:flex;justify-content:space-between;align-items:center;width:100%}
.file-preview button{background:transparent;border:none;color:#a0a1af;cursor:pointer;font-weight:500}
.attach-btn{padding:6px 8px;background:#101218;border-radius:3px;border:1px solid #262833;cursor:pointer;font-size:10px;font-weight:500;color:#e5e6ee;text-transform:uppercase;letter-spacing:0.12em}
.send-btn{padding:6px 9px;background:#f5f5f5;border-radius:3px;border:1px solid #f5f5f5;color:#050608;cursor:pointer;font-size:10px;font-weight:500;text-transform:uppercase;letter-spacing:0.12em}

/* Settings */
#settingsView{display:none;flex:1;overflow-y:auto;padding:14px 18px}
.settings-card{background:#0b0d12;border-radius:3px;border:1px solid #1c1e26;padding:11px 12px;margin-bottom:10px;font-size:11px;color:#b1b2c0}
.settings-card h3{font-size:12px;margin-bottom:4px;letter-spacing:0.12em;text-transform:uppercase}
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
    <div class="sidebar">
      <div class="sidebar-header">
        <h2>MAXFILM</h2>
        <div class="sidebar-sub">Projects · Budget · Days</div>
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
          <input id="projectSearchInput" type="text" placeholder="Search" oninput="app.filterProjects()">
        </div>
        <div class="sidebar-projects" id="projectsList"></div>
      </div>

      <div class="sidebar-footer">
        <button onclick="app.openNewProjectModal()">New</button>
        <button onclick="app.logout()">Logout</button>
      </div>
    </div>

    <div class="main-content">
      <div class="header">
        <div class="header-left">
          <div class="header-title" id="headerTitle">Dashboard</div>
          <div class="header-breadcrumb" id="headerBreadcrumb">All projects</div>
        </div>
        <div class="header-actions">
          <button class="btn secondary" onclick="app.openNewProjectModal()">New Project</button>
          <button class="btn secondary" onclick="app.showMainView('dashboard')">Projects</button>
          <span class="save-indicator" id="saveIndicator">Auto-save on</span>
        </div>
      </div>

      <div class="content">
        <!-- Dashboard -->
        <div id="dashboardView" style="display:flex;flex:1;flex-direction:column;min-height:0">
          <div class="dashboard">
            <div class="dashboard-row">
              <div class="welcome-card">
                <h3>Producing overview</h3>
                <p>Use MaxFilm to track projects, finished scripts, budgets, days and decisions in one place.</p>
                <ul class="welcome-steps">
                  <li>Create a project for each film or episode.</li>
                  <li>Upload finished scripts and key materials.</li>
                  <li>Keep a simple budget and schedule, adjust as things move.</li>
                </ul>
              </div>
              <div class="hint-card">
                Keep it light: rough numbers and days are better than perfect spreadsheets you never open.
              </div>
            </div>

            <div style="font-size:11px;font-weight:500;margin-top:4px;text-transform:uppercase;letter-spacing:0.12em;color:#d4c6b3">All projects</div>
            <div id="allProjects" class="projects-grid" style="margin-top:4px;"></div>
          </div>
        </div>

        <!-- Editor -->
        <div id="editorView" style="display:none;flex:1;flex-direction:column;min-height:0">
          <div class="tabs">
            <button class="tab active" onclick="app.switchTab('scripts')">Scripts</button>
            <button class="tab" onclick="app.switchTab('storyboards')">Visuals</button>
            <button class="tab" onclick="app.switchTab('budget')">Budget</button>
            <button class="tab" onclick="app.switchTab('shooting')">Shooting</button>
            <button class="tab" onclick="app.switchTab('chat')">Notes</button>
          </div>

          <div class="content">
            <!-- Scripts -->
            <div id="scriptsTab">
              <div class="scripts-header">Script & documents</div>
              <div class="scripts-body">
                <div class="scripts-layout">
                  <div class="scripts-list-pane">
                    <div class="scripts-actions">
                      <button class="btn secondary" onclick="document.getElementById('scriptFileInput').click()">Upload file</button>
                      <input type="file" id="scriptFileInput" accept=".pdf,.fdx,.fdr,.doc,.docx,.txt" onchange="app.handleScriptUpload()">
                    </div>
                    <div class="scripts-hint">Upload finished scripts and other important docs. PDFs open on the right so you can read and highlight.</div>
                    <div class="scripts-list" id="scriptsList"></div>
                  </div>
                  <div class="scripts-viewer-pane">
                    <div class="scripts-viewer-header">
                      <span id="scriptViewerTitle">No document selected</span>
                      <span style="font-size:9px;color:#77798a">PDFs open inline · other types may download</span>
                    </div>
                    <div class="scripts-viewer-body">
                      <div id="scriptViewerEmpty">Select a script or document from the left to view it here.</div>
                      <iframe id="scriptIframe"></iframe>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Storyboards -->
            <div id="storyboardsTab">
              <div class="storyboards-toolbar">
                <div style="font-size:11px;font-weight:500;letter-spacing:0.12em;text-transform:uppercase">Visual references</div>
                <button class="btn secondary" onclick="app.addStoryboard()">Add frame</button>
              </div>
              <div class="storyboards-grid" id="storyboardsList"></div>
            </div>

            <!-- Budget -->
            <div id="budgetTab">
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
              <div class="budget-table-wrap">
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
              <button class="btn secondary" style="margin:8px 18px 12px 18px" onclick="app.addBudgetLine()">Add line</button>
            </div>

            <!-- Shooting -->
            <div id="shootingTab">
              <div class="shooting-wrap">
                <table class="data-table">
                  <thead>
                    <tr><th>Date</th><th>Location</th><th>Scenes</th><th>Notes</th><th></th></tr>
                  </thead>
                  <tbody id="shootingList"></tbody>
                </table>
              </div>
              <button class="btn secondary" style="margin:8px 18px 12px 18px" onclick="app.addShootingDay()">Add day</button>
            </div>

            <!-- Chat -->
            <div id="chatTab">
              <div class="chat-container">
                <div class="chat-header-row">
                  <div>
                    <div class="chat-title" id="chatTitle">Notes</div>
                    <div class="chat-sub" id="chatSubtitle">Per‑project notes or a shared room.</div>
                  </div>
                  <div style="font-size:9px;color:#6b6c76">Files stay with messages.</div>
                </div>

                <div class="chat-scope-toggle">
                  <button id="projectChatBtn" class="active" onclick="app.setChatScope('project')">Project</button>
                  <button id="publicChatBtn" onclick="app.setChatScope('public')">Public</button>
                </div>
                <div class="chat-help">
                  Project notes follow this project and are removed if it’s deleted. Public notes are shared across all work.
                </div>

                <div class="messages-area" id="messagesArea"></div>

                <div class="input-area" id="inputArea">
                  <input type="text" id="messageInput" class="message-input" placeholder="Write a note">
                  <button class="attach-btn" onclick="document.getElementById('fileInput').click()">Attach</button>
                  <button class="send-btn" onclick="app.sendMessage()">Send</button>
                  <input type="file" id="fileInput" onchange="app.handleFileSelect()">
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Settings -->
        <div id="settingsView">
          <div class="settings-card">
            <h3>What this is for</h3>
            <p>MaxFilm is for producing: projects, finished scripts, budgets, days, and decisions. Write in your screenwriting tool, then upload the documents here.</p>
          </div>
          <div class="settings-card">
            <h3>Flow</h3>
            <p>1) Create a project. 2) Upload scripts and key docs. 3) Add budget lines and shooting days. 4) Use notes to track decisions.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- New project modal -->
<div id="newProjectModal" style="position:fixed;inset:0;display:none;align-items:center;justify-content:center;background:rgba(0,0,0,.55);z-index:50">
  <div style="background:#0b0d12;border-radius:3px;padding:14px 14px 10px 14px;border:1px solid #1c1e26;min-width:260px;max-width:340px">
    <div style="font-size:11px;font-weight:500;margin-bottom:4px;text-transform:uppercase;letter-spacing:0.16em">New project</div>
    <div style="font-size:10px;color:#6b6c76;margin-bottom:8px">Name your production.</div>
    <input id="newProjectNameInput" type="text" placeholder="Title" style="width:100%;padding:7px 8px;border-radius:3px;border:1px solid #262833;background:#101218;font-size:12px;margin-bottom:9px;color:#f5f5f5">
    <div style="display:flex;justify-content:flex-end;gap:8px">
      <button onclick="app.closeNewProjectModal()" style="padding:6px 9px;border-radius:3px;border:1px solid #262833;background:#101218;font-size:10px;cursor:pointer;color:#e5e6ee">Cancel</button>
      <button onclick="app.createProjectFromModal()" style="padding:6px 11px;border-radius:3px;border:1px solid #f5f5f5;background:#f5f5f5;color:#050608;font-size:10px;font-weight:500;cursor:pointer;text-transform:uppercase;letter-spacing:0.12em">Create</button>
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
  selectedScriptId: null,

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
    var el = document.getElementById("saveIndicator");
    if (el) el.textContent = "Last saved " + new Date().toLocaleTimeString();
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
    this.selectedScriptId = null;
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
    this.selectedScriptId = null;
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
    document.getElementById(tab + "Tab").style.display = (tab === "scripts") ? "flex" : "flex";
    event.target.classList.add("active");
  },

  /* Scripts: upload + viewer */
  handleScriptUpload: function() {
    if (!this.currentProject) return;
    var input = document.getElementById("scriptFileInput");
    var file = input.files[0];
    if (!file) return;
    var self = this;
    var reader = new FileReader();
    reader.onload = function(e) {
      if (!self.currentProject.scripts) self.currentProject.scripts = [];
      var scriptObj = {
        id: Date.now(),
        name: file.name,
        size: file.size,
        type: file.type,
        data: e.target.result,
        uploadedAt: new Date().toLocaleString()
      };
      self.currentProject.scripts.push(scriptObj);
      self.selectedScriptId = scriptObj.id;
      self.renderScripts();
      self.showScript(scriptObj.id);
      input.value = "";
    };
    reader.readAsDataURL(file);
  },

  renderScripts: function() {
    var list = document.getElementById("scriptsList");
    var scripts = this.currentProject && this.currentProject.scripts ? this.currentProject.scripts : [];
    if (!scripts.length) {
      list.innerHTML = '<div class="empty-text" style="padding:8px 0;">No documents uploaded.</div>';
      document.getElementById("scriptViewerTitle").textContent = "No document selected";
      document.getElementById("scriptViewerEmpty").style.display = "block";
      document.getElementById("scriptIframe").style.display = "none";
      return;
    }
    var self = this;
    var html = scripts.map(function(s) {
      var activeCls = (self.selectedScriptId === s.id) ? " script-row active" : " script-row";
      return '' +
        '<div class="' + activeCls + '" onclick="app.showScript(' + s.id + ')">' +
          '<div class="script-row-main">' +
            '<div class="script-name">' + s.name + '</div>' +
            '<div class="script-meta">' + Math.round(s.size / 1024) + ' KB · ' + (s.uploadedAt || '') + '</div>' +
          '</div>' +
          '<div class="script-row-actions" onclick="event.stopPropagation()">' +
            '<button onclick="app.downloadScript(' + s.id + ')">DL</button>' +
            '<button onclick="app.deleteScript(' + s.id + ')">Del</button>' +
          '</div>' +
        '</div>';
    }).join("");
    list.innerHTML = html;
  },

  showScript: function(id) {
    if (!this.currentProject || !this.currentProject.scripts) return;
    this.selectedScriptId = id;
    var s = this.currentProject.scripts.find(function(x) { return x.id === id; });
    if (!s) return;
    this.renderScripts(); // refresh active highlight
    var viewerTitle = document.getElementById("scriptViewerTitle");
    var empty = document.getElementById("scriptViewerEmpty");
    var iframe = document.getElementById("scriptIframe");
    viewerTitle.textContent = s.name;
    if (s.type && s.type.indexOf("pdf") !== -1 || (s.name || "").toLowerCase().endsWith(".pdf")) {
      iframe.src = s.data;
      iframe.style.display = "block";
      empty.style.display = "none";
    } else {
      // For non-PDF, fallback: just download
      iframe.style.display = "none";
      empty.style.display = "block";
      empty.textContent = "Preview not available for this file type. Use Download to open it.";
    }
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
    if (this.selectedScriptId === id) {
      this.selectedScriptId = null;
      document.getElementById("scriptViewerTitle").textContent = "No document selected";
      document.getElementById("scriptViewerEmpty").style.display = "block";
      document.getElementById("scriptIframe").style.display = "none";
    }
    this.renderScripts();
  },

  /* Editor sections */
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
      title = this.currentProject ? "Project · " + this.currentProject.name : "Project notes";
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
