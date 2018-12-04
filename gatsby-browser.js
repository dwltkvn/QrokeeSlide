/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

// You can delete this file if you're not using it

import "./src/styles/global.css";

var global_kdo_update = true;
export default window.global_kdo_update;

export const onClientEntry = () => {
  console.log("We've started!");
  //window.dispatchEvent(new Event('evtClientEntry'))
  //setTimeout(function(){ window.dispatchEvent(new Event('evtClientEntry')); }, 3000);
};

export const onServiceWorkerInstalled = ({ serviceWorker }) => {
  console.log("sw installed");
};

export const onServiceWorkerUpdateFound = ({ serviceWorker }) => {
  setTimeout(function() {
    window.dispatchEvent(new Event("evtServiceWorkerUpdateFound"));
  }, 10000);
  //console.log('sw update found');
  //global_kdo_update = true;
};

export const onServiceWorkerActive = ({ serviceWorker }) => {
  console.log("sw active");
};

export const onServiceWorkerRedundant = ({ serviceWorker }) => {
  console.log("sw redundant");
};
