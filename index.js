const apiKey = '8f61f0b56aed48c28f218be4a6100ba2'; // Consider storing API key securely

const blogContainer = document.getElementById("blog-container");
const searchField = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");

async function fetchRandomNews() {
  try {
    if (!apiKey || apiKey.trim() === '') {
      throw new Error('Missing or invalid API key');
    }

    const apiUrl = `https://newsapi.org/v2/top-headlines?country=us&pageSize=10&apikey=${apiKey}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!data.status || data.status !== 'ok') {
      throw new Error(`API error: ${data.message}`);
    }

    return data.articles;
  } catch (error) {
    console.error("Error fetching random news:", error);
    return [];
  }
}

searchButton.addEventListener("click", async () => {
  const query = searchField.value.trim();

  if (query !== "") {
    try {
      const articles = await fetchNewsQuery(query);
      displayBlogs(articles);
    } catch (error) {
      console.error("Error fetching news by query:", error);
      // Consider displaying user-friendly error message here
    }
  }
});

async function fetchNewsQuery(query) {
  try {
    if (!apiKey || apiKey.trim() === '') {
      throw new Error('Missing or invalid API key');
    }

    const apiUrl = `https://newsapi.org/v2/everything?q=${query}&pageSize=10&apikey=${apiKey}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!data.status || data.status !== 'ok') {
      throw new Error(`API error: ${data.message}`);
    }

    return data.articles;
  } catch (error) {
    console.error("Error fetching news by query:", error);
    return [];
  }
}

function displayBlogs(articles) {
  blogContainer.innerHTML = "";

  articles.forEach((article) => {
    const blogCard = document.createElement("div");
    blogCard.classList.add('blog-card');

    const img = document.createElement("img");
    img.src = article.urlToImage || ''; // Set default if image URL is missing
    img.alt = article.title || 'News Article'; // Set default alt text

    const title = document.createElement("h2");
    const truncatedTitle = article.title.length > 30 ? article.title.slice(0, 30) + "..." : article.title;
    title.textContent = truncatedTitle;

    const description = document.createElement("p");
    const truncatedDesc = article.description?.length > 100 ? article.description.slice(0, 100) + "..." : article.description || ''; // Handle missing description and set default
    description.textContent = truncatedDesc;

    blogCard.appendChild(img);
    blogCard.appendChild(title);
    blogCard.appendChild(description);

    blogCard.addEventListener('click', () => {
      window.open(article.url, "_blank");
    });

    blogContainer.appendChild(blogCard);
  });
}

(async () => {
  try {
    const articles = await fetchRandomNews();
    displayBlogs(articles);
  } catch (error) {
    console.error("Error fetching random news:", error);
    // Consider displaying user-friendly error message here
  }
})();
