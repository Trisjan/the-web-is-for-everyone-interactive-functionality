import express from "express";

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

// app.get("/method/:slug", async (request, response) => {
//   const urlMethod = baseurl + 'method/' + request.params.slug
//   // const slugUrl = request.params.slug || "/roadmap"
//   // console.log(baseurl + "method/" + slugUrl)
//   // const data = await fetch(baseurl + "method/" + slugUrl).then((response) => response.json())
//   const data = await fetch(urlMethod).then((response) => response.json())
//   console.log(data)

//   response.render("method", data)
// })


app.get("/method/:slug", (request, response) => {
  let detailPageUrl = url + "method/" + request.params.slug;

  fetchJson(detailPageUrl).then((data) => {
    response.render("detail-page", data);
  });
});

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