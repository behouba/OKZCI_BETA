package controllers

import (
	"log"
	"time"

	"gopkg.in/mgo.v2/bson"

	"github.com/behouba/OKZ_BETA_0.01/models"
	"github.com/kataras/iris"
)

func messagesHandler(ctx iris.Context) {
	client := struct {
		SenderID   string `json:"sender_id"`
		ReceiverID string `json:"receiver_id"`
		Body       string `json:"body"`
	}{}
	ctx.ReadJSON(&client)
	message := models.Message{
		SenderID:   bson.ObjectIdHex(client.SenderID),
		ReceiverID: bson.ObjectIdHex(client.ReceiverID),
		Body:       client.Body,
		Date:       time.Now(),
	}
	log.Println(message)
	if err := message.Save(); err != nil {
		log.Println(err)
		ctx.StatusCode(iris.StatusInternalServerError)
		return
	}
	log.Println("Succes message sent")
}

func userMessages(ctx iris.Context) {
	userEmail := models.Sess.Start(ctx).GetString("email")
	user, err := models.GetUserByEmail(userEmail)
	if err != nil {
		log.Println(err)
	}
	user.MessageReaded()
	conversations := user.GetUserConversations()
	ctx.ViewData("conversations", conversations)
	ctx.ViewData("user", user)
	ctx.View("messages.html")
}
