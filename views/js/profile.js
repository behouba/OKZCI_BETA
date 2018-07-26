let switcher = document.getElementById("profile-switcher")


let createDate = document.getElementsByClassName('create-date')
for (let i=0; i< createDate.length; i++){
    let dateStr = createDate.item(i).innerHTML
    createDate.item(i).innerHTML = moment(dateStr, 'YYYY-MM-DD HH:mm Z', 'fr').fromNow()
}


function advert(ad) {
    console.log(ad)
}
