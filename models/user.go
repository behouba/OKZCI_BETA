package models

import (
	"errors"

	"golang.org/x/crypto/bcrypt"

	"gopkg.in/mgo.v2/bson"
)

// User struct define data for all users
type User struct {
	ID          bson.ObjectId `bson:"_id"`
	UserName    string        `json:"userName"`
	Email       string        `json:"email"`
	PhoneNumber string        `json:"phoneNumber"`
	Password    string        `json:"password"`
	Picture     string        `json:"picture"`
	CreatedAt   string        `json:"date"`
	Location    string        `json:"location"`
	Pin         string        `json:"pin"`
	Auth        string        `json:"auth"`
}

// StoreUserData store new user data into database
func (u *User) StoreUserData() (err error) {
	u.ID = bson.NewObjectId()
	err = mgoSession.DB("okzdb").C("users").Insert(&u)
	if err != nil {
		return
	}
	return nil
}

// AlreadyUser check is new user is already registered
func (u *User) AlreadyUser() (ok bool) {
	var user User
	err := mgoSession.DB("okzdb").C("users").Find(bson.M{"email": u.Email}).One(&user)
	if err != nil {
		ok = false
	} else if user.Pin != "" {
		mgoSession.DB("okzdb").C("users").Remove(bson.M{"email": u.Email})
		return
	} else if user.Email == u.Email {
		ok = true
	} else {
		ok = false
	}
	return
}

// CheckPinCode check if pin code sent by email is correct
func (u *User) CheckPinCode(pin string) (err error) {
	err = mgoSession.DB("okzdb").C("users").Find(bson.M{"pin": pin}).One(&u)
	if err != nil {
		return
	}
	if u.Pin != pin {
		return errors.New("pin code is invalid")
	}
	err = mgoSession.DB("okzdb").C("users").Update(bson.M{"pin": pin}, bson.M{"$unset": bson.M{"pin": pin}})
	if err != nil {
		return
	}
	return
}

// Authenticate check user login information
func (u *User) Authenticate() (err error) {
	var dbUser User
	err = mgoSession.DB("okzdb").C("users").Find(bson.M{"email": u.Email}).One(&dbUser)
	if err != nil {
		return
	}
	if dbUser.Pin != "" {
		return errors.New("you must validate email address")
	}
	if dbUser.Auth != "email" {
		return errors.New("must login with google or facebook")
	}
	err = bcrypt.CompareHashAndPassword([]byte(dbUser.Password), []byte(u.Password))
	if err != nil {
		return
	}
	return
}

// GetUserToRecover check if user exist in DB and if is registred with email address
func GetUserToRecover(email string) (user User, err error) {
	err = mgoSession.DB("okzdb").C("users").Find(bson.M{"email": email}).One(&user)
	if err != nil {
		return
	}
	if user.Auth != "email" {
		return User{}, errors.New("account created with facebook or google")
	}
	return
}

// UpdateUserData Update user data
func (u *User) UpdateUserData() (err error) {
	u.ID = bson.NewObjectId()
	err = mgoSession.DB("okzdb").C("users").
		Update(bson.M{"email": u.Email}, bson.M{"$set": bson.M{"username": u.UserName, "phonenumber": u.PhoneNumber, "picture": u.Picture, "location": u.Location, "pin": u.Pin}})
	if err != nil {
		return
	}
	return nil
}

// UpdatePassword update user password
func (u *User) UpdatePassword() (err error) {
	err = mgoSession.DB("okzdb").C("users").Update(bson.M{"email": u.Email}, bson.M{"$set": bson.M{"password": u.Password}})
	if err != nil {
		return
	}
	return
}

// AuthenticateGoogleUser authenticate google users
func (u *User) AuthenticateGoogleUser() (err error) {
	var dbUser User
	err = mgoSession.DB("okzdb").C("users").Find(bson.M{"email": u.Email}).One(&dbUser)
	if err != nil {
		if err = u.StoreUserData(); err != nil {
			return
		}
		return
	}
	if dbUser.Auth != "google" {
		return errors.New("user already register with this email but not with google")
	}
	return
}

// AuthenticateFbUser authenticate facebook users
func (u *User) AuthenticateFbUser() (err error) {
	var dbUser User
	err = mgoSession.DB("okzdb").C("users").Find(bson.M{"email": u.Email}).One(&dbUser)
	if err != nil {
		if err = u.StoreUserData(); err != nil {
			return
		}
		return
	}
	if dbUser.Auth != "facebook" {
		return errors.New("user already register with this email but not with facebook")
	}
	return
}

// GetUserByEmail get user data from database by their email
func GetUserByEmail(email string) (user User, err error) {
	err = mgoSession.DB("okzdb").C("users").Find(bson.M{"email": email}).One(&user)
	if err != nil {
		return
	}
	return
}
