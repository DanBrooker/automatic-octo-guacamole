//=require lunr/lunr

// load search index

// page load
var idx = false;

function search(term) {
  if(idx) {
    var results = idx.search(term);
    console.log("results", results);
    var el = document.querySelector("#results");
    el.innerHTML = results.map(function(r) {
      return r.ref;
    });
  } else {
    console.log("waiting");

    setTimeout(function() {
      search(term);
    }, 500);
  }
}

document.addEventListener('DOMContentLoaded', function() {
  console.log("loaded");

  var request = new XMLHttpRequest();
  request.open('GET', "/search/data.json", true);

  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      var documents = JSON.parse(request.responseText);
      console.log("data.json", documents);
      idx = lunr(function () {
        this.ref('url');
        this.field('title');

        documents.forEach(function (doc) {
          this.add(doc)
        }, this)
      });

    } else {
      console.log("data.json", documents);
    }
  };

  request.onerror = function() {
    // There was a connection error of some sort
    console.log("error", request);
  };

  request.send();

  var queryStringRegex = /[\?&]q=([^&]+)/g;
  var matches = queryStringRegex.exec(window.location.search);
  if (matches && matches[1]) {
    var value = decodeURIComponent(matches[1].replace(/\+/g, "%20"));
    console.log("q=", value);

    search(value + "*");
  }

});
