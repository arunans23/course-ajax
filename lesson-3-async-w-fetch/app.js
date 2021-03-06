var unsplashKey = config.UNSPLASH_CLIENT_API_KEY;
var nytimesKey = config.NYTIMES_CLIENT_API_KEY;

(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText;
    const responseContainer = document.querySelector('#response-container');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;

        fetch(`https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`, {
          headers: {
              Authorization: 'Client-ID ' + unsplashKey
            }
        }).then(response => response.json())
        .then(addImage)
        .catch( e =>console.log(e));


        fetch(`http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=` + nytimesKey, {})
        .then(response => response.json())
        .then(addArticles)
        .catch(e => console.log(e));


    });

    function addImage(images){

      const firstImage = images.results[0];

      responseContainer.insertAdjacentHTML('afterbegin', `<figure>
              <img src="${firstImage.urls.small}" alt="${searchedForText}">
              <figcaption>${searchedForText} by ${firstImage.user.name}</figcaption>
          </figure>`
      );
    }



    function addArticles (articles) {

      let htmlContent = '';

      if (articles.response && articles.response.docs && articles.response.docs.length > 1){
        htmlContent = '<ul>' + articles.response.docs.map(article => `<li class="article">
          <h1><a href="${article.web_url}">${article.headline.main}</a></h2>
          <p>${article.snippet}</p>
        </li>`).join('') + '</ul>';
      } else {
        htmlContent = '<div class = "error-no-articles">No articles available</div>'
      }

      responseContainer.insertAdjacentHTML('beforeend', htmlContent);
    }
})();
