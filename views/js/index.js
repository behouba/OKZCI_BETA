
function homePageLoaded() {
    document.getElementById("main").style.display = 'block'
    document.getElementById("home-spinner").style.display = 'none'
}

// init google auth api
function onLoad() {
    gapi.load('auth2', function() {
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

function loadMore() {
    document.getElementById("loadMore").style.display = 'none'
    document.getElementById("loadMore-spinner").style.display = 'block'
    setTimeout(() => {
        document.getElementById("loadMore-spinner").style.display = 'none'   
        document.getElementById("loadMore").style.display = 'inline'
    }, 5000);
}
function detailPageLoaded() {
    document.getElementById("detail").style.display = 'block'
    document.getElementById("detail-spinner").style.display = 'none'
}

function createPageLoaded() {
    document.getElementById("create-spinner").style.display = 'none'
    document.getElementById("create").style.display = 'block'
}