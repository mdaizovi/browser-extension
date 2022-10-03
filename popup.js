var textCheckUrl ='http://localhost:5000/check-text'

function iterateDom() {
  console.log("iterateDom");
  const allInBody = document.getElementsByTagName("*");

  var domDict = new Object();
  const textArr = [];

  function getUID(elm) {
    var id = elm.id;
    if(window["uidCounter"]==null)
        window["uidCounter"]=0;
    return id||( (window["uidCounter"]++) + "_" + (new Date()).getTime() );
  }

  // the tags thing is probably completely unnecessary, other than maybe irnoring scripts
  var textContainingTags = ["P","DIV","BR", "SPAN", "TD", "H1", "H2", "H3", "H4", "H5", "H6", "LI", "BUTTON", "LINK", "I", "B"];
  for (const element of allInBody) {

    var uid = getUID(element);
    element.id = uid;
    var selector = "#" + uid;
    console.log(selector);

    if (textContainingTags.includes(element.tagName)) {
      console.log("Correct Tag Name")
      const childText = Array.from(element.children, ({textContent}) => textContent.trim()).filter(Boolean).join(' ');
      let text = element.innerText.trim();
      if ((element.children.length == 0) || (text.length == childText.length)) {
        console.log("no children or childtext is same as text")
        console.log("childText");
        console.log(childText);
        console.log("text");
        console.log(text);
          if (!textArr.includes(text)) {        
            // var uid = getUID(element);
            // element.id = uid;
            // var selector = "#" + uid;
            // console.log(selector);
            domDict[selector] = text;
            textArr.push(text);
          } else {
            console.log("textArr includes text");
          }

      }

    } else {
      console.log("this element is the wrong tag");
      console.log(element.tagName);
    }
  }

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
    body: JSON.stringify(domDict),
  })
    .then((response) => response.json())
    .then((data) => {
      var arrayLength = data.length;
      for (var i = 0; i < arrayLength; i++) {
          var d = data[i];
          for (const [key, value] of Object.entries(d)) {
            if (key == "id") {
              var emlId = value;
            } else if (key == "score") {
              var emlScore = value;
            }
            var blurStyle = `blur(${emlScore}px)`;
            document.getElementById(emlId).style.filter = blurStyle;
          }
      }

    })
    .catch((error) => {
      console.error('Error:', error);
    });

}

blurButton.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: iterateDom,
    });
    document.getElementById("blurButton").style.visibility = "hidden";
    document.getElementById("blurButtonStatus").style.visibility = "visible";
  });
  
