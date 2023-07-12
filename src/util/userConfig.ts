import { defaults } from 'lodash-es'
import Browser from 'webextension-polyfill'
import { getSystemLanguage } from './localization'


const defaultConfig = {
    numWebResults: 3,
    webAccess: false,
    deepAccess : false,
    region: 'wt-wt',
    timePeriod: '',
    language: getSystemLanguage(),
    promptUUID: 'default',
    taskUUID:'task3',
    langUUID : 'lang1',
    templateUUID:'template1',
    autogpt:false,
    autogpt_status: false
}

export type UserConfig = typeof defaultConfig

export async function getUserConfig(): Promise<UserConfig> {
    const config = await Browser.storage.sync.get(defaultConfig)
    return defaults(config, defaultConfig)
}

export async function updateUserConfig(config: Partial<UserConfig>): Promise<void> {
    await Browser.storage.sync.set(config)
}
