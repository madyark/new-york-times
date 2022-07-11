// Parse the JSON data from the NYT API
let fetchURL = (url, div_id) => {
    // Call to fetch the URL and parse it as JSON
    fetch(url)
    .then(response => response.json())
    .then(data => {
        console.log(data);

        // Query the results
        data.results.map(article => {

            // Create the anchor tag in the HTML file for the article URL
            let a = document.createElement("a");
            a.setAttribute("href", article.url);
            a.setAttribute("target", "_blank");
            a.innerHTML = article.title;

            // Create a paragraph tag below the link to add a description
            let p = document.createElement("p");
            p.innerHTML = article.abstract + "<br><br><i>" + article.byline + "</i>";

            // Create an image tag
            let img = document.createElement("img");
            if (article.hasOwnProperty("multimedia")) {
                img.setAttribute("src", article.multimedia[0].url);
                img.setAttribute("alt", article.multimedia[0].caption);

                // Only append all elements if the title exists
                if (article.title != "" && article.abstract != "") {
                    // Append the elements into the DOM
                    div_id.appendChild(img);
                    div_id.appendChild(a);
                    div_id.appendChild(p);
                } 
            } else if (article.hasOwnProperty("media")) {
                // Only append all elements if the title exists
                if (article.title != "" && article.abstract != "") {
                    // Append the elements into the DOM
                    div_id.appendChild(a);
                    div_id.appendChild(p);
                } 
            }
        });
    });
}

// Load the news topics selected
let load_news = (clicked_id) => {
    // Reset all of the values of the variables after every click
    let selection = "";
    let url = "";
    let headlines = "";
    headlines = document.getElementById("headlines");
    headlines.innerHTML = "";

    // Set the selected news story as the id of the clicked button
    selection = clicked_id;

    // New York Times API URL based on button selection
    url = `https://api.nytimes.com/svc/topstories/v2/${selection}.json?api-key=pIoSq1UjWjXykHS64Jfb0BzSko9plm1v`;

    fetchURL(url, headlines);
}

// Load the 'popular' page
let load_popular = () => {
    // Reset all of the values of the variables after every click
    let url = "https://api.nytimes.com/svc/mostpopular/v2/viewed/7.json?api-key=pIoSq1UjWjXykHS64Jfb0BzSko9plm1v";
    let headlines = document.getElementById("headlines");
    headlines.innerHTML = "";

    fetchURL(url, headlines);
}

// Load search results for the first time
let make_query = (page_num) => {
    let query = document.getElementById("query").value;

    // Remove any potential spaces from search query
    query = query.split(" ").join("_");

    let url = `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${query}&page=${page_num}&api-key=pIoSq1UjWjXykHS64Jfb0BzSko9plm1v`;
    let headlines = document.getElementById("headlines");

    // Ensure the div still has the form inputs saved from before submission
    headlines.innerHTML = `<form><input type=\"text\" id=\"query\" value=\"${query}\"><input type=\"button\" value=\"Submit\" onClick=\"make_query(0)\"></form>`;
    
    fetch(url)
    .then(response => response.json())
    .then(data => {
        console.log(data);

        // Query the results of the search 
        data.response.docs.map(article => {
            
            // Create the anchor tag in the HTML file for the article URL
            let a = document.createElement("a");
            a.setAttribute("href", article.web_url);
            a.setAttribute("target", "_blank");
            a.innerHTML = article.headline.main;

            // Create a paragraph tag below the link to add a description
            let p = document.createElement("p");
            
            if (article.byline.original != null) {
                p.innerHTML = article.abstract + "<br><br><i>" + article.byline.original + "</i>";
            } else {
                p.innerHTML = article.abstract;
            }

            // Make sure there are pictures to accompany the articles
            if (article.multimedia.length > 0) {

                // Create an image tag
                let img = document.createElement("img");
                img.setAttribute("src", "http://www.nytimes.com/" + article.multimedia[0].url);
                img.setAttribute("alt", article.multimedia[0].caption);

                // Only append all elements if the title exists
                if (article.headline.main != "" && article.abstract != "") {
                    // Append the elements into the DOM
                    headlines.appendChild(img);
                    headlines.appendChild(a);
                    headlines.appendChild(p);
                }
            } else {
                // Only append all elements if the title exists
                if (article.headline.main != "" && article.abstract != "") {
                    // Append the elements into the DOM
                    headlines.appendChild(a);
                    headlines.appendChild(p);
                }
            }
        });

        if (data.response.meta.offset >= 10) {
            headlines.innerHTML += `<button class="pagination" onClick=make_query(${page_num - 1})>Previous Page</button>`;
        }
        if (data.response.meta.hits > data.response.meta.offset) {
            headlines.innerHTML += `<button class="pagination" onClick=make_query(${page_num + 1})>Next Page</button>`;
        }
    });
}

// Initialize the search parameters
let load_search = () => {
    // Reset all of the values of the variables after every click
    let headlines = document.getElementById("headlines");
    headlines.innerHTML = "";
    headlines.innerHTML = "<form><input type=\"text\" id=\"query\"><input type=\"button\" value=\"Submit\" onClick=\"make_query(0)\"></form>";
}

// Load an archive from 1852 to modern day using month and year parameters
let load_archive = () => {     
    let month_value = document.getElementById("month").value;
    let year = month_value.split("-")[0];
    let month = month_value.split("-")[1];

    // Remove the zero prefix for months 
    month = month.replace(/^0+/, ''); 

    let url = `https://api.nytimes.com/svc/archive/v1/${year}/${month}.json?api-key=pIoSq1UjWjXykHS64Jfb0BzSko9plm1v`;
    let headlines = document.getElementById("headlines");
    
    // Clear all previously loaded articles if a user is retyping the month parameters
    while (headlines.childNodes.length > 1) {
        headlines.removeChild(headlines.lastChild);
    }
    
    fetch(url)
    .then(response => response.json())
    .then(data => {
        console.log(data);

        // Query the results of the search for only 50 articles per search (hence the for loop) 
        for (let i = 0; i < 50; i++) {
            let article = data.response.docs[i];
            // Create the anchor tag in the HTML file for the article URL
            let a = document.createElement("a");
            a.setAttribute("href", article.web_url);
            a.setAttribute("target", "_blank");
            a.innerHTML = article.headline.main;

            // Create a paragraph tag below the link to add a description
            let p = document.createElement("p");
            
            if (article.byline.original != null) {
                p.innerHTML = article.abstract + "<br><br><i>" + article.byline.original + "</i>";
            } else {
                p.innerHTML = article.abstract;
            }

            // Make sure there are pictures to accompany the articles
            if (article.multimedia.length > 0) {

                // Create an image tag
                let img = document.createElement("img");
                img.setAttribute("src", "http://www.nytimes.com/" + article.multimedia[0].url);
                img.setAttribute("alt", article.multimedia[0].caption);

                // Only append all elements if the title exists
                if (article.headline.main != "" && article.abstract != "") {
                    // Append the elements into the DOM
                    headlines.appendChild(img);
                    headlines.appendChild(a);
                    headlines.appendChild(p);
                }
            } else {
                // Only append all elements if the title exists
                if (article.headline.main != "" && article.abstract != "") {
                    // Append the elements into the DOM
                    headlines.appendChild(a);
                    headlines.appendChild(p);
                }
            }
        }
    });
}

// Set archive parameters  
let find_archive = () => {
     // Reset all of the values of the variables after every click
     let headlines = document.getElementById("headlines");
     headlines.innerHTML = "";
     headlines.innerHTML = "<form><input type=\"month\" id=\"month\" min=\"1852-01\" max=\"2022-07\"><input onClick=\"load_archive()\" type=\"button\" value=\"Submit\"></form>";
}