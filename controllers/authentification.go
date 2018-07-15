package controllers

import (
	"log"
	"math/rand"
	"net/smtp"
	"strconv"

	"github.com/behouba/OKZ_BETA_0.01/models"
	"golang.org/x/crypto/bcrypt"

	"github.com/kataras/iris"
)

func checkIfLoggedIn(ctx iris.Context) {
	session := models.Sess.Start(ctx).GetString("email")
	if session == "" {
		ctx.View("index.html")
		return
	}
	ctx.Next()
}

func blockAuthPages(ctx iris.Context) {
	session := models.Sess.Start(ctx).GetString("email")
	if session != "" {
		ctx.Redirect("/", iris.StatusSeeOther)
		return
	}
	ctx.Next()
}

func login(ctx iris.Context) {
	ctx.View("login.html")
}

func googleAuth(ctx iris.Context) {
	session := models.Sess.Start(ctx)
	var user models.User
	ctx.ReadJSON(&user)
	// set auth type as google
	user.Auth = "google"
	err := user.AuthenticateGoogleUser()
	if err != nil {
		log.Println(err)
		ctx.StatusCode(iris.StatusForbidden)
		return
	}
	log.Println("google user is authenticated...")
	session.Set("email", user.Email)
}

func facebookAuth(ctx iris.Context) {
	session := models.Sess.Start(ctx)
	var user models.User
	ctx.ReadJSON(&user)
	// set auth type as google
	user.Auth = "facebook"
	err := user.AuthenticateFbUser()
	if err != nil {
		log.Println(err)
		ctx.StatusCode(iris.StatusForbidden)
		return
	}
	log.Println("facebook user is authenticated...")
	session.Set("email", user.Email)
}

func authentification(ctx iris.Context) {
	session := models.Sess.Start(ctx)
	var user models.User
	ctx.ReadJSON(&user)
	err := user.Authenticate()
	if err != nil {
		if err.Error() == "must login with google or facebook" {
			log.Println(err)
			ctx.StatusCode(iris.StatusConflict)
			return
		}
		log.Println(err)
		ctx.StatusCode(iris.StatusForbidden)
		return
	}
	log.Println("user is authenticated...")
	session.Set("email", user.Email)
}

func recovery(ctx iris.Context) {
	v := struct {
		Email string
	}{}
	ctx.ReadJSON(&v)
	user, err := models.GetUserToRecover(v.Email)
	if err != nil {
		if err.Error() == "account created with facebook or google" {
			ctx.StatusCode(iris.StatusConflict)
			return
		}
		log.Println(err)
		ctx.StatusCode(iris.StatusForbidden)
		return
	}
	user.Pin = strconv.Itoa(int(rand.Float32() * 9999))
	err = user.UpdateUserData()
	if err != nil {
		log.Println("error in trying to update user data", err)
		ctx.StatusCode(iris.StatusInternalServerError)
	}
	err = sendVerificationMail("hello from okz website", user.Email, user.Pin)
	if err != nil {
		log.Println(err)
		ctx.StatusCode(iris.StatusInternalServerError)
		return
	}
}

func register(ctx iris.Context) {
	var newUser models.User
	ctx.ReadJSON(&newUser)
	log.Println(newUser)
	// should make a nice looking verification email after
	if ok := newUser.AlreadyUser(); ok {
		ctx.StatusCode(iris.StatusForbidden)
		return
	}
	newUser.Pin = strconv.Itoa(int(rand.Float32() * 9999))

	err := sendVerificationMail("hello from okz website", newUser.Email, newUser.Pin)
	if err != nil {
		log.Println(err)
		ctx.StatusCode(iris.StatusInternalServerError)
		return
	}

	// will hash the user password and change his value in newUser struct
	bsPass, err := bcrypt.GenerateFromPassword([]byte(newUser.Password), bcrypt.MinCost)
	if err == nil {
		newUser.Password = string(bsPass)
	} else if err != nil {
		log.Println("can't hash password", err)
	}
	// default placeholder image for users
	newUser.Picture = "http://icons.iconarchive.com/icons/graphicloads/flat-finance/256/person-icon.png"
	// set authentification type as email
	newUser.Auth = "email"
	if err := newUser.StoreUserData(); err != nil {
		log.Println(err)
		ctx.StatusCode(iris.StatusInternalServerError)
		return
	}
}

func verification(ctx iris.Context) {
	var u models.User
	session := models.Sess.Start(ctx)
	c := struct {
		Pin string `json:"pin"`
	}{}

	ctx.ReadJSON(&c)
	err := u.CheckPinCode(c.Pin)
	if err != nil {
		ctx.StatusCode(iris.StatusForbidden)
		log.Println(err)
		return
	}
	log.Println("pin code is valid")
	session.Set("email", u.Email)
}

func recoveryVerification(ctx iris.Context) {
	var u models.User
	c := struct {
		Pin string
	}{}
	ctx.ReadJSON(&c)
	log.Println(c)
	err := u.CheckPinCode(c.Pin)
	if err != nil {
		ctx.StatusCode(iris.StatusForbidden)
		log.Println(err)
		return
	}
	log.Println("recovery pin code is valid")
}

func updatePassword(ctx iris.Context) {
	session := models.Sess.Start(ctx)
	var user models.User
	ctx.ReadJSON(&user)
	hashPass, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.MinCost)
	if err != nil {
		log.Println(err)
		ctx.StatusCode(iris.StatusInternalServerError)
		return
	}
	user.Password = string(hashPass)
	err = user.UpdatePassword()
	if err != nil {
		log.Println(err)
		ctx.StatusCode(iris.StatusInternalServerError)
		return
	}
	log.Println("password updated")
	session.Set("email", user.Email)
}

func logout(ctx iris.Context) {
	models.Sess.Start(ctx).Destroy()
	ctx.Redirect("/", iris.StatusSeeOther)
}

// sendVerificationMail send email with pin code to users
// should make a nice looking email
func sendVerificationMail(body, to, pin string) error {
	from := "behoubaokz@gmail.com"
	pass := "45001685"

	msg := "From: " + from + "\n" +
		"To: " + to + "\n" +
		"Subject: Hello there\n\n" +
		"Votre de code de verification: " + pin

	err := smtp.SendMail("smtp.gmail.com:587",
		smtp.PlainAuth("", from, pass, "smtp.gmail.com"),
		from, []string{to}, []byte(msg))

	if err != nil {
		log.Printf("smtp error: %s", err)
		return err
	}

	log.Print("email to user")
	return nil
}
