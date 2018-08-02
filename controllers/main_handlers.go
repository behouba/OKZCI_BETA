package controllers

import (
	"log"

	"github.com/behouba/OKZ_BETA_0.01/models"
	"github.com/kataras/iris"
)

func home(ctx iris.Context) {
	session := models.Sess.Start(ctx).GetString("email")
	// adverts, err := models.GetAds()
	// if err != nil {
	// 	log.Println(err)
	// }
	hotAuctions, err := models.GetHotAuction()
	if err != nil {
		log.Println(err)
	}
	ctx.ViewData("cities", models.Cities)
	ctx.ViewData("categories", models.Categories)
	// ctx.ViewData("ads", adverts)
	ctx.ViewData("hotAuctions", hotAuctions)
	if session == "" {
		ctx.View("index.html")
		return
	}
	userEmail := models.Sess.Start(ctx).GetString("email")
	user, err := models.GetUserByEmail(userEmail)
	if err != nil {
		log.Println(err)
	}
	ctx.ViewData("user", user)
	ctx.View("index.html")
}

func thread(ctx iris.Context) {
	ctx.View("thread.html")
}

func aboutUs(ctx iris.Context) {
	ctx.View("contact.html")
}

func conditions(ctx iris.Context) {
	ctx.View("conditions.html")
}