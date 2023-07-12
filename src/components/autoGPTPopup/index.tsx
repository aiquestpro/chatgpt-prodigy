import { h, render } from "preact";

import { useEffect, useState } from "preact/hooks";
import { Modal, Button, Input, Select, Switch ,Upload} from "antd";
// export type { UploadFile, UploadProps } from './upload';
import { getUserConfig, updateUserConfig } from "src/util/userConfig";


import { getLocal, parseData, setLocal } from "src/util/constants";
import { UploadOutlined } from '@ant-design/icons';
import {
  getTextArea,
  getFooter,
  getRootElement,
  getSubmitButton,
  getWebChatGPTToolbar,
  getDeepSearchElement,
} from "src/util/elementFinder";
import createShadowRoot from "src/util/createShadowRoot";
import Toolbar from "src/components/toolbar";

import "./style.css";
import Browser from "webextension-polyfill";

import fileupload from "./fileupload"

const { TextArea } = Input;
let textarea: HTMLTextAreaElement | null
let tasks_area: HTMLTextAreaElement | null









function pressEnter() {
  textarea = getTextArea()

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
  // updateUserConfig({ webAccess: true })
  
  textarea?.dispatchEvent(enterEvent);



  

}

export default function AutoGPTPopup(props) {
  const {  message } = props;
  const [responseModal, setResponseModal] = useState(true);
  const [articles, setArticles] = useState([]);
  const [attachArticle, showAttachArticle] = useState(false);
  const [articleKey, setArticleKey] = useState(null);
  const [tasks, setTasks] = useState("");
  const [goals, setGoals] = useState("");
  const observer_goals = new MutationObserver( mutationCallback );



  const get_suggestions = async () => {

    textarea = getTextArea()

    textarea.value = "create a task list to break down the following goal into smaller,manageable tasks which can be handled by you (chat GPT). If you (chat GPT) can't perform a task use [web_search] notation. use prefix 'Task:' notation before each task.  \n Goal:" + goals
    updateUserConfig({autogpt:true})

    pressEnter()

    const btn = document.querySelector('textarea').nextElementSibling

    


    observer_goals.observe(btn, { childList: true, subtree: true })


  }

  function mutationCallback (){

    const btn = document.querySelector('textarea').nextElementSibling
  
  
    if (btn.className.includes("disabled:bottom")){
      // console.log("button diabled in autogpt :)")
    }
    else{
      // console.log("button enabled in autogpt, good to go")
      const responseElementDiv = document.getElementsByClassName('markdown prose w-full break-words')
      const chatGPTResponse = responseElementDiv[responseElementDiv.length-1].innerText
      // console.log("chatGPTResponse : ", chatGPTResponse)
  
      tasks_area = document.querySelector("textarea[id='tasks']")
      tasks_area?.addEventListener("onChange", handleOnChange)

      tasks_area.addEventListener("Event",handleOnChange)
  
      tasks_area?.focus()
      tasks_area.value = chatGPTResponse
      observer_goals.disconnect()
    }
    
  }
  

  const start = async () => {
    // handleSaveResponse({ title, message, articleKey });

    // let all_tasks = tasks.split("Task:")
    // console.log(all_tasks.slice(2,))


    updateUserConfig({autogpt:true})
    updateUserConfig({autogpt_status:true})
    

    
    // prompts = all_tasks
    // tasks_performed = 0

    textarea = getTextArea()

    textarea.value = goals
    // const btn = document.querySelector('textarea').nextElementSibling

    


    // observer.observe(btn, { childList: true, subtree: true })
    setResponseModal(false);

    pressEnter()


    
    
  };

  const handleGoals =(event) => {
    setGoals(event.target.value)
    // console.log("event",event.target.value)
  }

  const handleOnChange =(event) => {
    setTasks(event.target.value)
    // console.log("event",event.target.value)
  }

  const handleAttachArticle = ({ key }) => {
    setArticleKey(key);
  };

  const handleAddTitle = (event) => {
    showAttachArticle(event);
  };

  

  
  function set_example(){

  // console.log("in set example")

  const goals_area = document.querySelector("textarea[id='goals']")
  // console.log(goals_area)
  goals_area.value = "comparison between ChatGPT and AutoGPT"

   tasks_area = document.querySelector("textarea[id='tasks']")
  //  console.log(tasks_area)
   tasks_area.value = "Task: Write a short paragraph on ChatGPT \nTask: what is autoGPT [web_search] \nTask: compare chatgpt and autogpt using web results"
  tasks_area.placeholder=""
  }
  

  useEffect(() => {
    tasks_area = document.querySelector("textarea[id='tasks']")
    tasks_area?.addEventListener("onChange", handleOnChange)

    tasks_area.addEventListener("Event",handleOnChange)

    tasks_area?.focus()




    // const btn = document.querySelector('textarea').nextElementSibling

    // observer.observe(btn, { childList: true, subtree: true })
    getLocal("conversations").then((data) => {
      const items = parseData(data || []);
      const newArticles = items?.map((item) => {
        return {
          label: item.title,
          value: item.key,
        };
      });
      setArticles(newArticles);
    });
  }, []);

  return (
    <div className="messsenger-edit-lead-modal">

  
      { <Modal
        className="create-messenger-edit-lead-modal messenger-assign-lead-modal"
        footer={null}
        
        width={440}
        centered
        open={responseModal}
        onCancel={() => {
          updateUserConfig({autogpt:false})
          setResponseModal(false);
        }}
      >
        <div className="d-flex justify-content-center align-items-center flex-column pipeline-modal">
          <img src={""} alt={""} className="pipeline-bulk-action" />
          <h2 className="mb-3 text-center color-dark pipeline-modal-heading">
            <span className="">{"Auto Pilot"}</span>
          </h2>
         
         {/* { <div className="pipeline-modal-wrapper-pro">
            <div className="pipeline-modal-label">
             
             
              <label style={{ fontWeight: 600 }}> Goals </label>
              
                <a href='https://www.youtube.com/watch?v=XSq3Wav7PokE' target='_blank' className='wcg-text-gray-400 wcg-underline' rel="noreferrer">See Example</a>
              
              <TextArea
                id="goals"
                defaultValue=""
                rows={2}
                placeholder="Create a market plan for a product which uses chatgpt with internet"
                maxLength={400}
                type = "text"
                onChange={(event) => handleGoals(event)}
                
              />
            </div>
            
          </div>
      } */}
          
          { <div className="pipeline-modal-wrapper-pro">
            <div className="pipeline-modal-label">
               <label style={{ fontWeight: 600 }}> Goals </label>
               <a href='https://www.youtube.com/watch?v=XSq3Wav7PokE' target='_blank' className='wcg-text-gray-400 wcg-underline' rel="noreferrer"> (See Example)</a>

              <TextArea
                defaultValue=""
                isRequired="true"
                id="tasks"
                rows={2}
                placeholder="which is better, amazon vs shopify"
                maxLength={400}
                type = "text"
                name="tasks"
                onChange={(event) => handleGoals(event)}
                
              />
            </div>
          </div>
           }
        </div>
        {/* <a>* use [web_search] to seach on web </a> */}
        <br />
        <br />
        

        <div className="modal-footer d-flex justify-content-center">
          <Button
            size="default"
            outlined="true"
            type="white"
            onClick={() => {
              updateUserConfig({autogpt:false})

              setResponseModal(false);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              start();
            }}
            style={{ background: "#1677ff" }}
            // disabled={
            //   (!attachArticle && !title) ||
            //   (attachArticle && articleKey === null)
            // }
            size="default"
            type="primary"
            className="ml-2 save-btn"
          >
            {"Start"}
          </Button>
        </div>
      </Modal> }
    </div>
  );
}
