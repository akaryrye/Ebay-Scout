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
                        <a href=${link} target="_blank">View on Ebay</a>
                        <p> Current Price: ${price} ${currency} </p>
                    </div>
                </div></div>
            `);
        }
    }

    function paginateSearchItems(page, totalPages) {
        if (totalPages < 20) {
            for(let i = 1; i <= totalPages; i++) {
                $("#pagination").append(`<button class="page-key btn" data-val="${i}">${i}</button>`);
            }
        } else {
            for(let i = page; i <= page + 19; i++) {
                if (i > totalPages) break;
                $("#pagination").append(`<button class="page-key btn" data-val="${i}">${i}</button>`);
            }
        }
    }

    function paginateCategoryItems(page, totalPages) {
        if (totalPages < 20) {
            for(let i = 1; i <= totalPages; i++) {
                $("#pagination").append(`<button class="page-cat btn" data-val="${i}">${i}</button>`);
            }
        } else {
            for(let i = page; i <= page + 19; i++) {
                if (i > totalPages) break;
                $("#pagination").append(`<button class="page-cat btn" data-val="${i}">${i}</button>`);
            }
        }
    }
    
    function keywordSearch(url) {
        $("#results").empty();
        $("#pagination").empty();

        $.ajax({
            url: url,
            type: "GET"
        }).then(function(result) {
            let data = JSON.parse(result);
            page = data.findItemsByKeywordsResponse[0].paginationOutput[0].pageNumber[0];
            let items = data.findItemsByKeywordsResponse[0].searchResult[0].item;
            let totalPages = data.findItemsByKeywordsResponse[0].paginationOutput[0].totalPages[0];
            
            displayItems(items);
            paginateSearchItems(parseInt(page), parseInt(totalPages));
        });
    }

    function keywordStoreSearch(url) {
        $("#results").empty();
        $("#pagination").empty();

        $.ajax({
            url: url,
            type: "GET"
        }).then(function(result) {
            let data = JSON.parse(result);
            page = data.findItemsIneBayStoresResponse[0].paginationOutput[0].pageNumber[0];
            let items = data.findItemsIneBayStoresResponse[0].searchResult[0].item;
            let totalPages = data.findItemsIneBayStoresResponse[0].paginationOutput[0].totalPages[0];
            
            displayItems(items);
            paginateSearchItems(parseInt(page), parseInt(totalPages));
        });
    }

    function categorySearch(url) {
        $("#results").empty();
        $("#pagination").empty();
        
        $.ajax({
            url: url,
            type: "GET"
        }).then(function(result) {
            let data = JSON.parse(result);
            let items = data.findItemsIneBayStoresResponse[0].searchResult[0].item;
            page = parseInt(data.findItemsIneBayStoresResponse[0].paginationOutput[0].pageNumber[0]);
            let totalPages = parseInt(data.findItemsIneBayStoresResponse[0].paginationOutput[0].totalPages[0]);
            displayItems(items);
            paginateCategoryItems(page, totalPages);
        });
    }
 
    // Search by keyword
    $("#search-btn").on("click", function() {
        page = "1";
        let keyword = $('#searchInput').val().trim().replace(" ", "%20");
        let url = `${baseURL}${findByKey}${paginate}${page}&keywords=${keyword}`;
        keywordSearch(url);
    });

    // Search the store by keyword
    $("#store-search-btn").on("click", function() {
        page = "1";
        let keyword = $('#searchInput').val().trim().replace(" ", "%20");
        let url = `${baseURL}${findInStore}${paginate}${page}&keywords=${keyword}`;
        keywordStoreSearch(url);
    }); 

    // Category buttons on click, find all matching items in store
    $("#category-buttons").on("click", ".category-btn", function() {
        currentCategory = $(this).data("val");
        page = "1";
        let url = `${baseURL}${findInStore}${paginate}${page}&categoryId=${currentCategory}`;
        categorySearch(url);
    });

    // Go to the next page of results
    $("#pagination").on("click", ".page-key", function() {
        page = $(this).data("val");
        let input = $('#searchInput').val().trim();
        let keyword = input.replace(" ", "%20");
        let url = "";

        if (document.location.pathname === "/find") {
            url = `${baseURL}${findByKey}${paginate}${page}&keywords=${keyword}`;
            keywordSearch(url);
        } else if (document.location.pathname === "/store") {
            url = `${baseURL}${findInStore}${paginate}${page}&keywords=${keyword}`;
            keywordStoreSearch(url);
        }
    });

    $("#pagination").on("click", ".page-cat", function() {
        page = $(this).data("val");
        url = `${baseURL}${findInStore}${paginate}${page}&categoryId=${currentCategory}`;
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
        });
    }

});