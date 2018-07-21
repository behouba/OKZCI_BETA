let history = document.getElementById("history")


function goBack(){
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

function whatsAppShare() {
    let link = encodeURI('https://api.whatsapp.com/send?text=' + window.location.href)
    console.log(link)
    window.location.href = link
}

function detailPageLoaded() {
    document.getElementById("detail").style.display = 'block'
    document.getElementById("detail-spinner").style.display = 'none'
}