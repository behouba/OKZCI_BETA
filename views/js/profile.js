let switcher = document.getElementById("profile-switcher")


let createDate = document.getElementsByClassName('create-date')
for (let i = 0; i < createDate.length; i++) {
    let dateStr = createDate.item(i).innerHTML
    createDate.item(i).innerHTML = moment(dateStr, 'YYYY-MM-DD HH:mm Z', 'fr').fromNow()
}

function logout() {
    // google logout
    // gapi.auth2.init();
    // let auth2 = gapi.auth2.getAuthInstance();
    // auth2.signOut().then(function () {
    //   console.log("User signed out.");
    // });

    // server logout
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


function advert(ad) {
    console.log(ad)
}

function backTo() {
    window.history.back()
}