(function () {
  'use strict';

  (async () => {
    await import(
      /* @vite-ignore */
      chrome.runtime.getURL("assets/content.ts.d97e46aa.js")
    );
  })().catch(console.error);

})();
