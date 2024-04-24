package main

import (
	"database/sql"
	"embed"
	"fmt"
	_ "github.com/lib/pq"
	"log"
	"os"
	"strings"
)

const (
	version   = "6.2.0" // # x-release-please-version
	dbDialect = "postgres"
)

//go:embed migrations/*.sql
var embedMigrations embed.FS //

func main() {

	log.Println(fmt.Sprintf("migrator: v%s", version))
	log.Println("migrator: starting DB migrations...")

	//appUserPassword := "user" //getVar("DB_APP_USER_PASSWORD", true)
	//devUserPassword := "user" //getVar("DB_DEV_USER_PASSWORD", true)
	gooseDbString := getVar("GOOSE_DBSTRING", true)

	db, err := sql.Open(dbDialect, gooseDbString)
	if err != nil {
		log.Println("DB: failed while connecting to DB")
		log.Panic(err)
	}

	defer func(db *sql.DB) {
		err := db.Close()
		if err != nil {
			log.Panic(err)
		}
	}(db)

	log.Println("DB: dumping data to MYSQL")
	files, err := os.ReadDir("migrations/")
	if err != nil {
		log.Fatal(err)
	}

	for _, file := range files {
		if !file.IsDir() {
			err = loadSqlFile(db, file.Name())
			if err != nil {
				log.Println("DB: ERROR while exec sql script - ", file.Name())
			} else {
				log.Println("DB: data migration was successful! ")
			}
		}
	}
	if err == nil {
		log.Println("migrator: all operations finished!")
	} else {
		log.Println("FAILED: migration was not successful")
	}
}

func loadSqlFile(db *sql.DB, fileName string) error {
	log.Println("Migrating ", fileName)
	file, err := os.ReadFile("migrations/" + fileName)
	//fmt.Println(string(file))
	qs := strings.Split(string(file), ";\n")
	if err != nil {
		fmt.Println(err.Error())
		panic(err)
	}

	// Execute all
	for _, q := range qs {
		_, err = db.Exec(q)
		if err != nil {
			fmt.Println(err.Error())
			fmt.Println(q)
			panic(err)
		}
	}

	return err
}

func getVar(envVarName string, panicIfEmpty bool) string {
	v := os.Getenv(envVarName)
	if panicIfEmpty && 0 == len(strings.TrimSpace(v)) {
		msg := fmt.Sprintf("env var %s is empty", envVarName)
		log.Println(fmt.Sprintf("migrator: %s", msg))
		panic(msg)
	}
	return v
}
