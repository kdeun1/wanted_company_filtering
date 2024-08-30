const EXCEPT_KEYWORD = 'except_keyword';
const WANTED_CHECK = 'wanted_check';
const DELAY_TIMEOUT = 500;

const debounce = (func, timeout = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
};

const splitKeywordToArray = keyword => {
  if (!keyword) {
    return [];
  }
  return (
    String(keyword)
      .split(/,|\r\n|\r|\n|\t/)
      ?.map(v => v.trim())
      ?.filter(v => v) ?? []
  );
};

const filterCards = () => {
  chrome.storage.local.get('except_keyword', ({ except_keyword }) => {
    const wdlistCards = document.querySelectorAll('[class*="Card_Card__"]');
    const keywordArr = splitKeywordToArray(except_keyword);

    if (keywordArr?.length > 0) {
      wdlistCards.forEach(card => {
        const cardInner = card.children[0].children[0];
        const wantedCompanyName = cardInner
          .getAttribute('data-company-name')
          .toLowerCase();
        const wantedPositionName = cardInner
          .getAttribute('data-position-name')
          .toLowerCase();

        if (
          keywordArr.some(
            keyword =>
              wantedCompanyName.includes(keyword.toLowerCase()) ||
              wantedPositionName.includes(keyword.toLowerCase())
          )
        ) {
          card.style.display = 'none';
        }
      });
    } else {
      wdlistCards.forEach(card => {
        card.style.display = 'none';
      });
    }
  });
};

window.addEventListener('popstate', () => {
  setTimeout(() => {
    chrome.storage.local.get('wanted_check', ({ wanted_check }) => {
      if (wanted_check) {
        filterCards();
      }
    });
  }, DELAY_TIMEOUT);
});

let wantedObserver = null;

window.onload = () => {
  chrome.storage.local.get('wanted_check', ({ wanted_check }) => {
    if (wanted_check) {
      filterCards();
      startObserver();
    } else {
      disconnectObserver();
    }
  });

  wantedObserver = new MutationObserver(
    debounce(() => {
      chrome.storage.local.get('wanted_check', ({ wanted_check }) => {
        if (wanted_check) {
          filterCards();
        }
      });
    }, DELAY_TIMEOUT)
  );
};

const startObserver = () => {
  if (wantedObserver) {
    const jobListUl = document.querySelectorAll('[class*="List_List__"]')[0];
    if (jobListUl) {
      wantedObserver.observe(jobListUl, {
        childList: true,
      });
    }
  }
};

const disconnectObserver = () => {
  if (wantedObserver) {
    wantedObserver.disconnect();
  }
};

const saveValueToLocalStorage = obj => {
  chrome.storage.local.set(obj, () => {
    console.log('Keywords saved to local storage:', obj);
  });
};

const initCardsStyle = () => {
  const wdlistCards = document.querySelectorAll('[class*="Card_Card__"]');

  wdlistCards.forEach(cardInner => {
    cardInner.style.display = '';
  });
};

const clearAllLocalStorage = () => {
  let removedKeys = ['except_keyword, wanted_check'];
  chrome.storage.local.remove(removedKeys, () => {
    console.log('Keywords removed to chrome storage');
  });
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const { action, keyword } = request;

  switch (action) {
    case 'wantedCheck': {
      saveValueToLocalStorage({ wanted_check: true });
      if (keyword) {
        saveValueToLocalStorage({ except_keyword: keyword });
      }
      filterCards();
      startObserver();

      sendResponse({ status: 'done' });
      break;
    }
    case 'wantedUncheck': {
      saveValueToLocalStorage({ wanted_check: false });
      initCardsStyle();
      disconnectObserver();

      sendResponse({ status: 'done' });
      break;
    }
    case 'clearButtonClick': {
      clearAllLocalStorage();
      break;
    }
    default: {
      break;
    }
  }
});
