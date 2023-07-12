import "../style/base.css";
import { h, render } from "preact";
import { getUserConfig, updateUserConfig } from "src/util/userConfig";
import { useCallback, useLayoutEffect, useState } from "preact/hooks";
import PromptEditor from "src/components/promptEditor";
import {
  getTranslation,
  localizationKeys,
  setLocaleLanguage,
} from "src/util/localization";
import NavBar from "src/components/navBar";
import { icons } from "src/util/icons";
import ArticleEditor from "src/components/articleEditor";
import SourceEditor from "src/components/sourceEditor";


import { Layout, Menu, Modal, Tooltip } from 'antd';


// import ChatGPT from '../assets/icons/icon16.png';


const getSourceName = {
    "0": "Prompts",
    "1": "Articles",
    // "2": "Web Sources",
  };

const Footer = () => (
  <div className="wcg-flex wcg-flex-col wcg-items-center wcg-p-4">
    <p
      style={{ whiteSpace: "pre-line" }}
      className="wcg-m-0 wcg-p-1 wcg-text-center wcg-text-sm"
    >
      info@aiquestpro.com <br></br>
      Feel free to Write to us!
    </p>
    {/* <a
      className="wcg-p-4"
      href="https://www.buymeacoffee.com/aiquestpro?utm_source=webchatgpt&utm_medium=options_page"
      target="_blank"
      rel="noopener noreferrer"
    >
      <img src="https://img.buymeacoffee.com/button-api/?text=Support this project&emoji=&slug=aiquestpro&button_colour=FFDD00&font_colour=000000&font_family=Poppins&outline_colour=000000&coffee_colour=ffffff" />
    </a> */}
  </div>
);

// const SocialCard = ({ icon, text }: { icon: JSX.Element, text: string }) => (
//     <div className="wcg-btn wcg-btn-ghost wcg-h-28 wcg-w-36 wcg-p-2 wcg-rounded-xl wcg-flex wcg-flex-col">
//         {icon}
//         <p className="wcg-normal-case wcg-p-2">{text}</p>
//     </div>
// )
const removeFocusFromCurrentElement = () =>
(document.activeElement as HTMLElement)?.blur();

export default function OptionsPage() {
  const [language, setLanguage] = useState<string>(null);

  const [userSelection, setUserSelection] = useState<string>("1");

  const edit_prompt_template = useCallback(() => {
    removeFocusFromCurrentElement();
    setUserSelection("0");

   

    
  }, [ userSelection]);

  const edit_articles = useCallback(() => {
    removeFocusFromCurrentElement();

   

    setUserSelection("1");

  }, [ userSelection]);

  const edit_web_sources = useCallback(() => {
    removeFocusFromCurrentElement();
    setUserSelection("2");

  
  }, [ userSelection]);


  useLayoutEffect(() => {
    getUserConfig().then((config) => {
      setLanguage(config.language);
      setLocaleLanguage(config.language);
    });
  }, []);

  const onLanguageChange = (language: string) => {
    setLanguage(language);
    updateUserConfig({ language });
    setLocaleLanguage(language);
  };

  if (!language) {
    return <div />;
  }

  return (
    <div className="wcg-flex wcg-w-3/5 wcg-flex-col wcg-items-center">
      <NavBar language={language} onLanguageChange={onLanguageChange} />

      


  

  { <div>
    <span className="wcg-text-xl wcg-font-bold">Menu</span>

          <div className="wcg-dropdown wcg-dropdown wcg-min-w-[4.5rem]">
            <div
              tabIndex={0}
              className="wcg-flex wcg-cursor-pointer wcg-flex-row wcg-items-center wcg-justify-between wcg-gap-0 wcg-px-2"
            >
              <label className="wcg-max-w-[7rem] wcg-cursor-pointer wcg-justify-start wcg-truncate wcg-pr-0 wcg-text-sm wcg-normal-case">
                {getSourceName[userSelection] || "Select"}
              </label>
              {icons.expand}
            </div>

            <ul
              tabIndex={0}
              className="wcg-dropdown-content wcg-menu wcg-m-0 wcg-flex wcg-max-h-50 wcg-w-25 wcg-flex-col
                    wcg-flex-nowrap wcg-overflow-auto
                    wcg-rounded-md wcg-bg-gray-800 wcg-p-0"
            >
              <li
                className="wcg-text-sm wcg-text-white hover:wcg-bg-gray-700"
                onClick={edit_prompt_template}
              >
                <a>{"Prompt Template"}</a>
              </li>
              <li
                className="wcg-text-sm wcg-text-white hover:wcg-bg-gray-700"
                onClick={edit_articles}
              >
                <a>{"Articles"}</a>
              </li>
              {/* <li
                className="wcg-text-sm wcg-text-white hover:wcg-bg-gray-700"
                onClick={edit_web_sources}
              >
                <a>{"Web Sources"}</a>
              </li> */}
            </ul>
          </div>
        </div> }

      {userSelection == "0" &&
      <PromptEditor language={language} />
  }

  {userSelection == "1" &&
      <ArticleEditor language={language} />
}


      <div className=" wcg-items-center wcg-self-center">
        {/* <div className="wcg-flex wcg-flex-row wcg-gap-4">
                    <SocialCard icon={icons.twitter} text={getTranslation(localizationKeys.socialButtonTips.twitter)} />
                    <SocialCard icon={icons.discord} text={getTranslation(localizationKeys.socialButtonTips.discord)} />
                    <SocialCard icon={icons.github} text={getTranslation(localizationKeys.socialButtonTips.github)} />
                </div> */}
        <Footer />
      </div>
    </div>
  );
}

render(<OptionsPage />, document.getElementById("options"));
