let history = document.getElementById("history")
let messageBody = document.getElementById("message-body")
let fav = document.getElementById("fav")
let report = document.getElementById("report-body")
let adPrice = document.getElementById("ad-price")
let userName = document.getElementById("user-name")
let userEmail = document.getElementById("user-email")
let detailSpinner = document.getElementById("detail-spinner");
let detail = document.getElementById("detail");
let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

adPrice.innerText = numberWithCommas(adPrice.innerText)


function goBack() {
    window.history.back();
}

function showHistory() {
    let hDisplay = history.style.display
    if (hDisplay === 'none') {
        history.style.display = 'block'
    } else {
        history.style.display = 'none'
    }
}

function sendMessage1(userName, userEmail, OwnerEmail, OwnerName) {
    if (messageBody.value.length < 15) {
        return UIkit.notification('Message trop court', 'danger')
    }
    var msg = {
        "userName": userName,
        "userEmail": userEmail,
        "ownerEmail": OwnerEmail,
        "url": location.href,
        "ownerName": OwnerName,
        "body": messageBody.value
    }
    console.log(msg)
    UIkit.modal('#message-modal').hide()
    axios.post('/send-message', msg)
        .then(res => {
            messageBody.value = ''
            UIkit.notification('Votre message a bien été envoyé', 'success')
        })
        .catch(err => {
            if (err.response) {
                let code = err.response.status
                console.log(code)
                if (code === 403) {
                    UIkit.notification("Vous n'etes pas autorisé a envoyer un email, merci de vous connecter svp ", "warning");
                } else if (code === 500) {
                    UIkit.notification("Une erreur est survenue coté serveur ! \nVeillez reesayer svp", "warning");
                }
            }
        })
}

function sendMessage2(OwnerEmail, OwnerName) {
    if (messageBody.value.length < 15) {
        return UIkit.notification('Message trop court', 'danger')
    }
    if (userName.value === '' || userEmail.value === '') {
        return UIkit.notification('Veillez reseigner correctement votre nom et votre email', 'danger')
    }
    if (!userEmail.value.match(emailRegex)) {
        return UIkit.notification('Address email non valid', 'warning')
    }
    var msg = {
        "ownerEmail": OwnerEmail,
        "ownerName": OwnerName,
        "body": messageBody.value,
        "url": location.href
    }

    msg.userName = userName.value
    msg.userEmail = userEmail.value
    console.log(msg)
    UIkit.modal('#message-modal').hide()
    axios.post('/send-message', msg)
        .then(res => {
            messageBody.value = ''
            UIkit.notification('Votre message a bien été envoyé', 'success')
        })
        .catch(err => {
            if (err.response) {
                let code = err.response.status
                console.log(code)
                if (code === 403) {
                    UIkit.notification("Vous n'etes pas autorisé a envoyer un email, merci de vous connecter svp ", "warning");
                } else if (code === 500) {
                    UIkit.notification("Une erreur est survenue coté serveur ! \nVeillez reesayer svp", "warning");
                }
            }
        })
}

function sendReportMessage(shortID) {
    if (report.value.length < 15) {
        UIkit.notification('Message trop court', 'danger')
        return
    }
    let msg = {
        "body": report.value,
        "ShortID": shortID
    }
    UIkit.modal('#report-modal').hide()
    axios.post("/report", msg)
        .then(res => {
            report.value = ''
            UIkit.notification('Merci d\'avoir signalé nous allons verifier cette annonce', 'success')
        })
        .catch(err => {
            if (err.response) {
                let code = err.response.status
                console.log(code)
                if (code === 403) {
                    UIkit.notification("Vous n'etes pas autorisé a signaler une annonce, merci de vous connecter svp ", "warning");
                } else if (code === 500) {
                    UIkit.notification("Une erreur est survenue coté serveur ! \nVeillez reesayer svp", "warning");
                }
            }
        })

}

function addToFavorites(adID) {

    let ad = {
        "shortID": adID
    }
    console.log(adID)
    if (fav.classList.contains("far")) {
        addFav(ad)
    } else {
        removeFav(ad)
    }

}

function addFav(ad) {
    fav.classList.remove("far")
    fav.classList.add("fas")
    axios.post("/add-fav", ad)
        .then(res => {
            UIkit.notification('<span uk-icon=\'icon: check\'></span> Ajoutée à votre liste de favoris', 'success')
            console.log(res)
        })
        .catch(err => {
            console.log(err)
            UIkit.notification("Vous devez être inscrit avant d'ajouter des favoris", "danger")
            fav.classList.remove("fas")
            fav.classList.add("far")
        })
}

function removeFav(ad) {
    fav.classList.remove("fas")
    fav.classList.add("far")
    axios.post("/remove-fav", ad)
        .then(res => {
            UIkit.notification('<span uk-icon=\'icon: check\'></span> Retirée de votre liste de favoris', 'success')
            console.log(res)
        })
        .catch(err => {
            console.log(err)
            fav.classList.remove("far")
            fav.classList.add("fas")
        })
}

function whatsAppShare() {
    let link = encodeURI('https://api.whatsapp.com/send?text=' + window.location.href)
    console.log(link)
    window.location.href = link
}

function detailPageLoaded() {
    detail.style.display = 'block'
    detailSpinner.style.display = 'none'
}

function detailLoad() {
    detailSpinner.style.display = 'none';
    detail.style.display = 'block';
}