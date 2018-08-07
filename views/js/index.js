let offset = Number(sessionStorage.getItem("offset")) || 0;
let search = document.getElementById("search");
let city = "";
let category = "";
let sort = "";
let adsField = document.getElementById("ads-field");
let loadButton = document.getElementById("loadButton");
let loadSpinner = document.getElementById("loadMore-spinner");
let step = Number(sessionStorage.getItem("step")) || 0;
let homeSpinner = document.getElementById("home-spinner");
let noMoreAds = document.getElementById("noMoreAds");
let sticky = document.getElementById("sticky");
let queryData = document.getElementById("query-data");
let desktopCurrentCategory = document.getElementById("desktop-current-category");
let desktopCategoryPicker = document.getElementById("desktop-category-picker");
let currentDesktopLocation = document.getElementById("desktop-current-location");
let desktopSearch = document.getElementById("desk-search");
let desktopSearchBar = document.getElementById("desk-search-bar");
let listingTitle = document.getElementById("listing-title");
let categoryTitle = document.getElementById("category-title")
let mobileSearchKeyword = document.getElementById("mobile-search-keyword")

let searchBar = document.getElementById("search-bar");
let searchNav = document.getElementById("search-nav");
let searchField = document.getElementById("search");
let searchCloseIcon = document.getElementById("search-close-icon");
let searchSetting = document.getElementById("search-setting");
let createDate = document.getElementsByClassName("create-date");



function homePageLoaded() {
  if (sessionStorage.getItem("data") !== null && step === 1) {
    adsField.innerHTML = sessionStorage.getItem("data");
    sessionStorage.removeItem("step");
    sessionStorage.removeItem("data");
    loadButton.style.display = "block"
    getSearchParams()
  } else {
    searchRequest()
  }
  displayListing()
}


function displayListing() {
  homeSpinner.style.display = "none";
  listingTitle.style.display = "flex";
  adsField.style.display = "flex";
  sticky.style.display = "block";
}
// init google auth api
function onLoad() {
  gapi.load("auth2", function () {
    gapi.auth2.init();
  });
}

function getSearchParams() {
  city = sessionStorage.getItem("city")
  category = sessionStorage.getItem("category")
  sort = sessionStorage.getItem("sort")
  search.value = sessionStorage.getItem("search")
  currentDesktopLocation.innerText = city.toUpperCase() || 'TOUTES LES VILLES'
  desktopCurrentCategory.innerText = category.toUpperCase() || 'TOUTES LES CATEGORIES'
  categoryTitle.innerText = category.toUpperCase() || 'TOUTES LES ANNONCES'
}

function incrementOffset() {
  sessionStorage.setItem("offset", String(offset += 8));
  offset = Number(sessionStorage.getItem("offset"))
  console.log("offset =", offset)
}

function logout() {
  axios
    .get("/logout")
    .then(res => {
      console.log("disconnected");
      window.location.href = "/";
    })
    .catch(err => {
      UIkit.notification("Erreur de reseau...", "warning");
    });
}

function offFunction() {
  UIkit.notification("Connection internet perdue !", "danger");
}

function goCreateAdPage() {
  sessionStorage.setItem("createAd", "createAd");
  window.location.href = "/create";
}

function saveData() {
  sessionStorage.setItem("step", "1");
  sessionStorage.setItem("data", adsField.innerHTML);
  sessionStorage.setItem("city", city);
  sessionStorage.setItem("category", category);
  sessionStorage.setItem("sort", sort);
  sessionStorage.setItem("search", search.value)
}

function setCategory(cat) {
  if (cat === "all") {
    category = "";
    categoryTitle.innerText = "TOUTES LES ANNONCES"
    desktopCurrentCategory.innerText = "TOUTES LES CATEGORIES"
  } else {
    category = cat;
    desktopCurrentCategory.innerText = cat.substring(0, 32).toUpperCase()
    categoryTitle.innerText = cat.toUpperCase()
  }
  console.log("categorie", category);
  UIkit.offcanvas("#categories-menu").hide();
  searchRequest();
}

function setCity(c) {
  if (c === "Partout") {
    city = "";
  } else {
    city = c;
  }
  console.log(city);
  searchRequest();
}

function setDeskCity(c) {
  console.log(c)
  if (c === "TOUTES LES VILLES") {
    city = "";
  } else {
    city = c;
  }
  currentDesktopLocation.innerText = c.toUpperCase()
  searchRequest();
}

function setSort(v) {
  sort = v;
  console.log(sort);
}

function setSortDesktop(v) {
  sort = v;
  console.log(sort);
  searchRequest();
}

function validateFilter() {
  UIkit.modal("#filter-modal").hide();
  searchRequest();
}

function searchRequest() {
  offset = 0;
  console.log("category =", category, "city =", city, "search =", search.value, "sort =", sort)
  window.scrollTo(0, 0);
  adsField.style.display = "none";
  homeSpinner.style.display = "block";
  loadButton.style.display = "none";
  listingTitle.style.display = 'flex';
  noMoreAds.style.display = 'none';
  let url =
    "/search?query=" +
    search.value +
    "&category=" +
    category +
    "&city=" +
    city +
    "&sort=" +
    sort +
    "&offset=" +
    0;
  axios
    .get(url)
    .then(res => {
      adsField.innerHTML = "";
      if (res.data) {
        console.log(res.data);
        res.data.forEach(ad => {
          adsField.innerHTML += createAdCard(ad);
        });
        incrementOffset()
        checkResult(res.data);
      } else {
        listingTitle.style.display = 'none'
        noMoreAds.style.display = "none";
        adsField.innerHTML = `<div class="uk-margin uk-text-center" style="margin-top:40px;">
        <h3>Malheureusement, aucune n'annonce ne correspond a votre recherche !</h3>
        <div class="uk-margin-small">
            <img src="/img/nothing_found.png" style="width: 200px; height: 200px">
        </div>
    </div>`;
        console.log("nothing found for this search ...");
      }
      homeSpinner.style.display = "none";
      adsField.style.display = "flex";
    })
    .catch(err => {
      console.log(err);
      homeSpinner.style.display = "none";
      adsField.style.display = "flex";
      UIkit.notification("Erreur de reseau...", "warning");
    });
}

searchBar.addEventListener("submit", e => {
  e.preventDefault();
  console.log(search.value);
  if (search.value !== "") {
    mobileSearchKeyword.innerHTML = `<h3 class="uk-align-left" id="keyword-title">Mot clé recherché: <strong style="color: #00aaff; font-weight: bold">« ${search.value} »</strong></h3>`
    mobileSearchKeyword.style.display = 'block';
  } else {
    mobileSearchKeyword.style.display = 'none';
  }
  searchRequest();
});

desktopSearchBar.addEventListener("submit", e => {
  e.preventDefault();
  search.value = desktopSearch.value
  searchRequest();
})

function deskSearBarBtn() {
  search.value = desktopSearch.value
  searchRequest();
}

function loadMore() {
  loadButton.style.display = "none";
  loadSpinner.style.display = "block";

  let url =
    "/search?query=" +
    search.value +
    "&category=" +
    category +
    "&city=" +
    city +
    "&sort=" +
    sort +
    "&offset=" +
    offset;
  axios
    .get(url)
    .then(res => {
      console.log(res.data);
      if (res.data) {
        res.data.forEach(a => {
          adsField.innerHTML += createAdCard(a);
        });
        incrementOffset()
      }
      checkResult(res.data);
    })
    .catch(err => {
      console.log(err);
      loadSpinner.style.display = "none";
      loadButton.style.display = "block";
      UIkit.notification("Erreur de reseau...", "warning");
    });
}

function checkResult(data) {
  loadSpinner.style.display = "none";

  if (data === null) {
    loadButton.style.display = "none";
    noMoreAds.style.display = "block";
  } else if (data.length < 8) {
    noMoreAds.style.display = "block";
    loadButton.style.display = "none";
  } else {
    loadButton.style.display = "block";
    noMoreAds.style.display = "none";
  }
}

function createAdCard(ad) {
  let html =
    `<div class="ad-card uk-width-1-2 uk-width-1-3@s uk-width-1-4@m">
                            <a href="/watch/?a=` +
    ad.short_id +
    `" onclick="saveData()">
                            <div class="uk-card uk-card-default uk-card-hover uk-card-small uk-margin-auto">
                                <div class="uk-card-media-top">
                                    <img src="` +
    ad.pictures[0] +
    `" alt="Error: Failed to load image" height="400">
                                    <div class="uk-overlay uk-overlay-default uk-dark uk-position-top">
                                        <span uk-icon="icon: location; ratio: 0.7"></span><small class="uk-text-bold">` +
    ad.city +
    `</small>
                                    </div>`;
  html += `</div>`;

  html +=
    `<div class="uk-card-body">
            <p class="uk-text-small uk-text-truncate"> ` +
    ad.title +
    `</p>`;
  if (ad.price > 0) {
    html += `<p class="uk-text-bold">` + numberWithCommas(ad.price) + ` FCFA</p>`;
  } else {
    html += `<br>`;
  }
  html +=
    ` <p class="uk-text-right uk-text-small create-date">` +
    moment(ad.created_at, "YYYY-MM-DD HH:mm Z", "fr").fromNow() +
    `</p>
                    </div>
                </div>
                </a>
                </div>`;

  return html;
}


function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


function clearSearch() {
  searchField.value = "";
  searchSetting.style.display = "inline-flex";
  searchCloseIcon.style.display = "none";
  mobileSearchKeyword.style.display = "none";
  searchRequest()
}

function searchBarFocus() {
  // console.log(searchField.value)
  if (searchField.value.length > 0) {
    searchCloseIcon.style.display = "inline-flex";
    searchSetting.style.display = "none";
  } else {
    searchCloseIcon.style.display = "none";
    searchSetting.style.display = "inline-flex";
  }
}
window.onscroll = function (e) {
  if (
    this.oldScroll > this.scrollY &&
    !(window.innerHeight + window.scrollY > document.body.clientHeight)
  ) {
    sticky.style.display = "block";
    sticky.className = "sticky";
  } else {
    sticky.style.display = "none";
  }
  this.oldScroll = this.scrollY;
};

for (let i = 0; i < createDate.length; i++) {
  let dateStr = createDate.item(i).innerHTML;
  createDate.item(i).innerHTML = moment(
    dateStr,
    "YYYY-MM-DD HH:mm Z",
    "fr"
  ).fromNow();
}