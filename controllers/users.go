package controllers

import (
	"log"
	"mime/multipart"
	"os"

	"github.com/behouba/OKZ_BETA_0.01/models"
	"github.com/kataras/iris"
	"gopkg.in/mgo.v2/bson"
)

func userProfil(ctx iris.Context) {
	email := session.Start(ctx).GetString("email")
	user, err := models.GetUserByEmail(email)
	if err != nil {
		log.Println(err)
		ctx.Redirect("/", iris.StatusSeeOther)
	}
	ctx.ViewData("user", user)
	ctx.View("profile.html")
}

func userAds(ctx iris.Context) {
	id := bson.ObjectIdHex(ctx.URLParam("id"))
	ads, count, err := models.GetUserAdsByUserID(id)
	if err != nil {
		log.Println(err)
	}
	favorites, err := models.GetFavoritesAdsByUserID(id)
	if err != nil {
		log.Println(err)
	}
	data := struct {
		Ads       []models.Advert `json:"ads"`
		Favorites []models.Advert `json:"fav"`
		Count     int             `json:"count"`
	}{
		Ads:       ads,
		Favorites: favorites,
		Count:     count,
	}
	ctx.JSON(data)
}

func userSetting(ctx iris.Context) {
	email := session.Start(ctx).GetString("email")
	user, err := models.GetUserByEmail(email)
	if err != nil {
		log.Println(err)
		ctx.Redirect("/", iris.StatusSeeOther)
	}
	ctx.ViewData("cities", models.Cities)
	ctx.ViewData("user", user)
	ctx.View("profil-setting.html")
}

// security issue with these three functions bellow

func updateUserName(ctx iris.Context) {
	var user models.User
	ctx.ReadJSON(&user)
	user.Email = session.Start(ctx).Get("user").(map[string]interface{})["email"].(string)
	if err := user.UpdateUserName(); err != nil {
		ctx.StatusCode(iris.StatusInternalServerError)
	}
	session.Start(ctx).Set("user", user)
}

func updateUserContact(ctx iris.Context) {
	var user models.User
	ctx.ReadJSON(&user)
	user.Email = session.Start(ctx).Get("user").(map[string]interface{})["email"].(string)
	err := user.UpdateContact()
	if err != nil {
		ctx.StatusCode(iris.StatusInternalServerError)
	}
	session.Start(ctx).Set("user", user)
}

func updateUserLocation(ctx iris.Context) {
	var user models.User
	ctx.ReadJSON(&user)
	user.Email = session.Start(ctx).Get("user").(map[string]interface{})["email"].(string)

	if err := user.UpdateUserLocation(); err != nil {
		ctx.StatusCode(iris.StatusInternalServerError)
	}
	session.Start(ctx).Set("user", user)
}

func updateUserProfileImage(ctx iris.Context) {
	var user models.User
	user.Email = session.Start(ctx).GetString("email")
	userID := session.Start(ctx).GetString("userID")
	err := os.RemoveAll("./public/u/" + userID)
	if err != nil {
		log.Println(err)
	}
	err = os.Mkdir("./public/u/"+userID+"/", os.ModeDir)
	if err != nil {
		log.Println(err)
		ctx.StatusCode(iris.StatusInternalServerError)
		return
	}
	_, err = ctx.UploadFormFiles("./public/u/"+userID+"/", func(ctx iris.Context, file *multipart.FileHeader) {
		path := endPoint.Users + userID + "/" + file.Filename
		user.Picture = path
	})
	if err := user.UpdateUserProfileImage(); err != nil {
		log.Println(err)
		ctx.StatusCode(iris.StatusInternalServerError)
		return
	}
	session.Start(ctx).Set("user", user)
}
