from bottle import *

@get("/")
@get("/<path:path>")
def index(path="index.html"):
    if path.replace("/", "") == "kdb":
        path = "kdb/index.html"
    return static_file(path, root="./static")

if __name__ == "__main__":
    run(host="localhost", port=8080, debug=True, reloader=True)

application = default_app()