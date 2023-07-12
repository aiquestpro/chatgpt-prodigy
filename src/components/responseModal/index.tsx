import { h } from "preact";

import { useEffect, useState } from "preact/hooks";
import { Modal, Button, Input, Select, Switch } from "antd";
import { getLocal, parseData, setLocal } from "src/util/constants";

import "./style.css";

const { TextArea } = Input;
export default function ResponseModal(props) {
  const { handleSaveResponse, message } = props;
  const [responseModal, setResponseModal] = useState(true);
  const [articles, setArticles] = useState([]);
  const [attachArticle, showAttachArticle] = useState(false);
  const [articleKey, setArticleKey] = useState(null);
  const [title, setTitle] = useState("");

  const saveResponse = async () => {
    handleSaveResponse({ title, message, articleKey });
    setResponseModal(false);
  };

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
      <Modal
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
            <span className="">{"Save Response"}</span>
          </h2>
          <div className="pipeline-modal-wrapper-pro">
            <div className="pipeline-modal-label">
              <label style={{ fontWeight: 600 }}> Attach Article</label>
              <div style={{ display: "inline-flex" }}>
                <Switch
                  style={{
                    display: "-webkit-box",
                    background: attachArticle
                      ? "rgb(22, 119, 255)"
                      : "rgba(0, 0, 0, 0.45)",
                  }}
                  defaultChecked={attachArticle}
                  onChange={handleAddTitle}
                />
                <p style={{ fontSize: "smaller", marginLeft: "10px" }}>
                  Attach This Message To Any Previous Article
                </p>
              </div>
              <br />
              {!attachArticle ? (
                <div>
                  <label style={{ fontWeight: 600 }}> Add Title </label>
                  <br />
                  <Input
                    value={title}
                    onChange={(event) => {
                      setTitle(event.target.value);
                    }}
                    style={{
                      borderRadius: "6px",
                      borderColor: "#d9d9d9",
                      height: "32px",
                    }}
                    placeholder="Add Title"
                  />
                  <br />
                </div>
              ) : (
                <div>
                  <div style={{ display: "inline-grid" }}>
                    <label style={{ fontWeight: 600, marginTop: "10px" }}>
                      {" "}
                      Select Article{" "}
                    </label>
                    <Select
                      style={{
                        width: 390,
                      }}
                      allowClear={true}
                      placeholder={"Select Article"}
                      onChange={(event) => {
                        handleAttachArticle({ key: event });
                      }}
                      options={articles}
                    />
                  </div>
                  <br />
                </div>
              )}
              <label style={{ fontWeight: 600 }}> Message </label>
              <TextArea
                value={message}
                rows={4}
                placeholder="Message"
                maxLength={6}
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
            disabled={
              (!attachArticle && !title) ||
              (attachArticle && articleKey === null)
            }
            size="default"
            type="primary"
            className="ml-2 save-btn"
          >
            {"Save"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
