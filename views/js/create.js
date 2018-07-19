'use strict'
let selling = document.getElementById("selling")
let sellingType = document.getElementById("selling-type")
let auction = document.getElementById("auction")
let simple = document.getElementById("price-simple")
let category = document.getElementById('select-category')
let adForm = document.getElementById('ad-form')
let adFormField = document.getElementById("ad-form-field")
let formTitle = document.getElementById("form-title")
let price = document.getElementById("price")
let priceValue = document.getElementById("prix")
let type = document.getElementById("ad-type")
let typeValue = document.getElementById("ad-type-value")
let title = document.getElementById("title")
let firstPrice = document.getElementById("first-price")
let auctionDuration = document.getElementById("auction-duration")
let preview = document.getElementById("preview")
let files = document.getElementById("files")
let steps = 0
let fileList = []
let selectedCategory = ''
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
   priceValue.value = ''
   firstPrice.value =''
   auctionDuration.value = ''
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
    selectedCategory = c
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
    if (fileList.length > 7){
        UIkit.notification('Nombre maximum d\'images pour une annonce atteint', 'warning')
        return
    }
    var input = this;
    let object = {};
    if (input.files && input.files[0]) {
        console.log(input.files[0])
        var reader = new FileReader();
        console.log(reader)
        reader.onload = (function (e) {
            object.file = input.files[0]
            object.data = e.target.result;
            var listItem = document.createElement('li');
            listItem.className = 'uk-width-1-4'
            listItem.innerHTML = ['<button type="button" class="remove_img_preview" uk-close></button><a href="#"><img src="', e.target.result, '" title="', escape(e.name), '" class="preview-img"></a>'].join('');
            document.getElementById('preview').appendChild(listItem);
        });
        reader.readAsDataURL(input.files[0]);
        fileList.push(object);
    }
}


files.addEventListener('change', handleFileSelect)

preview.addEventListener('click', function (e) {
    let index = 0
    let close = document.querySelector('.remove_img_preview')
    let src = e.target.nextSibling.children[0].src
    for (var file of fileList){
        if(file.data === src){
            fileList.splice(index, 1)
        }
        index++
    }
    e.target.parentElement.remove()
    console.log(fileList)
})




adFormField.addEventListener('submit', e => {
    e.preventDefault()
    var advert = new FormData()
    var formData = new FormData(adFormField)
    for(var pair of formData.entries()) {
        if (pair[1] !== "" && pair[0] !== 'files'){
            advert.append(pair[0], pair[1])
        }
     }
    console.log(sellingType.value)
    if (sellingType.value === 'auction') {
        console.log('is auction', Date.now().addHours(auctionDuration.value).toISOString())
        advert.set('auctionDuration', Date.now().addHours(auctionDuration.value).toISOString())
        advert.set('price', firstPrice.value)
    }
     advert.set('category', selectedCategory)
     advert.set('uuid', uuid.v4())
     advert.set('created_at', Date.now().toISOString())
     for (var file of fileList) {
         advert.append('files', file.file)
     }
     console.log(fileList)
    console.log(advert.getAll('files'))
    advert.forEach(e => console.log(e))

    axios.post('/create', advert, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
    })
})