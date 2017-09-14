package main

import (
	"encoding/json"
	"fmt"
	"github.com/zicodeng/midas/server/middleware"
	"gopkg.in/mgo.v2/bson"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/context"
	mgo "gopkg.in/mgo.v2"
)

func main() {
	fmt.Println("Hello, Midas!")

	// Connect to the database.
	// Database session is not database.
	// It is an instance of database usage.
	dbsession, err := mgo.Dial("localhost:27017")
	if err != nil {
		panic(err)
	}
	defer dbsession.Close()

	// Adapt our handle function using withDB.
	// HandlerFunc(f) is a Handler that calls f.
	handler := middleware.Adapt(http.HandlerFunc(handle), withDB(dbsession))

	// Add our handler.
	http.Handle("/", http.FileServer(http.Dir("/client/public/dist/index.html")))
	http.Handle("/comments", context.ClearHandler(handler))

	// Start the server.
	log.Fatal(http.ListenAndServe(":3000", nil))
}

// This function returns an Adapter that will set up or tear down
// the database session for our handlers and store it in a context,
// so our handlers can get it back later.
func withDB(dbsession *mgo.Session) middleware.Adapter {

	// Return an Adapter.
	return func(handler http.Handler) http.Handler {

		// The adapter (when called) should return a new handler.
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

			// Copy the database session.
			dbsession := dbsession.Copy()
			defer dbsession.Close()

			// Save it in the mux context.
			context.Set(r, "dbsession", dbsession)

			// Pass execution to the original handler.
			handler.ServeHTTP(w, r)
		})
	}
}

// handle is a function handles HTTP request depending on the HTTP method.
func handle(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "GET":
		handleRead(w, r)
	case "POST":
		handleInsert(w, r)
	default:
		http.Error(w, "Not supported", http.StatusMethodNotAllowed)
	}
}

// This comment struct represents a single comment.
type comment struct {
	// bson.ObjectId is provided by mgo and represents a MongoDB identifier.
	// backtics `` describes how we want our data to look in different contexts
	// such as JSON and BSON.
	ID     bson.ObjectId `json:"id" bson:"_id"`
	Author string        `json:"author" bson:"author"`
	Text   string        `json:"text" bson:"text"`
	When   time.Time     `json:"when" bson:"when"`
}

func handleInsert(w http.ResponseWriter, r *http.Request) {
	// Retrieve database session from context.
	// We can retrieve it because withDB Adapter has put it there for us.
	dbsession := context.Get(r, "dbsession").(*mgo.Session)

	// Decode the request body.
	var comment comment
	if err := json.NewDecoder(r.Body).Decode(&comment); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Give the comment a unique ID and set the time.
	comment.ID = bson.NewObjectId()
	comment.When = time.Now()

	// Insert it into the database.
	if err := dbsession.DB("commentsapp").C("comments").Insert(&comment); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Redirect to it.
	http.Redirect(w, r, "/comments/"+comment.ID.Hex(), http.StatusTemporaryRedirect)
}

func handleRead(w http.ResponseWriter, r *http.Request) {
	// Set response content type to be JSON.
	w.Header().Set("Content-Type", "application/json")

	dbsession := context.Get(r, "dbsession").(*mgo.Session)

	// Load the comments.
	var comments []*comment

	if err := dbsession.DB("commentsapp").C("comments").
		Find(nil).Sort("-when").Limit(100).All(&comments); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Write it out
	if err := json.NewEncoder(w).Encode(comments); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}
