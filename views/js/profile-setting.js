let userName = document.getElementById('userName')
let userContact = document.getElementById('contact')
let userLocation = document.getElementById('location')
let userNameModal = document.getElementById('user-name-modal')
let userContactModal = document.getElementById('contact-modal')
let userLocationModal = document.getElementById('location-modal')



function updateUserName() {
    console.log(userName.value)
    UIkit.modal(userNameModal).hide();
    UIkit.notification("Mise à jour en cours...", "success")
    var data = {
        "userName": userName.value
    }
    axios.post('/upadte-name', data)
        .then(res => {
            window.location.reload(true)
        })
        .catch(err => {
            UIkit.notification("Echec de mise à jour: " + err, warning)
            console.log(err)
        })
}

function updateUserContact() {
    if (userContact.value.replace(/ /g, '').length !== 8) {
        UIkit.notification("Numero invalid !", "warning")
        return
    }
    UIkit.modal(userContactModal).hide();
    UIkit.notification("Mise à jour en cours...", "success")
    var data = {
        "phoneNumber": userContact.value
    }
    axios.post('/update-contact', data)
        .then(res => {
            console.log(res)
            window.location.reload(true)
        })
        .catch(err => {
            UIkit.notification("Echec de mise à jour: " + err, warning)
            console.log(err)
        })
}

function backTo() {
    window.history.back()
}

function updateUserLocation() {
    UIkit.modal(userLocationModal).hide();
    UIkit.notification("Mise à jour en cours...", "success")
    var data = {
        "location": userLocation.value
    }
    axios.post('/update-location', data)
        .then(res => {
            console.log(res)
            window.location.reload(true)
        })
        .catch(err => {
            UIkit.notification("Echec de mise à jour: " + err, warning)
            console.log(err)
        })
}


function readURL(input) {
    let imageUpload = document.getElementById("imageUpload");
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            let preview = document.getElementById("imagePreview");
            preview.style.backgroundImage = 'url(' + e.target.result + ')';
        }
        reader.readAsDataURL(input.files[0]);
        updateProfileImage(input.files[0])
    }
}
imageUpload.addEventListener('change', function () {
    readURL(this);
})


function updateProfileImage(file) {
    var formData = new FormData();
    formData.set("picture", file)
    axios.post("/update-profile-pic", formData)
        .then(res => {
            UIkit.notification("Photo de profile mis a jour avec succes");
            setTimeout(() => {
                console.log('picture updated...');
                window.location.reload(false);
            }, 2000);
        })
        .catch(err => {
            console.log(err)
        })
}

var contactCleave = new Cleave('.contact-input', {
    phone: true,
    phoneRegionCode: 'CI'
});