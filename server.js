/********************************************************************************
*  WEB322 – Assignment 05
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
const app = express();
const port = process.env.PORT || 3000;

const projectData = require("./modules/projects.js");

const studentName = "Mansan Silwal";
const studentId = "132326232";

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ====== ROUTES ======
app.get("/", async (req, res) => {
  try {
    const response = await fetch("https://dummyjson.com/quotes/random");
    const data = await response.json();
    res.render("home", { studentName, studentId, randomQuote: data.quote });
  } catch (error) {
    res.render("home", { studentName, studentId, randomQuote: "Error fetching quote" });
  }
});

app.get("/about", (req, res) => {
  res.render("about", { studentName, studentId });
});

// ====== PROJECTS ROUTES ======
app.get("/solutions/projects", async (req, res) => {
  try {
    const sector = req.query.sector;
    const projects = sector 
      ? await projectData.getProjectsBySector(sector)
      : await projectData.getAllProjects();
    
    res.render("projects", {
      studentName,
      studentId,
      projects,
      sector: sector || "All Sectors",
    });
  } catch (err) {
    res.status(500).render("500", {
      studentName,
      studentId,
      message: `Failed to load projects: ${err.message}`
    });
  }
});

// ====== ADD PROJECT ROUTES ======
app.get("/solutions/addProject", async (req, res) => {
  try {
    const sectors = await projectData.getAllSectors();
    res.render("addProject", { studentName, studentId, sectors });
  } catch (error) {
    res.status(500).render("500", {
      studentName,
      studentId,
      message: `Failed to load sectors: ${error.message}`
    });
  }
});

app.post("/solutions/addProject", async (req, res) => {
  try {
    await projectData.addProject({
      title: req.body.title,
      feature_img_url: req.body.feature_img_url,
      sector_id: req.body.sector_id,
      intro_short: req.body.intro_short,
      summary_short: req.body.summary_short,
      impact: req.body.impact,
      original_source_url: req.body.original_source_url
    });
    res.redirect("/solutions/projects");
  } catch (error) {
    res.status(500).render("500", {
      studentName,
      studentId,
      message: `Failed to create project: ${error}`
    });
  }
});

// ====== EDIT PROJECT ROUTES (PART 4) ======
app.get("/solutions/editProject/:id", async (req, res) => {
  try {
    const project = await projectData.getProjectById(req.params.id);
    const sectors = await projectData.getAllSectors();
    res.render("editProject", {
      studentName,
      studentId,
      project: project.toJSON(),
      sectors
    });
  } catch (error) {
    res.status(500).render("500", {
      studentName,
      studentId,
      message: `Error loading edit form: ${error}`
    });
  }
});

app.post("/solutions/editProject", async (req, res) => {
  try {
    await projectData.updateProject(req.body.id, req.body);
    res.redirect(`/solutions/projects/${req.body.id}`);
  } catch (error) {
    res.status(500).render("500", {
      studentName,
      studentId,
      message: `Error updating project: ${error}`
    });
  }
});

// ====== DELETE PROJECT ROUTE (PART 5) ====== ✅ ADDED
app.get("/solutions/deleteProject/:id", async (req, res) => {
  try {
    await projectData.deleteProject(req.params.id);
    res.redirect("/solutions/projects");
  } catch (error) {
    res.render("500", {
      studentName,
      studentId,
      message: `I'm sorry, but we have encountered the following error: ${error}`
    });
  }
});

// ====== PROJECT DETAILS ROUTE ======
app.get("/solutions/projects/:id", async (req, res) => {
  try {
    const project = await projectData.getProjectById(req.params.id);
    const response = await fetch("https://dummyjson.com/quotes/random");
    const data = await response.json();
    res.render("project", {
      studentName,
      studentId,
      project,
      randomQuote: data.quote
    });
  } catch (err) {
    projectData.handleError(`Project with ID ${req.params.id} not found`, res);
  }
});

// ====== ERROR HANDLERS ======
app.get("*", (req, res) => {
  res.status(404).render("404", {
    studentName,
    studentId,
    message: "Page not found",
  });
});

// ====== SERVER INITIALIZATION ======
projectData.Initialize()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Initialization failed:", err);
    process.exit(1);
  });