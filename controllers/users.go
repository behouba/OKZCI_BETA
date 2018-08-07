package controllers

import (
	"log"
	"net/smtp"

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
	ctx.ViewData("adsCount", len(ads))
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

func messagesHandler(ctx iris.Context) {
	msg := struct {
		To        string `json:"to"`
		OwnerName string `json:"ownerName"`
		Body      string `json:"body"`
	}{}
	ctx.ReadJSON(&msg)
	log.Println(msg.To, msg.OwnerName)
	if err := sendMailMessage(msg.Body, msg.To, msg.OwnerName); err != nil {
		log.Println(err)
		ctx.StatusCode(iris.StatusInternalServerError)
		return
	}
	log.Println("message envoyé")
}

func sendMailMessage(body, to, name string) error {
	from := "behoubaokz@gmail.com"
	pass := "45001685"

	msg := "From: " + from + "\n" +
		"To: " + to + "\n" +
		"Subject: Salut " + name + "\n\n" +
		"Vous venez de recevoir un message concernant une de vos annonces en ligne: " + body

	err := smtp.SendMail("smtp.gmail.com:587",
		smtp.PlainAuth("", from, pass, "smtp.gmail.com"),
		from, []string{to}, []byte(msg))

	if err != nil {
		log.Printf("smtp error: %s", err)
		return err
	}
	return nil
}

func updateUserProfileImage(ctx iris.Context) {
	session := models.Sess.Start(ctx).GetString("email")
	user, err := models.GetUserByEmail(session)
	if err != nil {
		log.Println(err)
		ctx.StatusCode(iris.StatusForbidden)
		return
	}
	path := "/user/" + user.UserName + "/"
	urls, err := models.UploadFormFilesToAwsS3(ctx, path)
	if err != nil {
		ctx.StatusCode(iris.StatusInternalServerError)
		log.Println(err)
		return
	}
	user.Picture = urls[0]
	if err := user.UpdateUserData(); err != nil {
		ctx.StatusCode(iris.StatusInternalServerError)
		return
	}
}
