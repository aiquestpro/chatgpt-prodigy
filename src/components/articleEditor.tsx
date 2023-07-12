import { h } from "preact";
import { useState, useEffect, useRef, useLayoutEffect } from "preact/hooks";
import { getTranslation, localizationKeys } from "src/util/localization";

import TooltipWrapper from "./tooltipWrapper";
import { getLocal, parseData, setLocal } from "src/util/constants";
import { Article, deleteArticle, saveArticle } from "src/util/articleManager";
import { Tooltip } from "antd";

const ArticleEditor = (props: { language: string }) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [article, setArticle] = useState<Article>({
    title: "",
    key: null,
    messages: [],
  });
  const [showErrors, setShowErrors] = useState(false);
  const [deleteBtnText, setDeleteBtnText] = useState("delete");
  const [titleError, setTitleError] = useState(false);
  const [messageError, setMessageError] = useState(false);
  const [defaultValue, setDefaultValue] = useState(false);

  useLayoutEffect(() => {
    updateSavedArticles();
    setArticle({ title: "", messages: [], key: null });
  }, []);

  const updateSavedArticles = async () => {
    getLocal("conversations").then((data) => {
      console.info("data:", data);
      if (data && data.length) {
        const items = parseData(data);
        setArticles(items);
        //   setComponentName(items[0]?.key)
        //   const articles = items.map((data: Article) => {
        //     return {
        //       key: data.key,
        //       label: <Tooltip title={data.title} color={'#FFFFFF'} overlayInnerStyle={{ color: '#000000' }}>
        //         <span className="item">{handleString(data.title)}</span>
        //       </Tooltip>,
        //     }
        //   })
      }
    });
    // setSavedPrompts(prompts.filter(d => d.type === "template"))
    // if (prompt.uuid === 'default') {
    //     setPrompt(prompts.filter(d => d.type === "source")[0])
    // }
  };

  useEffect(() => {
    updateSavedArticles();
  }, [props.language]);

  // this may neet to be uncommented
  //   useEffect(() => {
  //     updatePlaceholderButtons(article.title);
  //   }, [article]);

  useEffect(() => {
    if (article && article.title) setTitleError(article.title.trim() === "");
    // setMessageError(article.messages.text.trim() === "");
  }, [article]);

  useEffect(() => {
    if (articles && articles.length > 0) {
      setArticle(articles[articles.length - 1]);
    }
  }, [articles]);

  async function updateList() {
    getLocal("conversations").then((data) => {
      if (data && data.length) {
        const items = parseData(data);
        // setAllArticles(items);
        // setArticle(items[0]);
        // setComponentName(items[0]?.key);
        // const articles = items.map((data) => {
        //   return {
        //     key: data.key,
        //   };
        // });
        setArticles((artis) => items);
      } else {
        setArticles([]);
        setArticle({ title: "", messages: [], key: null });
      }
    });
  }

  const handleSelect = (article: Article) => {
    setShowErrors(false);
    setArticle(article);
    setDefaultValue(true);
    setDeleteBtnText("delete");
  };

  const handleAdd = () => {
    setDefaultValue(true);
    setShowErrors(false);
    console.log("handle add");
    setArticle({ title: "", messages: [], key: null });
    setDeleteBtnText("delete");
    if (titleInputRef.current) {
      titleInputRef.current.focus();
    }
  };

  const handleSave = async () => {
    // console.log(prompt)
    setShowErrors(true);
    if (titleError || messageError) {
      return;
    }
    await saveArticle(article);
    await updateList();
    // setTimeout(() => {
    //   console.info("articles:", articles);
    //   setArticle(articles[articles.length - 1]);
    // }, 500);
  };

  const handleDeleteBtnClick = async () => {
    if (deleteBtnText === "delete") {
      setDeleteBtnText("check");
    } else {
      await handleDelete();
    }
  };

  const handleDelete = async () => {
    console.info("delete", article);
    if (!article.title) return;
    await deleteArticle(article.key);
    await updateList();
    handleAdd();
  };

  const titleInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  //   const handleInsertText = (text: string) => {
  //     if (textareaRef.current) {
  //       const start = textareaRef.current.selectionStart;
  //       const end = textareaRef.current.selectionEnd;
  //       const currentText = textareaRef.current.value;
  //       const newText =
  //         currentText.substring(0, start) +
  //         text +
  //         currentText.substring(end, currentText.length);
  //       textareaRef.current.setSelectionRange(
  //         start + text.length,
  //         start + text.length
  //       );
  //       textareaRef.current.focus();

  //       setPrompt({ ...prompt, text: newText });
  //     }
  //   };

  const handleTextareaChange = (e: Event) => {
    const text = (e.target as HTMLTextAreaElement).value;
    if (text !== article.messages?.map((d) => d).join("\n")) {
      // may be change the messages to message, in the interface
      setMessageError(false);
      setArticle({ ...article, messages: [text] });
    }
  };
  // this may need to be uncommented
  //   const updatePlaceholderButtons = (text: string) => {
  //     setHasWebResultsPlaceholder(text.includes("{web_results}"));
  //     setHasQueryPlaceholder(text.includes("{query}"));
  //   };

  const actionToolbar = (
    <div
      className={
        `wcg-mt-4 wcg-flex wcg-flex-row wcg-justify-between`
        // ${
        //   prompt.uuid === "default" ||
        //   prompt.uuid === "default_en"
        //     ? "wcg-hidden"
        //     : ""
        // }
      }
    >
      <div className="wcg-flex wcg-flex-row wcg-gap-4">
        {/* <TooltipWrapper tip={showErrors ? getTranslation(localizationKeys.placeHolderTips.webResults) : ""}>
                    <button
                        className={`wcg-btn
                        ${showErrors && webResultsError ? "wcg-btn-error" : hasWebResultsPlaceholder ? "wcg-btn-success" : "wcg-btn-warning"}
                        wcg-p-1 wcg-lowercase`}
                        onClick={() => {
                            setWebResultsError(false)
                            handleInsertText('{web_results}')
                        }}
                    >
                        &#123web_results&#125
                    </button>
                </TooltipWrapper> */}
        {/* <TooltipWrapper tip={showErrors ? getTranslation(localizationKeys.placeHolderTips.query) : ""}>
                    <button
                        className={`wcg-btn
                        ${showErrors && queryError ? "wcg-btn-error" : hasQueryPlaceholder ? "wcg-btn-success" : "wcg-btn-warning"}
                        wcg-p-1 wcg-lowercase`}
                        onClick={() => {
                            setQueryError(false)
                            handleInsertText('{query}')
                        }}
                    >
                        &#123query&#125
                    </button>
                </TooltipWrapper>
                <TooltipWrapper tip={getTranslation(localizationKeys.placeHolderTips.currentDate)}>
                    <button
                        className="wcg-btn-success wcg-btn wcg-p-1 wcg-lowercase"
                        onClick={() => handleInsertText('{current_date}')}
                    >
                        &#123current_date&#125
                    </button>
                </TooltipWrapper> */}
      </div>

      <button
        className="wcg-btn-success wcg-btn wcg-text-base"
        onClick={handleSave}
      >
        {getTranslation(localizationKeys.buttons.save)}
      </button>
    </div>
  );

  const ArticleList = (
    <div>
      <button
        className="wcg-btn-success wcg-btn wcg-w-full wcg-text-base"
        onClick={handleAdd}
      >
        <span class="material-symbols-outlined wcg-mr-2">add_circle</span>
        Add Article
      </button>
      <ul
        className="wcg-scroll-y wcg-menu wcg-mt-4 wcg-flex wcg-max-h-96 wcg-scroll-m-0 wcg-flex-col
                    wcg-flex-nowrap wcg-overflow-auto wcg-border-2
                    wcg-border-solid wcg-border-white/20 wcg-p-0"
        style={{ maxHeight: "200px" }}
      >
        {articles?.map((item) => (
          <li key={item.key} onClick={() => handleSelect(item)}>
            <a
              className={`wcg-text-base ${
                item.key === article.key ? "wcg-active" : ""
              }`}
            >
              📝 {item.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );

  const titleInput = (
    <input
      ref={titleInputRef}
      className={`wcg-input-bordered wcg-input wcg-flex-1
                        ${showErrors && titleError ? "wcg-input-error" : ""}`}
      placeholder={getTranslation(
        localizationKeys.placeholders.namePlaceholder
      )}
      value={defaultValue && article?.title ? article.title : ""}
      onInput={(e: Event) => {
        setTitleError(false);
        setArticle({ ...article, title: (e.target as HTMLInputElement).value });
      }}
      disabled={defaultValue === false}
    />
  );

  const btnDelete = (
    <button
      className={
        `wcg-btn wcg-text-base
                    ${
                      deleteBtnText === "check"
                        ? "wcg-btn-error"
                        : "wcg-btn-primary"
                    }`
        // ${
        //   article.key === "default" || article.key === "default_en"
        //     ? "wcg-hidden"
        //     : ""
        // }
      }
      onClick={handleDeleteBtnClick}
    >
      <span class="material-symbols-outlined">{deleteBtnText}</span>
    </button>
  );

  const textArea = (
    <textarea
      ref={textareaRef}
      className={`wcg-textarea-bordered wcg-textarea
                        ${
                          showErrors && messageError ? "wcg-textarea-error" : ""
                        }
                        wcg-mt-2 wcg-h-96 wcg-resize-none wcg-text-base`}
      value={
        defaultValue &&
        article &&
        article.messages !== undefined &&
        article.messages &&
        article.messages.length > 0
          ? article.messages.map((m) => m).join("\n")
          : ""
      }
      onInput={handleTextareaChange}
      disabled={defaultValue === false}
    />
  );

  return (
    <div className="wcg-rounded-box wcg-mt-10 wcg-flex wcg-h-[30rem] wcg-w-4/5 wcg-flex-row wcg-gap-4 wcg-border wcg-py-4">
      <div className="wcg-w-1/3">{ArticleList}</div>

      <div className="wcg-flex wcg-w-2/3 wcg-flex-col">
        <div className="wcg-flex wcg-flex-row wcg-items-center wcg-gap-2">
          {titleInput}
          {article.key !== null && btnDelete}
        </div>
        {textArea}

        {actionToolbar}
      </div>
    </div>
  );
};

export default ArticleEditor;
