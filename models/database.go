package models

import (
	"log"

	"github.com/kataras/iris/sessions"
	"gopkg.in/mgo.v2"
	// postgresql driver
)

var mgoSession *mgo.Session
var err error

// var redisDb *redis.Database

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
	// redisDb = redis.New(service.DefaultConfig())

	Sess = sessions.New(sessions.Config{
		// Cookie string, the session's client cookie name, for example: "mysessionid"
		//
		// Defaults to "irissessionid"
		Cookie: "mysessionid",
		// it's time.Duration, from the time cookie is created, how long it can be alive?
		// 0 means no expire.
		// -1 means expire when browser closes
		// or set a value, like 2 hours:
		Expires: 0,
		// if you want to invalid cookies on different subdomains
		// of the same host, then enable it.
		// Defaults to false.
		DisableSubdomainPersistence: true,
		// AllowReclaim will allow to
		// Destroy and Start a session in the same request handler.
		// All it does is that it removes the cookie for both `Request` and `ResponseWriter` while `Destroy`
		// or add a new cookie to `Request` while `Start`.
		//
		// Defaults to false.
		AllowReclaim: true,
	})
	// Sess.UseDatabase(redisDb)

}
