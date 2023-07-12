import Browser from "webextension-polyfill";
import { h, render } from "preact";
import ErrorMessage from "src/components/errorMessage";
import { Description } from "@geist-ui/core";
import Fuse from 'fuse.js'


export interface SearchResult {
  body: string;
  href: string;
  title: string;
}
const options = {
  includeScore: true
}

import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";




function showErrorMessage(error: Error) {
  console.log("WebChatGPT error --> API error: ", error);
  // const div = document.createElement('div')
  // document.body.appendChild(div)
  // render(<ErrorMessage message={error.message} />, div)
}

export async function scrap(url:string) {

  let url_scrap = await Browser.runtime.sendMessage({
    type: "getRequest",
    url: url,
  });
  const url_results_2 = url_scrap;
  const url1_container_1 = document.createElement("div");
  url1_container_1.innerHTML = url_results_2;
  let url_elems =  Array.prototype.slice.call(url1_container_1.getElementsByTagName("p"));



  // let url_elems2 = Array.prototype.slice.call(url1_container_1.getElementsByTagName("span"));

  // url_elems = url_elems.concat(url_elems2)

  let scrapped_content = []

      

      //scrap successful
      if (url_elems.length > 1) {
        for (let j = 0; j < url_elems.length; j++) {
          // const split_paragraph = ""
          let url_text = url_elems[j].innerText.trim();


          if(url_text.length  > 30){
            scrapped_content.push(url_text)
          } 

        }
      }

    return scrapped_content


}

export async function deep_api(
  query: string,
  
  numResults: number,
  timePeriod: string,
  region: string
): Promise<SearchResult[]> {
  const googleSearchResults = [];
  try {
    const url1 = `https://www.google.com/search?q=${query}`;
    console.log("querystring ",query)
    let url_scrap = await Browser.runtime.sendMessage({
      type: "getRequest",
      url: url1,
    });
    const url_results_2 = url_scrap;
    const url1_container_1 = document.createElement("div");
    url1_container_1.innerHTML = url_results_2;

    const extractText_0 = url1_container_1.querySelectorAll(
      "div.kvH3mc.BToiNc.UK95Uc"
    );

    // console.log("length : : ", extractText_0.length)

    for (let i = 0; i < extractText_0.length; i++) {
      const res = [];

      try{

      res[0] = extractText_0[i].querySelectorAll(
        "div.VwiC3b.yXK7lf.MUxGbd.yDYNvb.lyLwlc.lEBKkf"
      )[0].innerText; //description

      res[1] = extractText_0[i]
        .querySelectorAll("div.yuRUbf")[0]
        .querySelector("a").href; //link
      // console.log("res[0]: ", res[1])
      googleSearchResults.push(res);
      
      }
      catch (error){console.log("error 58 ", error)}
      
    }

    console.log("google: ", googleSearchResults)
  } catch (error) {
    console.log("error ", error)
  }
  let all_results = [];
  console.log("google search ", googleSearchResults.length)

  const results_ddg = await apiSearch(
    query ,
    4,
    '',
    'wt-wt'
  );
  let results_ddg_count = 0

  


  
  let shortlisted_para = ""

  for (let i = 0; i < googleSearchResults.length; i++) {
    try {
      // console.log("i ",i)
      const url1 = googleSearchResults[i][1];
      if (url1.includes(".pdf")){
        continue
      }
      let url_scrap = await Browser.runtime.sendMessage({
        type: "getRequest",
        url: url1,
      });
      const url_results_2 = url_scrap;
      const url1_container_1 = document.createElement("div");
      url1_container_1.innerHTML = url_results_2;
      let url_elems =  Array.prototype.slice.call(url1_container_1.getElementsByTagName("p"));



      let url_elems2 = Array.prototype.slice.call(url1_container_1.getElementsByTagName("span"));

      url_elems = url_elems.concat(url_elems2)

      console.log("url : ", url1)

      console.log("snipped : ", googleSearchResults[i][0])

      // console.log(" dep scrapping",url1_container_1.getElementsByTagName('p'))
      let text = "";
      let para_added = false;
      let scrapped_content = []
      shortlisted_para = ""

      

      //scrap successful
      if (url_elems.length > 1) {
        for (let j = 0; j < url_elems.length; j++) {
          // const split_paragraph = ""
          let url_text = url_elems[j].innerText.trim();

          console.log("urltext : ",url_text)

          if(url_text.length  > 20){
            scrapped_content.push(url_text)
          } 

        }
        

        if(scrapped_content.length > 0){

        const fuse = new Fuse(scrapped_content, options);

        let pattern= ""
        
        if (googleSearchResults[i][0].includes("—)")){

           pattern = googleSearchResults[i][0].split("—")[1]

        }
        else{
           pattern = googleSearchResults[i][0]

        }

        

        let fuse_search = fuse.search(pattern)
        
        console.log("fuse_search para : ", fuse_search)
        if ( fuse_search.length > 0){


        shortlisted_para =  fuse_search[0]['item']+". "

        if ( fuse_search.length > 1){

        shortlisted_para +=  fuse_search[1]['item'] + "\n"
        }

        console.log("shortlisted para : ", shortlisted_para)

        all_results.push({
          body: shortlisted_para,
          href: googleSearchResults[i][1],
          title: shortlisted_para,
        });
        para_added = true
        }
        else{
          //approximate search fails
           shortlisted_para = googleSearchResults[i][0]  + " "

          for (let sc = 0; sc < 2; sc++) {

            shortlisted_para +=  scrapped_content[sc] + ". "

            

          }
          all_results.push({
            body: shortlisted_para,
            href: googleSearchResults[i][1],
            title: shortlisted_para,
          });

          para_added = true

          
        }

        }
        
        if (para_added == false) {
          // console.log("para in if: ", text.split("",400).join(""))
          all_results.push({
            body: googleSearchResults[i][0] + results_ddg[results_ddg_count].body,
            href: googleSearchResults[i][1],
            title: googleSearchResults[i][0] ,
          });
          para_added = true;

          if (results_ddg_count < results_ddg.length-1){
            results_ddg_count += 1
          }
          
        }
      } else {
        all_results.push({
          body: googleSearchResults[i][0] + results_ddg[results_ddg_count].body,
          href: googleSearchResults[i][1],
          title: googleSearchResults[i][0],
        });
        para_added = true;
        
        if (results_ddg_count < results_ddg.length-1){
          results_ddg_count += 1
        }
      }
    } catch (error) {console.log("exception 135",error)}
    console.log("numResults ", numResults)
    console.log("final para  :: ", shortlisted_para)

    if (all_results.length > numResults) {
      break;
    }
  }

  if (all_results.length < 2){

    for (let i = 0; i < results_ddg.length; i++) {
    all_results.push({
      body: results_ddg[i].body,
      href: results_ddg[i].href,
      title: results_ddg[i].title
    });
  }


  }

  
  return all_results;
}

export async function apiSearch(
  query: string,
  numResults: number,
  timePeriod: string,
  region: string
): Promise<SearchResult[]> {
  // console.log("Query: ",query)
  const DDG_URL = `https://html.duckduckgo.com/html/?q=${query}`;
  const BING_URL = `https://www.bing.com/search?q=${query}`;

  const response_bing = await Browser.runtime.sendMessage({
    type: "getRequest",
    url: BING_URL,
  });
  const response_ddg = await Browser.runtime.sendMessage({
    type: "getRequest",
    url: DDG_URL,
  });

  //    console.log(response_bing,response_ddg)

  const ddg_results_2 = response_ddg;
  const ddg_container_1 = document.createElement("div");
  ddg_container_1.innerHTML = ddg_results_2;
  const ddg_elems = ddg_container_1.getElementsByClassName("web-result");
  //    console.log(ddg_elems)
  let ddg_search_results = [];
  if (ddg_elems.length > 1) {
    for (let i = 0; i < ddg_elems.length; i++) {
      const href = ddg_elems[i]
        .querySelector('[class="result__title"]')
        .querySelector("a").href;
      const body = ddg_elems[i].querySelector(
        '[class="result__snippet"]'
      ).innerText;
      const title = ddg_elems[i]
        .querySelector('[class="result__title"]')
        .querySelector("a").innerText;

      if (body) {
        ddg_search_results.push({ title: title, href: href, body: body });
      }
    }
  }

  const bing_results_2 = response_bing;
  let bing_res = 1
  const bing_container_1 = document.createElement("div");
  bing_container_1.innerHTML = bing_results_2;
  const bing_elems = bing_container_1
    .querySelectorAll('[id="b_results"]')[0]
    .querySelectorAll("li.b_algo");
  //    console.log("bing_container_1: ", bing_container_1)
  let bing_search_results = [];
  //    console.log("bing_elems ", bing_elems.length)
  if (bing_elems.length > 1) {
    if (bing_elems.length > 5) {
      bing_res = 5;
    }
    for (let i = 0; i < bing_res; i++) {
      // let link_0 = bing_elems[i].querySelector('a')?.href

      let description = null;

      let link_0 = bing_elems[i].querySelector("a").href;
      console.log("link ", link_0);

      const link = link_0?.replace("https://https://", "https://");

      try {
        description = bing_elems[i]
          .querySelector("li")
          .querySelector("ol.b_dList").innerText;
        // console.log("desc1: ", description)
      } catch (e) {
        description = null;
        // console.log("in catch: ", description)
      }

      if (description == undefined || description == null) {
        description =
          bing_elems[i].getElementsByClassName("b_lineclamp2")[0]?.innerText;
        // console.log("in if: ", description)
      }

      if (description == undefined || description == null) {
        description =
          bing_elems[i].getElementsByClassName("b_lineclamp3")[0]?.innerText;
        // console.log("desc3: ", description)
        // console.log("in elseif: ", description)
      }
      if (description == undefined || description == null) {
        description =
          bing_elems[i].getElementsByClassName("b_lineclamp4")[0]?.innerText;
        // console.log("desc4: ", description)
        // console.log("in else: ", description)
      }

      // console.log("error in api.ts")

      // console.log("desc: ",description)
      if (description) {
        bing_search_results.push({
          body: description,
          href: link,
          title: description,
        });
      }
    }
  }

  // console.log("DDG ResultsL: ",ddg_search_results)
  // console.log("Bing ResultsL: ",bing_search_results)
  let all_results = [];
  all_results = [
    ...ddg_search_results
      .slice(0, 5)
      .concat(...bing_search_results.slice(0, 3)),
  ];
  // if(ddg_search_results.length>1 && bing_search_results.length>1){

  // }else{
  //     all_results = [{body:"No Results!",href:"No Source found!", title:"No title Found!"}]
  // }

  return all_results;
}

export async function apiSearchO(
  query: string,
  numResults: number,
  timePeriod: string,
  region: string
): Promise<SearchResult[]> {
  const headers = new Headers({
    Origin: "https://chat.openai.com",
    "Content-Type": "application/json",
  });

  const searchParams = new URLSearchParams();
  searchParams.set("q", query);
  searchParams.set("max_results", numResults.toString());
  if (timePeriod) searchParams.set("time", timePeriod);
  if (region) searchParams.set("region", region);

  const url = `https://ddg-webapp-aagd.vercel.app/search?${searchParams.toString()}`;

  const response = await fetch(url, {
    method: "GET",
    headers,
  });
  const results = await response.json();
  return results.map((result: any) => {
    return {
      body: result.body,
      href: result.href,
      title: result.title,
    };
  });
}
