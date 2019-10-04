$("Document").ready(function() {
    // API key
    const appID = "RyanAlld-ProjectT-PRD-5dfb0df12-1f10d5a8";
    // Base GET request URL
    const endPoint = `https://cors-anywhere.herokuapp.com/https://svcs.ebay.com/services/search/FindingService/v1?SERVICE-VERSION=1.13.0&SECURITY-APPNAME=${appID}&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&OPERATION-NAME=findItemsByKeywords`;
    // get next page of results, specify how many per page
    let numPerPage = "20", page = "1";
    const paginate = `&paginationInput.entriesPerPage=${numPerPage}&paginationInput.pageNumber=`;

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
            page = data.findItemsByKeywordsResponse[0].paginationOutput[0].pageNumber[0];
            
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
            
            for(let i = page; i <= parseInt(page) + 5; i++) {
                $("#pagination").append(`<button class="page-btn" data-val="${i}">${i}</button>`);
            }
        });
    }
    
    $("#search-btn").on("click", function() {
        
        let input = $('#searchInput').val().trim();
        let keyword = input.replace(" ", "%20");
        let url = `${endPoint}${paginate}${page}&keywords=${keyword}`;
        keywordSearch(url);
    });

    $("#pagination").on("click", $(".page-btn"), function(e) {
        page = $(e.target).data("val");
        let input = $('#searchInput').val().trim();
        let keyword = input.replace(" ", "%20");
        console.log(keyword + " : " + page);
        let url = `${endPoint}${paginate}${page}&keywords=${keyword}`;
        keywordSearch(url);
    });

});

/*

  <div class="row">
    <div class="col s12 m6">
      <div class="card blue-grey darken-1">
        <div class="card-content white-text">
          <span class="card-title">Card Title</span>
          <p>I am a very simple card. I am good at containing small bits of information.
          I am convenient because I require little markup to use effectively.</p>
        </div>
        <div class="card-action">
          <a href="#">This is a link</a>
          <a href="#">This is a link</a>
        </div>
      </div>
    </div>
  </div>

*/