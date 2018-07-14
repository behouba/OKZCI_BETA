let login = document.getElementById("login")
let recovery = document.getElementById("recovery")
let register = document.getElementById("register")
let verification = document.getElementById("verification")
let loginForm = document.getElementById("login-form")
let registerForm = document.getElementById("register-form")
let verifForm = document.getElementById("verification-form")
let loginEmail = document.getElementById("login-email")
let loginPassowd = document.getElementById("login-password")
let registrationName = document.getElementById("register-user_name")
let registrationEmail = document.getElementById("register-email")
let registrationPass1 = document.getElementById("register-password")
let registrationPass2 = document.getElementById("register-password2")
let pinCode = document.getElementById("pin-code")
let spinner = document.getElementById("auth-spinner")


function authLoading() {
   document.getElementById("auth").style.display = 'block'
   document.getElementById("auth-spinner").style.display = 'none'
}
function displayRecovery() {
    login.style.display = 'none'
    recovery.style.display = 'block'
}
function displayRegister() {
    login.style.display = 'none'
    register.style.display = 'block'
}
function closeRecovery() {
    recovery.style.display = 'none'
    login.style.display = 'block'
}
function closeRegister () {
    register.style.display = 'none'
    login.style.display = 'block'
}


// login submition 
loginForm.addEventListener('submit', (e) => {
    e.preventDefault()
   spinner.style.display = 'block'
   login.style.display = 'none'

   let userCredentials = {
       "email": loginEmail.value,
       "password": loginPassowd.value
   }

   axios.post("/login", userCredentials)
       .then(res => {
           window.location.href = "/"
       })
       .catch(err => {
           spinner.style.display = 'none'
           login.style.display = 'block'
           if (err.response) {
               let code = err.response.status
               console.log(code)
               if (code === 403){
                   UIkit.notification("Email ou mot de passe incorrect ", "warning");
               } else if (code === 500){
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
// email verification submition
verifForm.addEventListener('submit', (e) => {
    e.preventDefault()
   verification.style.display = 'none'
   spinner.style.display = 'block'

    let code = {
        "pin": pinCode.value
    }
    axios.post("/verification", code)
       .then(res => {
           console.log(res)
           window.location.href = "/"
       })
       .catch(err => {
           spinner.style.display = 'none'
           verification.style.display = 'block'
           if (err.response) {
               let code = err.response.status
               console.log(code)
               if (code === 403){
                   UIkit.notification("Code de verification incorrect !\nVerifiez votre boite email et reessayez svp !", "warning");
               } else if (code === 500){
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


// new user data submition to server
registerForm.addEventListener('submit', (e) => {
    e.preventDefault()

    if (registrationPass1.value !== registrationPass2.value) {
       UIkit.notification("Les mots de passe ne correspondent pas", "warning");
        return
    }

   register.style.display = 'none'
   spinner.style.display = 'block'

    let newUser = {
           "userName": registrationName.value,
           "email": registrationEmail.value,
           "password": registrationPass1.value,
       } 
    axios.post("/register", newUser)
       .then( res => {
           console.log(res)
           spinner.style.display = 'none'
           register.style.display = 'none'
           verification.style.display = 'block'
       })
       .catch(err => {
           console.log(err)
           spinner.style.display = 'none'
           register.style.display = 'block'
           if (err.response) {
               let code = err.response.status
               console.log(code)
               if (code === 403){
                   UIkit.notification("Cette addresse email est deja liée a compte. essayez de vous connectez ou recuperer votre mot de passe si vous l'avez perdu", "warning");
               } else if (code === 500){
                   UIkit.notification("Une erreur est survenue coté serveur ! \nVeillez reesayer svp", "warning");
               }
           } else if (err.request) {
               alert()
               console.log(err.request);
           } else {
               // Something happened in setting up the request that triggered an Error
               console.log('Error', error.message);
           }
       })
})
