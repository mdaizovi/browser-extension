// Initialize button
let blurButton = document.getElementById("blurButton");


function iterateDom() {
  console.log("iterateDom");
  const allInBody = document.querySelectorAll('body > *');

  function getDomPath(el) {
    console.log("getDomPath");
    var stack = [];
    while ( el.parentNode != null ) {
      console.log(el.nodeName);
      var sibCount = 0;
      var sibIndex = 0;
      for ( var i = 0; i < el.parentNode.childNodes.length; i++ ) {
        var sib = el.parentNode.childNodes[i];
        if ( sib.nodeName == el.nodeName ) {
          if ( sib === el ) {
            sibIndex = sibCount;
          }
          sibCount++;
        }
      }
      if ( el.hasAttribute('id') && el.id != '' ) {
        stack.unshift(el.nodeName.toLowerCase() + '#' + el.id);
      } else if ( sibCount > 1 ) {
        stack.unshift(el.nodeName.toLowerCase() + ':eq(' + sibIndex + ')');
      } else {
        stack.unshift(el.nodeName.toLowerCase());
      }
      el = el.parentNode;
    }
    console.log("stack");
    console.log(stack);
    return stack.slice(1); // removes the html element
  }

  for (const element of allInBody) {
    let text = element.textContent;
    console.log(text);
  
    var path = getDomPath(element);
    console.log(path.join(' > '));
  }

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