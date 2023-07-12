import { h, render } from "preact";
import { useCallback, useEffect, useState } from "preact/hooks";
import { icons } from "src/util/icons";
import {
  getSavedPrompts,
  Prompt,
  getSavedTasks,
  getSavedLang,
  getSavedTemplates,
} from "src/util/promptManager";
import { getUserConfig, updateUserConfig } from "src/util/userConfig";
import Browser from "webextension-polyfill";
import createShadowRoot from "src/util/createShadowRoot";
import {
  getTranslation,
  localizationKeys,
  setLocaleLanguage,
} from "src/util/localization";
import Footer from "./footer";
import IconButton from "./socialIconButton";
import ArticlesPopup from "../components/articlesPopup";
import { UnorderedListOutlined } from "@ant-design/icons";
import { getTextArea } from "src/util/elementFinder";

import useDropdownMenu from "react-accessible-dropdown-menu-hook";
import { getLocal, parseData, setLocal } from "src/util/constants";
import { getArticles, Article } from "src/util/articleManager";
import urlPopup from "../components/urlPopup/index";
import AutoGPTPopup from "../components/autoGPTPopup/index"
import UrlPopup from "../components/urlPopup/index";
import { Button } from "antd";

const numResultsOptions = Array.from({ length: 10 }, (_, i) => i + 1).map(
  (num) => ({
    value: num,
    label: `${num} result${num === 1 ? "" : "s"}`,
  })
);

interface ToolbarProps {
  textarea: HTMLTextAreaElement | null
  tasksarea : HTMLTextAreaElement | null

}
const Toolbar = ({ textarea,tasksarea }: ToolbarProps) => {
  const [webAccess, setWebAccess] = useState(false);
  const [extSource, setExtSource] = useState(false);
  const [autogpt, setAutoGPT] = useState(false);
  const [autogpt_status, setAutoGPTstatus] = useState(false);
  const [userSelection, setUserSelection] = useState<string>("");
  const [numResults, setNumResults] = useState(3);
  const [timePeriod, setTimePeriod] = useState("");
  const [region, setRegion] = useState("wt-wt");
  const [promptUUID, setPromptUUID] = useState<string>("");
  const [sourceUUID, setSourceUUID] = useState<string>("");
  const [taskUUID, setTaskUUID] = useState<string>("");
  const [templateUUID, setTemplateUUID] = useState<string>("");
  const [langUUID, setLangUUID] = useState<string>("");
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [sources, setSources] = useState<Prompt[]>([]);
  const [tasks, setTasks] = useState<Prompt[]>([]);
  const [template, setTemplate] = useState<Prompt[]>([]);
  const [lang, setLang] = useState<Prompt[]>([]);
  const [deepAccess, setDeepAccess] = useState(false);

  //   const [showArticles, setShowArticles] = useState(true);
  //   const [componentName, setComponentName] = useState(1);
  const [articles, setArticles] = useState<Article[]>([]);
  const [article, setArticle] = useState<Article>({
    title: "",
    key: null,
    messages: [],
  });
  const [defaultValue, setDefaultValue] = useState("Select"); // this is only for the article dropdown

  const options = ["CHATGPT", "Internet", "My Source"];

  useEffect(() => {
    getUserConfig().then((userConfig) => {
      setWebAccess(userConfig.webAccess);
      setNumResults(userConfig.numWebResults);
      setTimePeriod(userConfig.timePeriod);
      setRegion(userConfig.region);
      setPromptUUID(userConfig.promptUUID);
      setDeepAccess(userConfig.deepAccess);
      setTaskUUID(userConfig.taskUUID);
      setLangUUID(userConfig.langUUID);
      setTemplateUUID(userConfig.templateUUID);

      setLocaleLanguage(userConfig.language);
      setAutoGPT(false)
    });
    updatePrompts();
    updateSources();
    updateTasks();

    updateArticles();
    textarea?.focus()
    // set the article to articles[0] if there is one
    if (articles && articles.length > 0) {
      setArticle(articles[0]);
    }
    //     (async ()=>{
    // })
  }, []);

  useEffect(() => {
    if (
      !defaultValue &&
      article &&
      article.messages &&
      article.messages.length > 0
    ) {
      const textArea = getTextArea();
      if (textArea) {
        textArea.value = article.messages.map((m) => m).join("\n");
        textArea.value += "\n" + "Don't do anything, keep this for reference and wait for my next prompt"

        const enterEvent = new KeyboardEvent("keydown", {
          bubbles: true,
          cancelable: true,
          key: "Enter",
          code: "Enter",
        });
        textArea.dispatchEvent(enterEvent);


      }
    }
  }, [article]);

  const renderResponseModal = async () => {
    const newDivElement = document.createElement("div");
    newDivElement.id = `export-post-members`;
    // const message = parentModule && parentModule?.innerText;
    render(
      <UrlPopup  />,
      newDivElement
    );
  };

  const autogpt_off = async () => {
    updateUserConfig({autogpt_status:false})
    setAutoGPTstatus(false)
    setAutoGPT(false)

  }
  
  // const renderAutoGPT = async () => {

  const renderAutoGPT = event => {
    if (event.target.checked) {

      console.log("checked")

      const newDivElement = document.createElement("div");
        newDivElement.className="autogpt-div"
        newDivElement.id = `omer-export-post-members`;
        render(
          <AutoGPTPopup  />,
          newDivElement
        );
      


    } else {
      console.log("unchecked")

      updateUserConfig({autogpt_status:false})
      setAutoGPTstatus(false)

   }

// setAutoGPT(current => !current)

    };


  // const renderAutoGPT = useCallback(() => {


  //   console.log("autogpt: ", !autogpt)

  //   if (!autogpt == true){
 
  //   setAutoGPT(!autogpt)
    
  //   const newDivElement = document.createElement("div");
  //   newDivElement.className="autogpt-div"
  //   newDivElement.id = `omer-export-post-members`;
  //   render(
  //     <AutoGPTPopup  />,
  //     newDivElement
  //   );

  //   }
  //   else{
  //     updateUserConfig({autogpt_status:false})
  //     setAutoGPTstatus(false)

  //   }
    



   

  //   // updateUserConfig({autogpt:!autogpt})

    
   
    
    
      
    

  //   // console.log(autoGPTToggle.props.children[0].props)
  //   // autoGPTToggle.props.children[0].props.checked= true
  //   // console.log(autoGPTToggle.props.children[0].props)


    
  //   // newDivElement.id = `export-post-members`;
  //   // const message = parentModule && parentModule?.innerText;
   
  // },[autogpt,autogpt_status]);

  const handlePromptClick = () => {
    updatePrompts();
  };

  const handleSourceClick = () => {
    updateSources();
  };

  const handleTasksClick = () => {
    updateTasks();
  };

  const handleTemplateClick = () => {
    updateTemplates();
  };

  const handleArticleClick = () => {
    setDefaultValue("");
    updateArticles();
  };

  const handleLAngClick = () => {
    updateLang();
  };

  const handleShowArticles = async () => {
    const newDivElement = document.createElement("div");
    newDivElement.id = `show-articles-members`;
    const { shadowRootDiv, shadowRoot } = await createShadowRoot(
      "content-scripts/mainUI.css"
    );
    newDivElement.appendChild(shadowRootDiv);

    render(<ArticlesPopup />, shadowRoot);
  };

  const updatePrompts = () => {
    getSavedPrompts().then((savedPrompts) => {
      setPrompts(savedPrompts.filter((d) => d.type === "prompt"));
      setPromptUUID(
        promptUUID === ""
          ? savedPrompts.filter((d) => d.type === "prompt")[0].uuid
          : promptUUID
      );
      updateUserConfig({
        promptUUID:
          promptUUID === ""
            ? savedPrompts.filter((d) => d.type === "prompt")[0].uuid
            : promptUUID,
      });
    });
  };

  const updateTasks = () => {
    getSavedTasks().then((savedTasks) => {
      setTasks(savedTasks.filter((d) => d.type === "task"));
      setTaskUUID(
        taskUUID === ""
          ? savedTasks.filter((d) => d.type === "task")[0].uuid
          : taskUUID
      );
      updateUserConfig({
        taskUUID:
          taskUUID === ""
            ? savedTasks.filter((d) => d.type === "task")[0].uuid
            : taskUUID,
      });
    });
  };

  async function get_template() {
    const userConfig = await getUserConfig();
    const currentTaskUuid = userConfig.templateUUID;
    console.log("user_template_id ", currentTaskUuid);
    const savedTasks = await getSavedTemplates();
    return savedTasks.find((i: Prompt) => i.uuid === currentTaskUuid);
  }

  const updateTemplates = () => {
    getSavedTemplates().then((savedTemplate) => {
      setTemplate(savedTemplate.filter((d) => d.type === "template"));

      setTemplateUUID(
        templateUUID === ""
          ? savedTemplate.filter((d) => d.type === "template")[0].uuid
          : templateUUID
      );
      updateUserConfig({
        templateUUID:
          templateUUID === ""
            ? savedTemplate.filter((d) => d.type === "template")[0].uuid
            : templateUUID,
      });

      
    });
  };

  const updateArticles = () => {
    getArticles().then((savedArticles) => {
      if (savedArticles && savedArticles.length > 0) {
        // savedArticles = [
        //   {
        //     title: "No articles found",
        //     key: null,
        //     messages: [],
        //   },
        // ];
        setArticles(savedArticles);

        // setComponentName(savedArticles[0]?.key);
      } else {
        setArticles([]);
      }
    });
  };

  const updateLang = () => {
    getSavedLang().then((savedLang) => {
      setLang(savedLang.filter((d) => d.type === "lang"));
      setLangUUID(
        taskUUID === ""
          ? savedLang.filter((d) => d.type === "task")[0].uuid
          : langUUID
      );
      updateUserConfig({
        langUUID:
          langUUID === ""
            ? savedLang.filter((d) => d.type === "lang")[0].uuid
            : langUUID,
      });
    });
  };

  const updateSources = () => {
    getSavedPrompts().then((savedPrompts) => {
      setSources(savedPrompts.filter((d) => d.type === "source"));
    });
  };

  const handleWebAccessToggle = useCallback(() => {
    setWebAccess(!webAccess);
    updateUserConfig({ webAccess: !webAccess });

    console.log("webaccess toggle ", webAccess)

    const text_area = getTextArea();

    text_area.value = "";
  }, [webAccess]);

  const handleExternalSourceToggle = useCallback(() => {
    setExtSource(!extSource);

    // const text_area = getTextArea();

    // text_area.value = "";
  }, [extSource]);

  const handleAutoGPTToggle = useCallback(() => {
    setAutoGPT(!autogpt);
    updateUserConfig({autogpt:!autogpt})
    // const text_area = getTextArea();

    // text_area.value = "";
  }, [autogpt]);

  const handleAutoGPTstatus = useCallback(() => {
    
    updateUserConfig({autogpt_status:false})
    // const text_area = getTextArea();

    // text_area.value = "";
  }, [autogpt_status]);





  const handleDeepSearchToggle = useCallback(() => {
    setDeepAccess(!deepAccess);
    updateUserConfig({ deepAccess: !deepAccess });
  }, [deepAccess]);

  const handleNumResultsChange = (e: { target: { value: string } }) => {
    const value = parseInt(e.target.value, 10);
    setNumResults(value);
    updateUserConfig({ numWebResults: value });
  };

  const handleTimePeriodChange = (e: { target: { value: string } }) => {
    setTimePeriod(e.target.value);
    updateUserConfig({ timePeriod: e.target.value });
  };

  const handleRegionChange = (e: { target: { value: string } }) => {
    setRegion(e.target.value);
    updateUserConfig({ region: e.target.value });
  };

  const handlePromptChange = (uuid: string) => {
    removeFocusFromCurrentElement();
    console.log("uuid: ", uuid);
    setPromptUUID(uuid);
    updateUserConfig({ promptUUID: uuid });
  };

  const handleTasksChange = (uuid: string) => {
    removeFocusFromCurrentElement();
    console.log("uuid: ", uuid);
    setTaskUUID(uuid);
    // setPromptUUID(uuid)
    updateUserConfig({ taskUUID: uuid });
  };

  const handleLangChange = (uuid: string) => {
    removeFocusFromCurrentElement();
    console.log("lang uuid: ", uuid);
    setLangUUID(uuid);
    // setPromptUUID(uuid)
    updateUserConfig({ langUUID: uuid });
  };

  const handleTemplateChange = (uuid: string) => {
    removeFocusFromCurrentElement();
    // console.log("lang uuid: ", uuid)
    setTemplateUUID(uuid);
    // setPromptUUID(uuid)
    updateUserConfig({ templateUUID: uuid });

    const text_area = getTextArea();

      get_template().then((value) => {
        text_area.value = value.text;
        console.log(value); // 👉️ "bobbyhadz.com"
      });


    
  };

  const handleArticleChange = (key: number) => {
    removeFocusFromCurrentElement();
    // setComponentName(key);
    setArticle(articles[key]);

    const text_area = getTextArea();
    text_area.style.height="40px"



    

  };

  const handleSourceChange = (uuid: string) => {
    removeFocusFromCurrentElement();
    const slectedSources = sources.filter((d) => d.uuid === uuid)[0];
    window.localStorage.setItem("resources_input", slectedSources.text);
    setSourceUUID(uuid);
    updateUserConfig({ sourceUUID: uuid });
  };

  //--------------------------------------------------------------------

  const removeFocusFromCurrentElement = () =>
    (document.activeElement as HTMLElement)?.blur();

  const webAccessToggle = (
    <label className="webaccess wcg-relative wcg-inline-flex wcg-cursor-pointer wcg-items-center">
      <input
        type="checkbox"
        value=""
        className="wcg-peer wcg-sr-only"
        checked={webAccess}
        onChange={handleWebAccessToggle}
      />
      <div className="wcg-peer wcg-h-5 wcg-w-9 wcg-rounded-full wcg-bg-red-500 after:wcg-absolute after:wcg-top-[2px] after:wcg-left-[2px] after:wcg-h-4 after:wcg-w-4 after:wcg-rounded-full after:wcg-border after:wcg-border-gray-300 after:wcg-bg-white after:wcg-transition-all after:wcg-content-[''] peer-checked:wcg-bg-emerald-700 peer-checked:after:wcg-translate-x-full peer-checked:after:wcg-border-white dark:wcg-border-gray-600" />
      {/* <span className="wcg-ml-1 wcg-pl-1 wcg-text-sm wcg-font-semibold">Web Access</span> */}
      <span className="wcg-ml-1 wcg-pl-1 wcg-text-sm  after:wcg-content-['Web'] md:after:wcg-content-['Web_access']" />
    </label>
  );


  const ExtSourceToggle = (
    <label className="webaccess wcg-relative wcg-inline-flex wcg-cursor-pointer wcg-items-center">
      <input
        type="checkbox"
        value=""
        className="wcg-peer wcg-sr-only"
        checked={extSource}
        onChange={handleExternalSourceToggle}
      />
      <div className="wcg-peer wcg-h-5 wcg-w-9 wcg-rounded-full wcg-bg-red-500 after:wcg-absolute after:wcg-top-[2px] after:wcg-left-[2px] after:wcg-h-4 after:wcg-w-4 after:wcg-rounded-full after:wcg-border after:wcg-border-gray-300 after:wcg-bg-white after:wcg-transition-all after:wcg-content-[''] peer-checked:wcg-bg-emerald-700 peer-checked:after:wcg-translate-x-full peer-checked:after:wcg-border-white dark:wcg-border-gray-600" />
      {/* <span className="wcg-ml-1 wcg-pl-1 wcg-text-sm wcg-font-semibold">Web Access</span> */}
      <span className="wcg-ml-1 wcg-pl-1 wcg-text-sm  after:wcg-content-['Web'] md:after:wcg-content-['Custom_Source']" />
    </label>
  );

  const autoGPTToggle = (
    <label className="webaccess wcg-relative wcg-inline-flex wcg-cursor-pointer wcg-items-center">
      <input
        type="checkbox"
        name={"autogpt-toggle"}
        value="AutoGPT"
        className="wcg-peer wcg-sr-only"
        // onClick={renderAutoGPT}
        checked={autogpt}
        onChange={renderAutoGPT}
      />
      <div className="wcg-peer wcg-h-5 wcg-w-9 wcg-rounded-full wcg-bg-red-500 after:wcg-absolute after:wcg-top-[2px] after:wcg-left-[2px] after:wcg-h-4 after:wcg-w-4 after:wcg-rounded-full after:wcg-border after:wcg-border-gray-300 after:wcg-bg-white after:wcg-transition-all after:wcg-content-[''] peer-checked:wcg-bg-emerald-700 peer-checked:after:wcg-translate-x-full peer-checked:after:wcg-border-white dark:wcg-border-gray-600" />
      {/* <span className="wcg-ml-1 wcg-pl-1 wcg-text-sm wcg-font-semibold">Web Access</span> */}
      <span className="wcg-ml-1 wcg-pl-1 wcg-text-sm  after:wcg-content-['Web'] md:after:wcg-content-['AutoGPT']" />
    </label>
  );

  
  

  const deepsearchToggle = (
    <label className="wcg-relative wcg-inline-flex wcg-cursor-pointer wcg-items-center">
      <input
        type="checkbox"
        value=""
        className="wcg-peer wcg-sr-only"
        checked={deepAccess}
        onChange={handleDeepSearchToggle}
      />
      <div className="wcg-peer wcg-h-5 wcg-w-9 wcg-rounded-full wcg-bg-red-500 after:wcg-absolute after:wcg-top-[2px] after:wcg-left-[2px] after:wcg-h-4 after:wcg-w-4 after:wcg-rounded-full after:wcg-border after:wcg-border-gray-300 after:wcg-bg-white after:wcg-transition-all after:wcg-content-[''] peer-checked:wcg-bg-emerald-700 peer-checked:after:wcg-translate-x-full peer-checked:after:wcg-border-white dark:wcg-border-gray-600" />
      {/* <span className="wcg-ml-1 wcg-pl-1 wcg-text-sm wcg-font-semibold">Deep Search</span> */}

      <span className="wcg-ml-1 wcg-pl-1 wcg-text-sm after:wcg-content-['Deep'] md:after:wcg-content-['Deep_Search']" />
    </label>
  );

  // const drop = <SimpleDropdown
  // options={data}
  // configs={
  //   { position: { y: 'top', x: 'center' } }
  // }
  // />
  const { buttonProps, itemProps, isOpen, setIsOpen } = useDropdownMenu(3);

  const click_chatgpt = useCallback(() => {
    removeFocusFromCurrentElement();
    setUserSelection("0");

    setWebAccess(false);
    updateUserConfig({ webAccess: false });

    const text_area = getTextArea();

    text_area.value = "";

    // console.log("webAccess ", webAccess);
    // console.log("userSelection ", userSelection);
  }, [webAccess, userSelection]);

  const click_internet = useCallback(() => {
    removeFocusFromCurrentElement();

    setWebAccess(true);
    updateUserConfig({ webAccess: true });

    const text_area = getTextArea();

    text_area.value = "";
    // console.log("webAccess ", webAccess);

    setUserSelection("1");

    // console.log("userSelection ", userSelection);
  }, [webAccess, userSelection]);

  const click_sources = useCallback(() => {
    removeFocusFromCurrentElement();
    setUserSelection("2");

    setWebAccess(false);
    updateUserConfig({ webAccess: false });

    const text_area = getTextArea();

    text_area.value = "";

    // console.log("webAccess ", webAccess);
    // console.log("userSelection ", userSelection);
  }, [webAccess, userSelection]);

  // const getSourceName = {
  //   "0": "ChatGPT",
  //   "1": "Internet",
  //   "2": "My Sources",
  // };

  return (
    <div className="wcg-flex wcg-flex-col wcg-gap-0 ">
      <div
        className="wcg-toolbar wcg-flex wcg-items-start wcg-justify-between wcg-gap-2 wcg-rounded-md wcg-px-1 "
        style="padding: 5px"
      >

        {webAccessToggle } 

        {!webAccess && !extSource && ( autoGPTToggle)}
        {!webAccess && ExtSourceToggle}

        { webAccess && deepsearchToggle}

 
        {webAccess &&  (
          <div>
            Tasks
            <div
              className="wcg-dropdown-top wcg-dropdown wcg-min-w-[4.5rem]"
              onClick={handleTasksClick}
            >
              <div
                tabIndex={0}
                className="wcg-flex wcg-cursor-pointer wcg-flex-row wcg-items-center wcg-justify-between wcg-gap-0 wcg-px-2"
              >
                <label className="wcg-max-w-[7rem] wcg-cursor-pointer wcg-justify-start wcg-truncate wcg-pr-0 wcg-text-sm wcg-normal-case">
                  {tasks?.find((task) => task.uuid === taskUUID)?.name ||
                    "Select"}
                </label>
                {icons.expand}
              </div>

              <ul
                tabIndex={0}
                className="wcg-dropdown-content wcg-menu wcg-m-0 wcg-flex wcg-max-h-50 wcg-w-25 wcg-flex-col
                    wcg-flex-nowrap wcg-overflow-auto
                    wcg-rounded-md wcg-bg-gray-800 wcg-p-0"
              >
                {tasks
                  .filter((d) => d.type === "task")
                  .map((task) => (
                    <li
                      tabIndex={0}
                      className="wcg-text-sm wcg-text-white hover:wcg-bg-gray-700"
                      onClick={() => handleTasksChange(task.uuid)}
                      key={task.uuid}
                    >
                      <a>{task.name}</a>
                    </li>
                  ))}
                {/* <li className="wcg-text-sm wcg-text-white hover:wcg-bg-gray-700"
                            onClick={() => Browser.runtime.sendMessage("show_options")
                            }
                        >
                            <a>Add New Source</a>
                        </li> */}
              </ul>
            </div>
          </div>
        )}

{/* {webAccess &&
                <div>
                Sources
                
                <div className="wcg-dropdown-top wcg-dropdown wcg-min-w-[4.5rem]"
                    onClick={handleSourceClick}
                >
                    <div tabIndex={0} className="wcg-flex wcg-cursor-pointer wcg-flex-row wcg-items-center wcg-justify-between wcg-gap-0 wcg-px-2">
                        <label className="wcg-max-w-[7rem] wcg-cursor-pointer wcg-justify-start wcg-truncate wcg-pr-0 wcg-text-sm  wcg-normal-case">
                            {sources?.find((source) => source.uuid === sourceUUID)?.name || 'All'}
                        </label>
                        {icons.expand}
                    </div>

                    <ul tabIndex={0} className="wcg-dropdown-content wcg-menu wcg-m-0 wcg-flex wcg-max-h-50 wcg-w-25 wcg-flex-col
                    wcg-flex-nowrap wcg-overflow-auto
                    wcg-rounded-md wcg-bg-gray-800 wcg-p-0"
                    >
                        {sources.filter(d => d.type === "source").map((source) =>
                            <li tabIndex={0} className="wcg-text-sm wcg-text-white hover:wcg-bg-gray-700"
                                onClick={() => handleSourceChange(source.uuid)}
                                key={source.uuid}
                            >
                                <a>{source.name}</a>
                            </li>
                        )
                        }
                        <li className="wcg-text-sm wcg-text-white hover:wcg-bg-gray-700"
                            onClick={() => Browser.runtime.sendMessage("show_options")
                            }
                        >
                            <a>Add New</a>
                        </li>
                    </ul>
                </div>
                </div>
                } */}

        {webAccess && (
          <div>
            Personalities
            <div
              className="wcg-dropdown-top wcg-dropdown wcg-min-w-[5.5rem]"
              onClick={handlePromptClick}
            >
              <div
                tabIndex={0}
                className="wcg-flex wcg-cursor-pointer wcg-flex-row wcg-items-center wcg-justify-between wcg-gap-0 wcg-px-2"
              >
                <label className="wcg-max-w-[7rem] wcg-cursor-pointer wcg-justify-start wcg-truncate wcg-pr-0 wcg-text-sm  wcg-normal-case">
                  {prompts?.find((prompt) => prompt.uuid === promptUUID)
                    ?.name || "Select"}
                </label>
                {icons.expand}
              </div>

              <ul
                tabIndex={0}
                className="wcg-dropdown-content wcg-menu wcg-m-0 wcg-flex wcg-max-h-50 wcg-w-25 wcg-flex-col
                    wcg-flex-nowrap wcg-overflow-auto
                    wcg-rounded-md wcg-bg-gray-800 wcg-p-0"
              >
                {prompts
                  .filter((d) => d.type === "prompt")
                  .map((prompt) => (
                    <li
                      tabIndex={0}
                      className="wcg-text-sm wcg-text-white hover:wcg-bg-gray-700"
                      onClick={() => handlePromptChange(prompt.uuid)}
                      key={prompt.uuid}
                    >
                      <a>{prompt.name}</a>
                    </li>
                  ))}
                {/* <li className="wcg-text-sm wcg-text-white hover:wcg-bg-gray-700"
                            onClick={() => Browser.runtime.sendMessage("show_options")
                            }
                        >
                            <a>Add New Source</a>
                        </li> */}
              </ul>
            </div>
          </div>
        )}

        {webAccess && (
          <div>
            Output Language
            <div
              className="wcg-dropdown-top wcg-dropdown wcg-min-w-[9.5rem]"
              onClick={handleLAngClick}
            >
              <div
                tabIndex={0}
                className="wcg-flex wcg-cursor-pointer wcg-flex-row wcg-items-center wcg-justify-between wcg-gap-0 wcg-px-2"
              >
                <label className="wcg-max-w-[7rem] wcg-cursor-pointer wcg-justify-start wcg-truncate wcg-pr-0 wcg-text-sm  wcg-normal-case">
                  {lang?.find((lang) => lang.uuid === langUUID)?.name ||
                    "Select"}
                </label>
                {icons.expand}
              </div>

              <ul
                tabIndex={0}
                className="wcg-dropdown-content wcg-menu wcg-m-0 wcg-flex wcg-max-h-50 wcg-w-25 wcg-flex-col
                    wcg-flex-nowrap wcg-overflow-auto
                    wcg-rounded-md wcg-bg-gray-800 wcg-p-0"
              >
                {lang
                  .filter((d) => d.type === "lang")
                  .map((lang) => (
                    <li
                      tabIndex={0}
                      className="wcg-text-sm wcg-text-white hover:wcg-bg-gray-700"
                      onClick={() => handleLangChange(lang.uuid)}
                      key={lang.uuid}
                    >
                      <a>{lang.name}</a>
                    </li>
                  ))}
                {/* <li className="wcg-text-sm wcg-text-white hover:wcg-bg-gray-700"
                            onClick={() => Browser.runtime.sendMessage("show_options")
                            }
                        >
                            <a>Add New Source</a>
                        </li> */}
              </ul>
            </div>
          </div>
        )}

        {!webAccess && !extSource && (
          <div>
            Prompts
            <div
              className="wcg-dropdown-top wcg-dropdown wcg-min-w-[4.5rem]"
              onClick={handleTemplateClick}
            >
              <div
                tabIndex={0}
                className="wcg-flex wcg-cursor-pointer wcg-flex-row wcg-items-center wcg-justify-between wcg-gap-0 wcg-px-2"
              >
                <label className="wcg-max-w-[7rem] wcg-cursor-pointer wcg-justify-start wcg-truncate wcg-pr-0 wcg-text-sm wcg-normal-case">
                  {template?.find((template) => template.uuid === templateUUID)
                    ?.name || "Select"}
                </label>
                {icons.expand}
              </div>

              <ul
                tabIndex={0}
                className="wcg-dropdown-content wcg-menu wcg-m-0 wcg-flex wcg-max-h-50 wcg-w-25 wcg-flex-col
                    wcg-flex-nowrap wcg-overflow-auto
                    wcg-rounded-md wcg-bg-gray-800 wcg-p-0"
              >
                {template
                  .filter((d) => d.type === "template")
                  .map((template) => (
                    <li
                      tabIndex={0}
                      className="wcg-text-sm wcg-text-white hover:wcg-bg-gray-700"
                      onClick={() => handleTemplateChange(template.uuid)}
                      key={template.uuid}
                    >
                      <a>{template.name}</a>
                    </li>
                  ))}

                <li
                  className="wcg-text-sm wcg-text-white hover:wcg-bg-gray-700"
                  onClick={() => Browser.runtime.sendMessage("show_options")}
                >
                  <a>+ {"New Prompt"}</a>
                </li>
              </ul>
            </div>
          </div>
        )}

        {!webAccess && extSource && (
          <div>
            Sources
            <div
              className="wcg-dropdown-top wcg-dropdown wcg-min-w-[4.5rem]"
              onClick={handleArticleClick}
            >
              <div
                tabIndex={0}
                className="wcg-flex wcg-cursor-pointer wcg-flex-row wcg-items-center wcg-justify-between wcg-gap-0 wcg-px-2"
              >
                <label className="wcg-max-w-[7rem] wcg-cursor-pointer wcg-justify-start wcg-truncate wcg-pr-0 wcg-text-sm wcg-normal-case">
                  {articles.find((a) => a.key === article.key)?.title ||
                    "Select"}
                </label>
                {icons.expand}
              </div>

              <ul
                tabIndex={0}
                className="wcg-dropdown-content wcg-menu wcg-m-0 wcg-flex wcg-max-h-50 wcg-w-25 wcg-flex-col
                    wcg-flex-nowrap wcg-overflow-auto
                    wcg-rounded-md wcg-bg-gray-800 wcg-p-0"
              >
                {articles.map((arti) => (
                  <li
                    tabIndex={0}
                    className="wcg-text-sm wcg-text-white hover:wcg-bg-gray-700"
                    onClick={() => handleArticleChange(arti.key)}
                    key={arti.key}
                  >
                    <a>{arti.title}</a>
                  </li>
                ))}



            <li
                  className="wcg-text-sm wcg-text-white hover:wcg-bg-gray-700"
                  onClick={() => 
                    
                    renderResponseModal()
                  
                  }
                >
                  <a> {"Import URL"}</a>
                </li>
               

                <li
                  className="wcg-text-sm wcg-text-white hover:wcg-bg-gray-700"
                  onClick={() => Browser.runtime.sendMessage("show_options")}
                >
                  <a>+ {"New Article"}</a>
                </li>
              </ul>
            </div>
          </div>
        )}

        {!webAccess && extSource && (
          <div>
            My Articles &nbsp;
            <div
              className="wcg-dropdown-top wcg-dropdown wcg-min-w-[9.5rem] ant-icon-wrap wcg-cursor-pointer"
              onClick={handleShowArticles}
            >
              <UnorderedListOutlined click={handleShowArticles} />
            </div>
          </div>
        )}
        {/* <a href="https://www.aiquestpro.com" target="_blank">AiQUEST </a>
              <IconButton url="https://twitter.com/ProAiquest" tip={getTranslation(localizationKeys.socialButtonTips.twitter)} icon={icons.twitter} /> */}
      </div>

      <Footer />
    </div>
  );
}

export default Toolbar;
