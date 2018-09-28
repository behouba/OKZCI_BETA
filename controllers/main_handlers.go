package controllers

import (
	"log"
	"net/smtp"

	"github.com/behouba/OKZ_BETA_0.01/models"
	"github.com/kataras/iris"
	ms "github.com/mitchellh/mapstructure"
)

func home(ctx iris.Context) {
	var user models.User
	ctx.ViewData("cities", models.Cities)
	ctx.ViewData("categories", models.Categories)

	userMap := session.Start(ctx).Get("user")
	if userMap == nil {
		ctx.View("index.html")
		return
	}
	err := ms.Decode(userMap.(map[string]interface{}), &user)
	if err != nil {
		panic(err)
	}
	ctx.ViewData("user", user)
	ctx.View("index.html")
}

func aboutUs(ctx iris.Context) {
	ctx.View("contact.html")
}

func privacyPolicy(ctx iris.Context) {
	ctx.View("privacy_policy.html")
}

func conditions(ctx iris.Context) {
	ctx.View("conditions.html")
}

func contactUs(ctx iris.Context) {
	msg := struct {
		Sender string
		Email  string
		Body   string
	}{}
	ctx.ReadJSON(&msg)
	if err := sendUSMessage(msg.Sender, msg.Email, msg.Body); err != nil {
		ctx.StatusCode(iris.StatusInternalServerError)
	}
}

func sendUSMessage(sender, email, body string) error {
	from := "behoubaokz@gmail.com"
	pass := "45001685"
	to := "behouba@gmail.com"
	msg := "From: " + from + "\n" +
		"To: " + to + "\n" +
		"Subject: Salut \n\n" +
		"Vous avec reçu un message de la par d'un utilisateur: \n" +
		"Nom: " + sender + " \n" +
		"ID: " + email + " \n" +
		"Message: " + body + " \n"

	err := smtp.SendMail("smtp.gmail.com:587",
		smtp.PlainAuth("", from, pass, "smtp.gmail.com"),
		from, []string{to}, []byte(msg))

	if err != nil {
		log.Printf("smtp error: %s", err)
		return err
	}
	return nil
}

func googleValidation(ctx iris.Context) {
	ctx.View("googlec7dfdac89dc40285.html")
}
