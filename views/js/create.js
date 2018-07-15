var app = new Vue({
    el: '#create',
    data: {
        selling: false,
        auction: false,
        categorie: '',
        steps: 0,
        vehicules: [{
                "name": "Voitures"
            },
            {
                "name": "Motos"
            },
            {
                "name": "Pièces et accessoires"
            },
        ],
        immobiliers: [{
                "name": "Ventes immobilières"
            },
            {
                "name": "Locations"
            },
            {
                "name": "Colocations"
            },
            {
                "name": "Bureaux et Commerces"
            }
        ],
        emplois: [{
            "name": "Offre d'emploi",
            "icon": "work"
        }],
        services: [{
                "name": "Prestations de services"
            },
            {
                "name": "Cours particuliers",
                "icon": "chalkboard-teacher"
            },
            {
                "name": "Covoiturage",
                "icon": "directions_car"
            },
            {
                "name": "Réparation et entretien de machines"
            },
            {
                "name": "Autres prestations de services",
                "icon": "servicestack"
            }
        ],
        mode: [{
                "name": "Vêtements et accesoires Homme",
                "icon": "tshirt"
            },
            {
                "name": "Vêtements et accesoires Femme",
                "icon": "tshirt"
            },
            {
                "name": "Vêtements et accesoires Enfants",
                "icon": "tshirt"
            },
            {
                "name": "Montres & Bijoux",
                "icon": "watch"
            },
            {
                "name": "Santé et beauté",
                "icon": "health"
            },
            {
                "name": "Equipement bébé",
                "icon": "icon"
            }
        ],
        home: [{
                "name": "Electroménager",
                "icon": "tv"
            },
            {
                "name": "Ameublement",
                "icon": "home"
            },
            {
                "name": "Décoration",
                "icon": "all_inbox"
            },
            {
                "name": "Jardinage",
                "icon": "local_florist"
            }

        ],
        electro: [{
                "name": "Audio er Videos",
                "icon": "film"
            },
            {
                "name": "Ordinateur de bureau"
            },
            {
                "name": "Ordinateur de portable"
            },
            {
                "name": "Consoles & Jeux vidéo",
                "icon": "gamepad"
            },
            {
                "name": "Téléphone",
                "icon": "mobile"
            },
            {
                "name": "Accesoires Téléphone et tablette",
                "icon": "usb"
            },
            {
                "name": "Accesoires Ordinateurs",
                "icon": "usb"
            }
        ],
        hobby: [{
                "name": "Livres",
                "icon": "book"
            },
            {
                "name": "Animaux",
                "icon": "paw"
            },
            {
                "name": "Vélos",
                "icon": "bicycle"
            },
            {
                "name": "Sports",
                "icon": "volleyball-ball"
            },
            {
                "name": "Jeux & Jouets",
                "icon": "puzzle-piece"
            },
        ],

        cities: [{
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
        ]
    },
    methods: {
        setCategory(c) {
            this.steps = 1
            this.categorie = c
            console.log(this.categorie)
            document.getElementById('select-category').style.display = 'none'
            document.getElementById('ad-form').style.display = 'block'
        },
        backTo() {
            if (this.steps === 1) {
                document.getElementById('select-category').style.display = 'block'
                document.getElementById('ad-form').style.display = 'none'
                this.steps = 0
                return
            }
            console.log("heloo")
            window.location.href = '/'
        }
    },
    updated() {
        console.log(this.categorie, 'updated')
    }
})

function handleFileSelect(event) {
    console.log(event)
    var input = this;
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        console.log(reader)
        reader.onload = (function (e) {
            var listItem = document.createElement('li');
            listItem.className = 'uk-width-1-4'
            listItem.innerHTML = ['<button type="button" class="remove_img_preview" uk-close></button><a href="#"><img src="', e.target.result, '" title="', escape(e.name), '" class="preview-img"></a>'].join('');
            document.getElementById('preview').appendChild(listItem);
        });
        reader.readAsDataURL(input.files[0]);
        console.log(input)
    }
}
$('#files').change(handleFileSelect);
$('#preview').on('click', '.remove_img_preview', function () {
    $(this).parent('li').remove();
    $(this).val("");
});