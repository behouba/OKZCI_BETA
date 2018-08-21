package controllers

import (
	"log"
	"math/rand"
	"strconv"

	"github.com/behouba/OKZ_BETA_0.01/models"
	"golang.org/x/crypto/bcrypt"

	"github.com/kataras/iris"
)

func blockAuthPages(ctx iris.Context) {
	user := session.Start(ctx).Get("user")
	if user != nil {
		ctx.Redirect("/", iris.StatusSeeOther)
		return
	}
	ctx.Next()
}

func checkAuthSatuts(ctx iris.Context) {
	user := session.Start(ctx).Get("user")
	if user == nil {
		ctx.Redirect("/", iris.StatusSeeOther)
		return
	}
	ctx.Values().Set("userMap", user)
	ctx.Next()
}

func checkAjaxAuthStatus(ctx iris.Context) {
	user := session.Start(ctx).Get("user")
	if user == nil {
		ctx.StatusCode(iris.StatusForbidden)
		return
	}
	ctx.Next()
}

func login(ctx iris.Context) {
	ctx.View("login.html")
}

func googleAuth(ctx iris.Context) {
	session := session.Start(ctx)
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
	session.Set("user", user)
	session.Set("email", user.Email)
	session.Set("email", user.Email)
}

func facebookAuth(ctx iris.Context) {
	session := session.Start(ctx)
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
	session.Set("user", user)
	session.Set("email", user.Email)
	session.Set("email", user.Email)
}

func authentification(ctx iris.Context) {
	session := session.Start(ctx)
	var user models.User
	ctx.ReadJSON(&user)
	log.Println(user.Email)
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
	log.Println("user is logged in as user-email=", user)
	session.Set("user", user)
	session.Set("email", user.Email)
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
	err = sendVerificationMail(user.Email, user.Pin)
	if err != nil {
		log.Println(err)
		ctx.StatusCode(iris.StatusInternalServerError)
		return
	}
}

func register(ctx iris.Context) {
	var newUser models.User
	ctx.ReadJSON(&newUser)
	// log.Println(newUser)
	// should make a nice looking verification email after
	if ok := newUser.AlreadyUser(); ok {
		ctx.StatusCode(iris.StatusForbidden)
		return
	}
	newUser.Pin = strconv.Itoa(int(rand.Float32() * 9999))

	err := sendVerificationMail(newUser.Email, newUser.Pin)
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
	newUser.Picture = "img/user.svg"
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
	session := session.Start(ctx)
	c := struct {
		Pin string `json:"pin"`
	}{}

	ctx.ReadJSON(&c)

	if c.Pin == "" {
		ctx.StatusCode(iris.StatusForbidden)
		return
	}
	err := u.CheckPinCode(c.Pin)
	if err != nil {
		ctx.StatusCode(iris.StatusForbidden)
		log.Println(err)
		return
	}
	log.Println("pin code is valid")
	session.Set("user", u)
	session.Set("email", u.Email)
}

func recoveryVerification(ctx iris.Context) {
	var u models.User
	c := struct {
		Pin string
	}{}
	ctx.ReadJSON(&c)
	if c.Pin == "" {
		ctx.StatusCode(iris.StatusForbidden)
		return
	}
	err := u.CheckPinCode(c.Pin)
	if err != nil {
		ctx.StatusCode(iris.StatusForbidden)
		log.Println(err)
		return
	}
	log.Println("recovery pin code is valid")
}

func updatePassword(ctx iris.Context) {
	session := session.Start(ctx)
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
	log.Println("password updated for user = ", user)
	session.Set("user", user)
	session.Set("email", user.Email)
	session.Set("userID", user.ID.String())
}

func logout(ctx iris.Context) {
	session.Destroy(ctx)
	ctx.Redirect("/", iris.StatusSeeOther)
}
