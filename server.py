import json
from bottle import *

@get("/json/<filename>")
def serve_json(filename):
    response.content_type = "application/json"
    with open("json/%s" % filename) as f:
        return f.read()

@get("/array/<category>")
def serve_array(category, cache={}):
    response.content_type = "application/json"
    if category not in cache:
        with open("json/kaomoji.json") as f:
            kaomoji = json.load(f).setdefault(category, [])
        cache[category] = json.dumps(kaomoji)
    return cache[category]

@get("/list")
@get("/list/")
@get("/list/<category>")
def list(category="all"):
    return template("list", category=category)

@get("/")
@get("/<filename:path>")
def index(filename="index.html"):
    return static_file(filename, root="public")

if __name__ == "__main__":
    run(host="localhost", port=8080, debug=True, reloader=True) 
