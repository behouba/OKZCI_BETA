package controllers

import (
	"bytes"
	"fmt"
	"html/template"
	"log"
	"net/smtp"

	"github.com/behouba/OKZ_BETA_0.01/models"
	"github.com/kataras/iris"
)

type request struct {
	from    string
	to      []string
	subject string
	body    string
}

type message struct {
	SenderName  string `json:"userName"`
	SenderEmail string `json:"userEmail"`
	AdURL       string `json:"url"`
	OwnerEmail  string `json:"ownerEmail"`
	OwnerName   string `json:"ownerName"`
	Body        string `json:"body"`
}

var mailConfig = models.Config.MailConfig

const (
	MIME = "MIME-version: 1.0;\nContent-Type: text/html; charset=\"UTF-8\";\n\n"
)

func newRequest(to []string, subject string) *request {
	return &request{
		to:      to,
		subject: subject,
	}
}

func (r *request) parseTemplate(fileName string, data interface{}) error {
	t, err := template.ParseFiles(fileName)
	if err != nil {
		return err
	}
	buffer := new(bytes.Buffer)
	if err = t.Execute(buffer, data); err != nil {
		return err
	}
	r.body = buffer.String()
	return nil
}

func (r *request) sendMail() error {
	body := "To: " + r.to[0] + "\r\nSubject: " + r.subject + "\r\n" + MIME + "\r\n" + r.body
	SMTP := fmt.Sprintf("%s:%d", mailConfig.Server, mailConfig.Port)
	if err := smtp.SendMail(SMTP, smtp.PlainAuth("", mailConfig.Email, mailConfig.Password, mailConfig.Server), mailConfig.Email, r.to, []byte(body)); err != nil {
		return err
	}
	return nil
}

func (r *request) send(templateName string, items interface{}) error {
	err := r.parseTemplate(templateName, items)
	if err != nil {
		return err
	}
	if err := r.sendMail(); err != nil {
		log.Printf("Failed to send the email to %s\n", r.to)
		return err
	}
	log.Printf("Email has been sent to %s\n", r.to)
	return nil
}

func messagesHandler(ctx iris.Context) {
	var msg message
	ctx.ReadJSON(&msg)
	log.Println(msg)
	if err := sendMailMessage(msg); err != nil {
		log.Println(err)
		ctx.StatusCode(iris.StatusInternalServerError)
		return
	}
	log.Println("message envoyé")
}

func sendMailMessage(message message) error {
	subject := "VOUS VENEZ DE RECEVOIR UN MESSAGE CONCERNANT L'UNE DE VOS ANNONCES SUR OKAZION"
	r := newRequest([]string{message.OwnerEmail}, subject)
	err := r.send("views/email/msgEmailTemplate.html", message)
	if err != nil {
		return err
	}
	return nil
}

func reportAd(ctx iris.Context) {
	msg := struct {
		Body    string
		ShortID string
	}{}
	ctx.ReadJSON(&msg)
	if err := sendMailToAdmins("UNE ANNONCE VIENS D'ETRE SIGNALÉE", msg.Body, msg.ShortID, mailConfig.AdminsEmails); err != nil {
		log.Println(err)
		ctx.StatusCode(iris.StatusInternalServerError)
		return
	}
	log.Println("report message sent to admin")
}

func sendMailToAdmins(subject, body, shortID string, receivers []string) error {
	data := struct {
		Title   string
		Body    string
		ShortID string
	}{
		Title:   subject,
		Body:    body,
		ShortID: shortID,
	}
	r := newRequest(receivers, subject)
	err := r.send("views/email/emailTemplate.html", data)
	if err != nil {
		return err
	}
	return nil
}

// sendVerificationMail send email with pin code to users
func sendVerificationMail(to, pin string) error {
	subject := "CODE DE VERIFICATION"

	r := newRequest([]string{to}, subject)
	err := r.send("views/email/verification.html", pin)
	if err != nil {
		return err
	}
	return nil
}
