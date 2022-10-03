var textCheckUrl ='http://localhost:5000/check-text'

function iterateDom() {
  console.log("iterateDom");
  // const allInBody = document.getElementsByTagName("*");
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
  var rejectedTags = ["BODY", "FORM", "g", "HEAD","HEADER", "HTML", "IMG", "IFRAME", "INPUT", "META","NAV", "OL", "path", "polygon", "SECTION", "SCRIPT", "STYLE", "svg", "UL"];
  for (const element of allInBody) {
    var uid = getUID(element);
    element.id = uid;
    //console.log(uid);
    // var selector = "#" + uid;
    // console.log(selector);
    if (!rejectedTags.includes(element.tagName)) {
    
      let childText = Array.from(element.children, ({textContent}) => textContent).filter(Boolean).join(' ');
      if(typeof childText !== "undefined")
      {
        if (childText.length > 0) {
          childText = childText.trim().replace(/\s+/g,' ');
        }
      } else {
        childText = "";
      }
  
      let text = element.innerText;
      if(typeof text !== "undefined")
      {
        if (text.length > 0) {
          text = text.trim().replace(/\s+/g,' ');
        }
      } else {
        text = "";
      }
      
  
  
      if (text.length > 0) {
        //console.log(uid + " text:");
        //console.log(text);
  
        if ((element.children.length == 0) && (!textArr.includes(text))) {
          //console.log("NO children or children have no text. adding to domdict");
          //domDict[selector] = text;
          domDict[uid] = text;
          textArr.push(text);
    
      } else {
        //console.log("has children. here's child text");
        //console.log(childText);
      }
  
    } else {
      //console.log(uid + "has no text");
    }

    } else {
      console.log("should I add tag "+ element.tagName + " ?")
    }
}

console.log("ABOUT TO SEND DOMDICT");
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
    body: JSON.stringify(domDict),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("returned data");
      console.log(data);
      var arrayLength = data.length;
      for (var i = 0; i < arrayLength; i++) {
          var d = data[i];
          for (const [key, value] of Object.entries(d)) {
            if (key == "id") {
              var emlId = value;
            } else if (key == "score") {
              var emlScore = value;
            }
            
            if (emlScore >= 0.5) {
              console.log(emlId + " score is " + emlScore );
              var blurStyle = `blur(${emlScore*5}px)`;
              document.getElementById(emlId).style.filter = blurStyle;
            }
            // var blurStyle = `blur(${emlScore}px)`;
            // document.getElementById(emlId).style.filter = blurStyle;
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
  
