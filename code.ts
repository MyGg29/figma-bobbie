// This plugin will open a window to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.

// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (see documentation).

// This shows the HTML page in "ui.html".
figma.showUI(__html__, {
  height: 500,
  width: 310
});

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = msg => {
  // One way of distinguishing between different types of messages sent from
  // your HTML page is to use an object with a "type" property like this.
  
  if(msg.generateQuote) {
    const type = msg.generateQuote.type
    let prompt = ""
    if(type === "zen") {
      prompt = "Donne moi une citation motivante ou zen"
    }
    if(type === "joke") {
      prompt = "Raconte moi une blague"
    }
    if(type === "flatter") {
      prompt = "Flattez moi s'il vous plait"
    }
    if(type === "free") {
      prompt = msg.generateQuote.freePrompt
    }
    fetchGPT(prompt).then(json => {
      figma.ui.postMessage({
        text: json
      })
    })

  }

  // Make sure to close the plugin when you're done. Otherwise the plugin will
  // keep running, which shows the cancel button at the bottom of the screen.
  //figma.closePlugin();
};

function fetchGPT(prompt: string): Promise<FetchResponse> {
  const myHeaders = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${process.env.OPENIA_KEY}`,
  }

  const raw = JSON.stringify({
    "model": "text-davinci-003",
    "prompt": prompt,
    "temperature": 1,
    "max_tokens": 256
  });

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  return fetch("https://api.openai.com/v1/completions", requestOptions)
    .then(response => response.text())
    .then(text => JSON.parse(text))
}