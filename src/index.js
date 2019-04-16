import 'aframe';
import 'aframe-animation-component';
import capiFetch from '@abcnews/capi-fetch';
import { loadOdysseyScrollyteller } from '@abcnews/scrollyteller';
import { h, render } from 'preact';
import App from './components/App';

let scrollyteller;
let assets;

function renderApp() {
  render(
    <App assets={assets} panels={scrollyteller.panels} />,
    scrollyteller.mountNode,
    scrollyteller.mountNode.firstChild
  );
}

if (module.hot) {
  module.hot.accept('./components/App', () => {
    try {
      renderApp();
    } catch (err) {
      import('./components/ErrorBox').then(exports => {
        const ErrorBox = exports.default;
        render(<ErrorBox error={err} />, scrollyteller.mountNode, scrollyteller.mountNode.firstChild);
      });
    }
  });
}

function init() {
  try {
    scrollyteller = loadOdysseyScrollyteller('interior', 'u-full');
  } catch (e) {}

  if (scrollyteller && scrollyteller.mountNode) {
    while (scrollyteller.mountNode.nextElementSibling.tagName === 'A') {
      window.__ODYSSEY__.utils.dom.detach(scrollyteller.mountNode.nextElementSibling);
    }

    fetchAssets(scrollyteller.panels)
      .then(_assets => {
        assets = _assets;
        renderApp();
      })
      .catch(err => {
        console.error(err);
      });
  }
}

const ASSET_TAGNAMES = {
  CustomImage: 'img',
  Video: 'video'
};

function fetchAssets(panels) {
  return new Promise((resolve, reject) => {
    const assetCMIDs = panels.reduce((memo, panel) => {
      const assetCMID = panel.config.asset;

      if (assetCMID && memo.indexOf(assetCMID) === -1) {
        memo.push(assetCMID);
      }

      return memo;
    }, []);

    Promise.all(
      assetCMIDs.map(
        assetCMID =>
          new Promise((resolve, reject) => {
            capiFetch(assetCMID, (err, doc) => {
              if (err) {
                return reject(err);
              }

              const tagName = ASSET_TAGNAMES[doc.docType];

              if (!tagName) {
                return reject(new Error(`Unsupported asset type: ${doc.docType}`));
              }

              const renditions = (doc.renditions || doc.media).slice().sort((a, b) => b.width - a.width);
              let src = renditions[0].url;

              renditions.slice(1).forEach(x => {
                if (x.width > window.innerWidth) {
                  src = x.url;
                }
              });

              resolve({
                id: doc.id,
                tagName,
                src
              });
            });
          })
      )
    )
      .then(assets => resolve(assets))
      .catch(err => {
        reject(err);
      });
  });
}

if (window.__ODYSSEY__) {
  init();
} else {
  window.addEventListener('odyssey:api', init);
}

if (process.env.NODE_ENV === 'development') {
  require('preact/devtools');
}
