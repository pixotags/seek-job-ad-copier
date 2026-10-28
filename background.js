// Runs copy-job-ad.js in the current tab when the toolbar icon (or Alt+Shift+J) is pressed.
chrome.action.onClicked.addListener(async (tab) => {
  if (!tab?.id) return;
  try {
    await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ['copy-job-ad.js'] });
  } catch (err) {
    console.error('Seek Job Ad Copier:', err);
  }
});
