const filterButton = document.getElementById('filterButton');
const resetButton = document.getElementById('resetButton');
const clearButton = document.getElementById('clearButton');
const filterCheckbox = document.getElementById('filterCheckbox');
const keywordTextarea = document.getElementById('keyword');

document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get('wanted_filter_company_name', result => {
    if (result?.wanted_filter_company_name) {
      keywordTextarea.value = result.wanted_filter_company_name;
    }
  });

  chrome.storage.local.get('wanted_filter_check', result => {
    if (result?.wanted_filter_check === true) {
      filterCheckbox.checked = result.wanted_filter_check;
    }
  });
});

filterButton.addEventListener('click', () => {
  const keyword = keywordTextarea.value;
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { action: 'filter', keyword: keyword },
      response => {
        console.log(response?.status);
      }
    );
  });
});

resetButton.addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'reset' }, response => {
      console.log(response?.status);
    });
  });
});

clearButton.addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'clear' }, response => {
      console.log(response?.status);
    });
  });
});

filterCheckbox.addEventListener('change', () => {
  const isChecked = filterCheckbox.checked;
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { action: 'check', isChecked: isChecked },
      response => {
        console.log(response?.status);
      }
    );
  });
});
