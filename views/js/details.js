let history = document.getElementById("history")
let messageBody = document.getElementById("message-body")
let fav = document.getElementById("fav")
let report = document.getElementById("report-body")

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

function sendMessageTo(email, name) {
    if (messageBody.value.length < 15) {
        return UIkit.notification('Message trop court', 'danger')
    }
    var msg = {
        "to": email,
        "ownerName": name,
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
            UIkit.notification('Echec d\'envoi', 'danger')
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
            UIkit.notification('Echec d\'envoi', 'danger')
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
            UIkit.notification({
                message: '<span uk-icon=\'icon: check\'></span> Ajoutée de votre liste de favoris',
                pos: 'bottom-center',
                status: 'success'
            })
            console.log(res)
        })
        .catch(err => {
            console.log(err)
            fav.classList.remove("fas")
            fav.classList.add("far")
        })
}

function removeFav(ad) {
    fav.classList.remove("fas")
    fav.classList.add("far")
    axios.post("/remove-fav", ad)
        .then(res => {
            UIkit.notification({
                message: '<span uk-icon=\'icon: check\'></span> Retirée de votre liste de favoris',
                pos: 'bottom-center',
                status: 'success'
            })
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
    document.getElementById("detail").style.display = 'block'
    document.getElementById("detail-spinner").style.display = 'none'
}