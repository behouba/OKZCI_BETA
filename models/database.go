package models

import (
	"log"
	"time"

	"github.com/kataras/iris/sessions"
	"github.com/kataras/iris/sessions/sessiondb/redis"
	"github.com/kataras/iris/sessions/sessiondb/redis/service"
	"gopkg.in/mgo.v2"
	// postgresql driver
)

var connectDB = "mongodb://localhost"
var mgoSession *mgo.Session
var err error
var redisDb *redis.Database

// session
var Sess *sessions.Sessions

func init() {
	mgoSession, err = mgo.Dial("localhost")
	if err != nil {
		log.Println(err)
		panic(err)
	}

	log.Println("connected to mongodb")
	redisDb = redis.New(service.Config{
		Network:     "tcp",
		Addr:        "127.0.0.1:6379",
		Password:    "",
		Database:    "",
		MaxIdle:     0,
		MaxActive:   0,
		IdleTimeout: time.Duration(5) * time.Minute,
		Prefix:      ""})

	Sess = sessions.New(sessions.Config{
		Cookie:       "session-okz",
		Expires:      -1,
		AllowReclaim: true,
	},
	)

	Sess.UseDatabase(redisDb)

}
