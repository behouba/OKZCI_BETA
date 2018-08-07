package models

import (
	"log"
	"mime/multipart"
	"strings"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/aws/aws-sdk-go/service/s3/s3manager"
	"github.com/kataras/iris"
)

var myAwsSess = session.Must(session.NewSession(&aws.Config{
	Region:      aws.String("eu-west-3"),
	Credentials: credentials.NewStaticCredentials("", "", ""),
}))

// UploadFormFilesToAwsS3 used to upload form files to aws S3 bucket
func UploadFormFilesToAwsS3(ctx iris.Context, folder string) (urls []string, err error) {
	err = ctx.Request().ParseMultipartForm(ctx.Application().ConfigurationReadOnly().GetPostMaxMemory())
	if err != nil {
		return urls, err
	}

	if ctx.Request().MultipartForm != nil {
		if fhs := ctx.Request().MultipartForm.File; fhs != nil {
			for _, files := range fhs {
				for _, file := range files {
					url, err0 := uploadToAwsS3(file, myAwsSess, folder)
					if err0 != nil {
						return urls, err0
					}
					urls = append(urls, url)
				}
			}
			return urls, nil
		}
	}
	return
}

func uploadToAwsS3(f *multipart.FileHeader, awsSession *session.Session, folder string) (path string, err error) {
	// The session the S3 Uploader will use

	file, err := f.Open()
	if err != nil {
		return
	}
	defer file.Close()
	// Create an uploader with the session and default options
	uploader := s3manager.NewUploader(awsSession)
	// Upload the file to S3.
	result, err := uploader.Upload(&s3manager.UploadInput{
		Bucket: aws.String("okazion"),
		Key:    aws.String(folder + f.Filename),
		Body:   file,
		ACL:    aws.String("public-read"),
	})
	if err != nil {
		log.Println(err)
		return
	}
	log.Println("file uploaded to ", result.Location)
	return result.Location, err
}
func deleteFromAwsS3(urls []string) (err error) {
	svc := s3.New(myAwsSess)

	for _, url := range urls {
		key := strings.Split(url, "amazonaws.com/")[1]
		_, err = svc.DeleteObject(&s3.DeleteObjectInput{Bucket: aws.String("okazion"), Key: aws.String(key)})
		if err != nil {
			log.Println(err)
		}

		err = svc.WaitUntilObjectNotExists(&s3.HeadObjectInput{
			Bucket: aws.String("okazion"),
			Key:    aws.String(key),
		})
		if err != nil {
			log.Println(err)
		}

		log.Printf("file %s deleted", key)
	}
	return
}
