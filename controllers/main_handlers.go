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
	ctx.ViewData("isFav", isAdFavorite(user.FavList, ad.ShortID))
	ctx.ViewData("owner", owner)
	ctx.ViewData("ad", ad)
	ctx.View("detail.html")
}

func isAdFavorite(favList []string, adShortID string) bool {
	for _, shortID := range favList {
		if shortID == adShortID {
			return true
		}
	}
	return false
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

func userMessages(ctx iris.Context) {
	ctx.View("messages.html")
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

func thread(ctx iris.Context) {
	ctx.View("thread.html")
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
	err = os.Mkdir("./public/ad/"+ad.ShortID+"/", os.ModeDir)
	if err != nil {
		log.Println(err)
		ctx.StatusCode(iris.StatusInternalServerError)
		return
	}
	_, err = ctx.UploadFormFiles("./public/ad/"+ad.ShortID+"/", func(ctx iris.Context, file *multipart.FileHeader) {
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
	log.Println("new ad created ")
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
