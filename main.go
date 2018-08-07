package main

import (
	"github.com/behouba/OKZ_BETA_0.01/controllers"
	"github.com/kataras/iris"
)

var port = "80"

func main() {
	app := controllers.OkzApp()

	// iris.RegisterOnInterrupt(func() {
	// 	models.mgoSession.Close()
	// 	models.redisDb.Close()
	// })
	app.Run(iris.Addr(":" + port))
}
