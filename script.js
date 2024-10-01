const API_KEY = "87265d8f2cf7fa2c7447d6bb3543fbe6"; // Update with your actual API key
const url = "https://gnews.io/api/v4/everything?";

// Load news when the window is loaded
window.addEventListener("load", () => fetchNews("India"));

// Reload the page
function reload() {
    window.location.reload();
}

// Fetch news articles based on the query
async function fetchNews(query) {
    try {
        const proxyUrl = "https://cors-anywhere.herokuapp.com/"; // CORS proxy URL
        const apiUrl = `${url}q=${query}&apikey=${API_KEY}`;
        
        const res = await fetch(proxyUrl + apiUrl);
        
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        console.log(data);  // Log the API response
        
        if (data.articles) {
            bindData(data.articles);
        } else {
            console.error("No articles found in the response.");
        }
    } catch (error) {
        console.error("Error fetching the news:", error);
    }
}

// Bind data to the HTML elements
function bindData(articles) {
    const cardsContainer = document.getElementById("cards-container");
    const newsCardTemplate = document.getElementById("template-news-card");

    cardsContainer.innerHTML = ""; // Clear existing content

    articles.forEach((article) => {
        if (!article.image) return; // Check for image availability
        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article);
        cardsContainer.appendChild(cardClone);
    });
}

// Fill the data in the news card template
function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector("#news-img");
    const newsTitle = cardClone.querySelector("#news-title");
    const newsSource = cardClone.querySelector("#news-source");
    const newsDesc = cardClone.querySelector("#news-desc");

    newsImg.src = article.image; // Update image source
    newsTitle.innerHTML = article.title;
    newsDesc.innerHTML = article.description;

    const date = new Date(article.publishedAt).toLocaleString("en-US", {
        timeZone: "Asia/Jakarta",
    });

    newsSource.innerHTML = `${article.source.name} · ${date}`;

    cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.url, "_blank"); // Open article in a new tab
    });
}

// Handle navigation item click
let curSelectedNav = null;
function onNavItemClick(id) {
    fetchNews(id);
    const navItem = document.getElementById(id);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = navItem;
    curSelectedNav.classList.add("active");
}

// Search functionality
const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener("click", () => {
    const query = searchText.value;
    if (!query) return; // Avoid empty searches
    fetchNews(query);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = null;
});
