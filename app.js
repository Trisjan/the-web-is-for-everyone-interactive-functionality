import express from "express";

// API en de data fetchen
const url = "https://api.visualthinking.fdnd.nl/api/v1/methods?first=100";
const data = await fetch(url).then((response) => response.json());

// Maak een nieuwe express app
const app = express();

// Stel ejs in als template engine en geef de views map door
app.set("view engine", "ejs");
app.set("views", "./views");

// Gebruikt de map 'public' voor statische resources
app.use(express.static("public"));

// Maak een route voor de index
app.get("/", function (req, res) {
    res.render("index", data);
});

// Het poortnummer waarop de site lokaal gedraait wordt
app.set("port", process.env.PORT || 8000);

//
app.listen(app.get("port"), function () {
    //
    console.log(`Application started on http://localhost:${app.get("port")}`)
})