/*global chrome*/

import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks'
import { Layout, Menu, Modal, Tooltip } from 'antd';

import Home from '../Home';

// import ChatGPT from '../assets/icons/icon16.png';

import { darkTheme } from '../../util/themeVariables';
import { ThemeProvider } from 'styled-components';
import { Div } from './style.js';

import { getLocal, parseData, setLocal } from 'src/util/constants';

import './style.css'
const { Sider } = Layout;

const handleString = (str) => {
  if (str) {
    if (str.length <= 15) return str;
    const maxLength = 15;
    const title = str.substr(0, maxLength);
    return `${title}`;
  } else return "";
};

const Popup = (props) => {
  const [showArticles, setShowArticles] = useState(true);
  const [componentName, setComponentName] = useState(1);
  const [articles, setArticles] = useState([]);
  const [allArticles, setAllArticles] = useState([]);
  const [article, setArticle] = useState({ title: '', key: null, messages: [] })
  useEffect(() => {
    getLocal('conversations').then((data) => {
      if (data && data.length) {
        const items = parseData(data);
        setAllArticles(items);
        setArticle(items[0]);
        setComponentName(items[0]?.key)
        const articles = items.map((data) => {
          return {
            key: data.key,
            label: <Tooltip title={data.title} color={'#FFFFFF'} overlayInnerStyle={{ color: '#000000' }}>
              <span className="item">{handleString(data.title)}</span>
            </Tooltip>,
          }
        })
        setArticles(articles);
      }
    })
  }, []);

  const handleDeleteArticle = async ({ key, componentKey }) => {
    const allConversations = parseData(await getLocal('conversations'));
    const newConversations = allConversations.filter((data) => data.key !== key);
    const newArticles = articles.filter((data) => data.key !== key)
    setArticles(newArticles);
    setComponentName(componentKey);
    await setLocal('conversations', newConversations)
  }

  const renderComponent = () => {
    return <Home
      article={article}
      setArticle={setArticle}
      handleDeleteArticle={handleDeleteArticle}
    />;
  };

  return (
    <div className="messsenger-edit-lead-modal">
      <Modal
        className="create-messenger-edit-lead-modal messenger-assign-lead-modal"
        footer={null}
        width={640}
        centered
        visible={showArticles}
        onCancel={() => {
          setShowArticles(false)
        }}
      >
        <div>
          <nav className="menuBar">
            <div className="menuCon">
              <h2 className="chat-home">Articles</h2>
              <a href="https://www.youtube.com/watch?v=lO2QIUMSRRM" target='_blank'>How to Save Articles</a>
            </div>
          </nav>
          <Div style={{ display: 'flex' }} className="ant-div-main-wrap" darkMode={true}>
            <Layout className="layout">
              <Layout>
                <ThemeProvider theme={darkTheme}>
                  <Sider width={155} className="sideBar" theme={'dark'}>
                    <Menu
                      onClick={(event) => {
                        setArticle(allArticles.find(data => data.key === event.key))
                        setComponentName(event.key);
                      }}
                      selectedKeys={[componentName]}
                      openKeys={componentName}
                      className="menu-items"
                      items={articles}
                    />
                  </Sider>
                </ThemeProvider>
              </Layout>
            </Layout>
            <div>{renderComponent()}</div>
          </Div>
        </div>
      </Modal>
    </div>
  );
};

export default Popup;
