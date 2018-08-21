package controllers

import (
	"github.com/behouba/OKZ_BETA_0.01/models"
	"github.com/kataras/iris"
)

var session = models.Sess
var endPoint = models.Config.EndPoint

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

	//publics routes
	app.Get("/", home)
	app.Get("/search", searchHandler)
	app.Get("/watch", watch)
	app.Get("/about-us", aboutUs)
	app.Get("/conditions", conditions)
	app.Post("/contact-us", contactUs)
	app.Get("/googlec7dfdac89dc40285.html", googleValidation)

	// authentification and login
	app.Get("/login", blockAuthPages, login)
	app.Post("/login", authentification)
	app.Post("/google-auth", googleAuth)
	app.Post("/facebook-auth", facebookAuth)
	app.Post("/register", register)
	app.Post("/recovery", recovery)
	app.Get("/logout", logout)
	app.Post("/verification", verification)
	app.Post("/update-password", updatePassword)
	app.Post("/recovery-verification", recoveryVerification)

	//routes for authenficated users
	app.Get("/create", create)
	app.Get("/update-p", checkAuthSatuts, updatePage)
	app.Post("/update", checkAjaxAuthStatus, updateAdvert)
	app.Post("/delete", checkAjaxAuthStatus, deleteAdvert)
	app.Post("/create", checkAjaxAuthStatus, createAdvert)
	app.Get("/me", checkAuthSatuts, userProfil)
	app.Get("/me/ads", checkAuthSatuts, userAds)
	app.Post("/add-fav", checkAjaxAuthStatus, addFav)
	app.Post("/remove-fav", checkAjaxAuthStatus, removeFav)
	app.Post("/upadte-name", checkAjaxAuthStatus, updateUserName)
	app.Post("/update-location", checkAjaxAuthStatus, updateUserLocation)
	app.Post("/update-contact", checkAjaxAuthStatus, updateUserContact)
	app.Post("/update-profile-pic", checkAjaxAuthStatus, updateUserProfileImage)
	app.Post("/report", reportAd)
	app.Get("/settings", checkAuthSatuts, userSetting)
	app.Post("/send-message", messagesHandler)

	return app
}
