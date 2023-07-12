/*  chrome */

import Browser from "webextension-polyfill";

const insertAfter = (referenceNode: any, newNode: any) => {
  referenceNode?.parentNode?.insertBefore(newNode, referenceNode?.nextSibling);
};

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

const setLocal = async (localName: string, jsonData: any) => {
  try {
    console.info("setLocal original: ", jsonData);
    return await Browser.storage.local.set({
      [localName]: JSON.stringify(jsonData),
    });
  } catch (err) {
    console.error("setLocal Error: ", err);
  }

  //   ) window.localStorage.setItem(localName, JSON.stringify(jsonData));
};

const getLocal = async (localName: string) => {
  // clear all sync storage
  const localStorage = await Browser.storage.local.get(localName);
  console.info("getLocal: ", localName, localStorage);
  return localStorage[localName] || null;
  //   const localStorage =
  //    await window.localStorage.getItem(localName);
  //   console.info("getLocal: ", localName, localStorage);
  //   return localStorage || null;
};

const parseData = (data: any) => {
  try {
    return JSON.parse(data);
  } catch (err) {
    return data;
  }
};

export { insertAfter, setLocal, getLocal, parseData, sleep };
