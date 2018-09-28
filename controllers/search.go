package controllers

import (
	"log"
	"strconv"

	"github.com/behouba/OKZ_BETA_0.01/models"
	"github.com/kataras/iris"
)

func searchHandler(ctx iris.Context) {
	query := ctx.URLParam("query")
	category := ctx.URLParam("category")
	city := ctx.URLParam("city")
	sort := ctx.URLParam("sort")
	offset, err := strconv.Atoi(ctx.URLParam("offset"))
	if err != nil {
		log.Println(err)
		ctx.StatusCode(iris.StatusInternalServerError)
	}
	ads, err := models.SearchAds(query, category, city, sort, offset)
	if err != nil {
		log.Println(err)
		ctx.StatusCode(iris.StatusNotFound)
		return
	}
	ctx.JSON(ads)
}
