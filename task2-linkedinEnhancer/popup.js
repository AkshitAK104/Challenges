document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('toggle');
    
    chrome.storage.local.get(['widgetVisible'], ({ widgetVisible }) => {
      toggle.checked = !!widgetVisible;
    });
  
    toggle.addEventListener('change', (e) => {
      chrome.storage.local.set({ widgetVisible: e.target.checked });
    });
  });
  