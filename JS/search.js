function searching(input) {
    input.classList.add("active");
    var filter = input.value.toUpperCase();
    var gamesContainer = document.getElementById("games");
    var gameLinks = gamesContainer.getElementsByClassName("game-link");
    
    // Show/hide clear button
    var clearBtn = document.getElementById("clear-search");
    if (filter.length > 0) {
        clearBtn.style.display = "block";
    } else {
        clearBtn.style.display = "none";
    }
    
    // Filter games based on search input
    for (var i = 0; i < gameLinks.length; i++) {
        var gameTitle = gameLinks[i].querySelector(".game-title");
        if (gameTitle) {
            var txtValue = gameTitle.textContent || gameTitle.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                gameLinks[i].style.display = "";
            } else {
                gameLinks[i].style.display = "none";
            }
        }
    }
    
    // Show search results dropdown with matching games
    updateSearchResults(filter, gameLinks);
}

function updateSearchResults(filter, gameLinks) {
    var searchResults = document.getElementById("search-results");
    searchResults.innerHTML = "";
    
    if (filter.length === 0) {
        searchResults.style.display = "none";
        return;
    }
    
    var matches = [];
    for (var i = 0; i < gameLinks.length; i++) {
        var gameTitle = gameLinks[i].querySelector(".game-title");
        if (gameTitle) {
            var txtValue = gameTitle.textContent || gameTitle.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                matches.push({
                    title: txtValue,
                    url: gameLinks[i].href,
                    img: gameLinks[i].querySelector(".game-icon")?.src
                });
            }
        }
    }
    
    // Show top 5 matches in dropdown
    if (matches.length > 0) {
        searchResults.style.display = "block";
        matches.slice(0, 5).forEach(function(match) {
            var resultItem = document.createElement("a");
            resultItem.href = match.url;
            resultItem.className = "search-result-item";
            resultItem.innerHTML = `
                <img src="${match.img}" alt="${match.title}" class="search-result-icon">
                <span class="search-result-title">${match.title}</span>
            `;
            searchResults.appendChild(resultItem);
        });
    } else {
        searchResults.style.display = "block";
        searchResults.innerHTML = '<div class="no-results">No games found</div>';
    }
}

function clearSearch() {
    var searchBox = document.getElementById("search-box");
    searchBox.value = "";
    searching(searchBox);
    searchBox.focus();
}

function fun(obj){
   obj.classList.add("active");
}

// Close search results when clicking outside
document.addEventListener('click', function(event) {
    var searchBox = document.getElementById('search-box');
    var searchResults = document.getElementById('search-results');
    if (searchBox && searchResults && !searchBox.contains(event.target) && !searchResults.contains(event.target)) {
        searchResults.style.display = 'none';
    }
});