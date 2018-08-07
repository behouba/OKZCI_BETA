package controllers

import (
	"log"
	"net/smtp"

	"github.com/behouba/OKZ_BETA_0.01/models"
	"github.com/kataras/iris"
	shortid "github.com/ventu-io/go-shortid"
)

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

func updateAdvert(ctx iris.Context) {
	email := models.Sess.Start(ctx).GetString("email")
	if email == "" {
		log.Println(email)
		ctx.StatusCode(iris.StatusForbidden)
		return
	}
	if ok := ctx.URLParamExists("a"); !ok {
		log.Println(ok)
		ctx.StatusCode(iris.StatusForbidden)
		return
	}
	adShortID := ctx.URLParam("a")
	var ad models.Advert
	ctx.ReadJSON(&ad)
	err := ad.UpdateData(adShortID)
	if err != nil {
		log.Println(err)
		return
	}
}

func isAdFavorite(favList []string, adShortID string) bool {
	for _, shortID := range favList {
		if shortID == adShortID {
			return true
		}
	}
	return false
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
	ctx.ViewData("isFav", isAdFavorite(user.FavList, ad.ShortID))
	ctx.ViewData("owner", owner)
	ctx.ViewData("ad", ad)
	ctx.View("detail.html")
}

func deleteAdvert(ctx iris.Context) {
	email := models.Sess.Start(ctx).GetString("email")
	if email == "" {
		log.Println(email)
		ctx.StatusCode(iris.StatusForbidden)
		return
	}
	if ok := ctx.URLParamExists("a"); !ok {
		log.Println(ok)
		ctx.StatusCode(iris.StatusForbidden)
		return
	}
	adShortID := ctx.URLParam("a")
	err := models.DeleteAdvert(adShortID)
	if err != nil {
		log.Println(err)
		return
	}
}

func updatePage(ctx iris.Context) {
	email := models.Sess.Start(ctx).GetString("email")
	if email == "" {
		ctx.Redirect("/", iris.StatusSeeOther)
		return
	}
	if ok := ctx.URLParamExists("a"); !ok {
		ctx.Redirect("/", iris.StatusSeeOther)
		return
	}
	adShortID := ctx.URLParam("a")

	ad, owner, err := models.GetAdByShortID(adShortID)
	if err != nil || owner.Email != email {
		ctx.StatusCode(iris.StatusNotFound)
		return
	}
	ctx.ViewData("user", owner)
	ctx.ViewData("cities", models.Cities)
	ctx.ViewData("ad", ad)
	ctx.View("update-ad.html")
}

func addFav(ctx iris.Context) {
	session := models.Sess.Start(ctx).GetString("email")
	user, err := models.GetUserByEmail(session)
	if err != nil {
		ctx.StatusCode(iris.StatusForbidden)
		log.Println(err)
		return
	}
	ad := struct {
		ShortID string
	}{}
	ctx.ReadJSON(&ad)
	err = user.AddFavorite(ad.ShortID)
	if err != nil {
		ctx.StatusCode(iris.StatusForbidden)
		log.Println(err)
		return
	}
	log.Println("fav added", ad.ShortID, user.UserName)
}

func removeFav(ctx iris.Context) {
	session := models.Sess.Start(ctx).GetString("email")
	user, err := models.GetUserByEmail(session)
	if err != nil {
		ctx.StatusCode(iris.StatusForbidden)
		log.Println(err)
		return
	}
	ad := struct {
		ShortID string
	}{}
	ctx.ReadJSON(&ad)
	err = user.RemoveFavorite(ad.ShortID)
	if err != nil {
		ctx.StatusCode(iris.StatusForbidden)
		log.Println(err)
		return
	}
	log.Println("fav removed", ad.ShortID, user.UserName)
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
	folder := "/ads/" + ad.ShortID + "/"
	ad.Pictures, err = models.UploadFormFilesToAwsS3(ctx, folder)
	if err != nil {
		ctx.StatusCode(iris.StatusInternalServerError)
		log.Println(err)
		return
	}
	if len(ad.Pictures) < 1 {
		ad.Pictures = append(ad.Pictures,"https://s3.eu-west-3.amazonaws.com/okazion/assets/No-image-available.png")
	}
	if err := ad.StoreNewAd(); err != nil {
		log.Println(err)
		ctx.StatusCode(iris.StatusInternalServerError)
		return
	}
	log.Println("new ad created ")
}

func reportAd(ctx iris.Context) {
	msg := struct {
		Body    string
		ShortID string
	}{}
	ctx.ReadJSON(&msg)
	if err := sendReportMessage(msg.Body, msg.ShortID); err != nil {
		log.Println(err)
		ctx.StatusCode(iris.StatusInternalServerError)
		return
	}
	log.Println("report message sent to admin")
}

func sendReportMessage(body, shortID string) error {
	from := "behoubaokz@gmail.com"
	pass := "45001685"
	to := "behouba@gmail.com"
	msg := "From: " + from + "\n" +
		"To: " + to + "\n" +
		"Subject: Salut \n\n" +
		"Cette annonce viens d'etre signalé par un utilisateur: " + body + "\n" +
		"short-id: " + shortID + " ."

	err := smtp.SendMail("smtp.gmail.com:587",
		smtp.PlainAuth("", from, pass, "smtp.gmail.com"),
		from, []string{to}, []byte(msg))

	if err != nil {
		log.Printf("smtp error: %s", err)
		return err
	}
	return nil
}
