import { SearchResult } from "src/content-scripts/api"
import Browser from "webextension-polyfill"
import { v4 as uuidv4 } from 'uuid'
import { getCurrentLanguageName, getLocaleLanguage, getTranslation, localizationKeys } from "./localization"
import { getUserConfig } from "./userConfig"

export const SAVED_PROMPTS_KEY = 'saved_prompts'

export interface Prompt {
    uuid?: string,
    name: string,
    text: string
}

export const compilePrompt = async (results: SearchResult[], query: string) => {
    const currentPrompt = await getCurrentPrompt()
    const currentTask = await getCurrentTask()
    const currentLang = await getCurrentLang()

    const formattedResults = formatWebResults(results)
    const currentDate = new Date().toLocaleDateString()

    // console.log("persona ", currentPrompt)
    // console.log("task ", currentTask)

    let reply = ""
    if (currentPrompt.name == "Poet"){
        reply = "poem"
    }
    else if (currentPrompt.name == "Philosopher"){
        reply="philosophical answer"

    }
    else if (currentPrompt.name == "Journalist"){
        reply="journalistic report"

    }
    else{
        reply="answer"
    }

    if (currentTask.name == "SEO" ||  currentTask.name == "Fact Check" ){
        reply=""
        currentPrompt.text = ""


    }

    if (currentTask.name == "Blog Outline"){
        reply = "blog outline"
    }
    const prompt = replaceVariables(currentTask.text, {
        '{web_results}': formattedResults,
        '{persona}': currentPrompt.text,
        '{reply}':reply,
        '{query}': query,
        '{current_date}': currentDate,
        '{lang}' : currentLang.name
    })

    // console.log("full prompt ",prompt)

    return prompt
}

const formatWebResults = (results: SearchResult[]) => {
    let counter = 1
    return results.reduce((acc, result): string => acc += `[${counter++}] "${result.body}"\nURL: ${result.href}\n\n`, "")
}

const replaceVariables = (prompt: string, variables: { [key: string]: string }) => {
    let newPrompt = prompt
    for (const key in variables) {
        try {
            newPrompt = newPrompt.replaceAll(key, variables[key])
        } catch (error) {
            console.log("WebChatGPT error --> API error: ", error)
        }
    }
    return newPrompt
}

export const getDefaultTemplatePrompt = () => {
    return {
        name: 'all',
        text: "",
        uuid: 'default',
        type: "template"
    }
}

export const getDefaultPrompt = () => {
    return {
        name: 'all',
        text: "",
        uuid: 'default',
        type: "source"
    }
}

const getDefaultEnglishPrompt = () => {
    return { name: 'Default English', text: getTranslation(localizationKeys.defaultPrompt, 'en'), uuid: 'default_en' }
}

export const getCurrentPrompt = async () => {
    const userConfig = await getUserConfig()
    const currentPromptUuid = userConfig.promptUUID
    const savedPrompts = await getSavedPrompts()
    return savedPrompts.find((i: Prompt) => i.uuid === currentPromptUuid) 
}

export const getCurrentTemplate = async () => {
    const userConfig = await getUserConfig()
    const currentPromptUuid = userConfig.templateUUID
    const savedPrompts = await getSavedTemplates()
    return savedPrompts.find((i: Prompt) => i.uuid === currentPromptUuid) 
}

export const getCurrentTask = async () => {
    const userConfig = await getUserConfig()
    const currentTaskUuid = userConfig.taskUUID
    const savedTasks = await getSavedTasks()
    return savedTasks.find((i: Prompt) => i.uuid === currentTaskUuid) 
}

export const getSavedPrompts = async (addDefaults = true) => {
    const data = await Browser.storage.sync.get([SAVED_PROMPTS_KEY])
    const savedPrompts = data[SAVED_PROMPTS_KEY] || []

    if (addDefaults)
        return addDefaultPrompts(savedPrompts)

    return savedPrompts
}

export const getSavedTasks = async (addDefaults = true) => {
    const data = await Browser.storage.sync.get([SAVED_PROMPTS_KEY])
    const savedTasks = data[SAVED_PROMPTS_KEY] || []

    if (addDefaults)
        return addDefaultTasks(savedTasks)

    return savedTasks
}

export const getSavedTemplates = async (addDefaults = true) => {
    const data = await Browser.storage.sync.get([SAVED_PROMPTS_KEY])
    const savedTasks = data[SAVED_PROMPTS_KEY] || []

    if (addDefaults)
        return addDefaultTemplate(savedTasks)

    return savedTasks
}
export const getSavedLang = async (addDefaults = true) => {
    const data = await Browser.storage.sync.get([SAVED_PROMPTS_KEY])
    const savedLang = data[SAVED_PROMPTS_KEY] || []

    if (addDefaults)
        return addDefaultLang(savedLang)

    return savedLang
}

export const getCurrentLang = async () => {
    const userConfig = await getUserConfig()
    const currentLangUuid = userConfig.langUUID
    const savedLang = await getSavedLang()
    return savedLang.find((i: Prompt) => i.uuid === currentLangUuid) || getDefaultPrompt()
}



function addDefaultLang(prompts: Prompt[]) {

    // if (getLocaleLanguage() !== 'en') {
    //     addPrompt(prompts, getDefaultEnglishPrompt())
    // }
    
    const defaultLang = [
        {
            "name": "Arabic",
            "text": "ar",
            "uuid": "lang5",
            "type": "lang"
        },
        
         
        {
            "name": "Chinese",
            "text": "zh",
            "uuid": "lang6",
            "type": "lang"
        },
        {
            "name": "English",
            "text": "en",
            "uuid": "lang1",
            "type": "lang"
        },
        {
            "name": "French",
            "text": "fr",
            "uuid": "lang3",
            "type": "lang"
        }, 
        {
            "name": "German",
            "text": "de",
            "uuid": "lang7",
            "type": "lang"
        },
        {
            "name": "Portugese",
            "text": "pt",
            "uuid": "lang4",
            "type": "lang"
        },

        {
            "name": "Russian",
            "text": "ru",
            "uuid": "lang8",
            "type": "lang"
        },
        {
            "name": "Spanish",
            "text": "es",
            "uuid": "lang2",
            "type": "lang"
        }
        
       
       
       
        
    ]
    // addPrompt(prompts, getDefaultPrompt())
    // addPrompt(prompts, defaultTasks[6])
    addPrompt(prompts, defaultLang[7])
    addPrompt(prompts, defaultLang[6])
    addPrompt(prompts, defaultLang[5])
    addPrompt(prompts, defaultLang[4])
    addPrompt(prompts, defaultLang[3])
    addPrompt(prompts, defaultLang[2])
    addPrompt(prompts, defaultLang[1])
    addPrompt(prompts, defaultLang[0])
    // addPrompt(prompts, defaultPrompts[7])
    return prompts

    function addPrompt(prompts: Prompt[], prompt: Prompt) {
        // console.log("Default prompt: ",prompts,prompt)
        const index = prompts.findIndex((i: Prompt) => i.uuid === prompt.uuid)
        if (index >= 0) {
            prompts[index] = prompt
        } else {
            prompts.unshift(prompt)
        }
    }
}



function addDefaultTemplate(prompts: Prompt[]) {

    // if (getLocaleLanguage() !== 'en') {
    //     addPrompt(prompts, getDefaultEnglishPrompt())
    // }
    
    const defaultTemplate = [
        {
            "name": "Summarize",
            "text": "Summarize the text. ",
            "uuid": "template1",
            "type": "template"
        },
        {
            "name": "Explain",
            "text": "Explain the text and break down any technical terms used.",
            "uuid": "template2",
            "type": "template"
        },


        
         
        
        
       
       
       
        
    ]
    // addPrompt(prompts, getDefaultPrompt())
    // addPrompt(prompts, defaultTasks[6])
    
    addTemplate(prompts, defaultTemplate[0])
    addTemplate(prompts, defaultTemplate[1])

    // addPrompt(prompts, defaultPrompts[7])
    return prompts

    function addTemplate(prompts: Prompt[], prompt: Prompt) {
        // console.log("Default prompt: ",prompts,prompt)
        const index = prompts.findIndex((i: Prompt) => i.uuid === prompt.uuid)
        if (index >= 0) {
            prompts[index] = prompt
        } else {
            prompts.unshift(prompt)
        }
    }
}



function addDefaultTasks(prompts: Prompt[]) {

    // if (getLocaleLanguage() !== 'en') {
    //     addPrompt(prompts, getDefaultEnglishPrompt())
    // }
    
    const defaultTasks = [
        {
            "name": "Answer",
            "text": "Web search results:\n\n{web_results}\nInstructions: {persona} Using the provided web search results, write a comprehensive {reply} to the given Query. Choose the most appropriate way to present the information. It can be paragraph, bullet point, 3 sentence response, graph, table. For tables, use the necessary number of tables with appropriate header and column names. Make sure to cite every sentence using [number] notation. If the provided search results refer to multiple subjects with the same name, write separate answers for each subject. Always list down sources at the end. Write in {lang}. \nQuery: {query}",
            "uuid": "task2",
            "type": "task"
        },
        {
            "name": "Suggestions",
            "text": "Web search results:\n\n{web_results}\nInstructions: {persona} Using the provided web search results, suggest at least three but no more than five follow-on search queries that will help you broaden your response to the request. Write in {lang}. \nQuery: {query}",
            "uuid": "task3",
            "type": "task"
        },
        {
            "name": "Fact Check",
            "text": "Sources:\n\n{web_results}\nInstructions: {persona} {reply} Using the provided web search results, I want you to act as a fact checker. I will give you a Sources and Query  and you will find if factual information provided in text is correct and also reference the source of the text (i.e. where it was copied from). Use bullet points for multiple plagiarisms. Write in {lang}. My Query: {query}  ",
            "uuid": "task8",
            "type": "task"
        },
        
        {
            "name": "Summary",
            "text": "Web search results:\n\n{web_results}\nInstructions: {persona} Write a summarized {reply} (upto 100 words) using provided web search results, do cite which information you take from which source. Write in {lang}. \nQuery: {query}",
            "uuid": "task4",
            "type": "task"
        },
        {
            "name": "Simplify",
            "text": "Web search results:\n\n{web_results}\nInstructions:{persona} Write a summarized {reply} for a second-grade student. Write in {lang}. \nQuery: {query}",
            "uuid": "task5",
            "type": "task"
        },
        {
            "name": "Tweet",
            "text": "Web search results:\n\n{web_results}\nInstructions: {persona} Write a summarized {reply} into a single tweet. The resulting tweet must be 280 characters long or less. Do not wrap into quotes. Write in {lang}. \nQuery: {query}",
            "uuid": "task6",
            "type": "task"
        }
        ,
        {
            "name": "SEO",
            "text": "Web search results:\n\n{web_results}\nInstructions: {persona} {reply} Output a table with three columns: keyword, density %, LSI keywords. Find top 12 main keywords in that text, each containing at least 2 words. Output these in the first column of the resulting table. Give me a keyword density in the second column of the resulting table. Next I want you to come up with a list of LSI keywords and synonyms of those main keywords used in the article. Output a plain list of 5 keywords separated by comma in the third column called LSI keywords. \nQuery: {query} Table: ",
            "uuid": "task7",
            "type": "task"
        },
        {
            "name": "Blog Outline",
            "text": "Web search results:\n\n{web_results}\nInstructions: {persona} Using the provided web search results, Generate a {reply} for the given Prompt. Try to break it into topics and subtopics. Write the outline in {lang}. \nQuery: {query}",
            "uuid": "task10",
            "type": "task"
        },
        {
            "name": "Story",
            "text": "Web search results:\n\n{web_results}\nInstructions: {persona} Using the provided web search results, Write an interesting story for the given Prompt.  Write the story in {lang}. \nQuery: {query}",
            "uuid": "task9",
            "type": "task"
        },
        
    ]
    // addPrompt(prompts, getDefaultPrompt())
    // addPrompt(prompts, defaultTasks[6])

    addPrompt(prompts, defaultTasks[5])
    addPrompt(prompts, defaultTasks[6])
    addPrompt(prompts, defaultTasks[7])
    addPrompt(prompts, defaultTasks[8])


    addPrompt(prompts, defaultTasks[4])
    addPrompt(prompts, defaultTasks[3])
    addPrompt(prompts, defaultTasks[2])
    addPrompt(prompts, defaultTasks[1])
    addPrompt(prompts, defaultTasks[0])
    // addPrompt(prompts, defaultPrompts[7])
    return prompts

    function addPrompt(prompts: Prompt[], prompt: Prompt) {
        // console.log("Default prompt: ",prompts,prompt)
        const index = prompts.findIndex((i: Prompt) => i.uuid === prompt.uuid)
        if (index >= 0) {
            prompts[index] = prompt
        } else {
            prompts.unshift(prompt)
        }
    }
}


function addDefaultPrompts(prompts: Prompt[]) {

    if (getLocaleLanguage() !== 'en') {
        addPrompt(prompts, getDefaultEnglishPrompt())
    }
    
    const defaultPrompts = [
        {
            "name": "Default",
            "text": "",
            "uuid": "default2",
            "type": "prompt"
        },
        {
            "name": "Journalist",
            "text": "As a journalist (writing informational news articles and stories about real events using a fair and unbiased perspective.)",
            "uuid": "default3",
            "type": "prompt"
        },
        {
            "name": "Philosopher",
            "text": "As a Philosopher (a person who seeks wisdom or enlightenment)",
            "uuid": "default4",
            "type": "prompt"
        },
        {
            "name": "Comedian",
            "text": "Set your persona as a comedian (professional entertainment consisting of jokes and sketches, intended to make an audience laugh)",
            "uuid": "default5",
            "type": "prompt"
        },
        {
            "name": "Poet",
            "text": "Set your persona as a poet (having an imaginative or sensitively emotional style of expression)",
            "uuid": "default6",
            "type": "prompt"
        }
        ,
        {
            "name": "Critical Thinker",
            "text": "You are a critical thinker (Critical thinking means thinking carefully about information, ideas, and arguments to make good decisions)",
            "uuid": "default7",
            "type": "prompt"
        }
        ,
        {
            "name": "Story Teller",
            "text": "You are a story teller. You will come up with entertaining stories that are engaging, imaginative and captivating for the audience. It can be fairy tales, educational stories or any other type of stories which has the potential to capture people's attention and imagination. ",
            "uuid": "default8",
            "type": "prompt"
        }
    ]
    addPrompt(prompts, getDefaultPrompt())
    // addPrompt(prompts, defaultPrompts[6])
    addPrompt(prompts, defaultPrompts[6])
    addPrompt(prompts, defaultPrompts[5])
    addPrompt(prompts, defaultPrompts[4])
    addPrompt(prompts, defaultPrompts[3])
    addPrompt(prompts, defaultPrompts[2])
    addPrompt(prompts, defaultPrompts[1])
    addPrompt(prompts, defaultPrompts[0])
    // addPrompt(prompts, defaultPrompts[7])
    return prompts

    function addPrompt(prompts: Prompt[], prompt: Prompt) {
        // console.log("Default prompt: ",prompts,prompt)
        const index = prompts.findIndex((i: Prompt) => i.uuid === prompt.uuid)
        if (index >= 0) {
            prompts[index] = prompt
        } else {
            prompts.unshift(prompt)
        }
    }
}

export const savePrompt = async (prompt: Prompt) => {
    // console.log("Save prompt: ",prompt)
    const savedPrompts = await getSavedPrompts(false)
    const index = savedPrompts.findIndex((i: Prompt) => i.uuid === prompt.uuid)
    if (index >= 0) {
        savedPrompts[index] = prompt
    } else {
        prompt.uuid = uuidv4()
        savedPrompts.push(prompt)
    }

    await Browser.storage.sync.set({ [SAVED_PROMPTS_KEY]: savedPrompts })
}

export const deletePrompt = async (prompt: Prompt) => {
    let savedPrompts = await getSavedPrompts()
    savedPrompts = savedPrompts.filter((i: Prompt) => i.uuid !== prompt.uuid)
    await Browser.storage.sync.set({ [SAVED_PROMPTS_KEY]: savedPrompts })
}
