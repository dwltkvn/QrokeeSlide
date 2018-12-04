/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

// You can delete this file if you're not using it

import "./src/styles/global.css";

window.global_kdo_update = false;

export const onClientEntry = () => {
  console.log("We've started!");
  //window.global_kdo_update = true; // for test purpose
};

export const onServiceWorkerInstalled = ({ serviceWorker }) => {
  console.log("sw installed");
};

export const onServiceWorkerUpdateFound = ({ serviceWorker }) => {
  window.global_kdo_update = true;
};

export const onServiceWorkerActive = ({ serviceWorker }) => {
  console.log("sw active");
};

export const onServiceWorkerRedundant = ({ serviceWorker }) => {
  console.log("sw redundant");
};
