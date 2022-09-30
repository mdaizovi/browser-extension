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


  for (const element of allInBody) {
    if (element.children.length == 0) {
    let text = element.innerText;

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
  
