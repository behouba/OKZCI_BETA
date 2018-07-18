let selling = document.getElementById("selling")
let sellingType = document.getElementById("selling-type")
let auction = document.getElementById("auction")
let simple = document.getElementById("price-simple")
let category = document.getElementById('select-category')
let adForm = document.getElementById('ad-form')
let adFormField = document.getElementById("ad-form-field")
let formTitle = document.getElementById("form-title")
let price = document.getElementById("price")
let type = document.getElementById("ad-type")
let title = document.getElementById("title")
let steps = 0

function adType(value){
    if (value === 'Demande'){
        selling.style.display = 'none'
        auction.style.display = 'none'
        simple.style.display = 'none'
        sellingType.selectedIndex = 0
    } else if (value === 'Offre') {
        selling.style.display = 'block'
        auction.style.display = 'none'
        simple.style.display = 'block'
        sellingType.selectedIndex = 0
    }
}

function selectSellingType(value) {
   if (value === 'simple'){
       simple.style.display = 'block'
       auction.style.display = 'none'
   } else if (value === 'auction'){
        simple.style.display = 'none'
        auction.style.display = 'block'       
   } else if (value === 'others'){
       simple.style.display = 'none'
       auction.style.display = 'none'
   }
}
function displaySelling(){
    selling.style.display = 'block'
}
function hideSelling(){
    selling.style.display = 'none'
    auction.style.display = 'none'
    simple.style.display = 'none'
}
function setCategory(c) {
    formTitle.innerText = 'Annonce '+ c
    if (c === 'Locations' || c === 'Colocations' || c === 'Bureaux et Commerces') {
        price.innerText = 'Loyer'
    } else {
        price.innerText = 'Prix'
    }

    if (c === 'Offre d\'emploi'){
        simple.style.display = 'none'
        selling.style.display = 'none'
        type.style.display = 'none'
        title.innerText = 'Intitulé du poste'
    } else if (c === 'dons') {
        selling.style.display = 'none'
        type.style.display = 'none'
        title.innerText = 'Titre de l\'annonce'
        simple.style.display = 'none'
    } else {
        title.innerText = 'Titre de l\'annonce'
        type.style.display = 'block'
        selling.style.display = 'block'
        simple.style.display = 'block'
    }
    steps = 1
    console.log(c)
    auction.style.display = 'none'
    category.style.display = 'none'
    adForm.style.display = 'block'
}

function backTo() {
            if (steps === 1) {
                adFormField.reset()
                category.style.display = 'block'
                adForm.style.display = 'none'
                steps = 0
                return
            }
            window.location.href = '/'
}


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