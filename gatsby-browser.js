/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

// You can delete this file if you're not using it

import "./src/styles/global.css";

export const onClientEntry = () => {
  console.log("We've started!")
}

export const onServiceWorkerInstalled = ({serviceWorker}) => {
  console.log('sw installed')
}

export const onServiceWorkerUpdateFound = ({serviceWorker}) => {
  console.log('sw update found')
}

export const onServiceWorkerActive =  ({serviceWorker}) => {
  console.log('sw active')
}

export const onServiceWorkerRedundant = ({serviceWorker}) => {
  console.log('sw redundant')
}