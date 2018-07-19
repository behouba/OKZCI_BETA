package models

import (
	"time"

	"gopkg.in/mgo.v2/bson"
)

// Advert struct models for all ads
type Advert struct {
	OwnerID bson.ObjectId `from:"owner_id"` 
	Category     string    `form:"category"`
	CreatedAt    time.Time `form:"created_at"`
	AdType       string    `form:"ad-type"`
	OfferType    string    `form:"sellingType"`
	Title        string    `form:"title"`
	City         string    `form:"city"`
	Descritpion  string    `form:"description"`
	Price        int64     `form:"price"`
	Bids         []bid     `form:"bid"`
	EndDate      string    `form:"auctionDuration"`
	Contact      string    `form:"contact"`
	Pictures     []string  `form:"files"`
	IsNegociable string    `form:"isNegociable"`
	UUID         string    `form:"uuid"`
}

type bid struct {
	UserID bson.ObjectId
	Bid    int64
	Date   time.Time
}

// StoreNewAd method store new created ad to the database
func (a *Advert) StoreNewAd() (err error) {
	err = mgoSession.DB("okzdb").C("adverts").Insert(&a)
	if err != nil {
		return
	}
	return
}

// GetAd method retreive advert from database
func GetAd() (ads []Advert, err error) {
	err = mgoSession.DB("okzdb").C("adverts").Find(bson.M{}).Limit(50).All(&ads)
	if err != nil {
		return
	}
	return
}
