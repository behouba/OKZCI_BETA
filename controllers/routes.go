package controllers

import (
	"github.com/kataras/iris"
)

// OkzApp set up new app with routes and statics assets
func OkzApp() *iris.Application {
	app := iris.New()

	app.StaticWeb("/css", "./views/css")
	app.StaticWeb("/js", "./views/js")
	app.StaticWeb("/img", "./views/img")
	app.StaticWeb("/pictures", "./public")
	app.StaticWeb("/", "./views")

	templates := iris.HTML("./views", ".html").Reload(true)
	app.RegisterView(templates)

	app.Get("/", home)
	app.Get("/login", blockAuthPages, login)
	app.Post("/login", authentification)
	app.Post("/google-auth", blockAuthPages, googleAuth)
	app.Post("/facebook-auth", blockAuthPages, facebookAuth)
	app.Post("/register", blockAuthPages, register)
	app.Post("/recovery", recovery)
	app.Get("/watch", watch)
	app.Get("/create", create)
	app.Get("/update-p", updatePage)
	app.Post("/update", updateAdvert)
	app.Post("/delete", deleteAdvert)
	app.Post("/create", createAdvert)
	app.Get("/me", userProfil)
	app.Post("/send-message", messagesHandler)
	app.Post("/add-fav", addFav)
	app.Post("/remove-fav", removeFav)
	app.Post("/upadte-name", updateUserName)
	app.Post("/update-location", updateUserLocation)
	app.Post("/update-contact", updateUserContact)
	app.Post("/update-profile-pic", updateUserProfileImage)
	app.Post("/report", reportAd)
	app.Get("/search", searchHandler)
	app.Get("/settings", userSetting)
	app.Get("/about-us", aboutUs)
	app.Get("/conditions", conditions)
	app.Post("/contact-us", contactUs)
	app.Post("/verification", verification)
	app.Post("/recovery-verification", recoveryVerification)
	app.Post("/update-password", updatePassword)
	app.Get("/logout", logout)

	return app
}
