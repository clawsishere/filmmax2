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
  res.send(`<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>MaxFilm</title><style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:100%;height:100%}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f0f2f5;color:#1a1a1a}

/* Screens */
.screen{display:none}
.screen.active{display:flex}

/* Auth */
.auth-screen{width:100%;height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;background:radial-gradient(circle at top,#ffffff 0,#f0f2f5 60%,#e2e5ea 100%)}
.auth-box{width:100%;max-width:380px;padding:56px 40px;background:#fff;border-radius:16px;border:1px solid #e0e0e0;text-align:center;box-shadow:0 16px 40px rgba(0,0,0,0.08)}
.auth-box h1{font-size:32px;margin-bottom:8px;font-weight:700;letter-spacing:-0.5px}
.auth-tagline{color:#777;font-size:13px;margin-bottom:24px}
.auth-sub{color:#aaa;font-size:11px;margin-bottom:28px}
.form-group{margin-bottom:20px;text-align:left}
.form-group label{display:block;font-size:11px;font-weight:600;margin-bottom:6px;text-transform:uppercase;letter-spacing:0.6px;color:#777}
.form-group input{width:100%;padding:14px 12px;background:#fafafa;border-radius:8px;border:1px solid #e0e0e0;color:#1a1a1a;font-size:14px}
.form-group input:focus{outline:0;border-color:#000;background:#fff}
.auth-btn{width:100%;padding:14px;background:#000;border-radius:999px;border:1px solid #000;color:#fff;font-weight:600;font-size:13px;cursor:pointer;text-transform:uppercase;letter-spacing:0.7px}
.auth-btn:hover{background:#1a1a1a}
.auth-hint{margin-top:10px;font-size:11px;color:#999}

/* Layout */
.app-container{display:flex;width:100%;height:100vh}

/* Sidebar */
.sidebar{width:260px;background:#ffffff;border-right:1px solid #e0e0e0;display:flex;flex-direction:column;overflow:hidden}
.sidebar-header{padding:18px 20px;border-bottom:1px solid #e0e0e0;display:flex;flex-direction:column;gap:4px}
.sidebar-title-row{display:flex;justify-content:space-between;align-items:center}
.sidebar-header h2{font-size:16px;font-weight:700;letter-spacing:-0.5px}
.sidebar-badge{font-size:10px;padding:3px 8px;border-radius:999px;background:#f0f2ff;color:#4a56e2;font-weight:600;text-transform:uppercase;letter-spacing:0.6px}
.sidebar-sub{font-size:11px;color:#888}

.sidebar-nav{display:flex;gap:6px;margin-top:10px}
.sidebar-nav button{flex:1;padding:8px 6px;border-radius:999px;border:1px solid #e0e0e0;background:#fafafa;font-size:11px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:4px}
.sidebar-nav button.active{background:#000;color:#fff;border-color:#000}

.sidebar-content{flex:1;padding:12px;overflow-y:auto}
.projects-label-row{display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;padding:0 4px}
.projects-label{font-size:10px;font-weight:700;color:#999;text-transform:uppercase;letter-spacing:0.8px}
.projects-count{font-size:10px;color:#aaa}
.project-search{margin-bottom:8px}
.project-search input{width:100%;padding:8px 9px;border-radius:999px;border:1px solid #e0e0e0;font-size:11px;background:#fafafa}
.project-search input:focus{outline:0;border-color:#000;background:#fff}

.sidebar-projects{display:flex;flex-direction:column;gap:4px}
.sidebar-btn{width:100%;padding:9px 10px;background:#fafafa;border-radius:8px;border:1px solid #e0e0e0;color:#1a1a1a;font-size:12px;font-weight:500;cursor:pointer;text-align:left;display:flex;flex-direction:column;gap:2px}
.sidebar-btn:hover{background:#f3f3f3}
.sidebar-btn.active{background:#000;color:#fff;border-color:#000}
.sidebar-btn span{font-size:10px;opacity:.8}

.sidebar-footer{margin-top:auto;padding:10px 12px;border-top:1px solid #e0e0e0;display:flex;gap:8px}
.sidebar-footer button{flex:1;padding:10px 10px;border-radius:999px;border:1px solid #e0e0e0;background:#fafafa;font-size:11px;font-weight:600;cursor:pointer;text-transform:uppercase}
.sidebar-footer button:first-child{background:#000;color:#fff;border-color:#000}
.sidebar-footer button:hover{background:#f0f0f0}

/* Main */
.main-content{flex:1;display:flex;flex-direction:column;overflow:hidden;background:#f0f2f5}
.header{padding:14px 20px;background:#fff;border-bottom:1px solid #e0e0e0;display:flex;justify-content:space-between;align-items:center}
.header-left{display:flex;flex-direction:column;gap:2px}
.header-title{font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:0.6px}
.header-breadcrumb{font-size:11px;color:#888}
.header-actions{display:flex;gap:8px}
.btn{padding:9px 13px;background:#000;border-radius:999px;border:1px solid #000;color:#fff;font-size:11px;font-weight:600;cursor:pointer;text-transform:uppercase;letter-spacing:0.5px;display:flex;align-items:center;gap:6px}
.btn.secondary{background:#fafafa;color:#111;border-color:#e0e0e0}
.btn.secondary:hover{background:#f0f0f0}
.btn:hover{background:#111}

/* Content */
.content{flex:1;overflow:hidden;background:#f0f2f5;display:flex;flex-direction:column}

/* Dashboard */
.dashboard{flex:1;overflow-y:auto;padding:20px;display:flex;flex-direction:column;gap:16px}
.dashboard-row{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:16px}
.welcome-card{background:#fff;border-radius:12px;border:1px solid #e0e0e0;padding:18px 16px;display:flex;flex-direction:column;gap:8px}
.welcome-card h3{font-size:13px;font-weight:700}
.welcome-card p{font-size:11px;color:#666}
.welcome-steps{margin-top:4px;font-size:11px;color:#555}
.welcome-steps li{margin-left:14px;margin-bottom:4px}

.hint-card{background:#fff;border-radius:12px;border:1px dashed #d0d4dd;padding:14px 14px;font-size:11px;color:#666}

/* Projects grid */
.projects-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:16px}
.project-card{background:#fff;border-radius:12px;border:1px solid #e0e0e0;padding:14px 14px;cursor:pointer;display:flex;flex-direction:column;gap:6px}
.project-card:hover{border-color:#a2a7b3}
.project-card-header{display:flex;justify-content:space-between;align-items:flex-start;gap:6px}
.project-card h4{font-size:13px;font-weight:700}
.project-chip{font-size:10px;padding:2px 8px;border-radius:999px;background:#f0f2ff;color:#4a56e2;font-weight:600}
.project-meta{font-size:10px;color:#999}
.project-card-actions{display:flex;gap:6px;margin-top:6px}
.project-card-actions button{flex:1;padding:6px 0;border-radius:999px;background:#fafafa;border:1px solid #e0e0e0;color:#1a1a1a;font-size:9px;cursor:pointer;text-transform:uppercase}
.project-card-actions button:hover{background:#f3f3f3}

/* Tabs */
.tabs{display:flex;gap:0;border-bottom:1px solid #e0e0e0;background:#fff;padding:0 20px}
.tab{padding:11px 14px;background:transparent;border:none;border-bottom:2px solid transparent;color:#999;font-size:11px;font-weight:600;cursor:pointer;text-transform:uppercase;display:flex;align-items:center;gap:6px}
.tab span.icon{font-size:13px}
.tab.active{color:#000;border-bottom-color:#000}

/* Scripts layout (Word-like page) */
#scriptsTab{display:flex;flex:1}
.stage-bg{flex:1;display:flex;align-items:stretch;justify-content:center;padding:24px 0;background:linear-gradient(to bottom,#f0f2f5 0,#e2e4ea 60%,#d9dce4 100%)}
.screenplay-wrapper{display:flex;width:100%;max-width:1280px;overflow:hidden;background:transparent;gap:16px}
.screenplay-sidebar{width:210px;background:#ffffff;border-radius:12px;border:1px solid #e0e0e0;display:flex;flex-direction:column;overflow:hidden}
.screenplay-sidebar-header{padding:10px 12px;border-bottom:1px solid #e0e0e0}
.screenplay-sidebar-header h4{font-size:10px;font-weight:700;text-transform:uppercase;color:#666}
.scenes-list{flex:1;overflow-y:auto}
.scene-item{padding:8px 12px;font-size:10px;color:#555;border-bottom:1px solid #f3f3f3;cursor:pointer}
.scene-item:hover{background:#f7f7f7}

/* Page */
.screenplay-editor{flex:1;display:flex;flex-direction:column;align-items:center;gap:10px}
.page-label{font-size:11px;color:#777;margin-top:2px}
.screenplay-controls{width:100%;max-width:900px;padding:8px 12px;border-radius:10px;background:#ffffff;border:1px solid #e0e0e0;display:flex;gap:6px;flex-wrap:wrap;align-items:center}
.screenplay-controls button{padding:6px 9px;background:#fafafa;border-radius:999px;border:1px solid #e0e0e0;color:#1a1a1a;font-size:9px;font-weight:600;cursor:pointer;text-transform:uppercase}
.screenplay-controls button:hover{background:#f3f3f3}
.screenplay-text{flex:1;width:100%;max-width:900px;margin:0 auto 24px auto;background:#ffffff;color:#1a1a1a;padding:40px 60px;border:none;font-family:'Courier New',monospace;font-size:12px;line-height:1.9;resize:none;overflow-y:auto;box-shadow:0 0 0 1px #dedede,0 18px 45px rgba(0,0,0,0.08);border-radius:10px}
.screenplay-text:focus{outline:0}
.screenplay-text::placeholder{color:#ccc}

/* Tables */
.data-table{width:100%;border-collapse:collapse;background:#fff}
.data-table th{background:#fafafa;padding:10px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;border-bottom:1px solid #e0e0e0;color:#999}
.data-table td{padding:10px;border-bottom:1px solid #e0e0e0;font-size:11px}
.data-table input{width:100%;background:transparent;border:none;color:#1a1a1a;font-size:11px}
.data-table input:focus{outline:0;background:#fafafa}

/* Storyboards */
#storyboardsTab{flex:1;overflow-y:auto}
.storyboards-toolbar{display:flex;justify-content:space-between;align-items:center;padding:14px 20px;background:#fff;border-bottom:1px solid #e0e0e0}
.storyboards-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:12px;padding:20px}
.storyboard-card{background:#fff;border-radius:12px;border:1px solid #e0e0e0;overflow:hidden}
.storyboard-image{width:100%;aspect-ratio:16/9;background:#fafafa;display:flex;align-items:center;justify-content:center;cursor:pointer;border-bottom:1px solid #e0e0e0}
.storyboard-image img{width:100%;height:100%;object-fit:cover}
.storyboard-notes{padding:12px}
.storyboard-notes textarea{width:100%;background:#fafafa;color:#1a1a1a;padding:8px;border-radius:8px;border:1px solid #e0e0e0;font-size:10px;min-height:50px;font-family:inherit}
.storyboard-notes textarea:focus{outline:0;border-color:#000;background:#fff}

/* Budget / Shooting */
#budgetTab,#shootingTab{flex:1;flex-direction:column}
.budget-header{padding:16px 20px;background:#fff;border-bottom:1px solid #e0e0e0;display:flex;justify-content:space-between;align-items:center}
.budget-currency{padding:8px 12px;background:#fafafa;border-radius:999px;border:1px solid #e0e0e0;font-size:11px}
.budget-total{padding:12px 20px;background:#f7f7f7;border-bottom:1px solid #e0e0e0;font-weight:700;font-size:12px;display:flex;justify-content:space-between}
.delete-btn{background:#fafafa;border-radius:999px;border:1px solid #e0e0e0;color:#999;padding:4px 8px;font-size:9px;cursor:pointer;text-transform:uppercase}
.delete-btn:hover{background:#f3f3f3}

/* Chat */
#chatTab{flex:1;flex-direction:column}
.chat-container{display:flex;flex-direction:column;height:100%;padding:18px 20px;gap:8px}
.chat-header-row{display:flex;justify-content:space-between;align-items:center}
.chat-title{font-size:13px;font-weight:700}
.chat-sub{font-size:11px;color:#777}
.chat-scope-toggle{display:flex;gap:8px;margin-top:8px}
.chat-scope-toggle button{flex:0 0 auto;padding:6px 10px;font-size:10px;border-radius:999px;border:1px solid #e0e0e0;background:#fafafa;color:#333;cursor:pointer;text-transform:uppercase;font-weight:600;letter-spacing:0.5px}
.chat-scope-toggle button.active{background:#000;color:#fff;border-color:#000}
.chat-help{font-size:10px;color:#888;margin-top:4px}

.messages-area{flex:1;overflow-y:auto;margin-top:6px;margin-bottom:10px;background:#fff;padding:14px;border-radius:10px;border:1px solid #e0e0e0}
.message-item{margin-bottom:14px;padding-bottom:12px;border-bottom:1px solid #f0f0f0}
.message-text{font-size:12px;color:#1a1a1a;margin-bottom:6px;word-break:break-word}
.message-file{display:inline-block;padding:7px 10px;background:#fafafa;border-radius:999px;border:1px solid #e0e0e0;font-size:10px;text-decoration:none;color:#000;margin:4px 0;cursor:pointer}
.message-file:hover{background:#f3f3f3}
.message-meta{font-size:9px;color:#999}

.input-area{background:#fff;border-radius:10px;border:1px solid #e0e0e0;padding:10px;display:flex;gap:8px;flex-wrap:wrap;align-items:flex-start}
.message-input{flex:1;padding:9px 10px;border-radius:8px;border:1px solid #e0e0e0;background:#fafafa;font-size:12px;min-height:40px}
.file-preview{padding:6px 10px;background:#fafafa;border-radius:999px;border:1px solid #e0e0e0;font-size:10px;display:flex;justify-content:space-between;align-items:center;width:100%}
.file-preview button{background:transparent;border:none;color:#999;cursor:pointer;font-weight:700}
.attach-btn{padding:9px 11px;background:#fafafa;border-radius:999px;border:1px solid #e0e0e0;cursor:pointer;font-size:11px;font-weight:600}
.send-btn{padding:9px 13px;background:#000;border-radius:999px;border:1px solid #000;color:#fff;cursor:pointer;font-size:11px;font-weight:600}
.save-indicator{font-size:9px;color:#999;padding:6px;text-align:center}

/* Misc */
::-webkit-scrollbar{width:8px}
::-webkit-scrollbar-track{background:#f5f5f5}
::-webkit-scrollbar-thumb{background:#d0d0d0;border-radius:4px}
::-webkit-scrollbar-thumb:hover{background:#999}
input[type="file"]{display:none}
.empty-text{font-size:11px;color:#999}

/* Simple settings/help */
#settingsView{display:none;flex:1;overflow-y:auto;padding:20px}
.settings-card{background:#fff;border-radius:12px;border:1px solid #e0e0e0;padding:16px 18px;margin-bottom:12px;font-size:11px;color:#555}
.settings-card h3{font-size:13px;margin-bottom:6px}
</style></head><body>

<div id="authScreen" class="screen active">
  <div class="auth-screen">
    <div class="auth-box">
      <h1>MAXFILM</h1>
      <div class="auth-tagline">Production & Script Workspace</div>
      <div class="auth-sub">Enter your production room password to continue.</div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" placeholder="Enter password" onkeypress="if(event.key==='Enter') app.login()">
      </div>
      <button class="auth-btn" onclick="app.login()">Enter workspace</button>
      <div class="auth-hint">Hint: default password is <b>MAX</b> (you can change this later in the code).</div>
    </div>
  </div>
</div>

<div id="appScreen" class="screen">
  <div class="app-container">
    <!-- Sidebar -->
    <div class="sidebar">
      <div class="sidebar-header">
        <div class="sidebar-title-row">
          <h2>MAXFILM</h2>
          <span class="sidebar-badge">BETA</span>
        </div>
        <div class="sidebar-sub">Your production control room</div>
        <div class="sidebar-nav">
          <button id="navDashboard" class="active" onclick="app.showMainView('dashboard')">🏠 Dashboard</button>
          <button id="navSettings" onclick="app.showMainView('settings')">❓ Help</button>
        </div>
      </div>

      <div class="sidebar-content">
        <div class="projects-label-row">
          <span class="projects-label">Projects</span>
          <span class="projects-count" id="projectsCountLabel">0</span>
        </div>

        <div class="project-search">
          <input id="projectSearchInput" type="text" placeholder="Search projects…" oninput="app.filterProjects()">
        </div>

        <div class="sidebar-projects" id="projectsList"></div>
      </div>

      <div class="sidebar-footer">
        <button onclick="app.openNewProjectModal()">+ New</button>
        <button onclick="app.logout()">Logout</button>
      </div>
    </div>

    <!-- Main -->
    <div class="main-content">
      <!-- Header -->
      <div class="header">
        <div class="header-left">
          <div class="header-title" id="headerTitle">Dashboard</div>
          <div class="header-breadcrumb" id="headerBreadcrumb">Overview of all projects</div>
        </div>
        <div class="header-actions">
          <button class="btn secondary" onclick="app.openNewProjectModal()">+ New Project</button>
          <button class="btn secondary" onclick="app.showMainView('dashboard')">🏠 Projects</button>
        </div>
      </div>

      <!-- Save bar -->
      <div class="save-indicator" id="saveIndicator">Changes auto-save while you edit.</div>

      <!-- Main views -->
      <div class="content">
        <!-- Dashboard view -->
        <div id="dashboardView" style="display:flex;flex:1;flex-direction:column">
          <div class="dashboard">
            <div class="dashboard-row">
              <div class="welcome-card">
                <h3>Welcome to MaxFilm</h3>
                <p>Everything for your production in one place: scripts, breakdowns, boards, budget, schedule and chat.</p>
                <ul class="welcome-steps">
                  <li>Create a project from the left sidebar.</li>
                  <li>Open it and start writing in the Script tab.</li>
                  <li>Use Chat to keep notes per project or in the public room.</li>
                </ul>
              </div>
              <div class="hint-card">
                <b>Quick tip</b><br>
                Tabs along the top of a project follow your workflow: <b>Scripts → Storyboards → Budget → Shooting → Chat</b>.
              </div>
            </div>

            <div style="font-size:12px;font-weight:600;margin-top:8px;">All projects</div>
            <div id="allProjects" class="projects-grid" style="margin-top:6px;"></div>
          </div>
        </div>

        <!-- Editor view -->
        <div id="editorView" style="display:none;flex:1;flex-direction:column">
          <div class="tabs">
            <button class="tab active" onclick="app.switchTab('scripts')"><span class="icon">📄</span><span>Scripts</span></button>
            <button class="tab" onclick="app.switchTab('storyboards')"><span class="icon">🎬</span><span>Storyboards</span></button>
            <button class="tab" onclick="app.switchTab('budget')"><span class="icon">💰</span><span>Budget</span></button>
            <button class="tab" onclick="app.switchTab('shooting')"><span class="icon">📅</span><span>Shooting</span></button>
            <button class="tab" onclick="app.switchTab('chat')"><span class="icon">💬</span><span>Chat</span></button>
          </div>

          <div class="content">
            <!-- Scripts -->
            <div id="scriptsTab">
              <div class="stage-bg">
                <div class="screenplay-wrapper">
                  <div class="screenplay-sidebar">
                    <div class="screenplay-sidebar-header">
                      <h4>Scene list</h4>
                    </div>
                    <div id="scenesList" class="scenes-list"></div>
                  </div>
                  <div class="screenplay-editor">
                    <div class="page-label">Script for <span id="scriptProjectTitle">Project</span></div>
                    <div class="screenplay-controls">
                      <span style="font-size:10px;color:#777;margin-right:8px;">Insert:</span>
                      <button onclick="app.insertScene('EXT')">EXT</button>
                      <button onclick="app.insertScene('INT')">INT</button>
                      <button onclick="app.insertScene('ACTION')">Action</button>
                      <button onclick="app.insertScene('CHARACTER')">Character</button>
                      <button onclick="app.insertScene('DIALOGUE')">Dialogue</button>
                      <button onclick="app.insertScene('PAREN')">Paren</button>
                    </div>
                    <textarea id="scriptText" class="screenplay-text" placeholder="Fade in..." oninput="app.onScriptChange()"></textarea>
                  </div>
                </div>
              </div>
            </div>

            <!-- Storyboards -->
            <div id="storyboardsTab" style="display:none">
              <div class="storyboards-toolbar">
                <div style="font-size:12px;font-weight:600;">Storyboard frames</div>
                <button class="btn secondary" onclick="app.addStoryboard()">+ Add frame</button>
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
              <button class="btn secondary" style="margin:10px 20px 16px 20px" onclick="app.addBudgetLine()">+ Add line</button>
            </div>

            <!-- Shooting -->
            <div id="shootingTab" style="display:none">
              <div style="flex:1;overflow-y:auto;padding:20px">
                <table class="data-table">
                  <thead>
                    <tr><th>Date</th><th>Location</th><th>Scenes</th><th>Notes</th><th></th></tr>
                  </thead>
                  <tbody id="shootingList"></tbody>
                </table>
              </div>
              <button class="btn secondary" style="margin:10px 20px 16px 20px" onclick="app.addShootingDay()">+ Add day</button>
            </div>

            <!-- Chat -->
            <div id="chatTab" style="display:none">
              <div class="chat-container">
                <div class="chat-header-row">
                  <div>
                    <div class="chat-title" id="chatTitle">Chat</div>
                    <div class="chat-sub" id="chatSubtitle">Discuss this project or use the public room.</div>
                  </div>
                  <div style="font-size:10px;color:#888">Attachments are stored with messages</div>
                </div>

                <div class="chat-scope-toggle">
                  <button id="projectChatBtn" class="active" onclick="app.setChatScope('project')">Project chat</button>
                  <button id="publicChatBtn" onclick="app.setChatScope('public')">Public room</button>
                </div>
                <div class="chat-help">
                  <b>Project chat</b> stays with this project and disappears if the project is deleted. <b>Public room</b> is shared across everything.
                </div>

                <div class="messages-area" id="messagesArea"></div>

                <div class="input-area" id="inputArea">
                  <input type="text" id="messageInput" class="message-input" placeholder="Type a message and press Send">
                  <button class="attach-btn" onclick="document.getElementById('fileInput').click()">📎 Attach</button>
                  <button class="send-btn" onclick="app.sendMessage()">Send</button>
                  <input type="file" id="fileInput" onchange="app.handleFileSelect()">
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Settings / Help view -->
        <div id="settingsView">
          <div class="settings-card">
            <h3>How to use MaxFilm</h3>
            <p>1. Create a project from the sidebar or the header.<br>
               2. Open the project from the sidebar list.<br>
               3. Use the <b>Scripts</b> tab as your screenplay page, <b>Storyboards</b> to collect frames, <b>Budget</b> and <b>Shooting</b> to keep track of money and days.<br>
               4. Use <b>Project chat</b> for notes tied to that project and <b>Public room</b> for general talk.</p>
          </div>
          <div class="settings-card">
            <h3>Password</h3>
            <p>The default password is <b>MAX</b>. To change it, open the server file and edit the check inside <code>login()</code> in the inline script.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Simple "modal" for new project (inline) -->
<div id="newProjectModal" style="position:fixed;inset:0;display:none;align-items:center;justify-content:center;background:rgba(0,0,0,.35);z-index:50">
  <div style="background:#fff;border-radius:14px;padding:20px 20px 16px 20px;border:1px solid #d0d4dd;min-width:280px;max-width:360px">
    <div style="font-size:14px;font-weight:600;margin-bottom:8px">New project</div>
    <div style="font-size:11px;color:#777;margin-bottom:12px">Give your film or episode a name.</div>
    <input id="newProjectNameInput" type="text" placeholder="Project title" style="width:100%;padding:10px 9px;border-radius:8px;border:1px solid #d0d4dd;font-size:12px;margin-bottom:12px">
    <div style="display:flex;justify-content:flex-end;gap:8px">
      <button onclick="app.closeNewProjectModal()" style="padding:7px 11px;border-radius:999px;border:1px solid #e0e0e0;background:#fafafa;font-size:11px;cursor:pointer">Cancel</button>
      <button onclick="app.createProjectFromModal()" style="padding:7px 13px;border-radius:999px;border:1px solid #000;background:#000;color:#fff;font-size:11px;font-weight:600;cursor:pointer">Create</button>
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

  init: function() {
    // no auto-login
  },

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
        document.getElementById("headerBreadcrumb").textContent = "Overview of all projects";
      }
    } else if (view === "settings") {
      dashboard.style.display = "none";
      editor.style.display = "none";
      settings.style.display = "block";
      document.getElementById("navSettings").classList.add("active");
      document.getElementById("headerTitle").textContent = "Help";
      document.getElementById("headerBreadcrumb").textContent = "Quick guide to using MaxFilm";
    }
  },

  startAutoSave: function() {
    var self = this;
    this.autoSaveInterval = setInterval(function() {
      if (self.currentProject) self.autoSaveProject();
    }, 5000);
  },

  onScriptChange: function() {
    if (!this.currentProject) return;
    this.currentProject.scripts = document.getElementById("scriptText").value;
    this.updateScenesList();
  },

  autoSaveProject: async function() {
    if (!this.currentProject) return;
    this.currentProject.scripts = document.getElementById("scriptText").value;
    this.currentProject.updatedAt = new Date().toLocaleDateString();
    await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(this.currentProject)
    });
    document.getElementById("saveIndicator").textContent = "Auto-saved";
  },

  loadProjects: async function() {
    const res = await fetch("/api/projects");
    this.projects = await res.json();
    this.renderDashboard();
  },

  loadPublicMessages: async function() {
    const res = await fetch("/api/messages?scope=public");
    this.publicMessages = await res.json();
  },

  loadProjectMessages: async function() {
    if (!this.currentProject) return;
    const res = await fetch("/api/messages?scope=project&projectId=" + this.currentProject.id);
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
    document.getElementById("allProjects").innerHTML = html || '<div class="empty-text">No projects yet. Create one from the left or top.</div>';
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
    container.innerHTML = html || '<div class="empty-text" style="padding:4px 4px 0 4px;">No projects yet</div>';
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
      scripts: "",
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
      document.getElementById("headerBreadcrumb").textContent = "Overview of all projects";
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
    document.getElementById(tab + "Tab").style.display = (tab === "scripts") ? "flex" : "block";
    event.target.classList.add("active");
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

  insertScene: function(type) {
    var textarea = document.getElementById("scriptText");
    var toInsert = "";
    if (type === "EXT") toInsert = "\\nEXT. LOCATION - DAY\\n\\n";
    else if (type === "INT") toInsert = "\\nINT. LOCATION - DAY\\n\\n";
    else if (type === "ACTION") toInsert = "\\nACTION\\n";
    else if (type === "CHARACTER") toInsert = "\\nCHARACTER\\n";
    else if (type === "DIALOGUE") toInsert = "\\nDIALOGUE\\n";
    else toInsert = "\\n(parenthetical)\\n";

    textarea.value += toInsert;
    if (this.currentProject) this.currentProject.scripts = textarea.value;
    this.updateScenesList();
  },

  renderEditor: function() {
    document.getElementById("scriptProjectTitle").textContent = this.currentProject.name;
    document.getElementById("scriptText").value = this.currentProject.scripts || "";
    document.getElementById("currencySelect").value = this.currentProject.budget.currency || "NOK";
    this.updateCurrencySymbol();
    this.updateScenesList();
    this.renderStoryboards();
    this.renderBudget();
    this.renderShooting();
    this.currentChatScope = "project";
    this.setChatScope("project");
  },

  updateScenesList: function() {
    var text = this.currentProject.scripts || "";
    var lines = text.split("\\n");
    var scenes = lines.filter(function(line) {
      return line.indexOf("INT.") === 0 || line.indexOf("EXT.") === 0;
    });
    var html = scenes.map(function(s, i) {
      return '<div class="scene-item">' + (i + 1) + '. ' + s.slice(0, 32) + '...</div>';
    }).join("");
    document.getElementById("scenesList").innerHTML = html || '<div class="empty-text" style="padding:8px 10px;">No scene headings yet</div>';
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
    document.getElementById("storyboardsList").innerHTML = html || '<div class="empty-text">No frames yet. Add one to start visualizing.</div>';
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
    div.innerHTML = "📎 " + this.selectedFile.name + ' <button onclick="app.removeFile()" type="button">✕</button>';
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

  renderChat: function() {
    var messages;
    var title;
    if (this.currentChatScope === "public") {
      messages = this.publicMessages;
      title = "Public room";
    } else {
      messages = this.projectMessages;
      title = this.currentProject ? "Chat • " + this.currentProject.name : "Project chat";
    }
    var html = messages.map(function(m) {
      var fileHtml = "";
      if (m.file) {
        fileHtml = '<br><a class="message-file" onclick="app.downloadFile(' + "'" + m.file.data + "'" + ',' + "'" + m.file.name + "'" + ')">📄 ' + m.file.name + '</a>';
      }
      return '' +
        '<div class="message-item">' +
          '<div class="message-text">' +
            (m.text || "") + fileHtml +
          '</div>' +
          '<div class="message-meta">' + m.timestamp + '</div>' +
        '</div>';
    }).join("");
    document.getElementById("messagesArea").innerHTML = html || '<div class="empty-text">' + title + ' empty.</div>';
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
