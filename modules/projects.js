require('dotenv').config();
require('pg');
const Sequelize = require('sequelize');

// Initialize Sequelize connection
const sequelize = new Sequelize(
  process.env.PGDATABASE,
  process.env.PGUSER,
  process.env.PGPASSWORD,
  {
    host: process.env.PGHOST,
    dialect: 'postgres',
    dialectModule: require('pg'),
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
);

// Define Models
const Sector = sequelize.define('Sector', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  sector_name: Sequelize.STRING
}, { timestamps: false });

const Project = sequelize.define('Project', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: Sequelize.STRING,
  feature_img_url: Sequelize.STRING,
  summary_short: Sequelize.TEXT,
  intro_short: Sequelize.TEXT,
  impact: Sequelize.TEXT,
  original_source_url: Sequelize.STRING,
  sector_id: Sequelize.INTEGER
}, { timestamps: false });

// Define Association
Project.belongsTo(Sector, { foreignKey: 'sector_id' });

// Initialize Database Connection
async function Initialize() {
  try {
    await sequelize.sync();
    return Promise.resolve();
  } catch (error) {
    return Promise.reject("Database connection failed: " + error.message);
  }
}

// ====== DATABASE OPERATIONS ======
async function getAllProjects() {
  try {
    return await Project.findAll({
      include: [{
        model: Sector,
        attributes: ['sector_name']
      }]
    });
  } catch (error) {
    throw new Error("Error fetching projects: " + error.message);
  }
}

async function getProjectById(projectId) {
  try {
    const project = await Project.findByPk(projectId, {
      include: [{
        model: Sector,
        attributes: ['sector_name']
      }]
    });
    return project || Promise.reject(new Error(`Project ${projectId} not found`));
  } catch (error) {
    throw new Error("Error fetching project: " + error.message);
  }
}

async function getProjectsBySector(sector) {
  try {
    const projects = await Project.findAll({
      include: [{
        model: Sector,
        where: {
          sector_name: {
            [Sequelize.Op.iLike]: `%${sector}%`
          }
        }
      }]
    });
    return projects.length > 0 
      ? projects 
      : Promise.reject(new Error(`No projects in sector: ${sector}`));
  } catch (error) {
    throw new Error("Error searching by sector: " + error.message);
  }
}

// ====== PART 3 ADDITIONS ======
async function getAllSectors() {
  try {
    return await Sector.findAll();
  } catch (error) {
    const errorMessage = error.errors?.[0]?.message || error.message;
    return Promise.reject(errorMessage);
  }
}

async function addProject(projectData) {
  try {
    await Project.create(projectData);
    return Promise.resolve();
  } catch (error) {
    const errorMessage = error.errors?.[0]?.message || error.message;
    return Promise.reject(errorMessage);
  }
}

// ====== PART 4 ADDITION ======
async function updateProject(projectId, projectData) {
  try {
    const project = await Project.findByPk(projectId);
    if (!project) {
      return Promise.reject("Project not found");
    }
    await project.update(projectData);
    return Promise.resolve();
  } catch (error) {
    const errorMessage = error.errors?.[0]?.message || error.message;
    return Promise.reject(errorMessage);
  }
}

// ====== PART 5 ADDITION ======
async function deleteProject(id) {
  try {
    const result = await Project.destroy({
      where: { id: id }
    });
    
    if (result === 0) { // No rows deleted
      return Promise.reject("Project not found");
    }
    return Promise.resolve();
  } catch (error) {
    const errorMessage = error.errors?.[0]?.message || error.message;
    return Promise.reject(errorMessage);
  }
}

// ====== ERROR HANDLER ======
function handleError(errorMessage, res) {
  res.status(404).render("404", {
    studentName: "Mansan Silwal",
    studentId: "132326232",
    message: errorMessage,
  });
}

// ====== MODULE EXPORTS ======
module.exports = { 
  Initialize, 
  getAllProjects,
  getProjectById,
  getProjectsBySector,
  handleError,
  getAllSectors,
  addProject,
  updateProject,
  deleteProject  // Added for Part 5
};