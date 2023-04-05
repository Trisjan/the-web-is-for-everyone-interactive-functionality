import express, { request, response } from "express";

// API en de data fetchen
const url = "https://api.visualthinking.fdnd.nl/api/v1/";

// Maak een nieuwe express app
const app = express();

// Stel in hoe we express gebruiken
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("public"));

// Maak een route voor de index
app.get("/", (request, response) => {
  let methodsUrl = url + "/methods?first=100";
  fetchJson(methodsUrl).then((data) => {
    response.render("index", data);
  });
});

// de route voor een geselecteerde method en daarvan de detail pagina
app.get("/method/:slug", (request, response) => {
  // pak de url variabele van de api + method/ + de meegegeven slug van de gekozen methode
  let detailPageUrl = url + "method/" + request.params.slug;
  fetchJson(detailPageUrl).then((data) => {
    //render de view detail-page en geef de data mee
    response.render("detail-page", data);
  });
});

app.get("/method/:slug/stappenplan", (request, response) => {
  let detailPageUrl = url + "method/" + request.params.slug;
  fetchJson(detailPageUrl).then((data) => {
    //render de view steps en geef de data mee
    response.render("stappenplan", data);
  });
});

app.get("/method/:slug/examples", (request, response) => {
  let detailPageUrl = url + "method/" + request.params.slug;
  fetchJson(detailPageUrl).then((data) => {
    //render de view examples en geef de data mee
    response.render("examples", data);
  });
});

app.get("/method/:slug/comments", (request, response) => {
  let commentUrl = url + "method/" + request.params.slug;
  console.log(commentUrl);
  fetchJson(commentUrl).then((data) => {
    //render de view steps en geef de data mee
    response.render("comments", data);
  });
});

app.post('/method/:slug/comment', (request, response) => {
  const baseurl = "https://api.visualthinking.fdnd.nl/api/v1/";
  const url = `${baseurl}comments`;

  console.log("verstuurd:");
  console.log(request.body);

    postJson(url, request.body).then((data) => {
    console.log("ontvangen:");
    console.log(data);
    if (data.success) {
      response.redirect(
        "/method/" + request.params.slug + "/comments?methodPosted=true"
      );
    } else {
      response.redirect(
        "/method/" + request.params.slug + "/comments?methodPosted=false"
      );
    }
  })
})

// Het poortnummer waarop de site lokaal gedraait wordt
app.set("port", process.env.PORT || 8000);

//
app.listen(app.get("port"), function () {
    //
    console.log(`Application started on http://localhost:${app.get("port")}`)
})

/**
 * Wraps the fetch api and returns the response body parsed through json
 * @param {*} url the api endpoint to address
 * @returns the json response from the api endpoint
 */
async function fetchJson(url) {
  return await fetch(url)
    .then((response) => response.json())
    .catch((error) => error);
}



/**
 * postJson() is a wrapper for the experimental node fetch api. It fetches the url
 * passed as a parameter using the POST method and the value from the body paramater
 * as a payload. It returns the response body parsed through json.
 * @param {*} url the api endpoint to address
 * @param {*} body the payload to send along
 * @returns the json response from the api endpoint
 */
export async function postJson(url, body) {
  return await fetch(url, {
      method: 'post',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json'
      },
    })
    .then((response) => response.json())
    .catch((error) => error)
}