import express, { request, response } from "express";

// API en de data fetchen
const url = "https://api.visualthinking.fdnd.nl/api/v1/";

// Maak een nieuwe express app
const app = express();

// Stel in hoe we express gebruiken
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("public"));

// Stel afhandeling van formulieren inzx
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

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

app.get('/method/:slug/form', (request, response) => {

  const baseurl = "https://api.visualthinking.fdnd.nl/api/v1/"
  const commentUrl = `${baseurl}comments` + "?id=" + request.query.id

  let detailPageUrl = baseurl + "method/" + request.params.slug;

  fetchJson(detailPageUrl).then((data) => {
      fetchJson(commentUrl).then((data2) => {
          const newdata = { detail: data, form: data2, slug: request.params.slug }
          response.render('form', newdata)
      })
  })
})

app.post('/method/:slug/form', (request, response) => {

  const baseurl = "https://api.visualthinking.fdnd.nl/api/v1/"
  const url = `${baseurl}comments`

  postJson(url, request.body).then((data) => {
      let newComment = { ...request.body }

      console.log(newComment);

      if (data.success) {
          response.redirect("/method/" + request.params.slug + "/form?id=" + request.body.methodId)
      } else {
          const errormessage = `${data.message}: Werkt niet:(`
          const newdata = { error: errormessage, values: newComment }

          response.render('form', newdata)
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
      headers: { 'Content-Type': 'application/json' },
  })
      .then((response) => response.json())
      .catch((error) => error)
}