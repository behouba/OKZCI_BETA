let searchField = document.getElementById("search")
let searchCloseIcon = document.getElementById("search-close-icon")
let searchSetting = document.getElementById("search-setting")

// var app = new Vue({
//     el: '#main',
//     data: {
//         images: ['https://goo.gl/2DXsM5', 'https://goo.gl/Hnfi2f', 'https://goo.gl/qh9ZFX', 'https://goo.gl/qF6Lry', 'https://goo.gl/ZVgEDX', 'https://goo.gl/CQhSSx', 'https://goo.gl/Tb3MSK', '', 'https://goo.gl/qh9ZFX', 'https://goo.gl/qF6Lry', 'https://goo.gl/ZVgEDX', 'https://goo.gl/CQhSSx', '', 'https://goo.gl/qh9ZFX', 'https://goo.gl/qF6Lry', 'https://goo.gl/ZVgEDX']
//     }
// })
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


