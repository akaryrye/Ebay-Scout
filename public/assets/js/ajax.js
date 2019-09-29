const appID = "RyanAlld-ProjectT-PRD-5dfb0df12-1f10d5a8";
let query = "harry%20potter%20phoenix";
const operation = "&OPERATION-NAME=findItemsByKeywords";
const id = "&SECURITY-APPNAME=" + appID;
const format = "&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD";
const search = "&keywords=" + query;

const url = "https://cors-anywhere.herokuapp.com/https://svcs.ebay.com/services/search/FindingService/v1?SERVICE-VERSION=1.13.0" + operation + id + format + search;

console.log(url);

$.ajax({
    url: url,
    type: "GET"
}).then(function(data) {
    let jsonData = JSON.parse(data)
    console.log(jsonData.findItemsByKeywordsResponse[0].searchResult[0].item[0].title[0]);
});