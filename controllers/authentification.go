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

func authentification(ctx iris.Context) {
	session := models.Sess.Start(ctx)
	var user models.User
	ctx.ReadJSON(&user)
	err := user.Authenticate()
	if err != nil {
		ctx.StatusCode(iris.StatusForbidden)
		return
	}
	log.Println("user is authenticated...")
	session.Set("email", user.Email)
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
	if bsPass, err := bcrypt.GenerateFromPassword([]byte(newUser.Password), bcrypt.MinCost); err == nil {
		newUser.Password = string(bsPass)
	}

	if err != nil {
		log.Println("can't hash password", err)
	}
	// default placeholder image for users
	newUser.Picture = "http://icons.iconarchive.com/icons/graphicloads/flat-finance/256/person-icon.png"
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
	log.Println(c)
	err := u.CheckPinCode(c.Pin)
	if err != nil {
		ctx.StatusCode(iris.StatusForbidden)
		log.Println(err)
		return
	}
	log.Println("pin code is valid")
	session.Set("email", u.Email)
}

func logout(ctx iris.Context) {
	models.Sess.Start(ctx).Destroy()
	ctx.Redirect("/", iris.StatusSeeOther)
}

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

	log.Print("email send to new user")
	return nil
}
