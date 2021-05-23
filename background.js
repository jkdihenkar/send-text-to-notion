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


      // TODO: CORS issue when making authenticated api call
        var t = fetch('https://api.notion.com/v1/blocks/c28a9b7af9904e3089587ab665999556/children', {
            method: 'GET',
            //mode: "no-cors",
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
                'Notion-Version': '2021-05-13',
                'Authorization': "Bearer " + token,
                'Access-Control-Allow-Origin': 'https://api.notion.com',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'GET, PUT, POST, OPTIONS'
            }
        })
            .then(response =>  response.text())
            .then(data => console.log(data));

        writeData = {
                "children": [
                    {
                        "object": "block",
                        "type": "paragraph",
                        "paragraph": {
                            "text": [
                                {
                                    "type": "text",
                                    "text": {
                                        "content": text,
                                        "link": { "url": contextTabUrl }
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
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
