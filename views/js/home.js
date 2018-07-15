var app = new Vue({
    el: '#main',
    data: {
        villes: [{
                "name": "Abidjan"
            },
            {
                "name": "Bouaké"
            },
            {
                "name": "Daloa"
            },
            {
                "name": "Yamoussoukro"
            },
            {
                "name": "San-Pédro"
            },
            {
                "name": "Divo"
            },
            {
                "name": "Divo"
            },
            {
                "name": "Korhogo"
            },
            {
                "name": "Anyama"
            },
            {
                "name": "Abengourou"
            },
            {
                "name": "Man"
            },
            {
                "name": "Gagnoa"
            },
            {
                "name": "Soubré"
            },
            {
                "name": "Agboville"
            },
            {
                "name": "Dabou"
            },
            {
                "name": "Grand-Bassam"
            },
            {
                "name": "Bouaflé"
            },
            {
                "name": "Issia"
            },
            {
                "name": "Sinfra"
            },
            {
                "name": "Katiola"
            },
            {
                "name": "Bingerville"
            },
            {
                "name": "Adzopé"
            },
            {
                "name": "Séguéla"
            },
            {
                "name": "Bondoukou"
            },
            {
                "name": "Oumé"
            },
            {
                "name": "Ferkessedougou"
            },
            {
                "name": "Dimbokro"
            },
            {
                "name": "Odienné"
            },
            {
                "name": "Duékoué"
            },
            {
                "name": "Danané"
            },
            {
                "name": "Tingréla"
            },
            {
                "name": "Guiglo"
            },
            {
                "name": "Boundiali"
            },
            {
                "name": "Agnibilékrou"
            },
            {
                "name": "Daoukro"
            },
            {
                "name": "Vavoua"
            },
            {
                "name": "Zuénoula"
            },
            {
                "name": "Tiassalé"
            },
            {
                "name": "Toumodi"
            },
            {
                "name": "Akoupé"
            },
            {
                "name": "Lakota"
            }
        ],
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
