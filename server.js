/********************************************************************************
*  WEB322 – Assignment 04
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
* 
*  Name: Mansan Silwal Student ID: 132326232 Date: 9th March, 2025
*
********************************************************************************/

const express = require("express");
const path = require("path");
const fetch = require("node-fetch");
const app = express();
const port = process.env.PORT || 3000;

const projectData = require("./modules/projects");

const studentName = "Mansan Silwal";
const studentId = "132326232";

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.get("/", async (req, res) => {
  try {
    const response = await fetch("https://dummyjson.com/quotes/random");
    const data = await response.json();
    const randomQuote = data.quote;

    res.render("home", {
      studentName,
      studentId,
      randomQuote,
    });
  } catch (error) {
    res.render("home", {
      studentName,
      studentId,
      randomQuote: "Error fetching quote",
    });
  }
});

app.get("/about", (req, res) => {
  res.render("about", { studentName, studentId });
});

app.get("/solutions/projects", async (req, res) => {
  const sector = req.query.sector;

  try {
    let projects;
    
    if (sector) {
      switch (sector) {
        case "Plastic Bags":
          projects = [
            { id: 101, title: "Reduce Single-Use Plastic Bag Project", sector, description: "Encourage the use of reusable bags in local stores." },
            { id: 102, title: "Plastic Bag Recycling Initiative", sector, description: "Collect and recycle plastic bags to reduce waste." }
          ];
          break;

        case "Carbon Gases":
          projects = [
            { id: 201, title: "Carbon Capture Program", sector, description: "Implement technology to capture and store CO2 emissions." },
            { id: 202, title: "Greenhouse Gas Reduction", sector, description: "Work with industries to lower carbon footprints." }
          ];
          break;

        case "Plantation":
          projects = [
            { id: 301, title: "Urban Tree Planting", sector, description: "Plant trees in urban areas to improve air quality." },
            { id: 302, title: "Community Garden Initiative", sector, description: "Promote local gardening and planting for a greener community." }
          ];
          break;

        default:
          projects = await projectData.getProjectsBySector(sector);
      }
    } else {
      projects = await projectData.getAllProjects();
    }

    res.render("projects", {
      studentName,
      studentId,
      projects,
      sector: sector || "All Sectors",
    });
  } catch (err) {
    res.status(500).render("error", {
      studentName,
      studentId,
      error: err.message,
    });
  }
});

app.get("/solutions/projects/:id", async (req, res) => {
  const projectId = parseInt(req.params.id, 10);

  try {
    const project = await projectData.getProjectById(projectId);

    const response = await fetch("https://dummyjson.com/quotes/random");
    const data = await response.json();
    const randomQuote = data.quote;

    res.render("project", {
      studentName,
      studentId,
      project,
      randomQuote,
    });
  } catch (err) {
    // Using the handleError function from projects.js to handle project not found case
    projectData.handleError(`Project with ID ${projectId} not found`, res);
  }
});

app.get("*", (req, res) => {
  res.status(404).render("404", {
    studentName,
    studentId,
    message: "Sorry, we couldn't find what you're looking for.",
  });
});

app.post("/post-request", (req, res) => {
  res.json({
    studentName,
    studentId,
    timestamp: new Date().toISOString(),
    requestBody: req.body,
  });
});

projectData.Initialize()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to initialize project data:", err);
  });
