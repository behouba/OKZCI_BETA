package controllers

import (
	"log"

	"github.com/behouba/OKZ_BETA_0.01/models"
	"github.com/kataras/iris"
)

func searchHandler(ctx iris.Context) {
	query := ctx.URLParam("query")
	category := ctx.URLParam("category")
	city := ctx.URLParam("city")
	sort := ctx.URLParam("sort")
	log.Println(query, category, city, sort)
	ads, err := models.SearchAds(query, category, city, sort)
	if err != nil {
		log.Println(err)
		ctx.StatusCode(iris.StatusNotFound)
		return
	}
	ctx.JSON(ads)
}
