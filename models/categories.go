package models

// adverts main categories
type categories struct {
	Vehicules     []catItem
	Electroniques []catItem
	Immobilier    []catItem
	Services      []catItem
	Emplois       []catItem
	Maison        []catItem
	Mode          []catItem
	Hobby         []catItem
	Autres        []catItem
}

type catItem struct {
	Name string
	Icon string
}

// Categories and their sub-categories
var Categories = categories{
	Vehicules: []catItem{
		{Name: "Voitures"},
		{Name: "Motos"},
		{Name: "Pièces et accessoires"},
	},
	Immobilier: []catItem{
		{Name: "Ventes immobilières"},
		{Name: "Locations"},
		{Name: "Colocations"},
		{Name: "Bureaux et Commerces"},
	},
	Emplois: []catItem{
		{Name: "Offre d'emploi", Icon: "work"},
	},
	Services: []catItem{
		{Name: "Prestations de services"},
		{Name: "Cours particuliers", Icon: "chalkboard-teacher"},
		{Name: "Covoiturage", Icon: "directions_car"},
		{Name: "Réparation et entretien de machines"},
		{Name: "Autres prestations de services", Icon: "servicestack"},
	},
	Mode: []catItem{
		{Name: "Vêtements et accesoires Homme", Icon: "tshirt"},
		{Name: "Vêtements et accesoires Femme", Icon: "tshirt"},
		{Name: "Vêtements et accesoires Enfants", Icon: "tshirt"},
		{Name: "Montres & Bijoux", Icon: "watch"},
		{Name: "Santé et beauté", Icon: "health"},
		{Name: "Equipement bébé", Icon: "icon"},
	},
	Maison: []catItem{
		{Name: "Electroménager", Icon: "tv"},
		{Name: "Ameublement", Icon: "home"},
		{Name: "Décoration", Icon: "all_inbox"},
		{Name: "Jardinage", Icon: "local_florist"},
	},
	Electroniques: []catItem{
		{Name: "Audio et Videos", Icon: "film"},
		{Name: "Ordinateur de bureau"},
		{Name: "Ordinateur de portable"},
		{Name: "Consoles & Jeux vidéo", Icon: "gamepad"},
		{Name: "Téléphones & Tablettes", Icon: "mobile"},
		{Name: "Accesoires Téléphone et tablette", Icon: "usb"},
		{Name: "Accesoires Ordinateurs", Icon: "usb"},
	},
	Hobby: []catItem{
		{Name: "Livres", Icon: "book"},
		{Name: "Animaux", Icon: "paw"},
		{Name: "Vélos", Icon: "bicycle"},
		{Name: "Sports", Icon: "volleyball-ball"},
		{Name: "Jeux & Jouets", Icon: "puzzle-piece"},
	},
	Autres: []catItem{
		{Name: "Autres"},
	},
}
