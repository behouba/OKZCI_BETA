let searchField = document.getElementById("search")
let searchCloseIcon = document.getElementById("search-close-icon")
let searchSetting = document.getElementById("search-setting")
let createDate = document.getElementsByClassName('create-date')

moment.locale('fr');

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
    if (this.oldScroll > this.scrollY) {
        document.getElementById("sticky").className = 'sticky'
    } else {
        document.getElementById("sticky").className = 'hideSticky'
    }
    this.oldScroll = this.scrollY;
}

for (let i=0; i< createDate.length; i++){
    let dateStr = createDate.item(i).innerHTML
    console.log(dateStr)
    createDate.item(i).innerHTML = moment(dateStr, 'YYYY-MM-DD HH:mm Z', 'fr').fromNow()
}
// moment(.CreatedAt,'' , 'fr').fromNow()
