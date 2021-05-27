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
    

        // writeData = {
        //         "children": [
        //             {
        //                 "object": "block",
        //                 "type": "paragraph",
        //                 "paragraph": {
        //                     "text": [
        //                         {
        //                             "type": "text",
        //                             "text": {
        //                                 "content": text,
        //                                 "link": { "url": contextTabUrl }
        //                             }
        //                         }
        //                     ]
        //                 }
        //             }
        //         ]
        //     }
        // fetch('https://api.notion.com/v1/blocks/c28a9b7af9904e3089587ab665999556/children', {
        //     method: 'PATCH',
        //     mode: "no-cors",
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Notion-Version': '2021-05-13',
        //         'Authorization': "Bearer " + token
        //     },
        //     body: JSON.stringify(writeData)
        // })
        //     .then(response => response.json())
        //     .then(data => console.log(data));
    });
}
