// Inject widget DOM
const widgetHTML = `
<div id="linkedin-widget" style="display: none;">
  <div class="header">
    <h3>Company Insights</h3>
    <button id="widget-close">×</button>
  </div>
  <div class="content">
    <p><strong>Company:</strong> <span id="company-name">TechCorp</span></p>
    <div class="progress-container">
      <div class="progress-bar" style="width: 86%"></div>
    </div>
    <p>Match Score: 86%</p>
    <span class="status-tag target">Target</span>
  </div>
</div>
`;

document.body.insertAdjacentHTML('beforeend', widgetHTML);

// CSS Styles
const style = document.createElement('style');
style.textContent = `
  #linkedin-widget {
    position: fixed;
    top: 20px;
    right: 20px;
    width: 300px;
    background: white;
    border: 1px solid #cfcfcf;
    border-radius: 8px;
    padding: 15px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    z-index: 9999;
  }
  .progress-container {
    height: 10px;
    background: #eee;
    border-radius: 5px;
    margin: 10px 0;
  }
  .progress-bar {
    height: 100%;
    background: #4CAF50;
    border-radius: 5px;
    transition: width 0.3s ease;
  }
  .status-tag {
    padding: 4px 8px;
    border-radius: 4px;
    color: white;
    font-size: 0.8em;
  }
  .target { background: #4CAF50; }
  .not-target { background: #f44336; }
`;
document.head.appendChild(style);

// Storage handling
chrome.storage.local.get(['widgetVisible'], ({ widgetVisible }) => {
  document.getElementById('linkedin-widget').style.display = 
    widgetVisible ? 'block' : 'none';
});

chrome.storage.onChanged.addListener((changes) => {
  if (changes.widgetVisible) {
    document.getElementById('linkedin-widget').style.display = 
      changes.widgetVisible.newValue ? 'block' : 'none';
  }
});

document.getElementById('widget-close').addEventListener('click', () => {
  chrome.storage.local.set({ widgetVisible: false });
});
