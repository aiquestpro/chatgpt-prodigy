import { getLocal, parseData, setLocal } from "./constants";
import { v4 as uuidv4 } from "uuid";

export interface Article {
  key?: number;
  title: string;
  messages: string[];
}
export const ARTICLE_KEY = "conversations";
export const saveArticle = async (article: Article) => {
  const savedArticles = parseData(await getLocal(ARTICLE_KEY));
  if (!savedArticles) {
    article.key = 0;
    await setLocal(ARTICLE_KEY, [article]);
    return;
  }
  const index = savedArticles.findIndex((i: Article) => i.key === article.key);
  if (index >= 0) {
    savedArticles[index] = article;
  } else {
    if (savedArticles.length) {
      article.key = savedArticles[savedArticles.length - 1]?.key + 1 || 0;
    } else {
      article.key = 0;
    }
    savedArticles.push(article);
  }

  await setLocal(ARTICLE_KEY, savedArticles);
};

export const deleteArticle = async (key: number) => {
  const savedArticles = parseData(await getLocal(ARTICLE_KEY));
  if (!savedArticles) {
    return;
  }
  const index = savedArticles.findIndex((i: Article) => i.key === key);
  if (index >= 0) {
    savedArticles.splice(index, 1);
  }

  await setLocal(ARTICLE_KEY, savedArticles);
};

export const getArticles = async () => {
  const savedArticles = parseData(await getLocal(ARTICLE_KEY));
  return savedArticles;
};
