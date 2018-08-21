let switcher = document.getElementById("profile-switcher")
let userAdsSpinner = document.getElementById("userAdsSpinner")
let adsField = document.getElementById("ads-field")
let favField = document.getElementById("fav-field")
let countIndicator = document.getElementById("count-indicator")
let updateTip = document.getElementById("update-tip")

let adsFielInnerHtml = ''
let favFieldInnerHtml = ''


function getUserPageData(id) {
    console.log(id)
    axios.get('/me/ads?id=' + id)
        .then(res => {
            console.log(res.data)
            let ads = res.data.ads;
            let count = res.data.count;
            let fav = res.data.fav;
            if (count === 0) {
                countIndicator.innerText = `Vous n'avez aucune annonce en ligne`
                adsField.innerHTML = '<p class="uk-text-center">Aucune annonce.</p>'
            } else {
                updateTip.style.display = 'block'
                if (count === 1) {
                    countIndicator.innerText = `Vous avez 1 annonce en ligne`
                } else if (count > 1) {
                    countIndicator.innerText = `Vous avez ${count} annonces en ligne`
                }
                ads.forEach(ad => {
                    adsFielInnerHtml += createAdCard(ad, "update-p")
                })
                adsField.innerHTML = adsFielInnerHtml
            }
            if (fav === null) {
                favField.innerHTML = '<p class="uk-text-center">Aucune annonce ajoutée comme favoris.</p>'
            } else {
                fav.forEach(ad => {
                    favFieldInnerHtml += createAdCard(ad, "watch")
                })
                favField.innerHTML = favFieldInnerHtml
            }
        })
        .catch(err => {
            UIkit.notification(err, 'warning')
            console.log(err)
        })
}



function advert(ad) {
    console.log(ad)
}

function backTo() {
    window.history.back()
}

// window.onload = () => {
//     axios.get("/me/ads")
//         .then(res => {
//             console.log(res.data)
//         })
//         .catch(err => {
//             console.log(err)
//         })
// }


function createAdCard(ad, link) {
    let html = `<div class="ad-card uk-width-1-2 uk-width-1-3@s uk-width-1-6@m">
        <a href="/${link}/?a=${ad.short_id}" onclick="saveData()">
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
              <p class="uk-text-small uk-text-truncate"> ` +
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