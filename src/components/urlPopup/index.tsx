import { h, render } from "preact";

import { useEffect, useState } from "preact/hooks";
import { Modal, Button, Input, Select, Switch ,Upload} from "antd";
// export type { UploadFile, UploadProps } from './upload';

import { getLocal, parseData, setLocal } from "src/util/constants";
import { UploadOutlined } from '@ant-design/icons';


import "./style.css";
import Browser from "webextension-polyfill";
import { getTextArea } from "src/util/elementFinder";

import fileupload from "./fileupload"

const { TextArea } = Input;
export default function UrlPopup(props) {
  const {  message } = props;
  const [responseModal, setResponseModal] = useState(true);
  const [articles, setArticles] = useState([]);
  const [attachArticle, showAttachArticle] = useState(false);
  const [articleKey, setArticleKey] = useState(null);
  const [URL, setURL] = useState("");

  const saveResponse = async () => {
    // handleSaveResponse({ title, message, articleKey });

    console.log("URL :",URL)

    let url_scrap = await Browser.runtime.sendMessage({
      type: "getRequest",
      url: URL,
    });
    const url_results_2 = url_scrap;
    const url1_container_1 = document.createElement("div");
    url1_container_1.innerHTML = url_results_2;
    let url_elems =  Array.prototype.slice.call(url1_container_1.getElementsByTagName("p"));
    let url_elems2 = Array.prototype.slice.call(url1_container_1.getElementsByTagName("span"));

    let paras = ""
    url_elems = url_elems.concat(url_elems2)


    if (url_elems.length > 1) {
      for (let j = 0; j < url_elems.length; j++) {
        // const split_paragraph = ""

        let url_text = url_elems[j].innerText.trim()

        if (url_text && url_text.length > 25){

        paras += " \n " + url_text
      }

      }
    }

    // console.log("paras p  ", paras)

    const ta = getTextArea()
    ta.value = paras + "\n \nQuery:"
    ta.style.height="40px"


    
    setResponseModal(false);
  };

  const handleOnChange =(event) => {
    setURL(event.target.value)
    // console.log("event",event.target.value)
  }

  const handleAttachArticle = ({ key }) => {
    setArticleKey(key);
  };

  const handleAddTitle = (event) => {
    showAttachArticle(event);
  };

  

  

  useEffect(() => {
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
          setResponseModal(false);
        }}
      >
        <div className="d-flex justify-content-center align-items-center flex-column pipeline-modal">
          <img src={""} alt={""} className="pipeline-bulk-action" />
          <h2 className="mb-3 text-center color-dark pipeline-modal-heading">
            <span className="">{"Import URL"}</span>
          </h2>
          <div className="pipeline-modal-wrapper-pro">
            <div className="pipeline-modal-label">
             
             
              <label style={{ fontWeight: 600 }}> URL </label>
              <TextArea
                defaultValue=""
                rows={4}
                placeholder="Enter URL Here"
                maxLength={200}
                type = "text"
                onChange={(event) => handleOnChange(event)}
                
              />
            </div>
          </div>
        </div>
        <br />
        <br />

        <div className="modal-footer d-flex justify-content-center">
          <Button
            size="default"
            outlined="true"
            type="white"
            onClick={() => {
              setResponseModal(false);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              saveResponse();
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
            {"Import"}
          </Button>
        </div>
      </Modal> }
    </div>
  );
}
