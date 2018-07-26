package controllers

import (
	"log"

	"github.com/behouba/OKZ_BETA_0.01/models"
	"github.com/kataras/iris"
)

func userProfil(ctx iris.Context) {
	session := models.Sess.Start(ctx).GetString("email")
	if session == "" {
		ctx.Redirect("/", iris.StatusSeeOther)
		return
	}
	user, err := models.GetUserByEmail(session)
	if err != nil {
		log.Println(err)
	}
	ads, err := models.GetUserAdsByUserID(user.ID)
	if err != nil {
		log.Println(err)
	}
	favorites, err := models.GetFavoritesAdsByUserID(user.ID)
	if err != nil {
		log.Println(err)
	}
	ctx.ViewData("favorites", favorites)
	ctx.ViewData("ads", ads)
	ctx.ViewData("user", user)
	ctx.View("profile.html")
}

func userSetting(ctx iris.Context) {
	session := models.Sess.Start(ctx).GetString("email")
	if session == "" {
		ctx.Redirect("/", iris.StatusSeeOther)
		return
	}
	user, err := models.GetUserByEmail(session)
	if err != nil {
		log.Println(err)
	}
	ctx.ViewData("cities", models.Cities)
	ctx.ViewData("user", user)
	ctx.View("profil-setting.html")
}

// security issue with these three functions bellow

func updateUserName(ctx iris.Context) {
	var user models.User
	ctx.ReadJSON(&user)
	user.Email = models.Sess.Start(ctx).GetString("email")
	err := user.UpdateUserName()
	if err != nil {
		ctx.StatusCode(iris.StatusInternalServerError)
	}
}

func updateUserContact(ctx iris.Context) {
	var user models.User
	ctx.ReadJSON(&user)
	user.Email = models.Sess.Start(ctx).GetString("email")
	err := user.UpdateContact()
	if err != nil {
		ctx.StatusCode(iris.StatusInternalServerError)
	}
}

func updateUserLocation(ctx iris.Context) {
	var user models.User
	ctx.ReadJSON(&user)
	user.Email = models.Sess.Start(ctx).GetString("email")
	err := user.UpdateUserLocation()
	if err != nil {
		ctx.StatusCode(iris.StatusInternalServerError)
	}
}
