const projectData = require("../data/projectData");
const sectorData = require("../data/sectorData");

let projects = [];

// Initialize the project data and map sector names to the projects.
async function Initialize() {
  try {
    projects = [];
    projectData.forEach(project => {
      const matchingSector = sectorData.find(sector => sector.id === project.sector_id);
      const sectorName = matchingSector ? matchingSector.sector_name : "";
      projects.push({ ...project, sector: sectorName });
    });
  } catch (error) {
    throw new Error("Error initializing projects: " + error);
  }
}

// Get all projects
function getAllProjects() {
  if (projects.length > 0) {
    return projects;  // Return the projects directly as this is synchronous.
  }
  throw new Error("Projects not initialized or empty");
}

// Get project by ID
function getProjectById(projectId) {
  const project = projects.find(project => project.id === projectId);
  if (project) {
    return project;  // Return the project directly.
  }
  throw new Error(`Unable to find requested project with id: ${projectId}`); // Throw an error if not found
}


// Get projects by sector
function getProjectsBySector(sector) {
  const searchTerm = sector.toLowerCase();
  const filteredProjects = projects.filter(project => project.sector.toLowerCase().includes(searchTerm));
  if (filteredProjects.length > 0) {
    return filteredProjects;  // Return the filtered projects.
  }
  throw new Error(`Unable to find requested projects for sector: ${sector}`);
}

// Handle errors (for 404 routes)
function handleError(errorMessage, res) {
  res.status(404).render("404", {
    studentName: "Mansan Silwal",
    studentId: "132326232",
    message: errorMessage,
  });
}

module.exports = { Initialize, getAllProjects, getProjectById, getProjectsBySector, handleError };
