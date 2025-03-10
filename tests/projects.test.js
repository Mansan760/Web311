const projectData = require('../modules/projects');
const { Initialize, getAllProjects, getProjectById } = projectData; 

beforeAll(async () => {
  await Initialize();
});

describe("Project Data Functions", () => {
  beforeAll(() => {
    console.log("\nTest Project - Mansan Silwal - 132326232\n");
  });

  test("getAllProjects should return an array of projects", async () => {
    const projects = await getAllProjects();
    expect(Array.isArray(projects)).toBe(true);
    expect(projects.length).toBeGreaterThan(0);
    expect(projects[0]).toHaveProperty("title");
  });

  test("getProjectById should return the correct project by ID", async () => {
    const projectId = 13;
    const project = await getProjectById(projectId);
    expect(project).toHaveProperty("id", projectId);
    expect(project).toHaveProperty("title");
  });

  test("getProjectById should return null for an invalid ID", async () => {
    const invalidProjectId = 3;    
    try {
      const project = await getProjectById(invalidProjectId); 
    } catch (error) {
      expect(error.message).toBe(`Unable to find requested project with id: ${invalidProjectId}`);
    }
  });
});
