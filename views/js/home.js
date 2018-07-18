var app = new Vue({
    el: '#main',
    data: {
        images: ['https://goo.gl/2DXsM5', 'https://goo.gl/Hnfi2f', 'https://goo.gl/qh9ZFX', 'https://goo.gl/qF6Lry', 'https://goo.gl/ZVgEDX', 'https://goo.gl/CQhSSx', 'https://goo.gl/Tb3MSK', '', 'https://goo.gl/qh9ZFX', 'https://goo.gl/qF6Lry', 'https://goo.gl/ZVgEDX', 'https://goo.gl/CQhSSx', '', 'https://goo.gl/qh9ZFX', 'https://goo.gl/qF6Lry', 'https://goo.gl/ZVgEDX']
    }
})

window.onscroll = function (e) {
    if (this.oldScroll > this.scrollY) {
        document.getElementById("sticky").className = 'sticky'
    } else {
        document.getElementById("sticky").className = 'hideSticky'
    }
    this.oldScroll = this.scrollY;
}
