import { h } from 'preact'
import Browser from 'webextension-polyfill'
import IconButton from './socialIconButton'
import { icons } from 'src/util/icons'




function Footer() {
  const extension_version = Browser.runtime.getManifest().version

  return (
    <div className="wcg-text-center wcg-text-xs wcg-text-gray-400">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>

      <a href='https://aiquestpro.com/' target='_blank' className='underline wcg-text-gray-400 wcg-underline' rel="noreferrer">
        ChatGPT Prodigy
      </a> &nbsp;&nbsp;
      &nbsp;<a href='https://www.youtube.com/watch?v=tQdL6r-h9jE' target='_blank' className='wcg-text-gray-400 wcg-underline' rel="noreferrer">Tutorials</a>
       &nbsp;&nbsp;
       <a href='https://chrome.google.com/webstore/detail/chatgpt-prodigy-autogpt-w/nlkdjiiffalhmoaconegckknmebklpfa?hl=en&authuser=0/' target='_blank' className='underline wcg-text-gray-400 wcg-underline' rel="noreferrer">
        Rate Us
      </a> 
      &nbsp;&nbsp;
      <a href='https://www.buymeacoffee.com/aiquestpro' target='_blank' className='underline wcg-text-gray-400 wcg-underline' rel="noreferrer">
        Buy me a Coffee
      </a> 



      <div style="margin:10px 10px">
{/* <IconButton url="https://twitter.com/ProAiquest" tip="Follow me on twitter" icon={icons.twitter} /> */}
</div>
    </div>
  )
}

export default Footer
