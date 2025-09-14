// constants/projects.ts
/**
 * Data Structures for project whole functionality of the app
 *here step changed like this way
 * intially project name will display   consider as project id page with title name will display in  index page
 *  after clicking on index page project name it will navigate to project id page
 * there project  sub checks  will display like  checks [] array items  
 * for each check user will upload photos user will  review the each photo and submit the project 
 *      inside the each quality check like   photo with two options  1. fail(design failed)  2. pass(design passed)
 * after submitting the project  project will be marked as completed true ( after clicking on submit button a form will open ask for  enter email id and name    after entering  project status will go to mail  to the entered email id )
 * after completing the project  it will display in completed project page
 */ 


export type Check = {
  id: string;
  label: string;
  completed: boolean;
  photos: PhotoReview[]; // ⬅ updated
  
  submittedAt: string | null;
  notes?: string | null;
};

export type Project = {
  id: string;
  title: string;
  description: string;
  /** Array of checks (each with boolean + photos) */
  checks: Check[];
  /** Optional: id of the assigned handler (string) */
  handlerId?: string | null;
  /** Optional created timestamp */
  createdAt?: string | null;
};

/** Helper to create a Check with a stable id */
const makeCheck = (projectId: string, idx: number, label: string): Check => ({
  id: `${projectId}_c${idx + 1}`,
  label,
  completed: false,
  photos: [],
  submittedAt: null,
  notes: null,
});
export type PhotoReview = {
   id?: number;
  url: string;
  status: "pass" | "fail" | null; // null = not yet reviewed
};




export const projects: Project[] = [
  //these data from old client instructions now use the above data structure for project and implement the below one
  {
    id: "1",
    title: "Ganesh Villa",
    description: "Luxury villa project located in Pune.",
    checks: [
      makeCheck("1", 0, "Foundation completed"),
      makeCheck("1", 1, "Electrical wiring pending"),
      makeCheck("1", 2, "Painting in progress"),
    ],
    handlerId: null,
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Raju 3bhk",
    description: "Residential 3BHK flat with modular kitchen.",
    checks: [
      makeCheck("2", 0, "Plumbing completed"),
      makeCheck("2", 1, "Doors installation pending"),
      makeCheck("2", 2, "Tiles work completed"),
    ],
    handlerId: null,
    createdAt: new Date().toISOString(),
  },

];

export default projects;

/* -------------------------
   Simple in-memory helpers
   -------------------------
   These mutate the `projects` array (for quick local/dev usage).
   Replace with Firestore writes (addDoc/updateDoc) when you connect to DB.
*/

/**
 * Returns project by id, or null if not found
 */
export const getProjectById = (projectId: string): Project | null =>
  projects.find((p) => p.id === projectId) ?? null;

/**
 * Returns the photo count for a given check
 */
export const getPhotoCount = (projectId: string, checkId: string): number => {
  const p = getProjectById(projectId);
  if (!p) return 0;
  const chk = p.checks.find((c) => c.id === checkId);
  return chk ? chk.photos.length : 0;
};

/**
 * Adds photo URLs to a check (mutates project)
 * - photoUrls: array of remote URLs (string). In your app, upload images to storage and pass URLs here.
 * - Marks check.completed = true if photos were added.
 * - Sets submittedAt to now.
 *
 * Returns true on success, false if project/check not found.
 */
export const addPhotosToCheck = (
  projectId: string,
  checkId: string,
  photoUrls: string[]
): boolean => {
  const p = getProjectById(projectId);
  if (!p) return false;
  const chk = p.checks.find((c) => c.id === checkId);
  if (!chk) return false;

  // ✅ wrap URLs into PhotoReview objects
  const newPhotos: PhotoReview[] = photoUrls.map((url) => ({
    url,
    status: null, // default = not reviewed yet
  }));

  chk.photos.push(...newPhotos);

  if (chk.photos.length > 0) chk.completed = true;
  chk.submittedAt = new Date().toISOString();
  return true;
};


/**
 * Toggle a check's completed flag (useful for quick testing).
 * Returns true if toggled, false if not found.
 */
export const toggleCheckCompleted = (
  projectId: string,
  checkId: string
): boolean => {
  const p = getProjectById(projectId);
  if (!p) return false;
  const chk = p.checks.find((c) => c.id === checkId);
  if (!chk) return false;
  chk.completed = !chk.completed;
  if (!chk.completed) {
    // if un-checking, keep photos but you may want to clear them in your flow
    chk.submittedAt = null;
  } else {
    chk.submittedAt = new Date().toISOString();
  }
  return true;
};
