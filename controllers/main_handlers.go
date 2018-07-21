package controllers

import (
	"log"
	"mime/multipart"
	"os"
	"strconv"
	"time"

	"github.com/ventu-io/go-shortid"

	"github.com/behouba/OKZ_BETA_0.01/models"
	"github.com/kataras/iris"
)

func home(ctx iris.Context) {
	session := models.Sess.Start(ctx).GetString("email")
	adverts, err := models.GetAds()
	if err != nil {
		log.Println(err)
	}
	hotAuctions, err := models.GetHotAuction()
	if err != nil {
		log.Println(err)
	}
	ctx.ViewData("cities", models.Cities)
	ctx.ViewData("categories", models.Categories)
	ctx.ViewData("ads", adverts)
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

func watch(ctx iris.Context) {
	if ok := ctx.URLParamExists("a"); !ok {
		ctx.Redirect("/", iris.StatusSeeOther)
		return
	}
	adShortID := ctx.URLParam("a")

	ad, owner, err := models.GetAdByShortID(adShortID)
	if err != nil {
		log.Println(err)
		ctx.StatusCode(iris.StatusNotFound)
	}
	userEmail := models.Sess.Start(ctx).GetString("email")
	user, err := models.GetUserByEmail(userEmail)
	if err != nil {
		log.Println(err)
	} else {
		ctx.ViewData("user", user)
	}
	ctx.ViewData("owner", owner)
	ctx.ViewData("ad", ad)
	ctx.View("detail.html")
}

func loadMore(ctx iris.Context) {
	offset, err := strconv.Atoi(ctx.URLParam("offset"))
	if err != nil {
		log.Println(err)
	}
	ads, err := models.LoadMoreAds(offset)
	if err != nil {
		log.Println(err)
	}
	ctx.JSON(ads)
}

func create(ctx iris.Context) {
	session := models.Sess.Start(ctx).GetString("email")
	ctx.ViewData("cities", models.Cities)
	ctx.ViewData("categories", models.Categories)
	if session == "" {
		ctx.View("login.html")
		return
	}
	user, err := models.GetUserByEmail(session)
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
	session := models.Sess.Start(ctx).GetString("email")
	user, err := models.GetUserByEmail(session)
	if err != nil {
		log.Println(err)
		log.Println("must be login to create ad")
		ctx.StatusCode(iris.StatusForbidden)
		return
	}
	ad := models.Advert{}
	ctx.ReadForm(&ad)
	ad.OwnerID = user.ID
	ad.ShortID = shortid.MustGenerate()
	err = os.Mkdir("./public/ad/"+ad.ShortID+"/", os.ModeDir)
	if err != nil {
		log.Println(err)
		ctx.StatusCode(iris.StatusInternalServerError)
		return
	}
	val, err := ctx.UploadFormFiles("./public/ad/"+ad.ShortID+"/", func(ctx iris.Context, file *multipart.FileHeader) {
		path := "http://localhost:8080/pictures/ad/" + ad.ShortID + "/" + file.Filename
		ad.Pictures = append(ad.Pictures, path)
		ad.CreatedAt = time.Now()
	})
	if err != nil {
		ctx.StatusCode(iris.StatusInternalServerError)
		log.Println(err)
		return
	}
	if err := ad.StoreNewAd(); err != nil {
		log.Println(err)
		ctx.StatusCode(iris.StatusInternalServerError)
		return
	}
	log.Println("new ad created ", ad, val)
}
