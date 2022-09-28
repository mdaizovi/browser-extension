// Initialize button
let blurButton = document.getElementById("blurButton");


function iterateDom() {
  console.log("iterateDom");
  const allInBody = document.querySelectorAll('body > *');
  var domDict = new Object();

  function getUID(elm) {
    var id = elm.id;
    if(window["uidCounter"]==null)
        window["uidCounter"]=0;
    return id||( (window["uidCounter"]++) + "_" + (new Date()).getTime() );
  }

  for (const element of allInBody) {
    let text = element.textContent.trim();

    var uid = getUID(element);
    var selector = "#" + uid;
    element.id = selector;

    if (text) {
      domDict[selector] = text;
    }
  }

  console.log("domDict");
  console.log(domDict);

    // make dict of {id:text}

    // send to api

    // add css of blur according to toxicity rating.

    // add notification in button text has been cleaned?




}


// https://stackoverflow.com/questions/10596417/is-there-a-way-to-get-element-by-xpath-using-javascript-in-selenium-webdriver
// or
//$x("some xpath")
function getElementByXpath(path) {
  return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

// When the button is clicked, inject setPageBackgroundColor into current page
blurButton.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: blurText,
    });
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: iterateDom,
    });

  });
  
  // The body of this function will be executed as a content script inside the
  // current page
  function blurText() {
    console.log("Blurring text");
    chrome.storage.sync.get("blurInt", ({ blurInt }) => {
      var blurStyle = `blur(${blurInt}px)`;
      document.body.style.filter = blurStyle;
    });
  }