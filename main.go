package main

import (
	"github.com/behouba/OKZ_BETA_0.01/controllers"
	"github.com/kataras/iris"
)

func main() {
	app := controllers.OkzApp()

	// iris.RegisterOnInterrupt(func() {
	// 	models.mgoSession.Close()
	// 	models.redisDb.Close()
	// })
	app.Run(iris.Addr(":8080"))
	// target, _ := url.Parse("https://okazion.ci:443")
	// go host.NewProxy("http://okazion.ci:80", target).ListenAndServe()

	// app.Run(iris.TLS(":443", "/etc/letsencrypt/live/www.okazion.ci/fullchain.pem", "/etc/letsencrypt/live/www.okazion.ci/privkey.pem"))
}
