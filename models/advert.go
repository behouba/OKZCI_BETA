package models

import (
	"log"
	"os"
	"time"

	"gopkg.in/mgo.v2/bson"
)

// Advert struct models for all ads
type Advert struct {
	OwnerID   bson.ObjectId `form:"owner_id" bson:"owner_id" json:"owner_id"`
	Category  string        `form:"category" bson:"category" json:"category"`
	CreatedAt time.Time     `form:"created_at" bson:"created_at" json:"created_at"`
	AdType    string        `form:"ad_type" bson:"ad_type" json:"ad_type"`
	Title     string        `form:"title" bson:"title" json:"title"`
	City      string        `form:"city" bson:"city" json:"city"`
	Details   string        `form:"details" bson:"details" json:"details"`
	Price     int64         `form:"price" bson:"price" json:"price"`
	Bids      []bid         `form:"bid" bson:"bids" json:"bids"`
	EndDate   string        `form:"end_date" bson:"end_date" json:"end_date"`
	Contact   string        `form:"contact" bson:"contact" json:"contact"`
	Pictures  []string      `form:"files" bson:"pictures" json:"pictures"`
	ShortID   string        `bson:"short_id" json:"short_id"`
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

// GetAds method retreive advert from database
func GetAds() (ads []Advert, err error) {
	err = mgoSession.DB("okzdb").C("adverts").Find(bson.M{}).Limit(8).Sort("city").All(&ads)
	if err != nil {
		return
	}
	return
}

// GetHotAuction get auction that are near to their ending
func GetHotAuction() (ads []Advert, err error) {
	err = mgoSession.DB("okzdb").C("adverts").Find(bson.M{}).Limit(10).Sort("created_at").All(&ads)
	if err != nil {
		return
	}
	return
}

// GetAdByShortID Get one ad by it shortID
func GetAdByShortID(shortID string) (ad Advert, Owner User, err error) {
	err = mgoSession.DB("okzdb").C("adverts").Find(bson.M{"short_id": shortID}).One(&ad)
	if err != nil {
		return
	}
	err = mgoSession.DB("okzdb").C("users").Find(bson.M{"_id": ad.OwnerID}).Select(bson.M{"username": 1, "picture": 1, "email": 1}).One(&Owner)
	if err != nil {
		return
	}
	return
}

// GetUserAdsByUserID get adverts of current user
func GetUserAdsByUserID(userID bson.ObjectId) (ads []Advert, err error) {
	err = mgoSession.DB("okzdb").C("adverts").Find(bson.M{"owner_id": userID}).Sort("-created_at").All(&ads)
	if err != nil {
		return
	}
	return
}

// GetFavoritesAdsByUserID find all favorite ad of user
func GetFavoritesAdsByUserID(userID bson.ObjectId) (ads []Advert, err error) {
	var obj = struct {
		FavList []string `bson:"favList"`
	}{}
	err = mgoSession.DB("okzdb").C("users").Find(bson.M{"_id": userID}).Select(bson.M{"favList": 1}).One(&obj)
	if err != nil {
		return
	}
	favList := reverse(obj.FavList)
	for _, shortID := range favList {
		var ad Advert
		err = mgoSession.DB("okzdb").C("adverts").Find(bson.M{"short_id": shortID}).One(&ad)
		if err != nil {
			log.Println(err)
		}
		ads = append(ads, ad)
	}
	return
}

func reverse(slice []string) []string {
	for i := 0; i < len(slice)/2; i++ {
		j := len(slice) - i - 1
		slice[i], slice[j] = slice[j], slice[i]
	}
	return slice
}

// DeleteAdvert delete ad from database collection
func DeleteAdvert(shortID string) (err error) {
	ad, err := ArchiveAdvert(shortID)
	if err != nil {
		return
	}
	err = deleteFromAwsS3(ad.Pictures)
	if err != nil {
		log.Println(err)
	}
	err = mgoSession.DB("okzdb").C("adverts").Remove(bson.M{"short_id": shortID})
	if err != nil {
		return
	}
	err = os.RemoveAll("./public/ad/" + shortID)
	if err != nil {
		return
	}
	return
}

// ArchiveAdvert put ad on trash collection before delete it
func ArchiveAdvert(shortID string) (ad Advert, err error) {
	err = mgoSession.DB("okzdb").C("adverts").Find(bson.M{"short_id": shortID}).One(&ad)
	if err != nil {
		return
	}
	err = mgoSession.DB("okzdb").C("adverts_trash").Insert(&ad)
	if err != nil {
		return
	}
	return
}

// UpdateData update advert data
func (a *Advert) UpdateData(shortID string) (err error) {
	err = mgoSession.DB("okzdb").C("adverts").Update(bson.M{"short_id": shortID}, bson.M{"$set": bson.M{"title": a.Title, "city": a.City, "price": a.Price, "details": a.Details, "contact": a.Contact}})
	if err != nil {
		return
	}
	return
}

// SearchAds function query database with user search parameters
func SearchAds(query string, category string, city string, sort string, skip int) (ads []Advert, err error) {
	switch sort {
	case "Recents":
		err = mgoSession.DB("okzdb").C("adverts").Find(bson.M{"$and": []bson.M{bson.M{"category": bson.M{"$regex": category, "$options": "i"}}, bson.M{"city": bson.M{"$regex": city, "$options": "i"}}, bson.M{"$or": []bson.M{bson.M{"title": bson.M{"$regex": query, "$options": "i"}}, bson.M{"details": bson.M{"$regex": query, "$options": "i"}}, bson.M{"category": bson.M{"$regex": query, "$options": "i"}}}}}}).Skip(skip).Limit(8).Sort("-created_at").All(&ads)
		if err != nil {
			return
		}
	case "Prix croissant":
		err = mgoSession.DB("okzdb").C("adverts").Find(bson.M{"$and": []bson.M{bson.M{"category": bson.M{"$regex": category, "$options": "i"}}, bson.M{"city": bson.M{"$regex": city, "$options": "i"}}, bson.M{"$or": []bson.M{bson.M{"title": bson.M{"$regex": query, "$options": "i"}}, bson.M{"details": bson.M{"$regex": query, "$options": "i"}}, bson.M{"category": bson.M{"$regex": query, "$options": "i"}}}}}}).Skip(skip).Limit(8).Sort("+price").All(&ads)
		if err != nil {
			return
		}
	case "Prix decroissant":
		err = mgoSession.DB("okzdb").C("adverts").Find(bson.M{"$and": []bson.M{bson.M{"category": bson.M{"$regex": category, "$options": "i"}}, bson.M{"city": bson.M{"$regex": city, "$options": "i"}}, bson.M{"$or": []bson.M{bson.M{"title": bson.M{"$regex": query, "$options": "i"}}, bson.M{"details": bson.M{"$regex": query, "$options": "i"}}, bson.M{"category": bson.M{"$regex": query, "$options": "i"}}}}}}).Skip(skip).Limit(8).Sort("-price").All(&ads)
		if err != nil {
			return
		}
	default:
		err = mgoSession.DB("okzdb").C("adverts").Find(bson.M{"$and": []bson.M{bson.M{"category": bson.M{"$regex": category, "$options": "i"}}, bson.M{"city": bson.M{"$regex": city, "$options": "i"}}, bson.M{"$or": []bson.M{bson.M{"title": bson.M{"$regex": query, "$options": "i"}}, bson.M{"details": bson.M{"$regex": query, "$options": "i"}}, bson.M{"category": bson.M{"$regex": query, "$options": "i"}}}}}}).Skip(skip).Limit(8).Sort("-short_id").All(&ads)
		if err != nil {
			return
		}
	}
	return
}
