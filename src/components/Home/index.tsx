import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { getLocal, parseData, setLocal } from 'src/util/constants';
import { Divider } from 'antd';
import { DownloadIcon } from '@primer/octicons-react'
import FileSaver from 'file-saver'


import './style.css';

const Home = (props) => {

  const { article, handleDeleteArticle, setArticle } = props;

  const [articleMessages, setArticleMessages] = useState([])

  useEffect(() => {
    if (article?.messages?.length) {
      setArticleMessages(article.messages);
    }
  }, [article])

  const handleDeleteMessage = async () => {
    const allConversations = parseData(await getLocal('conversations')) || [];
    const deletedArticleIndex = allConversations.findIndex(data => data.key === article.key);

    let firstConversation = { messages: [], title: '', key: null };
    if (!allConversations || !allConversations?.length || allConversations?.length <= 1 || deletedArticleIndex === -1) {
      firstConversation = { messages: [], title: '', key: null };
    } else if (Number(deletedArticleIndex) >= 1) {
      firstConversation = allConversations[0]
    } else if (Number(deletedArticleIndex) === 0) {
      firstConversation = allConversations[1]
    }

    setArticle(firstConversation)
    setArticleMessages(firstConversation.messages || []);
    handleDeleteArticle({ key: article.key, componentKey: firstConversation.key })
  }

  const handleDownloadMessage = async () => {
    const allConversations = parseData(await getLocal('conversations')) || [];
    const deletedArticleIndex = allConversations.findIndex(data => data.key === article.key);
    const article_download = allConversations[deletedArticleIndex]

    // console.log(article_download)

    let text = ""

    for (let i = 0; i < article_download.messages.length; i++) {
      text += article_download.messages[i]
    }
    
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
    FileSaver.saveAs(blob, article_download.title + ".md")
  }



  return (
    <div>
      <div className={articleMessages?.length ? "home-div" : 'home-div-empty'}>
        <div className="heading-chat-wrap">
          <span className="home-pro"></span>
          {articleMessages?.length ? <span className="home-span article-delete-demo">
            <button onClick={handleDeleteMessage} className="home-pro home-article-wrap wcg-cursor-pointer">Delete Article</button>
          </span> : ''}
          
          {articleMessages.length > 0 &&
          < button
          title="Download Conversation"
          className="gpt-util-icon wcg-cursor-pointer"
          // style="margin:15px;"
          onClick={handleDownloadMessage}>
            
          <DownloadIcon size={16} />
        </button>
        }
        
        </div>
        {articleMessages?.length ? articleMessages.map((message, index) => {
          return (
            <div>
              <span className="home-span">
                {/* {index >= 1 && <span className="home-pro">Message</span>} */}
                {index >= 1 && <br />}
                <p>{message}</p>
              </span>
              <Divider plain></Divider>
            </div>
          )
        }): ''}
      </div>
    </div>
  );
};

export default Home;
