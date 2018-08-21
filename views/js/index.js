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
let desktopCurrentCategory = document.getElementById(
  "desktop-current-category"
);
let desktopCategoryPicker = document.getElementById("desktop-category-picker");
let currentDesktopLocation = document.getElementById(
  "desktop-current-location"
);
let desktopSearch = document.getElementById("desk-search");
let desktopSearchBar = document.getElementById("desk-search-bar");
let listingTitle = document.getElementById("listing-title");
let categoryTitle = document.getElementById("category-title");
let mobileSearchKeyword = document.getElementById("mobile-search-keyword");
let adsTop = document.getElementById("ads-top");

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
    loadButton.style.display = "block";
    getSearchParams();
  } else {
    searchRequest();
  }
  displayListing();
}

function displayListing() {
  homeSpinner.style.display = "none";
  listingTitle.style.display = "flex";
  adsField.style.display = "flex";
  sticky.style.display = "block";
}

function getSearchParams() {
  city = sessionStorage.getItem("city");
  category = sessionStorage.getItem("category");
  sort = sessionStorage.getItem("sort");
  search.value = sessionStorage.getItem("search");
  desktopSearch.value = sessionStorage.getItem("search");
  currentDesktopLocation.innerText = city.toUpperCase() || "TOUTES LES VILLES";
  desktopCurrentCategory.innerText =
    category.toUpperCase() || "TOUTES LES CATEGORIES";
  categoryTitle.innerText = category.toUpperCase() || "TOUTES LES ANNONCES";
}

function incrementOffset() {
  sessionStorage.setItem("offset", String((offset += 60)));
  offset = Number(sessionStorage.getItem("offset"));
  // console.log("offset =", offset);
}


function offFunction() {
  UIkit.notification("Connection internet perdue !", "danger");
}

function loginBeforeCreate() {
  sessionStorage.setItem("createAd", "createAd");
  window.location.href = "/create";
}

function goCreateAdPage() {
  window.location.href = "/create";
}

function saveData() {
  sessionStorage.setItem("step", "1");
  sessionStorage.setItem("data", adsField.innerHTML);
  sessionStorage.setItem("city", city);
  sessionStorage.setItem("category", category);
  sessionStorage.setItem("sort", sort);
  sessionStorage.setItem("search", search.value);
}

function setCategory(cat) {
  if (cat === "all") {
    category = "";
    categoryTitle.innerText = "TOUTES LES ANNONCES";
    desktopCurrentCategory.innerText = "TOUTES LES CATEGORIES";
  } else {
    category = cat;
    desktopCurrentCategory.innerText = cat.toUpperCase();
    categoryTitle.innerText = cat.toUpperCase();
  }
  // console.log("categorie", category);
  UIkit.offcanvas("#categories-menu").hide();
  searchRequest();
}

function setCity(c) {
  if (c === "Partout") {
    city = "";
  } else {
    city = c;
  }
  // console.log(city);
  searchRequest();
}

function setDeskCity(c) {
  // console.log(c);
  if (c === "TOUTES LES VILLES") {
    city = "";
  } else {
    city = c;
  }
  currentDesktopLocation.innerText = c.toUpperCase();
  searchRequest();
}

function setSort(v) {
  sort = v;
  // console.log(sort);
}

function setSortDesktop(v) {
  sort = v;
  // console.log(sort);
  searchRequest();
}

function validateFilter() {
  UIkit.modal("#filter-modal").hide();
  searchRequest();
}

function searchRequest() {
  offset = 0;
  // console.log(
  //   "category =",
  //   category,
  //   "city =",
  //   city,
  //   "search =",
  //   search.value,
  //   "sort =",
  //   sort
  // );
  adsField.style.display = "none";
  homeSpinner.style.display = "block";
  loadButton.style.display = "none";
  listingTitle.style.display = "flex";
  noMoreAds.style.display = "none";
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
        // console.log(res.data);
        let ads = "";
        res.data.forEach(ad => {
          ads += createAdCard(ad);
        });
        adsField.innerHTML = ads;
        incrementOffset();
        checkResult(res.data);
      } else {
        // listingTitle.style.display = "none";
        noMoreAds.style.display = "none";
        adsField.innerHTML = `<div class="uk-margin uk-text-center" style="margin-top:40px;">
        <h4>Malheureusement, aucune annonce n'a été trouvée !</h4>
        <div class="uk-margin-small">
            <img src="img/nothing_found.png" style="width: 200px; height: 200px">
        </div>
        <p class="uk-text-small uk-text-muted">Modifiez les termes de votre recherche et réessayez.</p>
    </div>`;
        // console.log("nothing found for this search ...");
      }
      homeSpinner.style.display = "none";
      adsField.style.display = "flex";
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 300);
    })
    .catch(err => {
      // console.log(err);
      homeSpinner.style.display = "none";
      adsField.style.display = "flex";
      UIkit.notification("Erreur de reseau...", "warning");
    });
}

searchBar.addEventListener("submit", e => {
  e.preventDefault();
  // console.log(search.value);
  if (search.value !== "") {
    mobileSearchKeyword.innerHTML = `<h3 class="uk-align-left" id="keyword-title">Mot clé recherché: <strong style="color: #00aaff; font-weight: bold">« ${
      search.value
    } »</strong></h3>`;
    mobileSearchKeyword.style.display = "block";
  } else {
    mobileSearchKeyword.style.display = "none";
  }
  searchRequest();
});

desktopSearchBar.addEventListener("submit", e => {
  e.preventDefault();
  search.value = desktopSearch.value;
  searchRequest();
});

function deskSearBarBtn() {
  search.value = desktopSearch.value;
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
      // console.log(res.data);
      if (res.data) {
        let ads = "";
        res.data.forEach(a => {
          ads += createAdCard(a);
        });
        adsField.innerHTML += ads;
        incrementOffset();
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
  } else if (data.length < 60) {
    noMoreAds.style.display = "block";
    loadButton.style.display = "none";
  } else {
    loadButton.style.display = "block";
    noMoreAds.style.display = "none";
  }
}

function createAdCard(ad) {
  let html = `<div class="ad-card uk-width-1-2 uk-width-1-3@s uk-width-1-4@m">
      <a href="/watch/?a=${ad.short_id}" onclick="saveData()">
      <div class="uk-card uk-card-default uk-card-hover uk-card-small uk-margin-auto">
          <div class="uk-card-media-top">
              <img src="${
                ad.pictures[0] !== undefined ? ad.pictures[0] : "img/blank.png"
              }" onerror="this.src='img/blank.png'" alt="${ad.title}" height="400">
              <div class="uk-overlay uk-overlay-default uk-dark uk-position-top">
                  <span uk-icon="icon: location; ratio: 0.7"></span><small class="uk-text-bold">${
                    ad.city
                  }</small>
              </div></div>`;
  html +=
    `<div class="uk-card-body">
            <p class="uk-text-truncate"> ` +
    ad.title +
    `</p>`;
  if (ad.price > 0) {
    html +=
      `<p class="uk-text-bold">` + numberWithCommas(ad.price) + ` FCFA</p>`;
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
  searchRequest();
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