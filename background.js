chrome.runtime.onInstalled.addListener(() => {
  console.log('Ext Installed.');
});

chrome.commands.onCommand.addListener(function(command, tab) {
  console.log('Command:', command, "Tab:", tab);

  if(command == "send-to-notion-default") {
    console.log("Hit command default ... URL ::", tab['url']);
    // does nothing yet
  }
});

chrome.contextMenus.create({
  id: "send-to-notion-default",
  title: "send-to-notion-default", 
  contexts:["selection"]
});

chrome.contextMenus.onClicked.addListener(send_to_notion);

function send_to_notion(info, tab) {
  chrome.storage.sync.get(['notion_token'], function(items) {
    var token = items.notion_token;
    var text = info.selectionText;
    var contextTabUrl = tab['url'];
    console.log("Post data to Notion API", text, contextTabUrl);
  });
}
