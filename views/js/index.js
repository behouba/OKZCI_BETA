let offset = 20
let adsField = document.getElementById("ads-field")
let loadButton = document.getElementById("loadButton")
let loadSpinner = document.getElementById("loadMore-spinner")

let searchField = document.getElementById("search")
let searchCloseIcon = document.getElementById("search-close-icon")
let searchSetting = document.getElementById("search-setting")
let createDate = document.getElementsByClassName('create-date')


function homePageLoaded() {
    document.getElementById("main").style.display = 'block'
    document.getElementById("home-spinner").style.display = 'none'
}

// init google auth api
function onLoad() {
    gapi.load('auth2', function () {
        gapi.auth2.init();
    });
}

function logout() {
    // google logout
    gapi.auth2.init()
    let auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
    });

    // server logout
    axios.get("/logout")
        .then(res => {
            console.log("disconnected")
            window.location.href = "/"
        })
        .catch(err => {
            UIkit.notification("Erreur de reseau...", "warning")
        })
}


function createPageLoaded() {
    document.getElementById("create-spinner").style.display = 'none'
    document.getElementById("create").style.display = 'block'
}

function goCreateAdPage(){
    sessionStorage.setItem('createAd', 'createAd')
    window.location.href = "/create"
}


function loadMore() {
    loadButton.style.display = 'none'
    loadSpinner.style.display = 'block'
    setTimeout(x => {

    axios.get('/load-more?offset=' + offset)
        .then(res => {
            console.log(res)
            res.data.forEach( a => {
                adsField.appendChild(createAdCard(a))
            })
            offset += 2
            loadSpinner.style.display = 'none'
            loadButton.style.display = 'inline-block'
        })
        .catch(err => {
            console.log(err)
            loadSpinner.style.display = 'none'
            loadButton.style.display = 'inline-block'
        })
        
    }, 1000)
}

function createAdCard (ad) {
   let html = `<div class="ad-card uk-width-1-2 uk-width-1-3@s uk-width-1-4@m uk-width-1-6@l">
                            <a href="/watch/?a=` + ad.ShortID + `">
                            <div class="uk-card uk-card-default uk-card-small uk-margin-auto">
                                <div class="uk-card-media-top uk-inline">
                                    <img src="` + ad.Pictures[0] + `" alt="Error: Failed to load image" height="400">
                                    <div class="uk-overlay uk-overlay-default uk-dark uk-position-top">
                                        <span uk-icon="icon: location; ratio: 0.7"></span><small class="uk-text-bold">`+ ad.City + `</small>
                                    </div>`

    if (ad.OfferType === 'auction') {
        html += `<div class="uk-overlay uk-overlay-default uk-dark uk-position-bottom">
                    <div uk-countdown="date: ` + ad.EndDate + `" class="uk-text-center">
                        <span class="uk-countdown-number uk-countdown-days"></span>
                        <span class="uk-countdown-separator">:</span>
                        <span class="uk-countdown-number uk-countdown-hours"></span>
                        <span class="uk-countdown-separator">:</span>
                        <span class="uk-countdown-number uk-countdown-minutes"></span>
                        <span class="uk-countdown-separator">:</span>
                        <span class="uk-countdown-number uk-countdown-seconds"></span>
                    </div>
                </div>`
    }
    html += `</div>`
    if (ad.EndDate) {
        html += `<div class="uk-card-badge uk-label"><small>Enchère</small></div>`
    }

    html += `<div class="uk-card-body">
            <p class="uk-text-small uk-text-truncate"> `+ ad.Title + `</p>`
    if (ad.Price > 0){
        html += `<p class="uk-text-bold">` + ad.Price + ` FCFA</p>`
    } else if (ad.Category === 'dons'){
        html += `<p>Gratuit</p>`
    } else {
        html += `br`
    }
    html += ` <p class="uk-text-right uk-text-small create-date">` + moment(ad.CreatedAt, 'YYYY-MM-DD HH:mm Z', 'fr').fromNow() + `</p>
                    </div>
                </div>
                </a>
                </div>`

    let template = document.createElement('template');
    template.innerHTML = html;
    return template.content.firstChild;
}

function clearSearch(){
    searchField.value = ''
    searchSetting.style.display = 'inline-flex'
    searchCloseIcon.style.display = 'none'
}

function searchBarFocus(){
    // console.log(searchField.value)
    if (searchField.value.length > 0) {
        searchCloseIcon.style.display = 'inline-flex'
        searchSetting.style.display = 'none'
    } else {
        searchCloseIcon.style.display = 'none'
        searchSetting.style.display = 'inline-flex'
    }
}
window.onscroll = function (e) {
    if (this.oldScroll > this.scrollY) {
        document.getElementById("sticky").className = 'sticky'
    } else {
        document.getElementById("sticky").className = 'hideSticky'
    }
    this.oldScroll = this.scrollY;
}

for (let i=0; i< createDate.length; i++){
    let dateStr = createDate.item(i).innerHTML
    console.log(dateStr)
    createDate.item(i).innerHTML = moment(dateStr, 'YYYY-MM-DD HH:mm Z', 'fr').fromNow()
}

