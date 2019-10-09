let page = 1;
let sourceName;
let currUrl;

let url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=7ffed3886b7749c8b0453911c0a36807`;

async function fetchNews(param) {
  let result = await fetch(param);
  let data = await result.json();
  currNews = data;
  console.log(currUrl);
  return data;
}

const render = (arr, command) => {
  let articles = arr.articles;
  let before = document.getElementById("board").innerHTML;
  let count = document.getElementById("totalResult").innerHTML;

  let html = articles
    .map(item => {
      return `
            <div class="col-lg-4 col-md-12 col-sm-12 custom-margin">
            <div class="card">
                <div class="image-holder"><img src="${
                  item.urlToImage
                }" class="card-img-top" alt="..." /></div>
                <div class="card-body">
                <h5 class="card-title">${item.title}</h5>
                <p class="card-text">
                    ${item.content}
                </p>
                
                <a href="${item.url}" class="btn btn-primary">Go to article</a>
                </div>
                <div class="card-footer text-muted">
                    Created <em>${moment(item.publishedAt).fromNow()}</em>
                </div>
            </div>
            </div>
            `;
    })
    .join("");
  command == "more"
    ? (document.getElementById("board").innerHTML = before.concat(html))
    : (document.getElementById("board").innerHTML = html);
  command == "more"
    ? (document.getElementById("totalResult").innerHTML =
        articles.length + parseInt(count))
    : (document.getElementById("totalResult").innerHTML = articles.length);
};

//get all soruces and add to drop down
const getSources = (arr, command) => {
  let temp = arr.map(item => {
    return item.source.name;
    //   return `<a class="dropdown-item" href="#">${item.source.name}</a>`;
  });
  const beforeHtml = document.getElementById('dropdown-source').innerHTML;
  console.log(beforeHtml)
  const html = temp
    .map(item => {
      return `<li class="dropdown-item" onclick='filterSource("${item}")'>${item}</li>`;
    })
    .filter(onlyUnique)
    .join("");
  command == "more" ? document.getElementById("dropdown-source").innerHTML = beforeHtml + html : document.getElementById("dropdown-source").innerHTML = html;
  console.log(html);
};

async function getNews(a, command) {
  const news = await fetchNews(a);
  currUrl = a;
  console.log("getNews", news);
  if (news.status === "error") {
    if (news.code == "maximumResultsReached") alert(news.message);
    return;
  }
  render(news, command);
  getSources(news.articles, command);
}

function searchInput(e) {
  let val = document.getElementById("search-input").value;
  let tempURL = `https://newsapi.org/v2/everything?q=${val}&sortBy=popularity&apiKey=7ffed3886b7749c8b0453911c0a36807`;
  getNews(tempURL);
}

//load more articles
const loadMore = () => {
  page += 1;
  url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=7ffed3886b7749c8b0453911c0a36807&page=${page}`;
  console.log(url);
  getNews(url, "more");
};

//remove duplicated value
function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

//filter by source in current page
const filterSource = async source => {
  let filteredArray = await fetchNews(currUrl);
  console.log(currNews)
  filteredArray.articles = currNews.articles.filter(
    item => item.source.name == source
  );
  
  render(filteredArray);
};

//first render
getNews(url);
