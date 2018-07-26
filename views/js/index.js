let offset = Number(sessionStorage.getItem('offset')) || 8
let adsField = document.getElementById("ads-field")
let loadButton = document.getElementById("loadButton")
let loadSpinner = document.getElementById("loadMore-spinner")
let step = Number(sessionStorage.getItem('step')) || 0
let homeSpinner = document.getElementById('home-spinner')
let noMoreAds = document.getElementById("noMoreAds")
let sticky = document.getElementById('sticky')

let searchNav = document.getElementById('search-nav')
let searchField = document.getElementById("search")
let searchCloseIcon = document.getElementById("search-close-icon")
let searchSetting = document.getElementById("search-setting")
let createDate = document.getElementsByClassName('create-date')


function homePageLoaded() {
    homeSpinner.style.display = 'none'
    adsField.style.display = 'flex'
    loadButton.style.display = 'block'
    sticky.style.display = 'block'
    if(sessionStorage.getItem('data') !== null && step === 1) {
        adsField.innerHTML = sessionStorage.getItem('data')
        sessionStorage.removeItem('step')
        sessionStorage.removeItem('data')
    } else {
        offset = 8
        sessionStorage.removeItem('offset')
    }
    console.log("step=",step, "offset=", offset)
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

function offFunction() {
    UIkit.notification('Connection internet perdue !', 'danger')
}

function goCreateAdPage(){
    sessionStorage.setItem('createAd', 'createAd')
    window.location.href = "/create"
}

function saveData() {
    sessionStorage.setItem('step', '1')
    sessionStorage.setItem('data', adsField.innerHTML)
}


function loadMore() {
    loadButton.style.display = 'none'
    loadSpinner.style.display = 'block'
    
    if(sessionStorage.getItem('offset') !== null) {
        offset = Number(sessionStorage.getItem('offset'))
    }
    axios.get('/load-more?offset=' + offset)
        .then(res => {
            console.log(res.data)
            if (!res.data) {
                loadSpinner.style.display = 'none'
                loadButton.style.display = 'none'
                noMoreAds.style.display = 'block'
                return
            }
            res.data.forEach( a => {
                adsField.innerHTML += createAdCard(a)
            })
            offset += 8
            sessionStorage.setItem('offset', String(offset))
            loadSpinner.style.display = 'none'
            loadButton.style.display = 'block'
        })
        .catch(err => {
            console.log(err)
            loadSpinner.style.display = 'none'
            loadButton.style.display = 'block'
        })
}

function createAdCard (ad) {
   let html = `<div class="ad-card uk-width-1-2 uk-width-1-3@s uk-width-1-4@m uk-width-1-6@l">
                            <a href="/watch/?a=` + ad.short_id + `" onclick="saveData()">
                            <div class="uk-card uk-card-default uk-card-small uk-margin-auto">
                                <div class="uk-card-media-top uk-inline">
                                    <img src="` + ad.pictures[0] + `" alt="Error: Failed to load image" height="400">
                                    <div class="uk-overlay uk-overlay-default uk-dark uk-position-top">
                                        <span uk-icon="icon: location; ratio: 0.7"></span><small class="uk-text-bold">`+ ad.city + `</small>
                                    </div>`

    if (ad.OfferType === 'auction') {
        html += `<div class="uk-overlay uk-overlay-default uk-dark uk-position-bottom">
                    <div uk-countdown="date: ` + ad.end_date + `" class="uk-text-center">
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
    if (ad.end_date) {
        html += `<div class="uk-card-badge uk-label"><small>Enchère</small></div>`
    }

    html += `<div class="uk-card-body">
            <p class="uk-text-small uk-text-truncate"> `+ ad.title + `</p>`
    if (ad.price > 0){
        html += `<p class="uk-text-bold">` + ad.price + ` FCFA</p>`
    } else if (ad.category === 'dons'){
        html += `<p class="uk-text-bold">Gratuit</p>`
    } else {
        html += `br`
    }
    html += ` <p class="uk-text-right uk-text-small create-date">` + moment(ad.created_at, 'YYYY-MM-DD HH:mm Z', 'fr').fromNow() + `</p>
                    </div>
                </div>
                </a>
                </div>`

    return html
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

    if (this.oldScroll > this.scrollY && !(window.innerHeight + window.scrollY > document.body.clientHeight)) {
        sticky.style.display = 'block'
        sticky.className = 'sticky'
    } else {
        sticky.style.display = 'none'
    }
    this.oldScroll = this.scrollY;
}


for (let i=0; i< createDate.length; i++){
    let dateStr = createDate.item(i).innerHTML
    createDate.item(i).innerHTML = moment(dateStr, 'YYYY-MM-DD HH:mm Z', 'fr').fromNow()
}
