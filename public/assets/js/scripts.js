$("Document").ready(function() {
    
    const appID = "RyanAlld-ProjectT-PRD-5dfb0df12-1f10d5a8";
    const storeName = "Sally%27s%20Fine%20Vintage%20Toys"
    let numPerPage = "20"; //results per page
    let page = "1"; //default page = 1
    let currentCategory = ""; // to keep trak of the category currently in use

    // URL building blocks
    let baseURL = `https://cors-anywhere.herokuapp.com/https://svcs.ebay.com/services/search/FindingService/v1?SERVICE-VERSION=1.13.0&SECURITY-APPNAME=${appID}&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD`;

    let findByKey = "&OPERATION-NAME=findItemsByKeywords";
    let findInStore = `&OPERATION-NAME=findItemsIneBayStores&storeName=${storeName}`;
    let paginate = `&paginationInput.entriesPerPage=${numPerPage}&paginationInput.pageNumber=`;
    

    function displayItems(items) {
        for(let i = 0; i < items.length; i++) {
            let title = items[i].title[0];
            let image = items[i].galleryURL[0];
            let link = items[i].viewItemURL[0];
            let price = items[i].sellingStatus[0].currentPrice[0]['__value__'];
            let currency = items[i].sellingStatus[0].currentPrice[0]['@currencyId'];
            $("#results").append(`
                <div class="col s12 m6 l4">
                <div class="card blue-grey darken-1 center-align">
                    <div class="card-content white-text">
                        <span class="card-title">${title}</span>
                        <img src=${image} />
                    </div>
                    <div class="card-action">
                        <a href=${link}>View on Ebay</a>
                        <p> Current Price: ${price} ${currency} </p>
                    </div>
                </div></div>
            `);
        }
    }

    function paginateItems(page, totalPages) {
        
        if (parseInt(totalPages) < 20) {
            for(let i = 1; i <= parseInt(totalPages); i++) {
                $("#pagination").append(`<button class="page-btn" data-val="${i}">${i}</button>`);
            }
        } else {
            for(let i = parseInt(page); i <= parseInt(totalPages); i++) {
                $("#pagination").append(`<button class="page-btn" data-val="${i}">${i}</button>`);
            }
        }
        
    }
    
    function keywordSearch(url) {
        $("#results").empty();
        $("#pagination").empty();
        page = "1";
        $.ajax({
            url: url,
            type: "GET"
        }).then(function(result) {
            let data = JSON.parse(result);
            let items = data.findItemsByKeywordsResponse[0].searchResult[0].item;
            page = parseInt(data.findItemsByKeywordsResponse[0].paginationOutput[0].pageNumber[0]);
            let totalPages = parseInt(data.findItemsByKeywordsResponse[0].paginationOutput[0].totalPages[0]);
            displayItems(items);
            paginateItems(page, totalPages); 
        });
    }

    function categorySearch(url) {
        $("#results").empty();
        $("#pagination").empty();
        page = "1";
        $.ajax({
            url: url,
            type: "GET"
        }).then(function(result) {
            console.log(result);
            let data = JSON.parse(result);
            let items = data.findItemsIneBayStoresResponse[0].searchResult[0].item;
            let page = parseInt(data.findItemsIneBayStoresResponse[0].paginationOutput[0].pageNumber[0]);
            let totalPages = parseInt(data.findItemsIneBayStoresResponse[0].paginationOutput[0].totalPages[0]);
            displayItems(items);
            paginateItems(page, totalPages);
        });
    }
 
    // General Ebay search by keyword
    $("#search-btn").on("click", function() {
        let input = $('#searchInput').val().trim();
        let keyword = input.replace(" ", "%20");
        let url = `${baseURL}${findByKey}${paginate}${page}&keywords=${keyword}`;
        keywordSearch(url);
    });

    // Go to the next page of results
    $("#pagination").on("click", ".page-btn", function(e) {
        page = $(e.target).data("val");   
        if (document.location.pathname === "/find") {
            let input = $('#searchInput').val().trim();
            let keyword = input.replace(" ", "%20");
            url = `${baseURL}${findByKey}${paginate}${page}&keywords=${keyword}`;
            keywordSearch(url);
        } else if (document.location.pathname === "/store") {
            url = `${baseURL}${findInStore}${paginate}${page}&categoryId=${currentCategory}`;
            categorySearch(url);
        }
    });

    // Category buttons on click, find all matching items in store
    $("#category-buttons").on("click", ".category-btn", function() {
        currentCategory = $(this).data("val");
        let url = `${baseURL}${findInStore}${paginate}${page}&categoryId=${currentCategory}`;
        categorySearch(url);
    });

    // loop through store and create buttons for each unique category
    if (document.location.pathname === "/store") {
        console.log(document.location.pathname);
        let url = `${baseURL}${findInStore}`;
        $.ajax({
            url: url,
            type: "GET"
        }).then(function(result) {
            let data = JSON.parse(result);
            let items = data.findItemsIneBayStoresResponse[0].searchResult[0].item;
            let categories = [];
            
            for (let i = 0; i < items.length; i++) {
                let category = items[i].primaryCategory[0].categoryName[0];
                let categoryId = items[i].primaryCategory[0].categoryId[0];
                if (!categories.includes(category)) {
                    categories.push(category);
                    $("#category-buttons").append(`<button class="category-btn btn" data-val="${categoryId}">${category}</button>`);
                }
            }

            console.log(categories);
        });
    }

});