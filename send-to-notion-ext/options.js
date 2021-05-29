//notionPage
function save_options() {
  var token = document.getElementById('notionToken').value;
  var page = document.getElementById('notionPage').value;
  chrome.storage.sync.set({
    notion_token: token,
    notion_page: page
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = 'Nothing';
    }, 750);
    console.log("Saved token successfully.");
  });
}

function restore_options() {
  chrome.storage.sync.get({
    notion_token: 'not-set',
    notion_page: 'not-set'
  }, function(items) {
    document.getElementById('notionToken').value = items.notion_token;
    document.getElementById('notionPage').value = items.notion_page;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);
