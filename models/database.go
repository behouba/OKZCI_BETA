package models

import (
	"crypto/tls"
	"log"
	"net"

	"github.com/BurntSushi/toml"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/kataras/iris/sessions"
	"github.com/kataras/iris/sessions/sessiondb/redis"
	"github.com/kataras/iris/sessions/sessiondb/redis/service"
	"gopkg.in/mgo.v2"
	// postgresql driver
)

var mgoSession *mgo.Session
var err error

var redisDb *redis.Database

// Sess for sessions
var Sess *sessions.Sessions

// Config hold all credentials and authentification data
var Config tomlConfig

// Aws session
var myAwsSess *session.Session

type database struct {
	URI       string
	S3ID      string
	S3Secret  string
	AwsRegion string
}

type mailConfig struct {
	Name         string
	Email        string
	Password     string
	AdminsEmails []string
	Server       string
	Port         int
}

type endPoint struct {
	Ads   string
	Users string
}

type tomlConfig struct {
	Title      string
	DB         database   `toml:"database"`
	MailConfig mailConfig `toml:"mailConfig"`
	EndPoint   endPoint   `toml:"endPoint"`
}

func init() {

	_, err := toml.DecodeFile("config.toml", &Config)
	if err != nil {
		log.Println(err)
		return
	}
	mongoURI := Config.DB.URI + "admin?replicaSet=OKZDB-shard-0&authSource=admin"
	log.Println(Config.DB.AwsRegion)
	dialInfo, err := mgo.ParseURL(mongoURI)
	if err != nil {
		log.Println(err)
		panic(err)
	}
	tlsConfig := &tls.Config{}
	dialInfo.DialServer = func(addr *mgo.ServerAddr) (net.Conn, error) {
		conn, err := tls.Dial("tcp", addr.String(), tlsConfig)
		return conn, err
	}
	mgoSession, err = mgo.DialWithInfo(dialInfo)
	// mgoSession, err = mgo.Dial("localhost")
	if err != nil {
		log.Println(err)
		panic(err)
	}
	log.Println("connected to mongodb")
	redisDb = redis.New(service.DefaultConfig())

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
	Sess.UseDatabase(redisDb)

	// aws session configuration
	myAwsSess = session.Must(session.NewSession(&aws.Config{
		Region:      aws.String(Config.DB.AwsRegion),
		Credentials: credentials.NewStaticCredentials(Config.DB.S3ID, Config.DB.S3Secret, ""),
	}))
}
