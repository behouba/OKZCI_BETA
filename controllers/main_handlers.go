package controllers

import (
	"log"
	"mime/multipart"
	"os"
	"time"

	"github.com/behouba/OKZ_BETA_0.01/models"
	"github.com/kataras/iris"
)

func home(ctx iris.Context) {
	session := models.Sess.Start(ctx).GetString("email")
	adverts, err := models.GetAd()
	if err != nil {
		log.Println(err)
	}
	ctx.ViewData("cities", models.Cities)
	ctx.ViewData("categories", models.Categories)
	ctx.ViewData("ads", adverts)
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

func detail(ctx iris.Context) {
	ctx.View("detail.html")
}

func create(ctx iris.Context) {
	session := models.Sess.Start(ctx).GetString("email")
	ctx.ViewData("cities", models.Cities)
	ctx.ViewData("categories", models.Categories)
	if session == "" {
		ctx.View("login.html")
		return
	}
	userEmail := models.Sess.Start(ctx).GetString("email")
	user, err := models.GetUserByEmail(userEmail)
	if err != nil {
		log.Println(err)
	}
	ctx.ViewData("user", user)
	ctx.View("create.html")
}

func userPage(ctx iris.Context) {
	ctx.View("profile.html")
}

func userMessages(ctx iris.Context) {
	ctx.View("messages.html")
}

func userSetting(ctx iris.Context) {
	ctx.View("profil-setting.html")
}

func thread(ctx iris.Context) {
	ctx.View("thread.html")
}

func createAdvert(ctx iris.Context) {
	ad := models.Advert{}
	ctx.ReadForm(&ad)
	err := os.Mkdir("./public/"+ad.UUID+"/", os.ModeDir)
	if err != nil {
		ctx.StatusCode(iris.StatusInternalServerError)
		return
	}
	val, err := ctx.UploadFormFiles("./public/"+ad.UUID+"/", func(ctx iris.Context, file *multipart.FileHeader) {
		path := "http://localhost:8080/pictures/" + ad.UUID + "/" + file.Filename
		ad.Pictures = append(ad.Pictures, path)
		ad.CreatedAt = time.Now()
	})
	if err != nil {
		ctx.StatusCode(iris.StatusInternalServerError)
		log.Println(err)
		return
	}
	if err := ad.StoreNewAd(); err != nil {
		ctx.StatusCode(iris.StatusInternalServerError)
		return
	}
	log.Println("new ad created ", ad, val)
}
