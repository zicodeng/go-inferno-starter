package middleware

import (
	"net/http"
)

// Adapter represents an http.Handler wrapper.
// An http.Hanlder wrapper is a function that has one input argument
// and one output argument, both of type http.Hanlder.
// The idea is that we can take in a http.Handler and return a new one
// that does something different before and/or after calling the ServeHTTP
// method on the original.
type Adapter func(http.Handler) http.Handler

// Adapt converts http.Handler to Adapter(http.Hanlder wrapper).
func Adapt(handler http.Handler, adapters ...Adapter) http.Handler {
	for _, adapter := range adapters {
		handler = adapter(handler)
	}
	return handler
}
