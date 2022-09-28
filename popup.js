// Initialize button
let blurButton = document.getElementById("blurButton");


function iterateDom() {
  console.log("iterateDom");
  //const allInBody = document.querySelectorAll('body > *'); // Empty dict
  const allInBody = document.getElementsByTagName("*");

  var domDict = new Object();
  const textArr = [];

  function getUID(elm) {
    var id = elm.id;
    if(window["uidCounter"]==null)
        window["uidCounter"]=0;
    return id||( (window["uidCounter"]++) + "_" + (new Date()).getTime() );
  }


  for (const element of allInBody) {
    if (element.children.length == 0) {
    let text = element.innerText;
    //let text = element.innerHTML; // NO
    //let text = element.outerHTML; // NO

      if (text) {
        let cleaned_text = text.trim();
        if (cleaned_text.length > 0) {

          if (!textArr.includes(cleaned_text)) {
            var uid = getUID(element);
            var selector = "#" + uid;
            element.id = selector;
      
            domDict[selector] = cleaned_text;
            textArr.push(cleaned_text);
          } 
    
        }
      }
    }
  }

  console.log("domDict");
  console.log(domDict);

  // send to api
  let headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Accept', 'application/json');
  headers.append('Access-Control-Allow-Origin', '*');
  headers.append('Access-Control-Allow-Credentials', 'true');
  headers.append('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  

  fetch('http://localhost:5000/check-text', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    // mode: 'no-cors',  
    // method: "post",
    // headers: headers,   
    body: JSON.stringify(domDict),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success");
      console.log(data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });

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