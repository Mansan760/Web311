// Ensure the DOM is fully loaded before running the script
document.addEventListener("DOMContentLoaded", () => {
    // Check if we're on a project details page
    if (window.location.pathname.startsWith("/solutions/projects/")) {
      fetchRandomQuote();
    }
  });
  
  // Function to fetch and display a random quote
  function fetchRandomQuote() {
    fetch("https://dummyjson.com/quotes/random")
      .then(response => response.json())
      .then(data => {
        // Get the quote and author from the response data
        const quoteText = data.quote;
        const quoteAuthor = data.author;
  
        // Update the DOM elements with the quote and author
        const quoteTextElement = document.getElementById("quote-text");
        const quoteAuthorElement = document.getElementById("quote-author");
  
        if (quoteTextElement && quoteAuthorElement) {
          quoteTextElement.textContent = `"${quoteText}"`;
          quoteAuthorElement.textContent = `— ${quoteAuthor}`;
        }
      })
      .catch(error => {
        // In case of an error, display a fallback message
        console.error("Error fetching quote:", error);
  
        const quoteTextElement = document.getElementById("quote-text");
        const quoteAuthorElement = document.getElementById("quote-author");
  
        if (quoteTextElement && quoteAuthorElement) {
          quoteTextElement.textContent = "Sorry, we couldn't load a quote at this time.";
          quoteAuthorElement.textContent = "";
        }
      });
  }
  