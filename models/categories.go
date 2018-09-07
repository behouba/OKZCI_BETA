package models

type catItem struct {
	Name          string
	Icon          string
	SubCategories []string
}

// Categories and their sub-categories
var Categories = []catItem{
	catItem{
		Name: "VEHICULES",
		Icon: "icons/car.svg",
		SubCategories: []string{
			"Voitures",
			"Motos et engins à roues",
			"Pièces et accessoires",
		},
	},
	catItem{
		Name: "ELECTRONIQUES",
		Icon: "icons/electronic.svg",
		SubCategories: []string{
			"Audios et Videos",
			"Ordinateurs de bureau",
			"Ordinateurs portables",
			"Consoles & Jeux vidéo",
			"Téléphones & Tablettes",
			"Accessoires Téléphones et tablettes",
			"Accessoires Ordinateurs",
		},
	},
	catItem{
		Name: "IMMOBILIER",
		Icon: "icons/house.svg",
		SubCategories: []string{
			"Ventes immobilières",
			"Locations immobilières",
			"Colocations",
			"Bureaux et Commerces",
		},
	},
	catItem{
		Name: "EMPLOIS",
		Icon: "icons/job.svg",
		SubCategories: []string{
			"Offres d'emplois",
			"Recherches d'emplois",
			"Formations",
		},
	},
	catItem{
		Name: "SERVICES",
		Icon: "icons/employee.svg",
		SubCategories: []string{
			"Prestations de services",
			"Cours particuliers",
			"Covoiturage",
			"Réparations et entretiens",
			"Autres prestations de services",
		},
	},
	catItem{
		Name: "MODE",
		Icon: "icons/fashion.svg",
		SubCategories: []string{
			"Vêtements et accessoires Hommes",
			"Vêtements et accessoires Femmes",
			"Vêtements et accessoires Enfants",
			"Montres & Bijoux",
			"Santé et beauté",
			"Equipements pour bébé",
		},
	},
	catItem{
		Name: "INTERIEUR",
		Icon: "icons/armchair.svg",
		SubCategories: []string{
			"Ameublement",
			"Décoration",
			"Jardinage",
		},
	},
	catItem{
		Name: "ÉLECTROMÉNAGERS",
		Icon: "icons/washer.svg",
		SubCategories: []string{
			"Téléviseurs",
			"Refrigerateurs",
			"Cuisinères",
			"Climatiseurs et Ventilateurs",
			"Machines à laver",
			"Autres électroménager",
		},
	},
	catItem{
		Name: "ÉVÉNEMENTS",
		Icon: "icons/fireworks.svg",
		SubCategories: []string{
			"Événements culturels",
			"Concerts",
			"Événements Sportifs",
			"Autres Événements",
		},
	},
	catItem{
		Name: "HOBBIES",
		Icon: "icons/guitar.svg",
		SubCategories: []string{
			"Livres",
			"Animaux",
			"Vélos",
			"Sports",
			"Jeux & Jouets",
		},
	},
	catItem{
		Name:          "AUTRES CATEGORIES",
		Icon:          "icons/alien.svg",
		SubCategories: []string{"Autres categories"},
	},
}
