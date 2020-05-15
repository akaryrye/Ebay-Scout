$("Document").ready(function() {
    
    const appID = "RyanAlld-ProjectT-PRD-5dfb0df12-1f10d5a8";
    const storeName = "Sally%27s%20Fine%20Vintage%20Toys"
    let numPerPage = "20"; // set results per page
    let page = 1; // default page #

    // URL building blocks
    let baseURL = `https://cors-anywhere.herokuapp.com/https://svcs.ebay.com/services/search/FindingService/v1?SERVICE-VERSION=1.13.0&SECURITY-APPNAME=${appID}&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD=true`;

    let findByKey = "&OPERATION-NAME=findItemsByKeywords";
    let findInStore = `&OPERATION-NAME=findItemsAdvanced&itemFilter(0).name=Seller&itemFilter(0).value=${storeName}`;
    let paginate = `&paginationInput.entriesPerPage=${numPerPage}&paginationInput.pageNumber=`;
    let URL = "";

    // Parse items object, format, and display
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

    // Display page buttons
    function paginateItems(pageInfo) {
        $("#pagination").empty();
        let totalPages = parseInt(pageInfo.totalPages[0]);
        console.log("page: " + page + ", total Pages: " + totalPages);

        if (totalPages < 20) {
            for(let i = 1; i <= totalPages; i++) {
                $("#pagination").append(`<button class="page-key btn" data-val="${i}">${i}</button>`);
            }
        } else {
            for(let i = page; i < page + 20; i++) {
                if (i > totalPages) break;
                $("#pagination").append(`<button class="page-key btn" data-val="${i}">${i}</button>`);
            }
        }
    }

    // Query eBay API and get items
    function getItems(url, operation) {
        $("#results").empty();

        $.ajax({
            url: url,
            type: "GET"
        }).then(function(result) {
            let data = JSON.parse(result)[operation][0];
            let items = data.searchResult[0].item;
            let pageInfo = data.paginationOutput[0];
            
            displayItems(items);
            paginateItems(pageInfo);
        });
    }

    // Search eBay by keyword
    $("#search-btn").on("click", function() {
        page = 1;
        let keyword = $('#searchInput').val().trim().replace(" ", "%20");
        URL = `${baseURL}${findByKey}&keywords=${keyword}${paginate}`;
        getItems(URL + page, 'findItemsByKeywordsResponse');
    });

    // Search store by keyword
    $("#store-search-btn").on("click", function() {
        page = 1;
        let keyword = $('#searchInput').val().trim().replace(" ", "%20");
        URL = `${baseURL}${findInStore}&keywords=${keyword}${paginate}`;
        getItems(URL + page, 'findItemsAdvancedResponse');
    }); 

    // Search store by category
    $("#category-buttons").on("click", ".category-btn", function() {
        page = 1;
        let category = $(this).data("val");
        URL = `${baseURL}${findInStore}&categoryId=${category}${paginate}`;
        getItems(URL + page, 'findItemsAdvancedResponse');
    });

    // Go to the next page of results
    $("#pagination").on("click", ".page-key", function() {
        page = parseInt($(this).data("val"));
        if (document.location.pathname === "/find") {
            getItems(URL + page, 'findItemsByKeywordsResponse');
        } else if (document.location.pathname === "/store") {
            getItems(URL + page, 'findItemsAdvancedResponse');
        }
    });

    // Find all unique categories in store and display buttons
    if (document.location.pathname === "/store") {
        console.log(document.location.pathname);
        let url = `${baseURL}${findInStore}`;
        $.ajax({
            url: url,
            type: "GET"
        }).then(function(result) {
            let data = JSON.parse(result);
            let items = data.findItemsAdvancedResponse[0].searchResult[0].item;
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