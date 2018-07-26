let userName = document.getElementById('userName')
let userContact = document.getElementById('contact')
let userLocation = document.getElementById('location')



function updateUserName() {
    console.log(userName.value)
    var data = {
        "userName": userName.value
    }
    axios.post('/upadte-name', data)
        .then(res => {
            window.location.reload(true)
        })
        .catch(err => {
            console.log(err)
        })
}

function updateUserContact() {
    var data = {
        "phoneNumber": userContact.value
    }
    axios.post('/update-contact', data)
        .then(res => {
            console.log(res)
            window.location.reload(true)
        })
        .catch(err => {
            console.log(err)
        })
}

function updateUserLocation() {
    var data = {
        "location": userLocation.value
    }
    axios.post('/update-location', data)
        .then(res => {
            console.log(res)
            window.location.reload(true)
        })
        .catch(err => {
            console.log(err)
        })
}