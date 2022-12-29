import * as url from "node:url";
import * as path from "node:path";
import express from "express";
import hbs from "hbs";
import { geocode } from "./utils/geocode.js";
import { forecast } from "./utils/forecast.js";

//since we are using the ESM standard, we cant access the inbuilt globals such as filename, dirname
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

const app = express();
const PORT = process.env.PORT || 3000; //

//define paths for express config
const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

//setup handlebars engine and views location
app.set("view engine", "hbs"); //hbs setup
app.set("views", viewsPath); //the default folder where templates are looked up, is the "views" folder, if the name of the folder is something else then, it results in an error, we can change the path for looking for views as follows
hbs.registerPartials(partialsPath);

//setup static directory to serve
app.use(express.static(publicDirectoryPath)); //app.use - its a way to customise your server
//this express.static is for serving static webpages
//for dynamic web pages use template engines

//to serve a template we use these routes
app.get("", (req, res) => {
  res.render("index", {
    title: "Weather App",
    name: "Aneesh Subudhi",
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About",
    name: "Aneesh Subudhi",
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    title: "Help",
    message: "This website is used for knowing the weather of the place",
    name: "Aneesh Subudhi",
  });
});

app.get("/help/*", (req, res) => {
  res.render("404", {
    title: "404",
    errorMessage: "Help article not found",
    name: "Aneesh Subudhi",
  });
});

app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: "Please provide an address",
    });
  }

  geocode(
    req.query.address,
    (error, { location, latitude, longitude } = {}) => {
      if (error) {
        return res.send({
          error,
        });
      }
      forecast(latitude, longitude, (error, data) => {
        if (error) {
          return res.send({
            error,
          });
        }

        res.send({
          location,
          data,
          address: req.query.address,
        });
      });
    }
  );
});

app.get("*", (req, res) => {
  res.render("404", {
    title: "404",
    errorMessage: "Path not found",
    name: "Aneesh Subudhi",
  });
});

app.listen(PORT, () => {
  console.log(`Server is up on port ${PORT}.`);
});

// app.get("/products", (req, res) => {
//   if (!req.query.search) {
//     return res.send({
//       error: "You must provide a search term.",
//     });
//   }
//   console.log(req.query.search);
//   res.send({
//     products: [],
//   });
// });

// console.log(__dirname);
// console.log(__filename);
// console.log(path.join(__dirname, "../public"));

//   //index.html has a special meaning with web servers, if we dont expliciltly provide a path then it needs to load something, so we could remove this route

/***********TO DELETE********** */
/*
// app.get("", (req, res) => {
//   res.send("<h1>Weather</h1>");
// });

// app.get("/help", (req, res) => {
//   res.send([
//     {
//       name: "Aneesh",
//     },
//     {
//       name: "Anand",
//     },
//   ]);
// });

// app.get("/about", (req, res) => {
//   res.send("<h1>About</h1>");
// });

app.get("/weather", (req, res) => {
  res.send({
    location: "Boston",
    forecast: "Partly cloudy",
  });
});
*/
