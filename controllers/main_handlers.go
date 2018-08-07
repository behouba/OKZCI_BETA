package controllers

import (
	"log"
	"net/smtp"

	"github.com/behouba/OKZ_BETA_0.01/models"
	"github.com/kataras/iris"
)

func home(ctx iris.Context) {
	userEmail := models.Sess.Start(ctx).GetString("email")
	ctx.ViewData("cities", models.Cities)
	ctx.ViewData("categories", models.Categories)
	log.Println("user-email=", userEmail)
	if userEmail == "" {
		log.Println("user is not logged")
		ctx.View("index.html")
		return
	}
	user, err := models.GetUserByEmail(userEmail)
	if err != nil {
		log.Println(err)
	}
	ctx.ViewData("user", user)
	log.Println("user is logged")
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
		"Vous avec reçu un message de la par d'une utilisateur: \n" +
		"Nom: " + sender + " \n" +
		"Email: " + email + " \n" +
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
