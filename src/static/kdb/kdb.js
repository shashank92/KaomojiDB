(function() {
    // Internal state variables.
    var kaomoji, currentCategory, kArr;
    var applyCategory = function(category) {
        var c = category || currentCategory;
        if (c === "all") {
            kArr = Object.getOwnPropertyNames(kaomoji[c]);
        } else {
            kArr = kaomoji[c];
        }
    };
    var loadKaomoji = function(kArr) {
        var kTable = document.getElementById("kaomoji-table");
        var html = "";
        for (var i = 0; i < kArr.length; i++) {
            if (i % 4 === 0)
                html += "<tr>\n";
            html += "<td>" + kArr[i] + "</td>\n";
            if ((i+1) % 4 === 0)
                html += "</tr>\n";
        }
        // Delete "Loading . . ." TextNode.
        document.getElementById("loading-message").textContent = "";
        kTable.innerHTML = html;
    };
    var searchLoadKaomoji = function(searchStr) {
        loadKaomoji(kArr.filter(function(k) {
            return k.indexOf(searchStr) > -1;
        }));
    };
    var applyDCCListeners = function() {
        var tds = document.getElementsByTagName("td");
        for (var i = 0; i < tds.length; i++) {
            var td = tds[i];
            td.addEventListener("click", function() {
                var currentClickTime = Date.now();
                var lastClickTime = this.attributes["data-lct"] || 0;
                if (currentClickTime - lastClickTime < 400) {
                    // Double-click detected.
                    var selection = window.getSelection();
                    selection.removeAllRanges();
                    var range = document.createRange();
                    range.selectNodeContents(this);
                    selection.addRange(range);
                    // Currently incompatible with Safari
                    if (document.execCommand("copy")) {
                        var that = this;
                        var k = this.textContent;
                        setTimeout(function() {
                            that.textContent = k;
                        }, 500);
                        this.textContent = "Copied to clipboard!";
                    } else {
                        alert("Sorry, your browser doesn't support copying to clipboard. Try using (ctrl/cmd)+C.")
                    }
                }
                this.attributes["data-lct"] = currentClickTime;
            });
        }
    };
    var applySCListeners = function() {
        var categoryButtons = document.getElementsByClassName("category-selector");
        for (var i = 0; i < categoryButtons.length; i++) {
            var button = categoryButtons[i];
            button.addEventListener("click", function() {
                var selected = document.getElementsByClassName("selected");
                for (var j = 0; j < selected.length; j++)
                    selected[j].className = "";
                this.className = "selected";
                currentCategory = this.textContent;
                applyCategory(currentCategory);
                loadKaomoji(kArr);
                applyDCCListeners();
            });
        }
    };
    
    var request = new XMLHttpRequest();
    request.open('GET', '/kdb/json/kaomoji.json', true);
    request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
            kaomoji = JSON.parse(request.responseText);
            applyCategory("all");
            loadKaomoji(kArr);
            applyDCCListeners();
            
            // Add category buttons to DOM.
            var categories = Object.getOwnPropertyNames(kaomoji).sort();
            var buttonsInnerHTML = "";
            for (var i = 0; i < categories.length; i++) {
                var category = categories[i];
                buttonsInnerHTML += "<button class=\"category-selector\">" +
                                        category + "</button>\n";
            }
            var buttons = document.getElementById("buttons");
            buttons.innerHTML = buttonsInnerHTML;
            buttons.childNodes[0].className += " selected";
            applySCListeners();
        } else {
            console.log("There was an error in retrieving the kaomoji. \
                            FORGIVE ME SENPAI. ༼つ☯﹏☯༽つ");
        }
    };
    request.send();
    
    //Searching through current set of kaomoji.
    document.getElementById("search").addEventListener("input", function() {
        searchLoadKaomoji(this.value);
    });
    
    // Copying to clipboard from textarea.
    document.getElementById("copy-button").addEventListener("click", function() {
        var createKaomoji = document.getElementById("create-kaomoji");
        var selection = window.getSelection();
        selection.removeAllRanges();
        var textArea = document.getElementById("create-kaomoji");
        var helper = document.getElementById("create-kaomoji-helper");
        helper.textContent = textArea.value;
        var range = document.createRange();
        range.selectNodeContents(helper);
        selection.addRange(range);
        console.log(selection);
        // Currently incompatible with Safari
        var success = document.execCommand("copy");
        helper.textContent = "";
        if (success) {
            var that = this;
            var k = this.textContent;
            setTimeout(function() {
                that.textContent = k;
            }, 500);
            this.textContent = "Copied!";
        } else {
            alert("Sorry, your browser doesn't support copying to clipboard. Try using (ctrl/cmd)+C.")
        }
    });
}());