const keywordTextarea = document.getElementById('keyword');
const wantedFilterCheckbox = document.getElementById('wantedFilterCheckbox');
const clearButton = document.getElementById('clearButton');

document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get(
    ['wanted_check', 'except_keyword'],
    ({ wanted_check, except_keyword }) => {
      if (wanted_check) {
        wantedFilterCheckbox.checked = wanted_check;
      }
      if (except_keyword) {
        keywordTextarea.value = except_keyword;
      }
    }
  );
});

const TABS_QUERY_PARAMS = { active: true, currentWindow: true };

wantedFilterCheckbox.addEventListener('change', () => {
  const isChecked = wantedFilterCheckbox.checked;
  const action = isChecked ? 'wantedCheck' : 'wantedUncheck';
  const keyword = keywordTextarea.value;

  chrome.tabs.query(TABS_QUERY_PARAMS, tabs => {
    chrome.tabs.sendMessage(tabs[0].id, { action, keyword }, response => {
      console.log(response?.status);
    });
  });
});

clearButton.addEventListener('click', () => {
  const action = 'clearButtonClick';

  chrome.tabs.query(TABS_QUERY_PARAMS, tabs => {
    chrome.tabs.sendMessage(tabs[0].id, { action }, response => {
      console.log(response?.status);
    });
  });
});
