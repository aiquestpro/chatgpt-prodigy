/**
 * @typedef {object} BingWeb
 * @property {string|null} conversationSignature
 * @property {string|null} conversationId
 * @property {string|null} clientId
 * @property {string|null} invocationId
 */
interface BingWeb {
    conversationSignature: string | null;
    conversationId: string | null;
    clientId: string | null;
    invocationId: string | null;
  }
  
  /**
   * @typedef {object} Session
   * @property {string|null} question
   * @property {Object[]|null} conversationRecords
   * @property {string|null} aiName
   * @property {string|null} modelName
   * @property {string|null} conversationId - chatGPT web mode
   * @property {string|null} messageId - chatGPT web mode
   * @property {string|null} parentMessageId - chatGPT web mode
   * @property {BingWeb} bingWeb
   */
  interface Session {
    question: string | null;
    conversationRecords: Object[] | null;
    aiName: string | null;
    modelName: string | null;
    conversationId: string | null;
    messageId: string | null;
    parentMessageId: string | null;
    bingWeb: BingWeb;
  }
  
  /**
   * @param {string|null} question
   * @param {Object[]|null} conversationRecords
   * @returns {Session}
   */
  export function initSession({ question = null, conversationRecords = [] }: { question?: string | null, conversationRecords?: Object[] | null } = {}): Session {
    return {
      // common
      question,
      conversationRecords,
      aiName: null,
      modelName: null,
  
      // chatgpt-web
      conversationId: null,
      messageId: null,
      parentMessageId: null,
  
      // bing
      bingWeb: {
        conversationSignature: null,
        conversationId: null,
        clientId: null,
        invocationId: null,
      },
    }
  }
  