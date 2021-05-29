chrome.runtime.onInstalled.addListener(() => {
  console.log('Ext Installed.');
});

chrome.commands.onCommand.addListener(function(command, tab) {
  console.log('Command:', command, "Tab:", tab);

  if(command == "send-to-notion-default") {
    console.log("TODO: implement later");
  }
});

chrome.contextMenus.create({
  id: "send-to-notion-default",
  title: "send-to-notion-default", 
  contexts:["selection"]
});

chrome.contextMenus.onClicked.addListener(send_to_notion);

function send_to_notion(info, tab) {
  chrome.storage.sync.get(['notion_token', 'notion_page'], function(items) {
    var token = items.notion_token;
    var page = items.notion_page;
    var text = info.selectionText;
    var contextTabUrl = tab['url'];

    function reqListener () {
      console.log(JSON.parse(this.responseText));
    }
    console.log(page);
    var xhttp = new XMLHttpRequest();
    xhttp.addEventListener("load", reqListener);
    xhttp.open("GET", "https://api.notion.com/v1/blocks/" + page + "/children");
    xhttp.setRequestHeader('Content-Type', "application/json");
    xhttp.setRequestHeader('Notion-Version', '2021-05-13');
    xhttp.setRequestHeader('Authorization', "Bearer " + token);
    xhttp.send();
    
    var writeData = {
            "children": [
              {
                "object": "block",
                "type": "paragraph",
                "paragraph": {
                  "text": [
                    {
                      "type": "text",
                      "text": {
                        "content": text + " - "
                      }
                    },
                    {
                      "type": "text",
                      "text": {
                        "content": "[ clipped from ]",
                        "link": { "url": contextTabUrl }
                      }
                    }
                  ]
                }
              }
            ]
          }

    var xhttp = new XMLHttpRequest();
    xhttp.addEventListener("load", reqListener);
    xhttp.open("PATCH", "https://api.notion.com/v1/blocks/" + page + "/children");
    xhttp.setRequestHeader('Content-Type', "application/json");
    xhttp.setRequestHeader('Notion-Version', '2021-05-13');
    xhttp.setRequestHeader('Authorization', "Bearer " + token);
    xhttp.send(JSON.stringify(writeData));
    
    });
}
