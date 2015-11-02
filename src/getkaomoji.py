import requests, json, functools
from bs4 import BeautifulSoup as BS

def getkaomoji():
    headers = {"User-Agent": "007"}
    requests.get = functools.partial(requests.get, headers=headers)
    url = "http://dongerlist.com"
    r = requests.get(url)
    soup = BS(r.text, "html.parser")
    anchors = soup.findAll("a", attrs={"class": "list-2-anchor"})[1:]
    category_urls = {a.text.lower(): a["href"] for a in anchors}
    kaomoji = {category: [] for category in category_urls}
    kaomoji["all"] = {}
    for category, url in category_urls.items():
        print("Scraping %s ..." % url)
        page_number = 1
        while True:
            print("Is there a page %d? owo" % page_number)
            r = requests.get("%s/page/%d" % (url, page_number))
            if r.status_code == 200:
                print("Yeah! ;D")
                soup = BS(r.text, "html.parser")
                textareas = soup.findAll("textarea", attrs={"class": "donger"})
                kaomoji_list = [textarea.text for textarea in textareas]
                kaomoji[category].extend(kaomoji_list)
                kaomoji["all"].update({k: True for k in kaomoji_list})
            else:
                print("No. D;")
                break
            page_number += 1
    print("Success.")
    return kaomoji

if __name__ == "__main__":
    k = kaomoji = getkaomoji()
    with open("static/kdb/json/kaomoji.json", "w") as f:
        json.dump(kaomoji, f)