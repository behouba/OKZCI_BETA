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

var mgoSession *mgo.Session
var err error
var redisDb *redis.Database

// var mongoURI = "mongodb://behouba:45001685@okzdb-shard-00-00-fo6si.mongodb.net:27017,okzdb-shard-00-01-fo6si.mongodb.net:27017,okzdb-shard-00-02-fo6si.mongodb.net:27017/admin?replicaSet=OKZDB-shard-0&authSource=admin"

// Sess for sessions
var Sess *sessions.Sessions

func init() {
	// dialInfo, err := mgo.ParseURL(mongoURI)
	// if err != nil {
	// 	log.Println(err)
	// 	panic(err)
	// }
	// tlsConfig := &tls.Config{}
	// dialInfo.DialServer = func(addr *mgo.ServerAddr) (net.Conn, error) {
	// 	conn, err := tls.Dial("tcp", addr.String(), tlsConfig)
	// 	return conn, err
	// }
	// mgoSession, err = mgo.DialWithInfo(dialInfo)
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
