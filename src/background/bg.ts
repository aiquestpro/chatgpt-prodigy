import { countBy } from 'lodash-es'
import { BrowserChrome } from 'react-bootstrap-icons'
import Browser from 'webextension-polyfill'

const manifest_version = Browser.runtime.getManifest().manifest_version


Browser.runtime?.onInstalled?.addListener(async () => openChatGPTWebpage())

function openChatGPTWebpage() {
    Browser.tabs.create({
        url: "https://chat.openai.com/chat",
    })
}

// open chatgpt webpage when extension icon is clicked
if (manifest_version == 2) {
    Browser.browserAction?.onClicked?.addListener(openChatGPTWebpage)
} else {
    Browser.action?.onClicked?.addListener(openChatGPTWebpage)
}


Browser.runtime.onMessage.addListener(async (request) => {
    if (request === "show_options") {
        Browser.runtime.openOptionsPage()
    }
    
    
    else if(request.type === "getRequest"){
        // console.log('get results',request)
        const req = await fetch(request.url)
        const res = await req.text()
        
        
        return res;
    }else if(request.type==="test"){
        console.log('test')
        return 'test'
    }
    else if (request.type === "openChat") {
        console.log("in highlightß")
        let chatWindow = Browser.windows.create({
          url: "https://chat.openai.com/",
          type: "popup",
          focused: true,
          width: 800,
          height: 600,
        
        });
        await new Promise((resolve) => setTimeout(resolve, 2000)).then(async () => {
          Browser.tabs.sendMessage((await chatWindow).tabs[0].id, {
            type: "addTextToInput",
            data: request.selectedText,
          });
        });
      }
})


Browser.commands.onCommand.addListener(async (command) => {
    console.log("ADas")
    console.log(`Command: ${command}`);
    if (command === "firstCommand") {

        Browser.tabs.create({
            url: "https://chat.openai.com/chat",
        })

    }
       
})


  