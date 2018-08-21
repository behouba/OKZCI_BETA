package controllers

import (
	"log"
	"mime/multipart"

	"os"
	"time"

	"gopkg.in/mgo.v2/bson"

	"github.com/behouba/OKZ_BETA_0.01/models"
	"github.com/kataras/iris"
	ms "github.com/mitchellh/mapstructure"
	shortid "github.com/ventu-io/go-shortid"
)

func create(ctx iris.Context) {
	var user models.User
	userMap := session.Start(ctx).Get("user")
	if userMap == nil {
		ctx.View("login.html")
		return
	}

	err := ms.Decode(userMap.(map[string]interface{}), &user)
	if err != nil {
		log.Println(err)
	}
	ctx.ViewData("cities", models.Cities)
	ctx.ViewData("categories", models.Categories)
	ctx.ViewData("user", user)
	ctx.View("create.html")
}

func updateAdvert(ctx iris.Context) {
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
	adShortID := ctx.URLParam("a")
	ad, owner, err := models.GetAdByShortID(adShortID)
	if err != nil {
		log.Println(err)
		ctx.StatusCode(iris.StatusNotFound)
		return
	}
	var user models.User
	userMap := session.Start(ctx).Get("user")
	if userMap != nil {
		ms.Decode(userMap.(map[string]interface{}), &user)
		ctx.ViewData("user", user)
	}
	ctx.ViewData("isFav", isAdFavorite(user.FavList, ad.ShortID))
	ctx.ViewData("owner", owner)
	ctx.ViewData("ad", ad)
	ctx.View("detail.html")
}

func deleteAdvert(ctx iris.Context) {
	// adShortID := ctx.URLParam("a")
	// err := models.DeleteAdvert(adShortID)
	// if err != nil {
	// 	log.Println(err)
	// 	return
	// }
	adShortID := ctx.URLParam("a")
	err := models.DeleteAdvert(adShortID)
	if err != nil {
		log.Println(err)
		return
	}
}

func updatePage(ctx iris.Context) {
	userMap := session.Start(ctx).Get("user").(map[string]interface{})
	adShortID := ctx.URLParam("a")

	ad, user, err := models.GetAdByShortID(adShortID)
	if err != nil {
		ctx.StatusCode(iris.StatusNotFound)
		return
	}
	if user.Email != userMap["email"].(string) {
		ctx.Redirect("/", iris.StatusSeeOther)
	}
	ctx.ViewData("user", user)
	ctx.ViewData("cities", models.Cities)
	ctx.ViewData("ad", ad)
	ctx.View("update-ad.html")
}

func addFav(ctx iris.Context) {
	var user models.User
	userMap := session.Start(ctx).Get("user").(map[string]interface{})

	if err := ms.Decode(userMap, &user); err != nil {
		panic(err)
	}
	ad := struct {
		ShortID string
	}{}
	ctx.ReadJSON(&ad)

	if err := user.AddFavorite(ad.ShortID); err != nil {
		ctx.StatusCode(iris.StatusForbidden)
		log.Println(err)
		return
	}
	session.Start(ctx).Set("user", user)
	log.Println("fav added", ad.ShortID, user.UserName)
}

func removeFav(ctx iris.Context) {
	var user models.User
	userMap := session.Start(ctx).Get("user").(map[string]interface{})

	if err := ms.Decode(userMap, &user); err != nil {
		panic(err)
	}
	ad := struct {
		ShortID string
	}{}
	ctx.ReadJSON(&ad)

	if err := user.RemoveFavorite(ad.ShortID); err != nil {
		ctx.StatusCode(iris.StatusForbidden)
		log.Println(err)
		return
	}
	session.Start(ctx).Set("user", user)
	log.Println("fav removed", ad.ShortID, user.UserName)
}

func createAdvert(ctx iris.Context) {
	var err error
	ad := models.Advert{}

	userMap := session.Start(ctx).Get("user").(map[string]interface{})

	ctx.ReadForm(&ad)
	ad.OwnerID = bson.ObjectIdHex(userMap["ID"].(string))
	ad.ShortID = shortid.MustGenerate()
	err = os.Mkdir("./public/ad/"+ad.ShortID+"/", os.ModeDir)
	if err != nil {
		log.Println(err)
		ctx.StatusCode(iris.StatusInternalServerError)
		return
	}
	_, err = ctx.UploadFormFiles("./public/ad/"+ad.ShortID+"/", func(ctx iris.Context, file *multipart.FileHeader) {
		path := endPoint.Ads + ad.ShortID + "/" + file.Filename
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
	// upload to aws s3
	// ad.Pictures, err = models.UploadFormFilesToAwsS3(ctx, folder)
	// if err != nil {
	// 	ctx.StatusCode(iris.StatusInternalServerError)
	// 	log.Println(err)
	// 	return
	// }
	// if len(ad.Pictures) < 1 {
	// 	ad.Pictures = append(ad.Pictures, "img/blank.png")
	// }
	// if err := ad.StoreNewAd(); err != nil {
	// 	log.Println(err)
	// 	ctx.StatusCode(iris.StatusInternalServerError)
	// 	return
	// }
	resp := struct {
		ShortID string `json:"shortID"`
	}{
		ShortID: ad.ShortID,
	}
	ctx.JSON(resp)
	log.Println("new ad created ")
}
