let login = document.getElementById("login")
let recovery = document.getElementById("recovery")
let register = document.getElementById("register")
let verification = document.getElementById("verification")
let recoveryVerification = document.getElementById("recovery-verification")
let updataPassword = document.getElementById("update-password")


let loginForm = document.getElementById("login-form")
let registerForm = document.getElementById("register-form")
let verifForm = document.getElementById("verification-form")
let recoveryForm = document.getElementById("recovery-form")
let recoveryVerificationForm = document.getElementById("recovery-verification-form")
let updataPasswordForm = document.getElementById("update-password-form")


let loginEmail = document.getElementById("login-email")
let loginPassowd = document.getElementById("login-password")
let newPassword = document.getElementById("new-password")
let newPassword2 = document.getElementById("new-password2")


let registrationName = document.getElementById("register-user_name")
let registrationEmail = document.getElementById("register-email")
let registrationPass1 = document.getElementById("register-password")
let registrationPass2 = document.getElementById("register-password2")
let recoveryEmail = document.getElementById("recovery-email")
let pinCode = document.getElementById("pin-code")
let recoveryPin = document.getElementById("recovery-pin-code")
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

function closeRegister() {
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
            if (sessionStorage.getItem('createAd') === 'createAd') {
                sessionStorage.removeItem('createAd')
                window.location.href = "/create"
            } else {
                window.location.href = "/"

            }
        })
        .catch(err => {
            spinner.style.display = 'none'
            login.style.display = 'block'
            if (err.response) {
                let code = err.response.status
                console.log(code)
                if (code === 403) {
                    UIkit.notification("Email ou mot de passe incorrect ", "warning");
                } else if (code === 409) {
                    UIkit.notification("Cette addresse email correspond a un compte enregistré avec Google ou Facebook essayez de vous connecter avec Facebook ou Google", "warning")
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
            if (sessionStorage.getItem('createAd') === 'createAd') {
                sessionStorage.removeItem('createAd')
                window.location.href = "/create"
            } else {
                window.location.href = "/"

            }
        })
        .catch(err => {
            spinner.style.display = 'none'
            verification.style.display = 'block'
            if (err.response) {
                let code = err.response.status
                console.log(code)
                if (code === 403) {
                    UIkit.notification("Code de verification incorrect !\nVerifiez votre boite email et reessayez svp !", "warning");
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

// password update 

updataPasswordForm.addEventListener('submit', e => {
    e.preventDefault()
    if (newPassword.value.length < 4) {
        UIkit.notification("le mot de passe doit contenir au moins 4 charactères", "warning")
        return
    }
    if (newPassword.value != newPassword2.value) {
        UIkit.notification("Les mots de passe sont differents", "warning")
        return
    }
    if (sessionStorage.getItem('recovery-email') === null) {
        updataPassword.style.display = 'none'
        recovery.style.display = 'block'
        return
    }
    updataPassword.style.display = 'none'
    spinner.style.display = 'block'
    let user = {
        "email": sessionStorage.getItem('recovery-email'),
        "password": newPassword.value
    }
    axios.post("/update-password", user)
        .then(res => {
            // spinner.style.display = 'none'
            // updataPassword.style.display = 'block'
            sessionStorage.removeItem('recovery-email')
            if (sessionStorage.getItem('createAd') === 'createAd') {
                sessionStorage.removeItem('createAd')
                window.location.href = "/create"
            } else {
                window.location.href = "/"

            }
        })
        .catch(err => {
            spinner.style.display = 'none'
            updataPassword.style.display = 'block'
            UIkit.notification("Erreur ! Veillez reessayer")
        })
})


// password recovery validation
recoveryVerificationForm.addEventListener('submit', e => {
    e.preventDefault()
    let c = {
        "pin": recoveryPin.value
    }
    recoveryVerification.style.display = 'none'
    spinner.style.display = 'block'
    axios.post("/recovery-verification", c)
        .then(res => {
            console.log(res)
            spinner.style.display = 'none'
            updataPassword.style.display = 'block'
        })
        .catch(err => {
            spinner.style.display = 'none'
            recoveryVerification.style.display = 'block'
            console.log(err)
            if (err.response) {
                let code = err.response.status
                console.log(code)
                if (code === 403) {
                    UIkit.notification("code fourni est incorrect", "warning");
                } else if (code === 500) {
                    UIkit.notification("Une erreur est survenue coté serveur ! \nVeillez reesayer svp", "warning");
                } else if (code === 409) {
                    UIkit.notification("code fourni est incorrect", "warning");
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


// user password recovery
recoveryForm.addEventListener('submit', e => {
    e.preventDefault()
    let v = {
        "email": recoveryEmail.value
    }
    sessionStorage.setItem('recovery-email', v.email)
    recovery.style.display = 'none'
    spinner.style.display = 'block'
    axios.post("/recovery", v)
        .then(res => {
            spinner.style.display = 'none'
            recoveryVerification.style.display = 'block'
            console.log(res)
        })
        .catch(err => {
            spinner.style.display = 'none'
            recovery.style.display = 'block'
            console.log(err)
            if (err.response) {
                let code = err.response.status
                console.log(code)
                if (code === 403) {
                    UIkit.notification("Cette addresse email n'est pas enregistrée veillez creer un nouveau compte", "warning");
                } else if (code === 500) {
                    UIkit.notification("Une erreur est survenue coté serveur ! \nVeillez reesayer svp", "warning");
                } else if (code === 409) {
                    UIkit.notification("Cette addresse email est enregistré avec google ou facebook", "warning");
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

// new user data submition to server
registerForm.addEventListener('submit', (e) => {
    e.preventDefault()

    if (registrationPass1.value.length < 4) {
        UIkit.notification("Choisissez un mot de passe d'au moins 4 charactères", "warning");
        return
    }

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
        .then(res => {
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
                if (code === 403) {
                    UIkit.notification("Cette addresse email est deja liée a compte. essayez de vous connectez ou recuperer votre mot de passe si vous l'avez perdu", "warning");
                } else if (code === 500) {
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


// google sign in
function onGoogleSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();

    var user = {
        "userName": profile.getName(),
        "email": profile.getEmail(),
        "picture": profile.getImageUrl()
    }
    axios.post("/google-auth", user)
        .then(res => {
            console.log(res)
            if (sessionStorage.getItem('createAd') === 'createAd') {
                sessionStorage.removeItem('createAd')
                window.location.href = "/create"
            } else {
                window.location.href = "/"

            }
        })
        .catch(err => {
            spinner.style.display = 'none'
            login.style.display = 'block'
            if (err.response) {
                let code = err.response.status
                console.log(code)
                if (code === 403) {
                    UIkit.notification("Cette addresse gmail est deja enregistré sur le site\nVeillez vous connectez", "warning");
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
}


// facebook sigin
function onFacebookLogin() {
    FB.login(function (response) {
        if (response.authResponse) {
            console.log('Welcome!  Fetching your information.... ');
            FB.api('/me', {
                fields: 'name, email, picture.width(320).height(320)'
            }, function (response) {
                console.log(response);
                let user = {
                    "userName": response.name,
                    "email": response.email || response.id,
                    "picture": response.picture.data.url
                }
                console.log(user)
                axios.post("/facebook-auth", user)
                    .then(res => {
                        console.log(res)
                        if (sessionStorage.getItem('createAd') === 'createAd') {
                            sessionStorage.removeItem('createAd')
                            window.location.href = "/create"
                        } else {
                            window.location.href = "/"
                        }
                    })
                    .catch(err => {
                        spinner.style.display = 'none'
                        login.style.display = 'block'
                        if (err.response) {
                            let code = err.response.status
                            console.log(code)
                            if (code === 403) {
                                UIkit.notification("Cette addresse email est deja enregistré sur le site\nVeillez vous connecter", "warning");
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
            });
        } else {
            console.log('User cancelled login or did not fully authorize.');
            UIkit.notification("Echec de connexion verifiez que votre navigateur ne bloque pas l'ouverture de nouveau onglets", "warning")
        }
    }, {
        scope: 'email'
    });
}