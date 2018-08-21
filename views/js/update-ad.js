let updateBtn = document.getElementById('update-btn')
let deleteBtn = document.getElementById('delete-btn')
let form = document.getElementById('form-field')
let fieldSet = document.getElementById('field-set')
let bottomBtns = document.getElementById('bottom-btn')
let main = document.getElementById("create")
let cancelBtn = document.getElementById("cancel-btn")
let title = document.getElementById('title')
let city = document.getElementById('city')
let detail = document.getElementById('details')
let price = document.getElementById('price')
let contact = document.getElementById('contact')
let modal = document.getElementById('delete-modal')


function backTo() {
    history.back()
}


function startUpdate() {
    updateBtn.style.display = 'none'
    deleteBtn.style.display = 'none'
    bottomBtns.style.display = 'flex'
    fieldSet.disabled = false
}

function cancelUpdate() {
    updateBtn.style.display = 'flex'
    deleteBtn.style.display = 'flex'
    bottomBtns.style.display = 'none'
    fieldSet.disabled = true
    UIkit.scroll(cancelBtn).scrollTo(main);
}

function updateAdData() {
    let ad = {
        "title": title.value,
        "city": city.value,
        "details": details.value,
        "price": price ? Number(price.value) : 0,
        "contact": contact.value
    }
    console.log(ad)
    axios.post('/update' + location.search, ad)
        .then(res => {
            UIkit.notification({
                message: '<span uk-icon=\'icon: check\'></span> Modifié',
                pos: 'bottom-center',
                status: 'success'
            })
            cancelUpdate()
            setTimeout(() => {
                location.href = '/me'
            }, 2000);
        })
        .catch(err => {
            UIkit.notification({
                message: '<span uk-icon=\'icon: check\'></span> Echec de mise a jour',
                pos: 'bottom-center',
                status: 'danger'
            })
            console.log('error', err)
        })
}

function deleteAd() {
    axios.post('/delete' + location.search)
        .then(res => {
            UIkit.modal(modal).hide();
            UIkit.notification({
                message: '<span uk-icon=\'icon: check\'></span> Supprimé',
                pos: 'bottom-center',
                status: 'success'
            })
            cancelUpdate()
            setTimeout(() => {
                window.location.href = '/me'
            }, 1000);
        })
        .catch(err => {
            UIkit.notification({
                message: '<span uk-icon=\'icon: check\'></span> Echec de suppression',
                pos: 'bottom-center',
                status: 'danger'
            })
            console.log('error', err)
        })
}
form.addEventListener('sbumit', e => {
    e.preventDefault()
})