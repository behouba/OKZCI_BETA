let create = document.getElementById("create")
let spinner = document.getElementById("create-spinner")

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
let type = document.getElementById("type")
let adType = document.getElementById("ad-type")
let city = document.getElementById("city")
let details = document.getElementById("details")
let typeValue = document.getElementById("ad-type-value")
let titleLabel = document.getElementById("title-label")
let firstPrice = document.getElementById("first-price")
let contact = document.getElementById("contact")
let title = document.getElementById("title")
let auctionDuration = document.getElementById("auction-duration")
let preview = document.getElementById("preview")
let files = document.getElementById("files")
let steps = 0
let fileList = []
let selectedCategory = ''


function setType(value){
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
   firstPrice.value = ''
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
        titleLabel.innerText = 'Intitulé du poste'
    } else if (c === 'dons') {
        selling.style.display = 'none'
        type.style.display = 'none'
        titleLabel.innerText = 'Titre de l\'annonce'
        simple.style.display = 'none'
    } else {
        titleLabel.innerText = 'Titre de l\'annonce'
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
                document.getElementById('preview').innerHTML = ''
                fileList = []
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
    let input = this;
    let object = {};
    if (input.files && input.files[0]) {
        console.log(input.files[0])
        let reader = new FileReader();
        console.log(reader)
        reader.onload = (function (e) {
            object.file = input.files[0]
            object.data = e.target.result;
            let listItem = document.createElement('li');
            listItem.className = 'uk-width-1-4'
            listItem.innerHTML = ['<button type="button" class="remove_img_preview" uk-close></button><a href="#"><img src="', e.target.result, '" titleLabel="', escape(e.name), '" class="preview-img"></a>'].join('');
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
    for (let file of fileList){
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
    spinner.style.display = 'block'
    create.style.display = 'none'

    let advert = new FormData()
    advert.set('ad_type', adType.value)
    advert.set('offer_type', sellingType.value)
    advert.set('title', title.value)
    advert.set('city', city.value)
    advert.set('details', details.value)
    advert.set('category', selectedCategory)
    advert.set('created_at', Date.now().toISOString())
    advert.set('price', priceValue.value)
    advert.set('contact', contact.value)
    
    if (sellingType.value === 'auction') {
        advert.set('end_date', Date.now().addHours(auctionDuration.value).toISOString())
        advert.set('price', firstPrice.value)
    }

    if (selectedCategory === 'dons') {
        advert.set('price', 0)
    }

     for (let file of fileList) {
         advert.append('files', file.file)
     }
    console.log(advert)
    advert.forEach(e => console.log(e))

    axios.post('/create', advert, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
    })
        .then(res => {
            window.location.href = '/'
            // UIkit.notification("CREATED", "succes");
        })
        .catch(err => {
            spinner.style.display = 'none'
            create.style.display = 'block'
            if (err.response) {
                let code = err.response.status
                console.log(code)
                if (code === 403) {
                    UIkit.notification("ceci est interdit", "warning");
                } else if (code === 500) {
                    UIkit.notification("Une erreur est survenue coté serveur ! \nVeillez reesayer svp", "warning");
                }
            } else if (err.request) {
                UIkit.notification(err.message)

            } else {
                // Something happened in setting up the request that triggered an Error
                UIkit.notification(err.message)
            }
        })
})