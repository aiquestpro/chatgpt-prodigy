import "../style/base.css";
import { h, render } from "preact";
import renderToString from "preact-render-to-string";
import {
  getTextArea,
  getFooter,
  getRootElement,
  getSubmitButton,
  getWebChatGPTToolbar,
  getDeepSearchElement,
} from "../util/elementFinder";

import {
  insertAfter,
  sleep,
  getLocal,
  setLocal,
  parseData,
} from "../util/constants";
import { Tooltip } from "antd";
import Toolbar from "src/components/toolbar";
import ErrorMessage from "src/components/errorMessage";
import { getUserConfig, updateUserConfig } from "src/util/userConfig";
import { apiSearch, deep_api, SearchResult,scrap } from "./api";
import createShadowRoot from "src/util/createShadowRoot";
import { compilePrompt } from "src/util/promptManager";
import { AiFillPlusCircle, AiFillPlusSquare, AiFillSave } from "react-icons/ai";
import ResponseModal from "../components/responseModal/index";
import Browser from "webextension-polyfill";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { similarity } from "ml-distance";
import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";



import urlPopup from "../components/urlPopup/index";


import FileSaver from 'file-saver'
import UrlPopup from "../components/urlPopup/index";
import FloatingToolbar from "src/components/FloatingToolbar";
import { initSession } from "src/util/init_sessions";

let isProcessing = false;
let currentSearchResults = "";
let searchResultArray = [];
let userUssageControl = true;

let btnSubmit: HTMLButtonElement | null | undefined
let textarea: HTMLTextAreaElement | null
let chatGptFooter: HTMLDivElement | null
let toolbar: HTMLElement | null

let tasksarea: HTMLTextAreaElement | null



let updatingUI = false
const rootEl = getRootElement();



const observer = new MutationObserver( mutationCallback );



// const prompts=['Translate above text in urdu','Perform sentiment analysis on above text in urdu','Now translate the text again into English']
let prompts = []
let get_tasks = false
let all_tasks = []
let task_answers = []
let query = ""
let goals = ""
let prev_tasks = []

const formatWebResults = (results: SearchResult[]) => {
  let counter = 1
  return results.reduce((acc, result): string => acc += `[${counter++}] "${result.body}"\nURL: ${result.href}\n\n`, "")
}


async function onSubmit(event: MouseEvent | KeyboardEvent) {

  
  


  console.log("on submit")
  if (!textarea) 
  {return}

  setTimeout(() => {
    let chatDiv = document.getElementsByClassName("whitespace-pre-wrap");
    for (let i = 0; i < chatDiv.length; i++) {
      if (
        chatDiv[i]?.innerText.indexOf("Query:") > -1 ||
        chatDiv[i]?.innerText.indexOf("query:") > -1
      ) {
        const elem_1 = chatDiv[i]?.innerText.split("Query:");
        if (chatDiv[i]) chatDiv[i].innerText = elem_1[1];
      }
    }
  }, 1000);

  setTimeout(() => {
    let chatDiv = document.getElementsByClassName("whitespace-pre-wrap");
    for (let i = 0; i < chatDiv.length; i++) {
      if (
        chatDiv[i]?.innerText.indexOf("Human :") > -1
        
      ) {
        const elem_1 = chatDiv[i]?.innerText.split("Human :");
        if (chatDiv[i]) chatDiv[i].innerText = elem_1[1];
      }
    }
  }, 1000);

  

  const isKeyEvent = event instanceof KeyboardEvent
  


  if (event instanceof KeyboardEvent && event.shiftKey && event.key === "Enter")
    return;


  if (!isProcessing && (event.type === "click" || (isKeyEvent && event.key === 'Enter'))) {
    // console.log(getDeepSearchElement(),getFooter())
     query = textarea?.value.trim();

    // console.log("query ", query)
    

    if (!query) return

    textarea.value = "";

    const userConfig = await getUserConfig();

    console.log(userConfig)

    isProcessing = true;

    // console.log(userConfig)

    if(userConfig.autogpt){

      // task_answers = []
      // all_tasks = query.toLowerCase().split("task:")

      // // console.log("all_tasks : ", all_tasks)

      // textarea.value=all_tasks[1]

      // prompts = all_tasks.slice(2,)
      // tasks_performed = 0

      let starting_prompt = `System: You are  Assistant
      Your decisions must always be made independently 
                  without seeking user assistance. Play to your strengths 
                  as an LLM and pursue simple strategies with no legal complications. 
                  If you have completed all your tasks, 
                  make sure to use the "finish" command.
      
      GOALS: {query}
      
      Constraints:
      1. ~4000 word limit for short term memory. 
      2. If you are unsure how you previously did something or want to recall past events, thinking about similar events will help you remember.
      3. No user assistance
      4. Exclusively use the commands listed in double quotes e.g. "command name"

      Commands:
      1. web_search: useful for when you need to answer questions about current events. You should ask targeted questions, args json schema: {"query": "Query"}
      2. chatgpt_task: Use ChatGPT to answer the query, args : {"query": "Query"}
      3. finish: use this to signal that you have finished all your objectives, args: "response": "final response to let people know you have finished your objectives"
      
      Resources:
      1. Internet access for searches and information gathering.
      2. CHATGPT as a LLM
      
      Performance Evaluation:
      1. Continuously review and analyze your actions to ensure you are performing to the best of your abilities.
      2. Constructively self-criticize your big-picture behavior constantly.
      3. Reflect on past decisions and strategies to refine your approach.
      4. Be sharp and think out of the box to achieve the mentioned goal in minimum steps.
      
      You should only respond in JSON format as described below 
      Response Format: 
      {
        "thoughts": {
          "text": "thought",
          "reasoning": "reasoning",
          "plan": "- short bulleted\\n- list that conveys\\n- long-term plan",
          "criticism": "constructive self-criticism",
         
      },
          "command": {
              "name": "command name",
              "args": {
                  "arg name": "value"
              }
          }
      } 
      Ensure the response can be parsed by Javascript JSON.parse
      
      Human : Determine which next command to use, and always respond using the format specified above:`


      
      textarea.value= starting_prompt.replace("{query}",query)
      get_tasks = true

      goals = query

      
      
    
     observer.observe(btnSubmit, { childList: true, subtree: true })

    // console.log("task performed : ",tasks_performed)
    updateUserConfig({autogpt:false})
    


    // const responseElementDiv = document.querySelector('textarea')
    // const newDivElement = document.createElement("div");
    // newDivElement.className = "taskinfo"
    // newDivElement.innerText= "Performing Task: " + all_tasks[1]
    // responseElementDiv.parentElement.appendChild(newDivElement)

    pressEnter()
    isProcessing = false;
      

      

      

    }

    else if (!userConfig.webAccess && !userConfig.deepAccess) {
      // console.log("no web access :: ", query);

      if (query.toLowerCase().includes("[web_search]")){
        // console.log("perform web search")
        // const web_results = await apiSearch(
        //   query.replace("[web_search]"," "),
        //   userConfig.numWebResults,
        //   userConfig.timePeriod,
        //   userConfig.region
        // );
         const responseElementDiv = document.querySelector('textarea')
      const newDivElement = document.createElement("div");
      newDivElement.className = "taskinfo"
      newDivElement.innerText= "Performing Web Search... Hold on!"
      responseElementDiv.parentElement.appendChild(newDivElement)


        const web_results = await deep_api(
          query.replace("[web_search]"," "),
          4,
          userConfig.timePeriod,
          userConfig.region
        );

        // console.log("web results : ",web_results)

        const formattedResults = formatWebResults(web_results)
        textarea.value ="web search results : " + formattedResults + "\n Instructions: Forget all previous instructions and write a summarized answer using the provided web search results. Write a summarized answer for given Query. Ensure the response is a single paragraph and not a json.  \nQuery: " + query.replace("[web_search]"," ") 
        pressEnter();
        isProcessing = false;
      }

      
      else if (query.toLowerCase().includes("[web_scrap]")){


       const scraped_content = await scrap(query.replace("[web_scrap]"," "))
       

       textarea.value ="web results : " + scraped_content.slice(0, 5).join(', ') + "\n Instructions: Forget all previous instructions and write a summarized answer using the provided web search results. Write a summarized answer for given Query. Ensure the response is a single paragraph and not a json.  \nQuery: " + query.replace("[web_scrap]"," ") 
       
       pressEnter();
       isProcessing = false;
       


      }

      else{
        console.log("Adsadasdasds")
        textarea.value = query 
        pressEnter();
        isProcessing = false;
        

        // return;
        
      }


      
      // const raw = document.getElementById("__NEXT_DATA__")?.innerText;
      // const json = JSON.parse(raw);
      // const user_email = json.props.pageProps.user.email;

     
      // return;
    }

    

    else if (userConfig.deepAccess && userConfig.webAccess) {
      // console.log("deep search on");
      textarea.value = "";
      try {
        const site_filter = window.localStorage
          .getItem("resources_input")
          .replace(/\n/gi, "");
        let site_2 = "";
        site_filter.includes(",")
          ? (site_2 = site_filter.split(","))
          : (site_2 = site_filter);
        // console.log(site_2, site_filter)

        // console.log(query)
        queryMake = "";
        site_2 === ""
          ? (queryMake = "")
          : typeof site_2 === "object"
          ? (queryMake = site_2
              .map((d) =>
                d.includes(".com")
                  ? (queryMake = " site:" + d)
                  : (queryMake = " site:" + d + ".com")
              )
              .join(" || "))
          : site_2.includes(".com")
          ? (queryMake = " site:" + site_2)
          : (queryMake = " site:" + site_2 + ".com");
        // console.log("querymake: ", queryMake);
        const results = await deep_api(
          query + " " + queryMake,
          5,
          userConfig.timePeriod,
          userConfig.region
        );

        searchResultArray = results;
        await pasteWebResultsToTextArea(results, query);
        // pressEnter();
        // isProcessing = false;
      } catch (error) {
        // pressEnter();
        // isProcessing = false;
        // showErrorMessage(error)
      }
    }
    else {
      // console.log("only webaccess");

      textarea.value = "";
      try {
        const site_filter = window.localStorage
          .getItem("resources_input")
          .replace(/\n/gi, "");
        let site_2 = "";
        site_filter.includes(",")
          ? (site_2 = site_filter.split(","))
          : (site_2 = site_filter);
        // console.log(site_2, site_filter)

        // console.log(query)
        queryMake = "";
        site_2 === ""
          ? (queryMake = "")
          : typeof site_2 === "object"
          ? (queryMake = site_2
              .map((d) =>
                d.includes(".com")
                  ? (queryMake = " site:" + d)
                  : (queryMake = " site:" + d + ".com")
              )
              .join(" || "))
          : site_2.includes(".com")
          ? (queryMake = " site:" + site_2)
          : (queryMake = " site:" + site_2 + ".com");
        // console.log(queryMake)
        const results = await apiSearch(
          query + " " + queryMake,
          userConfig.numWebResults,
          userConfig.timePeriod,
          userConfig.region
        );

        searchResultArray = results;
        await pasteWebResultsToTextArea(results, query);
        pressEnter();
        isProcessing = false;
      } catch (error) {
        isProcessing = false;
        showErrorMessage(error);
      }
    }
  }
}

function get_deep() {
  console.log("DS : ", getDeepSearchElement(), getWebChatGPTToolbar());
}

async function pasteWebResultsToTextArea(
  results: SearchResult[],
  query: string
) {
  const fullPrompt = await compilePrompt(results, query);
  // console.log(fullPrompt)
  currentSearchResults = fullPrompt;
  textarea.value = fullPrompt;

  const raw = document.getElementById("__NEXT_DATA__")?.innerText;
  const json = JSON.parse(raw);
  const user_email = json.props.pageProps.user.email;

  // fetch(
  //   "https://script.google.com/macros/s/AKfycbzy5elTbSz07nrUCws9qU_7aeQLT_FhW2470eQyif_9CBwOwzNr4IhaRM-EiLueVH8xNg/exec",
  //   {
  //     method: "POST",
  //     body: JSON.stringify({ prompt: currentSearchResults, user: user_email }),
  //     redirect: "follow",
  //   }
  // );
}

async function get_user() {
  const userConfig = await getUserConfig();

  return userConfig;
}

function pressEnter() {
  textarea?.focus();
  const enterEvent = new KeyboardEvent("keydown", {
    bubbles: true,
    cancelable: true,
    key: "Enter",
    code: "Enter",
  });
  setTimeout(() => {
    let chatDiv = document.getElementsByClassName("whitespace-pre-wrap");
    for (let i = 0; i < chatDiv.length; i++) {
      if (
        chatDiv[i]?.innerText.indexOf("Query:") > -1 ||
        chatDiv[i]?.innerText.indexOf("query:") > -1
      ) {
        const elem_1 = chatDiv[i]?.innerText.split("Query:");
        if (chatDiv[i]) chatDiv[i].innerText = elem_1[1];
      }
    }
  }, 1000);

  setTimeout(() => {
    let chatDiv = document.getElementsByClassName("whitespace-pre-wrap");
    for (let i = 0; i < chatDiv.length; i++) {
      if (
        chatDiv[i]?.innerText.indexOf("Human :") > -1
        
      ) {
        const elem_1 = chatDiv[i]?.innerText.split("Human :");
        if (chatDiv[i]) chatDiv[i].innerText = elem_1[1];
      }
    }
  }, 1000);
  // updateUserConfig({ webAccess: true })
  
  textarea?.dispatchEvent(enterEvent);



  

}

function showErrorMessage(error: Error) {
  console.log("WebChatGPT error --> API error: ", error);
  const div = document.createElement("div");
  document.body.appendChild(div);
  render(<ErrorMessage message={error.message} />, div);
}

async function validaterUser() {
  const raw = document.getElementById("__NEXT_DATA__")?.innerText;
  const json = JSON.parse(raw);
  const user_email = json.props.pageProps.user.email;
  // console.log(user_email)
  const sheetsID = "1FdzU-baHfjc-6tnlV8zbPJ9Q-zig8AkLolOwCa0dtWU";
  const r1 = await fetch(
    `https://docs.google.com/a/google.com/spreadsheets/d/${sheetsID}/gviz/tq?tqx=out:csv&tq=select%20*%20where%20A%20contains%20'${user_email}'`
  );
  const res1 = await r1.text();
  if (res1.length < 1) {
    const time = new Date().toISOString();
    fetch(
      `https://script.google.com/macros/s/AKfycbwWvU_P07LLpU-p9QkQhEIb2dwmZMNxzoVihCwEgmKTqpAdfFcFbq5g8Zpu4pSf-aAkxQ/exec?email=${user_email}&quota=-&act=write&type=-&time=${time}`
    );
  } else {
    const userControl = res1.slice(1, -1).split('","');
    // console.log(userControl)
    if (userControl[4] === false || userControl[4].toLowerCase() === "false") {
      console.log("userControl :: ",userControl)
      userUssageControl = false;
      footer = getFooter();
      console.log(footer);
      // isProcessing = true

    const responseElementDiv = document.querySelector('textarea')
    const newDivElement = document.createElement("div");
    newDivElement.className = "taskinfo"
    newDivElement.innerHTML=  '<p style="padding:0px; margin:0px; text-align:center; margin-top:1px; margin-bottom:1px; left:0; right:0;" font-size:larger !important; color:red !important;>Account Blocked, Please contact <a href="mailto:info@aiquestpro.com">info@aiquestpro.com</a></p>';

    responseElementDiv.parentElement.appendChild(newDivElement)

    updateUserConfig({ webAccess: false });
     
  }
}
}

function removePromptText() {
  let chatDiv = document.getElementsByClassName("whitespace-pre-wrap");
  for (let i = 0; i < chatDiv.length; i++) {
    if (
      chatDiv[i]?.innerText.indexOf("Query:") > -1 ||
      chatDiv[i]?.innerText.indexOf("query:") > -1
    ) {
      const elem_1 = chatDiv[i]?.innerText.split("Query:");
      if (chatDiv[i]) chatDiv[i].innerText = elem_1[1];
    }
  }

  const responseElem = document.getElementsByClassName(
    "markdown prose w-full break-words"
  );
  if (responseElem[0]) {
    if (responseElem[0]?.innerText?.includes("Sources:-")) {
      return;
    } else {
      responseElem[0].innerHTML =
        responseElem[0].innerHTML +
        (window.localStorage.getItem("sources") || "");
    }
  }
}

async function addSources(searchResults) {
  const userConfig = await getUserConfig();
  if (userConfig.webAccess) {
    const responseElementDiv = document.getElementsByClassName(
      "markdown prose w-full break-words"
    );
    const insertHtml =
      "<div class='sourceslist'>Sources:- " +
      searchResults
        .map((d, i) => `<a href="${d.href}" target="_blank">[${i + 1}]</a>`)
        .join(" - ") +
      "</div>";
    responseElementDiv[responseElementDiv.length - 1].innerHTML =
      responseElementDiv[responseElementDiv.length - 1].innerHTML + insertHtml;
    responseElementDiv.length === 1
      ? window.localStorage.setItem("sources", insertHtml)
      : "";
  }
}



async function updateUI() {  // removePromptText()

  if (updatingUI) return

  updatingUI = true


  setTimeout(() => {
    let chatDiv = document.getElementsByClassName("whitespace-pre-wrap");
    for (let i = 0; i < chatDiv.length; i++) {
      if (
        chatDiv[i]?.innerText.indexOf("Query:") > -1 ||
        chatDiv[i]?.innerText.indexOf("query:") > -1
      ) {
        const elem_1 = chatDiv[i]?.innerText.split("Query:");
        if (chatDiv[i]) chatDiv[i].innerText = elem_1[1];
      }
    }
  }, 1000);

  setTimeout(() => {
    let chatDiv = document.getElementsByClassName("whitespace-pre-wrap");
    for (let i = 0; i < chatDiv.length; i++) {
      if (
        chatDiv[i]?.innerText.indexOf("Human :") > -1
        
      ) {
        const elem_1 = chatDiv[i]?.innerText.split("Human :");
        if (chatDiv[i]) chatDiv[i].innerText = elem_1[1];
      }
    }
  }, 1000);

  window.localStorage.setItem("sources", "");



  // if (getWebChatGPTToolbar()) return;
  textarea = getTextArea()
  tasksarea = document.querySelector("textarea[id='tasks']")
  // console.info("UpdateUI textarea: ", textarea)

  toolbar = getWebChatGPTToolbar()

  if (!textarea) {
    toolbar?.remove()
    return
  } 

  
  if (toolbar) return

  console.info("WebChatGPT: Updating UI")

  btnSubmit = getSubmitButton();

  btnSubmit?.addEventListener("click", onSubmit)

  textarea?.addEventListener("keydown", onSubmit)

  await renderToolbar()

  
  // if ( userUssageControl) {
  //   await renderToolbar()
    
  // chatGptFooter = getFooter()
  // if (chatGptFooter) {
  //   const lastChild = chatGptFooter.lastElementChild as HTMLElement;
  //   if (lastChild) lastChild.style.padding = "0 0 0.5em 0";
  // }

  // }
  chatGptFooter = getFooter()
  if (chatGptFooter) {
      const lastChild = chatGptFooter.lastElementChild as HTMLElement
      if (lastChild) lastChild.style.padding = '0 0 0.5em 0'
  }
  updatingUI = false
}


async function renderToolbar() {

  try {
      const textareaParentParent = textarea?.parentElement?.parentElement
      const { shadowRootDiv, shadowRoot } = await createShadowRoot('content-scripts/mainUI.css')
      shadowRootDiv.classList.add('wcg-toolbar')
      textareaParentParent?.appendChild(shadowRootDiv)
      render(<Toolbar textarea={textarea} tasksarea={tasksarea} />, shadowRoot)

  } catch (e) {
      if (e instanceof Error) {
          showErrorMessage(Error(`Error loading WebChatGPT toolbar: ${e.message}. Please reload the page (F5).`))
      }
  }
}



const handleSaveResponse = async ({ title, message, articleKey }) => {
  const raw = document.getElementById("__NEXT_DATA__")?.innerText;
  const json = JSON.parse(raw);
  const user_email = json.props.pageProps.user.email;
  const allConversations = parseData(await getLocal("conversations")) || [];
  if (articleKey === undefined || articleKey === null) {
    console.info("i came in if");
    const conversationKeys = allConversations.map(({ key }) => key);
    let conversationObj = {};
    console.info("keys", conversationKeys);
    if (
      conversationKeys === undefined ||
      conversationKeys.length === 0 ||
      conversationKeys === null
    ) {
      conversationObj = {
        title,
        key: 0,
        messages: [message],
      };
    } else {
      const maxNumber = conversationKeys?.length
        ? Math.max(...conversationKeys) + 1 // because we want to start from 0
        : 0;
      console.info("maxNumber", maxNumber, conversationKeys);
      conversationObj = {
        title,
        key: Number(maxNumber),
        messages: [message],
      };
      console.info("conversationObj", conversationObj);
    }
    const newConversations = [...allConversations, conversationObj];

    fetch(
      "https://script.google.com/macros/s/AKfycbxw-dcT2DKX_yWmUAIVjMfqUh4HRxEMkfIL69wYmwUMdOHz3Zqee80U8BTh4BwSYQj7tw/exec",
      {
        method: "POST",
        body: JSON.stringify({
          article_save: "article_saved",
          user: user_email,
        }),
        redirect: "follow",
      }
    );
    await setLocal("conversations", newConversations);
  } else {
    console.info("i came in else");
    const newConversations = allConversations.map((data) => {
      if (data.key === articleKey) {
        const newMessagesArray = [...data.messages, message];
        return { title: data.title, key: data.key, messages: newMessagesArray };
      } else return data;
    });
    console.info("newConversations", newConversations);

    fetch(
      "https://script.google.com/macros/s/AKfycbxw-dcT2DKX_yWmUAIVjMfqUh4HRxEMkfIL69wYmwUMdOHz3Zqee80U8BTh4BwSYQj7tw/exec",
      {
        method: "POST",
        body: JSON.stringify({
          article_save: "article_saved",
          user: user_email,
        }),
        redirect: "follow",
      }
    );
    return await setLocal("conversations", newConversations);
  }
};

const renderResponseModal = async ({ parentModule }) => {
  const newDivElement = document.createElement("div");
  newDivElement.id = `export-post-members`;
  const message = parentModule && parentModule?.innerText;
  render(
    <ResponseModal handleSaveResponse={handleSaveResponse} message={message} />,
    newDivElement
  );
};

const handleAddButton = async () => {
  const likeDislikeDiv = [
    ...document.querySelectorAll('div[class*="text-gray-400 flex self-end"]'),
  ];

  for (let i = 0; i < likeDislikeDiv.length; i += 1) {
    const buttons = likeDislikeDiv[i];
    let parentModule =
      buttons.parentElement.parentElement.parentElement.parentElement;

    if (buttons.querySelectorAll("button")?.length <= 1) {
      parentModule = buttons.parentElement.parentElement.parentElement;
    }
    const btnAlreadyExists = buttons.parentElement.querySelector(
      'button[id^="response-button-wrap" ]'
    );

    if (!btnAlreadyExists) {
      const emailButton = document.createElement("button");
      emailButton.id = `response-button-wrap-${i}`;
      emailButton.className = `btn flex justify-center gap-2 btn-primary mr-2`;
      // emailButton.innerText=`Save`
      emailButton.innerHTML = `
              ${renderToString(
                <Tooltip title={"Save Response"}>
                  {/* {"Save"} */}
                  <AiFillPlusCircle />
                </Tooltip>
              )}
              `;

      buttons.appendChild(emailButton);

      await sleep(500);

      document
        .querySelector(`button[id="response-button-wrap-${i}"  ]`)
        ?.addEventListener("click", () => {
          renderResponseModal({ parentModule });
        });
    }
  }
};

const handleSaveResponseIcons = async () => {
  let retry = 0;
  const interval = setInterval(() => {
    const likeDislikeDiv = document.querySelectorAll(
      'div[class*="text-gray-400 flex self-end"]'
    );
    if (likeDislikeDiv?.length) {
      return handleAddButton();
    }
  }, 1000);
};

function extractJSON(str) {
  var firstOpen, firstClose, candidate;
  firstOpen = str.indexOf('{', firstOpen + 1);
  do {
      firstClose = str.lastIndexOf('}');
      // console.log('firstOpen: ' + firstOpen, 'firstClose: ' + firstClose);
      if(firstClose <= firstOpen) {
          return null;
      }
      do {
          candidate = str.substring(firstOpen, firstClose + 1);
          // console.log('candidate: ' + candidate);
          try {
              var res = JSON.parse(candidate);
              // console.log('...found');
              return [res, firstOpen, firstClose + 1];
          }
          catch(e) {
              // console.log('...failed');
          }
          firstClose = str.substr(0, firstClose).lastIndexOf('}');
      } while(firstClose > firstOpen);
      firstOpen = str.indexOf('{', firstOpen + 1);
  } while(firstOpen != -1);
}

async function  autogpt(){
  
  // console.log("autogpt get_tasks :: ", get_tasks)
  const userConfig = await getUserConfig();
  if (userConfig.autogpt_status == false){
        updateUserConfig({autogpt_status:true})

        observer.disconnect()
        const raw = document.getElementById("__NEXT_DATA__")?.innerText;
        const json = JSON.parse(raw);
        const user_email = json.props.pageProps.user.email;
        fetch(
      "https://script.google.com/macros/s/AKfycbxw-dcT2DKX_yWmUAIVjMfqUh4HRxEMkfIL69wYmwUMdOHz3Zqee80U8BTh4BwSYQj7tw/exec",
      {
      method: "POST",
      body: JSON.stringify({
        article_save: goals.toString(),
        user: user_email,
      }),
      redirect: "follow",
      }
    );

    const blob = new Blob([task_answers.join("\n\n")], { type: 'text/plain;charset=utf-8' })
    FileSaver.saveAs(blob, task_answers[0].split(" ").join("_")+ ".md")

    task_answers = []

  }

  setTimeout(() => {
    let chatDiv = document.getElementsByClassName("whitespace-pre-wrap");
    for (let i = 0; i < chatDiv.length; i++) {
      if (
        chatDiv[i]?.innerText.indexOf("Human :") > -1
        
      ) {
        const elem_1 = chatDiv[i]?.innerText.split("Human :");
        if (chatDiv[i]) chatDiv[i].innerText = elem_1[1];
      }
    }
  }, 1000);




  if (get_tasks  == true)


  {
    const responseElementDiv = document.getElementsByClassName('markdown prose w-full break-words')
    const chatGPTResponse = responseElementDiv[responseElementDiv.length-1].innerText

    let response = {}
    let command_name = ''
    let command_Args = ''
    
    // console.log("performing task :: " , chatGPTResponse)
    
    try{

    try{

    let response = JSON.parse(chatGPTResponse)
    // console.log("json1 : " ,response)
    command_name =  response['command']['name'] 

    if (command_name == "web_scrap"){
    command_Args = response['command']['args']['URL']
    }
    else if(command_name == "web_search" || command_name == "chatgpt_task"){
      command_Args = response['command']['args']['query']

    }
    else{
      command_Args = response['command']['args']['response']
    }

    

    }
    catch (error){
      command_name = "web_search"
      command_Args = goals
      console.log("exceptionnn inner!!!")
    //   let response = extractJSON(chatGPTResponse)
    //   console.log("json2 : " ,response)
      
    //    if (Object.keys(response[0]).includes("command")){
    //     command_name =  response[0]['command']['name'] 
    //     command_Args = response[0]['command']['args']['query']
    // }
    // else if (Object.keys(response[0]).includes("query")){
    //   command_name =  "web_search"
    //   command_Args = response[0]['query']

    // }
    // else{
    //   command_name =  response[0]['name'] 
    //   command_Args = response[0]['args']['query']

    // }
  }
}
catch{
  command_name = "web_search"
  command_Args = goals
  console.log("exceptionnn!!!")

}
task_answers.push(command_Args)


    prev_tasks.push(command_name + " : "+ command_Args)
    
    if (command_name == "chatgpt_task"){

      // console.log("perform chatgpt task ", command_Args)
      textarea.value = "Forget all previous instructions about output format and write a paragraph using previous explored information about: " + command_Args
    }
    else if (command_name == "web_search"){

      // console.log("perform websearch task ", command_Args)
      textarea.value = command_Args + "  [web_search] "
    }
    else if (command_name == "web_scrap"){

      if(command_Args.includes("http") || command_Args.includes("https")){

      textarea.value = command_Args + "  [web_scrap] "
    }
    else{
      textarea.value = goals + "  [web_search] "

    }

    }
    else if (command_name =="finish"){
      // console.log("in finish command ", command_Args)
      textarea.value =  "Summarize the above results and format it in best understandable format"

      updateUserConfig({autogpt_status:false})

        observer.disconnect()
        const raw = document.getElementById("__NEXT_DATA__")?.innerText;
        const json = JSON.parse(raw);
        const user_email = json.props.pageProps.user.email;
        fetch(
      "https://script.google.com/macros/s/AKfycbxw-dcT2DKX_yWmUAIVjMfqUh4HRxEMkfIL69wYmwUMdOHz3Zqee80U8BTh4BwSYQj7tw/exec",
      {
      method: "POST",
      body: JSON.stringify({
        article_save: goals.toString(),
        user: user_email,
      }),
      redirect: "follow",
      }
    );


    const blob = new Blob([task_answers.join("\n\n")], { type: 'text/plain;charset=utf-8' })
    FileSaver.saveAs(blob, task_answers[0].split(" ").join("_")+ ".md")

    task_answers = []

    



    }
    else {
      // console.log("perform else websearch task ", command_Args)
      textarea.value = command_Args + "  [web_search] "

    }


    get_tasks = false



    // const responseElementDiv = document.querySelector('textarea')
    // const newDivElement = document.createElement("div");
    // newDivElement.className = "taskinfo"
    // newDivElement.innerText= "Performing Task: " +  prompts[tasks_performed]
    // responseElementDiv.parentElement.appendChild(newDivElement)

    
    

    
    // tasks_performed += 1

    setTimeout(() => {
      
    pressEnter()
    isProcessing = false
    }, 2000);
    
    
  }
  else{ //get results of previous task and add to prompt for next task

    for (let i = 0; i < 1; i++) {
      const responseElementDiv = document.querySelector('div[class="taskinfo"]')
      if(responseElementDiv){
      
      responseElementDiv.remove()
      }

    }

    const responseElementDiv = document.getElementsByClassName('markdown prose w-full break-words')
    const chatGPTResponse = responseElementDiv[responseElementDiv.length-1].innerText


    task_answers.push(chatGPTResponse)


    // console.log("getting result of prev task : ", chatGPTResponse)
    // console.log("preparing prompt for next task")

    // let new_prompt = "Previous task results : " + chatGPTResponse 
    let new_prompt = `System: You are  Assistant Your decisions must always be made independently without seeking user assistance. Play to your strengths 
                  as an LLM and pursue simple strategies with no legal complications. If you have completed all your tasks, 
                  make sure to use the "finish" command.
      
      GOALS: {goals}

      Previous Tasks : {prev_tasks}
      
      Constraints:
      1. ~4000 word limit for short term memory. 
      2. If you are unsure how you previously did something or want to recall past events, thinking about similar events will help you remember.
      3. No user assistance
      4. Exclusively use the commands listed in double quotes e.g. "command name"
  

      Commands:
      1. web_search: useful for when you need to answer questions about current events. You should ask targeted questions, args json schema: {"query": "Query"}
      2. chatgpt_task: Use ChatGPT to answer the query, args : {"query": "Query"}
      3. web_scrap : useful to get content from a particular URL, args : {"query","URL"}
      4. finish: use this to signal that you have finished all your objectives, args: "response": "final response to let people know you have finished your objectives"
      
      Resources:
      1. Internet access for searches and information gathering using web.
      2. CHATGPT as a LLM
      3. Web Scrapping to scrap a website for information
      
      Performance Evaluation:
      1. Continuously review and analyze your actions to ensure you are performing to the best of your abilities.
      2. Constructively self-criticize your big-picture behavior constantly.
      3. Reflect on past decisions and strategies to refine your approach.
      4. Don't suggest already completed tasks.
      5. Be sharp and think out of the box to achieve the mentioned goal in minimum steps.

      You should only respond in JSON format as described below 
      Response Format: 
      {
        "thoughts": {
          "text": "thought",
          "reasoning": "reasoning",
          "plan": "- short bulleted\\n- list that conveys\\n- long-term plan",
          "criticism": "constructive self-criticism",
         
      },
          "command": {
              "name": "command name",
              "args": {
                  "arg name": "value"
              }
          }
      } 
      Ensure the response can be parsed by Javascript JSON.parse
      
      Human : Determine which next command to use, and always respond using the format specified above:
      `



    textarea.value = new_prompt.replace("{goals}",goals).replace("{prev_tasks}",task_answers.slice(-4,).join("\n"))



    get_tasks = true
    

    setTimeout(() => {
      pressEnter()
      isProcessing = false
    }, 2000);

// const raw = document.getElementById("__NEXT_DATA__")?.innerText;
  // const json = JSON.parse(raw);
  // const user_email = json.props.pageProps.user.email;
  // fetch(
  //   "https://script.google.com/macros/s/AKfycbxw-dcT2DKX_yWmUAIVjMfqUh4HRxEMkfIL69wYmwUMdOHz3Zqee80U8BTh4BwSYQj7tw/exec",
  //   {
  //     method: "POST",
  //     body: JSON.stringify({
  //       article_save: "AutoGPT",
  //       user: user_email,
  //     }),
  //     redirect: "follow",
  //   }
  // );





    



      
  

    
  




  }
  

  


}

function mutationCallback (){

  const btn = document.querySelector('textarea').nextElementSibling

  


  if (btn.className.includes("disabled:bottom")){
    // console.log("button diabled :)")
  }
  else{
    // console.log("button enabled, good to go")

    const responseElementDiv = document.getElementsByClassName('markdown prose w-full break-words')
    const chatGPTResponse = responseElementDiv[responseElementDiv.length-1].innerText

  //  task_answers.push(chatGPTResponse)





    setTimeout(() => {
    autogpt()
  }, 2000);
   
  }
  
}

const form = document.querySelector('form')
const formParent = form?.parentElement


const mutationObserver = new MutationObserver((mutations) => {
    
  if (!mutations.some(mutation => mutation.removedNodes.length > 0)) return

  console.info("WebChatGPT: Mutation observer triggered")
  
  if (getWebChatGPTToolbar()) return

  try {
    if(userUssageControl){
      updateUI()
  }
  } catch (e) {
      if (e instanceof Error) {
          showErrorMessage(e)
      }
  }
})

window.onload = async function () {

  // window.onload = function () {

  window.localStorage.setItem("resources_input", "");
  window.localStorage.setItem("sources", "");

  await validaterUser();

  console.log("userUssageControl : ", userUssageControl)
  // updateUI()

  if (userUssageControl) {
    updateUI()
  }
  


  handleSaveResponseIcons();

  setTimeout(() => {
    let chatDiv = document.getElementsByClassName("whitespace-pre-wrap");
    for (let i = 0; i < chatDiv.length; i++) {
      if (
        chatDiv[i]?.innerText.indexOf("Query:") > -1 ||
        chatDiv[i]?.innerText.indexOf("query:") > -1
      ) {
        const elem_1 = chatDiv[i]?.innerText.split("Query:");
        if (chatDiv[i]) chatDiv[i].innerText = elem_1[1];
      }
    }
  }, 1000);

  setTimeout(() => {
    let chatDiv = document.getElementsByClassName("whitespace-pre-wrap");
    for (let i = 0; i < chatDiv.length; i++) {
      if (
        chatDiv[i]?.innerText.indexOf("Human :") > -1
        
      ) {
        const elem_1 = chatDiv[i]?.innerText.split("Human :");
        if (chatDiv[i]) chatDiv[i].innerText = elem_1[1];
      }
    }
  }, 1000);

  // mutationObserver.observe(rootEl, { childList: true, subtree: true })
  mutationObserver.observe(rootEl, { subtree: true })





}
window.onunload = function () {
  mutationObserver.disconnect()
}






document.addEventListener("mouseup", function (event) {
  
  
  const res = copySelectedText();
  

  
  // if (res) {
  //   Browser.runtime
  //     .sendMessage({
  //       type: "openChat",
  //       selectedText: res,
  //     })
  //     .then((response) => {
  //       console.log("positive:", response);
  //     })
  //     .catch((error) => {
  //       console.error("Err:", error);
  //     });
  // }
});

function copySelectedText() {
  try {
    const selectedText = window.getSelection().toString();
    if (!selectedText || window.location.href.includes("chat.openai.com"))
      return "";
    return selectedText;
  } catch (error) {
    console.info("Error in selection:", error);
  }
}

Browser.runtime.onMessage.addListener((message) => {
  if (message.type === "addTextToInput") {
    let text = message.data;
    let textArea = getTextArea();
    setTimeout(() => {
      textArea.value = text;
    }, 3000);
  }
});


