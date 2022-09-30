# Don't Focus on Hate Chrome Extension

This repo is part of a final project for [Spiced Academy's](https://www.spiced-academy.com/en/program) [Data Science Course](https://www.spiced-academy.com/en/program/data-science) (Ginger-Pipeline cohort)

There is also an accompanying [Back End](https://github.com/mdaizovi/hate_speech)

## Purpose

This browser extension reads text from a browser page and sends it to a backend URL. The backend returns a json object of the text element IDs with a score (0-1) of how toxic the text is. This extension then takes those scores and blurs the text on the page accordingly. Text with a very low score will remain unaffected. Text with a very high toxicity score will become unreadable.

## To Run Locally

- Download this repo and then follow [instructions here](https://developer.chrome.com/docs/extensions/mv3/getstarted/#unpacked) to **load an unpacked extension**.

- This project will not be maintained so there is a high likelihood the url will not work. you will need to either clone the corresponding backend repo and run it locally, or otherwise host a url with identical functionality and replace the `textCheckUrl` url in `popup.js` with your new url.

## Other Maintained Extensions

This extension is not a maintained project. If you would like to block hate speech in your browser please see:

- [Hate Speech Blocker](https://chrome.google.com/webstore/detail/hate-speech-blocker/inmmffkffipkoajnleafijfnboefpkcj?hl=en)

- [Hate Block](https://chrome.google.com/webstore/detail/hate-block/cfdlpekecomochlpnbefnjimidpfmpbk?hl=en)

- [WiseMonkey](https://chrome.google.com/webstore/detail/wisemonkey/olhcfgfcbkjlonelecchakjnklbjofnc?hl=en)
