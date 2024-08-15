function filterCards() {
  chrome.storage.local.get('wanted_filter_company_name', result => {
    if (result?.wanted_filter_company_name) {
      const companyArr = result.wanted_filter_company_name;
      if (companyArr?.length > 0) {
        const cards = document.querySelectorAll('[class*="Card_Card__"]');

        cards.forEach(card => {
          const cardText =
            card.children[0].children[0].getAttribute('data-company-name');
          for (let keyword of companyArr) {
            if (cardText.includes(keyword.trim())) {
              card.style.display = 'none';
              break;
            }
          }
        });
      }
    }
  });
}

function saveKeywordsToLocalStorage(keywords) {
  chrome.storage.local.set({ wanted_filter_company_name: keywords }, () => {
    console.log('Keywords saved to local storage:', keywords);
  });
}

function cancelFilterCards() {
  const cards = document.querySelectorAll('[class*="Card_Card__"]');

  cards.forEach(card => {
    card.style.display = '';
  });
}

function clearStorage(key) {
  let removedKeys = ['wanted_filter_company_name, wanted_filter_check'];
  if (key) {
    removedKeys = [key];
  }
  chrome.storage.local.remove(removedKeys, () => {
    console.log('Keywords removed to chrome storage');
  });
}

function saveCheckToStorage(flag) {
  chrome.storage.local.set({ wanted_filter_check: flag }, () => {
    console.log('Checking filter');
  });
}

window.addEventListener('popstate', function () {
  chrome.storage.local.get('wanted_filter_check', result => {
    if (result?.wanted_filter_check === true) {
      filterCards();
    }
  });
});

window.onload = function () {
  chrome.storage.local.get('wanted_filter_check', result => {
    if (result?.wanted_filter_check === true) {
      filterCards();
    }
  });
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'filter') {
    cancelFilterCards();
    const keywords = request.keyword.split(',');
    if (request.keyword) {
      saveKeywordsToLocalStorage(keywords);
      filterCards();
    } else {
      clearStorage('wanted_filter_company_name');
    }
    sendResponse({ status: 'done' });
  } else if (request.action === 'reset') {
    cancelFilterCards();
    sendResponse({ status: 'done' });
  } else if (request.action === 'clear') {
    cancelFilterCards();
    clearStorage();
    sendResponse({ status: 'done' });
  } else if (request.action === 'check') {
    saveCheckToStorage(request.isChecked);
    sendResponse({ status: 'done' });
  }
});
