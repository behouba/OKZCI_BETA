package models

import (
	"time"

	"gopkg.in/mgo.v2/bson"
)

// Conversation struct define scheme for document that we store in conservasations collection in database
type Conversation struct {
	ID     bson.ObjectId `bson:"_id"`
	Users  [2]bson.ObjectId
	Thread []Message
}

// Message struct define message object
type Message struct {
	SenderID   bson.ObjectId `json:"sender_id" bson:"sender_id"`
	ReceiverID bson.ObjectId `json:"receiver_id" bson:"receiver_id"`
	Body       string        `json:"body" bson:"body"`
	Date       time.Time
}

func alertReceiver(receiverID bson.ObjectId) (err error) {
	err = mgoSession.DB("okzdb").C("users").Update(bson.M{"_id": receiverID}, bson.M{"$set": bson.M{"new_message": true}})
	if err != nil {
		return
	}
	return
}



func (m Message) Save() (err error) {
	err = alertReceiver(m.ReceiverID)
	if err != nil {
		return
	}
	err = mgoSession.DB("okzdb").C("conversations").Update(bson.M{"users": bson.M{"$all": [2]bson.ObjectId{m.SenderID, m.ReceiverID}}}, bson.M{"$push": bson.M{"thread": m}})
	if err != nil {
		err = m.CreateNewConversation()
		if err != nil {
			return
		}
		return
	}
	return
}

func (m Message) CreateNewConversation() (err error) {
	conv := Conversation{
		Users: [2]bson.ObjectId{m.ReceiverID, m.SenderID},
	}
	conv.ID = bson.NewObjectId()
	conv.Thread = append(conv.Thread, m)
	err = mgoSession.DB("okzdb").C("conversations").Insert(conv)
	if err != nil {
		return
	}
	return
}
