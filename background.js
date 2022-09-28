let blurInt = 5;

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ blurInt });
});
