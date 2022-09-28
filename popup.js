// Initialize button
let blurButton = document.getElementById("blurButton");

// When the button is clicked, inject setPageBackgroundColor into current page
blurButton.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: blurText,
    });
  });
  
  // The body of this function will be executed as a content script inside the
  // current page
  function blurText() {
    chrome.storage.sync.get("blurInt", ({ blurInt }) => {
      var blurStyle = `blur(${blurInt}px)`;
      document.body.style.filter = blurStyle;
    });
  }