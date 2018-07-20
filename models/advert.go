package models

import (
	"time"

	"gopkg.in/mgo.v2/bson"
)

// Advert struct models for all ads
type Advert struct {
	OwnerID   bson.ObjectId `form:"owner_id" bson:"owner_id"`
	Category  string        `form:"category" bson:"category"`
	CreatedAt time.Time     `form:"created_at" bson:"created_at"`
	AdType    string        `form:"ad_type" bson:"ad_type"`
	OfferType string        `form:"offer_type" bson:"offer_type"`
	Title     string        `form:"title" bson:"title"`
	City      string        `form:"city" bson:"city"`
	Details   string        `form:"details" bson:"details"`
	Price     int64         `form:"price" bson:"price"`
	Bids      []bid         `form:"bid" bson:"bids"`
	EndDate   string        `form:"end_date" bson:"end_date"`
	Contact   string        `form:"contact" bson:"contact"`
	Pictures  []string      `form:"files" bson:"pictures"`
	ShortID   string        `bson:"short_id"`
}

type bid struct {
	UserID bson.ObjectId
	Bid    int64
	Date   time.Time
}

// ShortTitle return short version of the title
func (a *Advert) ShortTitle() string {
	var numRunes = 0
	for index := range a.Title {
		numRunes++
		if numRunes > 25 {
			return a.Title[:index] + "..."
		}
	}
	return a.Title
}

// StoreNewAd method store new created ad to the database
func (a *Advert) StoreNewAd() (err error) {
	err = mgoSession.DB("okzdb").C("adverts").Insert(&a)
	if err != nil {
		return
	}
	return
}

// GetAds method retreive advert from database
func GetAds() (ads []Advert, err error) {
	err = mgoSession.DB("okzdb").C("adverts").Find(bson.M{}).Limit(50).All(&ads)
	if err != nil {
		return
	}
	return
}

// GetHotAuction get auction that are near to their ending
func GetHotAuction() (ads []Advert, err error) {
	err = mgoSession.DB("okzdb").C("adverts").Find(bson.M{"offer_type": "auction"}).Limit(10).Sort("end_date").All(&ads)
	if err != nil {
		return
	}
	return
}

// GetAdByShortID Get one ad by it shortID
func GetAdByShortID(shortID string) (ad Advert, err error) {
	err = mgoSession.DB("okzdb").C("adverts").Find(bson.M{"short_id": shortID}).One(&ad)
	if err != nil {
		return
	}
	return
}
