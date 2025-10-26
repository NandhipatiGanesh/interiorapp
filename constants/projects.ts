// constants/projects.ts
/**
 * Data Structures for project whole functionality of the app
 *here step changed like this way
 * intially project name will display   consider as project id page with title name will display in  index page
 *  after clicking on index page project name it will navigate to project id page
 * there project  sub checks  will display like  checks [] array items  
 * Example : -  
  Project (Level 1)
 ├── Main Check / Section (Level 2)
 │     ├── Sub-Check / Audit List Item (Level 3)
 │     │      └── PhotoReview[] (Level 4)
 │     │             ↳ status: pass/fail
 │     │             ↳ reason: process miss / technical miss
 │     │             ↳ corrective measure
 │     │
 │     └── ...
 └── Actions at Project Level:
       - Process Missed
       - Errors
       - Update to client
 * for each check user will upload photos user will  review the each photo and submit the project 
 *      inside the each quality check like   photo with two options  1. fail(design failed)  2. pass(design passed)
 * after submitting the project  project will be marked as completed true ( after clicking on submit button a form will open ask for  enter email id and name    after entering  project status will go to mail  to the entered email id )
 * after completing the project  it will display in completed project page
 * 
 */
//File : constants/projects.ts
export type PhotoReview = {
  id?: number;
  url: string;
  status: "pass" | "fail" | null; // null = not yet reviewed

  // Extended form fields
  reasonForFailure?: string | null; // Textarea - detailed reason
  processMiss: boolean; // Checkbox
  technicalMiss: boolean; // Checkbox
  correctiveMeasure?: string | null; // Textarea - corrective measures

  // Keep your existing reason field for backward compatibility
  reason?: "process_miss" | "technical_miss" | null; // only if fail
};

export type Check = {
  id: string;
  label: string;
  completed: boolean;
  photos: PhotoReview[];
  submittedAt: string | null;
  notes?: string | null;
  subChecks?: Check[]; // recursive audit list
};

export type Project = {
  id: string;
  title: string;
  description: string;
  checks: Check[];
  handlerId?: string | null;
  createdAt?: string | null;
  completed?: boolean;
};

/** Helper to create a Check */
const makeCheck = (
  projectId: string,
  idx: number,
  label: string,
  subChecks?: Check[]
): Check => ({
  id: `${projectId}_c${idx + 1}`,
  label,
  completed: false,
  photos: [],
  submittedAt: null,
  notes: null,
  subChecks: subChecks ?? [],
});


export const projects: Project[] = [
  
  {
    id: "1",
    title: "Ganesh Adobe",
    description: "Residential Project",
    checks: [
    makeCheck("1", 0, "Drawings", [

  // 🧭 Preliminary Survey
  makeCheck("1_0", 0, "Preliminary Survey", [
    makeCheck("1_0_0", 0, "Basic", [
      makeCheck("1_0_0_0", 0, "Drawing Title"),
      makeCheck("1_0_0_0", 1, "Drawing Number"),
      makeCheck("1_0_0_0", 2, "Revision Number/Date"),
      makeCheck("1_0_0_0", 3, "Designated site name"),
      makeCheck("1_0_0_0", 4, "Revisions & Date"),
      makeCheck("1_0_0_0", 5, "Drawing Scale"),
      makeCheck("1_0_0_0", 6, "Area statements"),
      makeCheck("1_0_0_0", 7, "North Arrow shown and oriented?"),
      makeCheck("1_0_0_0", 8, "Key Plan/Site Context included?"),
      makeCheck("1_0_0_0", 9, "Legend & Symbols defined?"),
      makeCheck("1_0_0_0", 10, "Proper Material specification provided?"),
      makeCheck("1_0_0_0", 11, "Consistency with other drawings?")
    ]),
    makeCheck("1_0_1", 0, "Technical", [
      makeCheck("1_0_1_0", 0, "Permanent Benchmark (BM) established and coordinates recorded?"),
      makeCheck("1_0_1_0", 1, "Temporary Benchmarks (TBMs) set up?"),
      makeCheck("1_0_1_0", 2, "All site boundary corners measured and recorded?"),
      makeCheck("1_0_1_0", 3, "Boundary measurements checked against legal plot plan?"),
      makeCheck("1_0_1_0", 4, "Encroachments from adjacent properties noted?"),
      makeCheck("1_0_1_0", 5, "Existing FGL spot levels taken across site?"),
      makeCheck("1_0_1_0", 6, "High and low points recorded?"),
      makeCheck("1_0_1_0", 7, "Proposed FFL referenced to BM?"),
      makeCheck("1_0_1_0", 8, "Location/elevation of existing utilities recorded?"),
      makeCheck("1_0_1_0", 9, "Adjacent structures and offsets recorded?"),
      makeCheck("1_0_1_0", 10, "Major trees, rock outcrops, foundations located?"),
      makeCheck("1_0_1_0", 11, "Raw data downloaded and backed up?"),
      makeCheck("1_0_1_0", 12, "North arrow orientation recorded?"),
      makeCheck("1_0_1_0", 13, "Preliminary site sketch prepared?"),
      makeCheck("1_0_1_0", 14, "Nearest drainage manhole details recorded?"),
      makeCheck("1_0_1_0", 15, "Nearest municipal water supply point recorded?"),
      makeCheck("1_0_1_0", 16, "Bore points in the plot recorded?"),
      makeCheck("1_0_1_0", 17, "Electrical pole details recorded?")
    ])
  ]),

  // 🧪 Soil Test Report
  makeCheck("1_1", 0, "Soil Test Report", [
    makeCheck("1_1_0", 0, "Basic", [
      makeCheck("1_1_0_0", 0, "Drawing Title"),
      makeCheck("1_1_0_0", 1, "Drawing Number"),
      makeCheck("1_1_0_0", 2, "Revision Number/Date"),
      makeCheck("1_1_0_0", 3, "Designated site name"),
      makeCheck("1_1_0_0", 4, "Revisions & Date"),
      makeCheck("1_1_0_0", 5, "Drawing Scale"),
      makeCheck("1_1_0_0", 6, "Area statements"),
      makeCheck("1_1_0_0", 7, "North Arrow shown and oriented?"),
      makeCheck("1_1_0_0", 8, "Key Plan/Site Context included?"),
      makeCheck("1_1_0_0", 9, "Legend & Symbols defined?"),
      makeCheck("1_1_0_0", 10, "Proper Material specification provided?"),
      makeCheck("1_1_0_0", 11, "Consistency with other drawings?")
    ]),
    makeCheck("1_1_1", 0, "Technical", [
      makeCheck("1_1_1_0", 0, "Project name/location matches site details?"),
      makeCheck("1_1_1_0", 1, "Report date recent and relevant?"),
      makeCheck("1_1_1_0", 2, "Scope covers entire footprint?"),
      makeCheck("1_1_1_0", 3, "Borehole/Trial Pit locations mapped?"),
      makeCheck("1_1_1_0", 4, "Number and depth of boreholes adequate?"),
      makeCheck("1_1_1_0", 5, "Groundwater table level recorded?"),
      makeCheck("1_1_1_0", 6, "Soil strata and layer thickness described?"),
      makeCheck("1_1_1_0", 7, "Soil classification provided?"),
      makeCheck("1_1_1_0", 8, "Lab test results included?"),
      makeCheck("1_1_1_0", 9, "Foundation type recommended?"),
      makeCheck("1_1_1_0", 10, "SBC or net allowable pressure stated?"),
      makeCheck("1_1_1_0", 11, "Minimum foundation depth specified?"),
      makeCheck("1_1_1_0", 12, "Settlement estimates provided?"),
      makeCheck("1_1_1_0", 13, "Seismic parameters recommended?"),
      makeCheck("1_1_1_0", 14, "Excavation/shoring recommendations provided?"),
      makeCheck("1_1_1_0", 15, "Special soil treatment noted?"),
      makeCheck("1_1_1_0", 16, "Specialized backfill recommendations included?"),
      makeCheck("1_1_1_0", 17, "Report shared with structural engineer?")
    ])
  ]),

  // 📐 Floor Plans
  makeCheck("1_2", 0, "Floor Plans", [
    makeCheck("1_2_0", 0, "Basic", [
      makeCheck("1_2_0_0", 0, "Drawing Title"),
      makeCheck("1_2_0_0", 1, "Drawing Number"),
      makeCheck("1_2_0_0", 2, "Revision Number/Date"),
      makeCheck("1_2_0_0", 3, "Designated site name"),
      makeCheck("1_2_0_0", 4, "Revisions & Date"),
      makeCheck("1_2_0_0", 5, "Drawing Scale"),
      makeCheck("1_2_0_0", 6, "Area statements"),
      makeCheck("1_2_0_0", 7, "North Arrow shown and oriented?"),
      makeCheck("1_2_0_0", 8, "Key Plan/Site Context included?"),
      makeCheck("1_2_0_0", 9, "Legend & Symbols defined?"),
      makeCheck("1_2_0_0", 10, "Proper Material specification provided?"),
      makeCheck("1_2_0_0", 11, "Consistency with other drawings?")
    ]),
    makeCheck("1_2_1", 0, "Technical", [
      makeCheck("1_2_1_0", 0, "Levels based on client/site requirements?"),
      makeCheck("1_2_1_0", 1, "Exterior wall thickness 9\"?"),
      makeCheck("1_2_1_0", 2, "Internal wall thickness 4\" specified?"),
      makeCheck("1_2_1_0", 3, "Beam and slab layout coordinated?"),
      makeCheck("1_2_1_0", 4, "Door/window dimensions correct?"),
      makeCheck("1_2_1_0", 5, "Floor levels specified?"),
      makeCheck("1_2_1_0", 6, "All room levels mentioned?"),
      makeCheck("1_2_1_0", 7, "Sill and lintel levels indicated?"),
      makeCheck("1_2_1_0", 8, "Room names & dimensions shown?"),
      makeCheck("1_2_1_0", 9, "Ceiling heights noted?"),
      makeCheck("1_2_1_0", 10, "Staircase details provided?")
    ])
  ]),

  // 🧱 Brick Work
  makeCheck("1_3", 0, "Brick Work", [
    makeCheck("1_3_0", 0, "Basic", [
      makeCheck("1_3_0_0", 0, "Drawing Title"),
      makeCheck("1_3_0_0", 1, "Drawing Number"),
      makeCheck("1_3_0_0", 2, "Revision Number/Date"),
      makeCheck("1_3_0_0", 3, "Designated site name"),
      makeCheck("1_3_0_0", 4, "Revisions & Date"),
      makeCheck("1_3_0_0", 5, "Drawing Scale"),
      makeCheck("1_3_0_0", 6, "Area statements"),
      makeCheck("1_3_0_0", 7, "North Arrow shown and oriented?"),
      makeCheck("1_3_0_0", 8, "Key Plan/Site Context included?"),
      makeCheck("1_3_0_0", 9, "Legend & Symbols defined?"),
      makeCheck("1_3_0_0", 10, "Proper Material specification provided?"),
      makeCheck("1_3_0_0", 11, "Consistency with other drawings?")
    ]),
    makeCheck("1_3_1", 0, "Technical", [
      makeCheck("1_3_1_0", 0, "Brick type specified?"),
      makeCheck("1_3_1_0", 1, "Mortar mix ratio specified?"),
      makeCheck("1_3_1_0", 2, "Joint thickness and finish detailed?"),
      makeCheck("1_3_1_0", 3, "Curing requirements noted?"),
      makeCheck("1_3_1_0", 4, "Setting-out plan provided?"),
      makeCheck("1_3_1_0", 5, "Bond pattern specified?"),
      makeCheck("1_3_1_0", 6, "Wall thickness noted?"),
      makeCheck("1_3_1_0", 7, "Dimensions based on brick module?"),
      makeCheck("1_3_1_0", 8, "Lintel details provided?"),
      makeCheck("1_3_1_0", 9, "DPC location/material specified?"),
      makeCheck("1_3_1_0", 10, "Wall tie details provided?"),
      makeCheck("1_3_1_0", 11, "Expansion joints shown?"),
      makeCheck("1_3_1_0", 12, "RCC band details included?"),
      makeCheck("1_3_1_0", 13, "Embedded items included?"),
      makeCheck("1_3_1_0", 14, "Parapet/coping details provided?"),
      makeCheck("1_3_1_0", 15, "Raking/toothing details provided?"),
      makeCheck("1_3_1_0", 16, "Plastering mix ratio specified?"),
      makeCheck("1_3_1_0", 17, "Chicken mesh mix ratio provided?"),
      makeCheck("1_3_1_0", 18, "Elevation plaster grooves detailed?"),
      makeCheck("1_3_1_0", 19, "Elevation additional items detailed?")
    ])
  ]),

  // 💡 Electrical
  makeCheck("1_4", 0, "Electrical", [
    makeCheck("1_4_0", 0, "Basic", [
      makeCheck("1_4_0_0", 0, "Drawing Title"),
      makeCheck("1_4_0_0", 1, "Drawing Number"),
      makeCheck("1_4_0_0", 2, "Revision Number/Date"),
      makeCheck("1_4_0_0", 3, "Designated site name"),
      makeCheck("1_4_0_0", 4, "Revisions & Date"),
      makeCheck("1_4_0_0", 5, "Drawing Scale"),
      makeCheck("1_4_0_0", 6, "Area statements"),
      makeCheck("1_4_0_0", 7, "North Arrow shown?"),
      makeCheck("1_4_0_0", 8, "Key Plan included?"),
      makeCheck("1_4_0_0", 9, "Legend & Symbols defined?"),
      makeCheck("1_4_0_0", 10, "Material specification provided?"),
      makeCheck("1_4_0_0", 11, "Consistency with other drawings?")
    ]),
    makeCheck("1_4_1", 0, "Technical", [
      makeCheck("1_4_1_0", 0, "All light fixtures and switches located and numbered?"),
      makeCheck("1_4_1_0", 1, "Power outlets correctly shown?"),
      makeCheck("1_4_1_0", 2, "Circuits identified and home run shown?"),
      makeCheck("1_4_1_0", 3, "Lighting fixtures scheduled with wattage, type, height?"),
      makeCheck("1_4_1_0", 4, "Load balancing considered?"),
      makeCheck("1_4_1_0", 5, "Panel schedules complete?"),
      makeCheck("1_4_1_0", 6, "Single-line diagram included?"),
      makeCheck("1_4_1_0", 7, "Voltage, phase, ampacity specified?"),
      makeCheck("1_4_1_0", 8, "Fire alarm devices shown?"),
      makeCheck("1_4_1_0", 9, "Data/telephone/AV outlets shown?"),
      makeCheck("1_4_1_0", 10, "Electrical coordinated with other plans?"),
      makeCheck("1_4_1_0", 11, "Conduit routing and bend radii provided?"),
      makeCheck("1_4_1_0", 12, "Motor connections and protection detailed?"),
      makeCheck("1_4_1_0", 13, "Emergency/exit lighting with backup shown?")
    ])
  ]),

  // 🚰 Plumbing
  makeCheck("1_5", 0, "Plumbing", [
    makeCheck("1_5_0", 0, "Basic", [
      makeCheck("1_5_0_0", 0, "Drawing Title"),
      makeCheck("1_5_0_0", 1, "Drawing Number"),
      makeCheck("1_5_0_0", 2, "Revision Number/Date"),
      makeCheck("1_5_0_0", 3, "Designated site name"),
      makeCheck("1_5_0_0", 4, "Revisions & Date"),
      makeCheck("1_5_0_0", 5, "Drawing Scale"),
      makeCheck("1_5_0_0", 6, "Area statements"),
      makeCheck("1_5_0_0", 7, "North Arrow shown?"),
      makeCheck("1_5_0_0", 8, "Key Plan included?"),
      makeCheck("1_5_0_0", 9, "Legend & Symbols defined?"),
      makeCheck("1_5_0_0", 10, "Material specification provided?"),
      makeCheck("1_5_0_0", 11, "Consistency with other drawings?")
    ]),
    makeCheck("1_5_1", 0, "Technical", [
      makeCheck("1_5_1_0", 0, "Drawing legend and abbreviations included?"),
      makeCheck("1_5_1_0", 1, "Project specifications referenced?"),
      makeCheck("1_5_1_0", 2, "Location of main water supply shown?"),
      makeCheck("1_5_1_0", 3, "Cold/hot water lines sized and routed?"),
      makeCheck("1_5_1_0", 4, "Water heater and pump details specified?"),
      makeCheck("1_5_1_0", 5, "All fixtures shown with connections?"),
      makeCheck("1_5_1_0", 6, "Waste and drain lines sized/routed?"),
      makeCheck("1_5_1_0", 7, "Vent piping shown and sized?"),
      makeCheck("1_5_1_0", 8, "Floor drains, cleanouts, traps specified?"),
      makeCheck("1_5_1_0", 9, "Riser diagrams included?"),
      makeCheck("1_5_1_0", 10, "Roof/balcony drains sized?"),
      makeCheck("1_5_1_0", 11, "Stormwater drain lines routed?"),
      makeCheck("1_5_1_0", 12, "Plumbing coordinated with other plans?"),
      makeCheck("1_5_1_0", 13, "Designs comply with codes?"),
      makeCheck("1_5_1_0", 14, "Pipe supports shown?"),
      makeCheck("1_5_1_0", 15, "Insulation requirements provided?"),
      makeCheck("1_5_1_0", 16, "Pressure testing/flushing details included?")
    ])
  ]),

  // 🪵 Flooring
  makeCheck("1_6", 0, "Flooring", [
    makeCheck("1_6_0", 0, "Basic", [
      makeCheck("1_6_0_0", 0, "Drawing Title"),
      makeCheck("1_6_0_0", 1, "Drawing Number"),
      makeCheck("1_6_0_0", 2, "Revision Number/Date"),
      makeCheck("1_6_0_0", 3, "Designated site name"),
      makeCheck("1_6_0_0", 4, "Revisions & Date"),
      makeCheck("1_6_0_0", 5, "Drawing Scale"),
      makeCheck("1_6_0_0", 6, "Area statements"),
      makeCheck("1_6_0_0", 7, "North Arrow shown?"),
      makeCheck("1_6_0_0", 8, "Key Plan included?"),
      makeCheck("1_6_0_0", 9, "Legend & Symbols defined?"),
      makeCheck("1_6_0_0", 10, "Material specification provided?"),
      makeCheck("1_6_0_0", 11, "Consistency with other drawings?")
    ]),
    makeCheck("1_6_1", 0, "Technical", [
      makeCheck("1_6_1_0", 0, "Legend and symbols included?"),
      makeCheck("1_6_1_0", 1, "Flooring material specified?"),
      makeCheck("1_6_1_0", 2, "Pattern/direction indicated?"),
      makeCheck("1_6_1_0", 3, "Details of borders/inlays shown?"),
      makeCheck("1_6_1_0", 4, "Dimensions from walls/datum provided?"),
      makeCheck("1_6_1_0", 5, "Joint type and width specified?"),
      makeCheck("1_6_1_0", 6, "Height and level noted?"),
      makeCheck("1_6_1_0", 7, "Transition strip details shown?"),
      makeCheck("1_6_1_0", 8, "Coordinated with architectural plans?"),
      makeCheck("1_6_1_0", 9, "Drains/cleanouts coordinated?"),
      makeCheck("1_6_1_0", 10, "Electrical floor outlets accounted?"),
      makeCheck("1_6_1_0", 11, "Subfloor prep notes included?"),
      makeCheck("1_6_1_0", 12, "Curing/setting time specified?")
    ])
  ]),

  // 🎨 Painting
  makeCheck("1_7", 0, "Painting", [
    makeCheck("1_7_0", 0, "Basic", [
      makeCheck("1_7_0_0", 0, "Drawing Title"),
      makeCheck("1_7_0_0", 1, "Drawing Number"),
      makeCheck("1_7_0_0", 2, "Revision Number/Date"),
      makeCheck("1_7_0_0", 3, "Designated site name"),
      makeCheck("1_7_0_0", 4, "Revisions & Date"),
      makeCheck("1_7_0_0", 5, "Drawing Scale"),
      makeCheck("1_7_0_0", 6, "Area statements"),
      makeCheck("1_7_0_0", 7, "North Arrow shown?"),
      makeCheck("1_7_0_0", 8, "Key Plan included?"),
      makeCheck("1_7_0_0", 9, "Legend & Symbols defined?"),
      makeCheck("1_7_0_0", 10, "Material specification provided?"),
      makeCheck("1_7_0_0", 11, "Consistency with other drawings?")
    ]),
    makeCheck("1_7_1", 0, "Technical", [
      makeCheck("1_7_1_0", 0, "Legend for colors, finishes, codes included?"),
      makeCheck("1_7_1_0", 1, "Paint type, brand, code specified?"),
      makeCheck("1_7_1_0", 2, "Number of coats and curing time noted?"),
      makeCheck("1_7_1_0", 3, "Specific finishes indicated?"),
      makeCheck("1_7_1_0", 4, "Surface prep instructions provided?"),
      makeCheck("1_7_1_0", 5, "Defect repair details included?"),
      makeCheck("1_7_1_0", 6, "Color schedule provided?"),
      makeCheck("1_7_1_0", 7, "All surfaces zoned with color codes?"),
      makeCheck("1_7_1_0", 8, "Painting coordinated with plans?"),
      makeCheck("1_7_1_0", 9, "Painted/unpainted surface specs included?"),
      makeCheck("1_7_1_0", 10, "Adjacent surface protection noted?"),
      makeCheck("1_7_1_0", 11, "Safety and ventilation notes included?")
    ])
  ])

]),
      
      makeCheck("1", 1, "Sub Structure", [
        makeCheck("1_1", 0, "Setting out", [
          makeCheck("1_1_0", 0, "Accuracy and Layout", [
            makeCheck(
              "1_1_0_0",
              0,
              "Have all boundary and benchmark coordinates been verified with the latest survey?"
            ),
            makeCheck(
              "1_1_0_0",
              1,
              "Is the site clear of obstructions, debris, and existing structures that could interfere with setting out?"
            ),
            makeCheck(
              "1_1_0_0",
              2,
              "Are the architectural, structural, and civil drawings coordinated and approved for construction?"
            ),
            makeCheck(
              "1_1_0_0",
              3,
              "Have all key dimensions and grid lines been cross-referenced between drawings?"
            ),
            makeCheck(
              "1_1_0_0",
              4,
              "Are the main grid lines and building corners pegged out from the established datum points?"
            ),
            makeCheck(
              "1_1_0_0",
              5,
              "Has the building orientation (North point) been checked against the drawings?"
            ),
            makeCheck(
              "1_1_0_0",
              6,
              "Are the right angles of the building corners checked using the 3-4-5 method or a total station?"
            ),
            makeCheck(
              "1_1_0_0",
              7,
              "Have all column and wall centerlines been marked?"
            ),
            makeCheck(
              "1_1_0_0",
              8,
              "Marking done with chalk power on site for excavation?"
            ),
            makeCheck(
              "1_1_0_0",
              9,
              "Are dimensions between all marked points checked against the drawing?"
            ),
            makeCheck(
              "1_1_0_0",
              10,
              "Is a record of all setting-out measurements and checks maintained on a daily basis?"
            ),
            makeCheck(
              "1_1_0_0",
              11,
              "Have any discrepancies been reported to the project manager and engineer?"
            ),
          ]),
          makeCheck("1_1_0", 1, "Datum and Reference Points", [
            makeCheck(
              "1_1_0_1",
              0,
              "Is a permanent benchmark (BM) established on site?"
            ),
            makeCheck(
              "1_1_0_1",
              1,
              "Are temporary benchmarks (TBMs) set up at convenient locations and referenced to the main BM?"
            ),
            makeCheck(
              "1_1_0_1",
              2,
              "Has the reduced level (RL) of the finished floor level (FFL) been checked against the TBMs?"
            ),
            makeCheck(
              "1_1_0_1",
              3,
              "Are the top of footing and top of slab levels clearly marked?"
            ),
          ]),
        ]),
        makeCheck("1_1", 1, "PCC & Columns marking", [
          makeCheck("1_1_1", 0, "Pre-Pour Preparation", [
            makeCheck(
              "1_1_1_0",
              0,
              "Footing pit dimensions (length and width) checked as per drawing?"
            ),
            makeCheck(
              "1_1_1_0",
              1,
              "Excavation depth is correct, considering PCC and footing thickness?"
            ),
            makeCheck(
              "1_1_1_0",
              2,
              "Sides of the pit are stable and sloped or shored to prevent collapse?"
            ),
            makeCheck("1_1_1_0", 3, "Is hard strata obtained?"),
            makeCheck(
              "1_1_1_0",
              4,
              "Bottom of the pit is level and compacted?"
            ),
            makeCheck(
              "1_1_1_0",
              5,
              "Pit is free of loose soil, debris, or water?"
            ),
            makeCheck(
              "1_1_1_0",
              6,
              "Location of the footing pit is correct relative to grid lines?"
            ),
            makeCheck(
              "1_1_1_0",
              7,
              "PCC mix ratio (e.g., 1:4:8 or 1:5:10) is correct as per drawing/specifications?"
            ),
            makeCheck("1_1_1_0", 8, "PCC thickness is as per the drawing?"),
            makeCheck(
              "1_1_1_0",
              9,
              "Top surface of the PCC is finished smooth and level?"
            ),
            makeCheck(
              "1_1_1_0",
              10,
              "Curing of the PCC has been done correctly?"
            ),
            makeCheck(
              "1_1_1_0",
              11,
              "Any necessary blockouts or sleeves for pipes are in place before the pour?"
            ),
            makeCheck(
              "1_1_1_0",
              12,
              "Location of dowels or starter bars is marked for future column placement?"
            ),
            makeCheck(
              "1_1_1_0",
              13,
              "A site inspection report with photos has been created and signed off?"
            ),
            makeCheck(
              "1_1_1_0",
              14,
              "The bearing capacity of the soil is visually inspected to match the geotechnical report?"
            ),
            makeCheck(
              "1_1_1_0",
              15,
              "A representative from the engineering team has approved the subgrade?"
            ),
          ]),
        ]),
        makeCheck("1_1", 2, "Columns marking", [
          makeCheck("1_1_2", 0, "Coordination", [
            makeCheck(
              "1_1_2_0",
              0,
              "Are the dowels/starter bars available and marked for placement?"
            ),
            makeCheck(
              "1_1_2_0",
              1,
              "Have the dowels/starter bars been checked for correct lap length?"
            ),
          ]),
          makeCheck("1_1_2", 1, "Documentation", [
            makeCheck(
              "1_1_2_1",
              0,
              "Has a formal site inspection report been signed off by the site engineer?"
            ),
          ]),
        ]),
        makeCheck("1_1", 3, "Footings", [
          makeCheck("1_1_3", 0, "Concreting (During & After Pour)", [
            makeCheck(
              "1_1_3_0",
              0,
              "Slump test is conducted to verify concrete workability?"
            ),
            makeCheck(
              "1_1_3_0",
              1,
              "Concrete is poured to the correct level and compacted thoroughly with a vibrator?"
            ),
            makeCheck(
              "1_1_3_0",
              2,
              "The top surface is finished smooth and level?"
            ),
            makeCheck(
              "1_1_3_0",
              3,
              "Concrete test cubes are cast and labeled for lab testing?"
            ),
            makeCheck(
              "1_1_3_0",
              4,
              "Proper curing of the concrete has started within the required time?"
            ),
          ]),
          makeCheck("1_1_3", 1, "Concreting (Pre-Pour) Checklist", [
            makeCheck(
              "1_1_3_1",
              0,
              "Concrete mix design (M-grade) verified with the supplier?"
            ),
            makeCheck(
              "1_1_3_1",
              1,
              "Batching plant authorization and material test reports are available?"
            ),
            makeCheck(
              "1_1_3_1",
              2,
              "Reinforcement and formwork are approved for the pour?"
            ),
            makeCheck(
              "1_1_3_1",
              3,
              "Necessary tools (vibrators, floats) and labor are on site?"
            ),
          ]),
        ]),
        makeCheck("1_1", 4, "Pedastals", [
          makeCheck("1_1_4", 0, "Concreting (During & After Pour)", [
            makeCheck(
              "1_1_4_0",
              0,
              "Slump test is conducted to verify concrete workability?"
            ),
            makeCheck(
              "1_1_4_0",
              1,
              "Concrete is poured to the correct level and compacted thoroughly using a vibrator?"
            ),
            makeCheck(
              "1_1_4_0",
              2,
              "The top surface is finished smooth and level?"
            ),
            makeCheck(
              "1_1_4_0",
              3,
              "Concrete test cubes are cast and labeled for lab testing?"
            ),
            makeCheck(
              "1_1_4_0",
              4,
              "Proper curing has started within the specified time?"
            ),
          ]),
          makeCheck("1_1_4", 1, "Concreting (Pre-Pour) Checklist", [
            makeCheck(
              "1_1_4_1",
              0,
              "Concrete mix design (M-grade) is verified and approved?"
            ),
            makeCheck(
              "1_1_4_1",
              1,
              "All tools (vibrators, trowels) and labor are ready on site?"
            ),
            makeCheck(
              "1_1_4_1",
              2,
              "All reinforcement and formwork are approved for the pour?"
            ),
          ]),
        ]),
        makeCheck("1_1", 5, "Columns", [
          makeCheck("1_1_5", 0, "Concreting (During & After Pour)", [
            makeCheck(
              "1_1_5_0",
              0,
              "Slump test is conducted to verify concrete workability?"
            ),
            makeCheck(
              "1_1_5_0",
              1,
              "Concrete is poured to the correct level and compacted thoroughly using a vibrator?"
            ),
            makeCheck(
              "1_1_5_0",
              2,
              "The top surface is finished smooth and level?"
            ),
            makeCheck(
              "1_1_5_0",
              3,
              "Concrete test cubes are cast and labeled for lab testing?"
            ),
            makeCheck(
              "1_1_5_0",
              4,
              "Proper curing has started within the specified time?"
            ),
          ]),
          makeCheck("1_1_5", 1, "Concreting (Pre-Pour) Checklist", [
            makeCheck(
              "1_1_5_1",
              0,
              "Concrete mix design (M-grade) is verified and approved?"
            ),
            makeCheck(
              "1_1_5_1",
              1,
              "All tools (vibrators, trowels) and labor are ready on site?"
            ),
            makeCheck(
              "1_1_5_1",
              2,
              "All reinforcement and formwork are approved for the pour?"
            ),
          ]),
        ]),
        makeCheck("1_1", 6, "Backfilling & Compaction", [
          makeCheck("1_1_6", 0, "Compaction", [
            makeCheck(
              "1_1_6_0",
              0,
              "The hand rammer is of sufficient weight and size for effective compaction?"
            ),
            makeCheck(
              "1_1_6_0",
              1,
              "The number of rammer passes is consistent across the entire layer?"
            ),
            makeCheck(
              "1_1_6_0",
              2,
              "A field density test (if specified) is conducted on each layer to verify compaction?"
            ),
          ]),
          makeCheck("1_1_6", 1, "Coordination", [
            makeCheck(
              "1_1_6_1",
              0,
              "All underground utilities (plumbing, electrical conduits) have been installed and inspected before backfilling?"
            ),
            makeCheck(
              "1_1_6_1",
              1,
              "The backfilling does not cause any damage to waterproofing or structural elements?"
            ),
          ]),
        ]),
        makeCheck("1_1", 7, "CRS (Coarse Rubble Masonry)", [
          makeCheck("1_1_7", 0, "Coordination", [
            makeCheck(
              "1_1_7_0",
              0,
              "The CRS work is coordinated with the foundation layout?"
            ),
            makeCheck(
              "1_1_7_0",
              1,
              "Any necessary drainage pipes or outlets have been installed before the work is completed?"
            ),
          ]),
          makeCheck("1_1_7", 1, "Curing", [
            makeCheck("1_1_7_1", 0, "Proper curing of the mortar has started?"),
          ]),
        ]),
        makeCheck("1_1", 8, "Plinth beam", [
          makeCheck("1_1_8", 0, "Coordination", [
            makeCheck(
              "1_1_8_0",
              0,
              "Location of all plinth beams is verified against grid lines and columns?"
            ),
            makeCheck(
              "1_1_8_0",
              1,
              "All underground utilities (e.g., plumbing pipes) are in place and protected?"
            ),
          ]),
          makeCheck("1_1_8", 1, "PCC Below Plinth", [
            makeCheck(
              "1_1_8_1",
              0,
              "Sub-grade preparation is properly compacted and level?"
            ),
            makeCheck(
              "1_1_8_1",
              1,
              "PCC mix ratio and grade are as per specifications?"
            ),
            makeCheck(
              "1_1_8_1",
              2,
              "PCC thickness and finished level are correct?"
            ),
            makeCheck(
              "1_1_8_1",
              3,
              "PCC is free of cracks and properly cured?"
            ),
          ]),
        ]),
        makeCheck("1_1", 9, "Ground floor slab", [
          makeCheck("1_1_9", 0, "Coordination", [
            makeCheck(
              "1_1_9_0",
              0,
              "Location of all future walls and door openings is marked on the finished PCC layer?"
            ),
          ]),
          makeCheck("1_1_9", 1, "Dimensional & Leveling", [
            makeCheck(
              "1_1_9_1",
              0,
              "PCC thickness is verified as per the drawing (e.g., 50-75 mm)?"
            ),
            makeCheck(
              "1_1_9_1",
              1,
              "Finished level of the PCC is checked to be consistent across all beams?"
            ),
            makeCheck(
              "1_1_9_1",
              2,
              "The top surface is finished smooth and level to provide a good base for the wall?"
            ),
          ]),
        ]),
      ]),
      makeCheck("1_4", 0, "Super Structure", [
        makeCheck("1_4_0", 0, "Column Marking & Columns", [
         makeCheck("1_4_0_0", 0, "Site Setting", [
           makeCheck("1_4_0_0_0", 0, "Slab surface or PCC surface is clean, cured, and free of debris/oil?"),
           makeCheck("1_4_0_0_0", 1, "Floor Level or slab top level is confirmed correct?"),
           makeCheck("1_4_0_0_0", 2, "Primary grid lines (from the building corners/offsets) are re-established on the PCC?"),
           makeCheck("1_4_0_0_0", 3, "Grid lines are checked for perpendicularity (90°) using a Total Station or tape/laser?"),
           makeCheck("1_4_0_0_0", 4, "Column center points are marked accurately at the intersection of grid lines?"),
           makeCheck("1_4_0_0_0", 5, "Offsets for columns not on the grid line are measured and verified?"),
           makeCheck("1_4_0_0_0", 6, "Column outline (perimeter) is drawn on the PCC based on structural dimensions?"),
           makeCheck("1_4_0_0_0", 7, "Column dimensions checked against the Column Schedule?"),
           makeCheck("1_4_0_0_0", 8, "Location of column dowels/starter bars from the foundation below is checked for vertical alignment with the marked outline?"),
           makeCheck("1_4_0_0_0", 9, "Any misalignment of dowels is addressed (e.g., chipped PCC for minor shifts)?"),
           makeCheck("1_4_0_0_0", 10, "All column marks are clearly labeled with the Column ID (e.g., C1, C2)?"),
           makeCheck("1_4_0_0_0", 11, "Key dimensions are witnessed and signed off by the site engineer/surveyor?"),
           makeCheck("1_4_0_0_0", 12, "Markings are protected from foot traffic and weathering until formwork is erected?")
         ]),
       ]),
       makeCheck("1_4_1", 0, "Columns", [
        makeCheck("1_4_1_0", 0, "Reinforcement", [
          makeCheck("1_4_1_0_0", 0, "Main vertical bars (size, count, and arrangement) checked as per drawing?"),
          makeCheck("1_4_1_0_0", 1, "Lateral ties/links (size, spacing, and hook details) verified?"),
          makeCheck("1_4_1_0_0", 2, "Lap length and staggering of vertical bars confirmed correct?"),
          makeCheck("1_4_1_0_0", 3, "Column cage is vertical and securely tied, free of rust/oil?"),
          makeCheck("1_4_1_0_0", 4, "Any necessary blockouts or sleeves for pipes are in place before the pour?")
         ]),
          // 🪵 Shuttering
        makeCheck("1_4_1_1", 1, "Shuttering", [
          makeCheck("1_4_1_1_0", 0, "Clear cover maintained using concrete or plastic cover blocks?"),
          makeCheck("1_4_1_1_0", 1, "Column dimensions (width and depth) match the drawing?"),
          makeCheck("1_4_1_1_0", 2, "Formwork is plumb (vertical) and aligned with the column markings?"),
          makeCheck("1_4_1_1_0", 3, "Formwork is securely braced against pouring pressure?"),
          makeCheck("1_4_1_1_0", 4, "Formwork is clean and coated with release agent?"),
          makeCheck("1_4_1_1_0", 5, "Pockets/windows left at the bottom for cleaning are open?"),
          makeCheck("1_4_1_1_0", 6, "All debris, sawdust, and dirt are cleaned out from the bottom of the formwork?")
        ]),
          // 🏗️ Concreting
        makeCheck("1_4_1_2", 2, "Concreting", [
          makeCheck("1_4_1_2_0", 0, "Concrete mix design (M-grade) and volume verified?"),
          makeCheck("1_4_1_2_0", 1, "All reinforcement and formwork approved for pour by the engineer?"),
          makeCheck("1_4_1_2_0", 2, "Slump test is conducted on the fresh concrete?"),
          makeCheck("1_4_1_2_0", 3, "Concrete is poured in lifts and properly compacted with a vibrator?"),
          makeCheck("1_4_1_2_0", 4, "Test cubes are cast and labeled for lab testing?"),
          makeCheck("1_4_1_2_0", 5, "Top surface is leveled and finished at the correct elevation?"),
          makeCheck("1_4_1_2_0", 6, "Curing starts within the specified time?"),
          makeCheck("1_4_1_2_0", 7, "Deshuttering date updated to client and contractor team")
        ]),
        ]),
        makeCheck("1_4_2", 0, "Slab Works", [
        // 🪵 SHUTTERING
        makeCheck("1_4_2_0", 0, "Shuttering", [
          makeCheck("1_4_2_0_0", 0, "Shuttering material (plywood/steel panels) is clean, undamaged, and free of defects?"),
          makeCheck("1_4_2_0_1", 1, "Formwork is coated with a proper release agent (form oil)?"),
          makeCheck("1_4_2_0_2", 2, "All joints and gaps in the formwork are tight to prevent cement slurry leakage?"),
          makeCheck("1_4_2_0_3", 3, "Overall slab dimensions (length and width) checked against the structural drawing?"),
          makeCheck("1_4_2_0_4", 4, "Shuttering for openings (staircases, shafts, MEP) is accurately placed?"),
          makeCheck("1_4_2_0_5", 5, "Edge beams/drop beam shuttering is correctly placed and sized?"),
          makeCheck("1_4_2_0_6", 6, "Slab bottom level is checked against the required datum/reference level?"),
          makeCheck("1_4_2_0_7", 7, "The shuttering surface is dead level (or set to the required slope for drainage, if applicable)?"),
          makeCheck("1_4_2_0_8", 8, "Vertical faces of the edge beams/slabs are plumb (perfectly vertical)?"),
          makeCheck("1_4_2_0_9", 9, "Props/vertical supports are placed on a firm base (not loose soil or debris)?"),
          makeCheck("1_4_2_0_10", 10, "Props are perfectly vertical or set at the specified maximum angle of inclination?"),
          makeCheck("1_4_2_0_11", 11, "All connections (prop heads, clamps, wedges) are tight and secure?"),
          makeCheck("1_4_2_0_12", 12, "Sufficient bracing (horizontal and diagonal) is provided to prevent lateral movement?"),
          makeCheck("1_4_2_0_13", 13, "All MEP sleeves, conduits, and inserts are accurately located and secured to the formwork?"),
          makeCheck("1_4_2_0_14", 14, "The shuttering surface is thoroughly cleaned of debris (wood chips, wire pieces, sawdust) before reinforcement placement?"),
          makeCheck("1_4_2_0_15", 15, "Access ladders, ramps, and edge protection (guardrails) are installed for safety?"),
          makeCheck("1_4_2_0_16", 16, "Working platforms are structurally sound and clear?")
        ]),
        // 🔩 REINFORCEMENT
        makeCheck("1_4_2_1", 1, "Reinforcement", [
          makeCheck("1_4_2_1_0", 0, "Steel grade and type (e.g., Fe 500, TMT) checked against structural drawings and specifications?"),
          makeCheck("1_4_2_1_1", 1, "Reinforcement bars are clean and free of loose rust, oil, paint, or mud?"),
          makeCheck("1_4_2_1_2", 2, "Diameter of main bars (top and bottom) verified?"),
          makeCheck("1_4_2_1_3", 3, "Spacing of bars (longitudinal and transverse) checked as per drawing specifications?"),
          makeCheck("1_4_2_1_4", 4, "Lapping/Splicing of bars is done at specified locations and the lap length is correct?"),
          makeCheck("1_4_2_1_5", 5, "Anchor L Bends provided at edge beams and supports?"),
          makeCheck("1_4_2_1_6", 6, "Bottom reinforcement is correctly positioned and secured?"),
          makeCheck("1_4_2_1_7", 7, "Top reinforcement is correctly positioned, especially at supports?"),
          makeCheck("1_4_2_1_8", 8, "Cover blocks are used to maintain the specified clear cover (top and bottom)?"),
          makeCheck("1_4_2_1_9", 9, "Chairs/spacers are used to maintain the required spacing between top and bottom layers?"),
          makeCheck("1_4_2_1_10", 10, "All bars are securely tied with binding wire (not less than 18 gauge) to maintain the cage integrity?"),
          makeCheck("1_4_2_1_11", 11, "Cantilever/Balcony reinforcement (if any) is correctly placed, with top steel extending fully into the slab?"),
          makeCheck("1_4_2_1_12", 12, "Rebar displacement is constantly checked and corrected during vibration?"),
          makeCheck("1_4_2_1_13", 13, "Opening trimming bars (extra reinforcement) are provided around all cut-outs and openings?"),
          makeCheck("1_4_2_1_14", 14, "All MEP sleeves, conduits, and inserts are placed and secured without cutting or displacing main reinforcement?"),
          makeCheck("1_4_2_1_15", 15, "Dowel bars/starter bars for future columns or walls are correctly positioned and tied?"),
          makeCheck("1_4_2_1_16", 16, "The entire reinforcement layout is approved by the site engineer before concreting?")
        ]),
        // 🏗️ CONCRETING
        makeCheck("1_4_2_2", 2, "Concreting", [
          makeCheck("1_4_2_2_0", 0, "Shuttering and Reinforcement have been inspected and approved?"),
          makeCheck("1_4_2_2_1", 1, "Clearance given by the Reinforcement check?"),
          makeCheck("1_4_2_2_2", 2, "All debris and water are removed from the shuttering surface?"),
          makeCheck("1_4_2_2_3", 3, "All MEP/Services (conduits, sleeves, inserts) are provided as per drawing and approval taken?"),
          makeCheck("1_4_2_2_4", 4, "Concrete Mix Design (M-Grade) confirmed to match specifications (e.g., M25)?"),
          makeCheck("1_4_2_2_5", 5, "Concrete delivery note checked for correct mix details, batch time, and volume?"),
          makeCheck("1_4_2_2_6", 6, "Slump Test conducted on-site to verify workability (within tolerance)? (every vehicle 3 cubes)"),
          makeCheck("1_4_2_2_7", 7, "Slab top level of Concrete marked on all columns?"),
          makeCheck("1_4_2_2_8", 8, "Concrete is discharged and placed without segregation (excessive dropping height avoided)?"),
          makeCheck("1_4_2_2_9", 9, "Concrete is placed continuously, following a logical pouring sequence?"),
          makeCheck("1_4_2_2_10", 10, "Concrete is thoroughly compacted using needle vibrator at close intervals (flat vibrator used)?"),
          makeCheck("1_4_2_2_11", 11, "Concrete Test Cubes are cast, labeled, and dated as per sampling frequency?"),
          makeCheck("1_4_2_2_12", 12, "Concrete is screeded to the required level using a straight edge or laser screed?"),
          makeCheck("1_4_2_2_13", 13, "Final slab thickness is verified against the drawing dimension using concrete gauge and marking of level?"),
          makeCheck("1_4_2_2_14", 14, "Surface finish with proper level using aluminium scale?"),
          makeCheck("1_4_2_2_15", 15, "Curing (wet hessian, ponding, or curing compound) starts immediately after the initial set?"),
          makeCheck("1_4_2_2_16", 16, "Curing is maintained for the specified duration (e.g., 7 days)?"),
          makeCheck("1_4_2_2_17", 17, "Slab surface is protected from heavy rain, rapid drying, and foot traffic? (if any)"),
          makeCheck("1_4_2_2_18", 18, "Deshuttering date updated to client and contractor team?"),
          makeCheck("1_4_2_2_19", 19, "Clear the honeycombing with bonding agents?")
        ])
      ]),
      
        makeCheck("1_4_3", 0, "Brick Work & Lintels", [
          // 🧱 BRICK WORK
          makeCheck("1_4_3_0", 0, "Brick Work", [
            makeCheck("1_4_3_0_0", 0, "Bricks are uniform in size, color, and pass the falling test & 2-block hitting sound check?"),
            makeCheck("1_4_3_0_1", 1, "Bricks are properly soaked in clean water before laying?"),
            makeCheck("1_4_3_0_2", 2, "Mortar mix ratio (cement:sand) and grade confirmed as per specifications?"),
            makeCheck("1_4_3_0_3", 3, "Sand and water used for mortar are clean and free of silt/salts?"),
            makeCheck("1_4_3_0_4", 4, "First course (setting out) is checked for correct alignment and level?"),
            makeCheck("1_4_3_0_5", 5, "Brickwork drawing checked as per architectural drawing and beam offsets?"),
            makeCheck("1_4_3_0_6", 6, "Damp Proof Course (DPC) is laid at the correct level and material is specified?"),
            makeCheck("1_4_3_0_7", 7, "The wall is straight and checked using a string line for alignment?"),
            makeCheck("1_4_3_0_8", 8, "Each course is level checked with a spirit level or leveling instrument?"),
            makeCheck("1_4_3_0_9", 9, "Wall thickness is uniform and as per the drawing?"),
            makeCheck("1_4_3_0_10", 10, "RCC band is provided every 3'?"),
            makeCheck("1_4_3_0_11", 11, "Mortar joints are uniform in thickness (typically 12–15 mm)?"),
            makeCheck("1_4_3_0_12", 12, "Joint finish (e.g., struck, raked) is achieved and consistent?"),
            makeCheck("1_4_3_0_13", 13, "If cavity walls exist – wall ties are correctly spaced and embedded?"),
            makeCheck("1_4_3_0_14", 14, "Openings for doors and windows are correctly sized and located?"),
            makeCheck("1_4_3_0_15", 15, "Lintels are placed at the correct height and have the specified bearing length?"),
            makeCheck("1_4_3_0_16", 16, "Fresh mortar is used (within its initial setting time)?"),
            makeCheck("1_4_3_0_17", 17, "Raking (scratching the joints) is done to provide key for plaster (if specified)?"),
            makeCheck("1_4_3_0_18", 18, "Curing (wetting/spraying) is maintained for the specified duration (e.g., 7 days)?")
          ]),
        
          // 🏗️ LINTELS
          makeCheck("1_4_3_1", 1, "Lintels", [
            makeCheck("1_4_3_1_0", 0, "Lintel depth and width checked against the drawing?"),
            makeCheck("1_4_3_1_1", 1, "Sunshade projection and thickness checked against the drawing?"),
            makeCheck("1_4_3_1_2", 2, "The bottom level of the lintel is uniform and at the specified height above FFL/Slab?"),
            makeCheck("1_4_3_1_3", 3, "Sunshade formwork is set to the required slope/fall for drainage?"),
            makeCheck("1_4_3_1_4", 4, "Shuttering is level and plumb (vertical) and securely fixed?"),
            makeCheck("1_4_3_1_5", 5, "Supports/props are adequate and securely braced, especially for the cantilevered sunshade?"),
            makeCheck("1_4_3_1_6", 6, "Formwork is clean and coated with a proper release agent?"),
            makeCheck("1_4_3_1_7", 7, "Main steel bars (size and number) for both lintel and sunshade checked?"),
            makeCheck("1_4_3_1_8", 8, "Shear stirrups (size and spacing) verified for the lintel?"),
            makeCheck("1_4_3_1_9", 9, "Anchorage of sunshade steel checked for correct extension into the main wall/lintel?"),
            makeCheck("1_4_3_1_10", 10, "All bars are free of rust, oil, and mud?"),
            makeCheck("1_4_3_1_11", 11, "Clear cover maintained using concrete or plastic cover blocks (bottom and sides)?"),
            makeCheck("1_4_3_1_12", 12, "Chairs/spacers are used to maintain the distance between top and bottom steel (if double mesh)?"),
            makeCheck("1_4_3_1_13", 13, "Shuttering and steel have been inspected and approved?"),
            makeCheck("1_4_3_1_14", 14, "Wall below the lintel is properly wetted to prevent water absorption?"),
            makeCheck("1_4_3_1_15", 15, "Concrete is placed and thoroughly compacted using a small needle vibrator?"),
            makeCheck("1_4_3_1_16", 16, "Test cubes are cast and labeled for lab testing (if required)?"),
            makeCheck("1_4_3_1_17", 17, "Top surface is finished smooth and at the correct level/slope?"),
            makeCheck("1_4_3_1_18", 18, "Curing (wetting) starts immediately after initial set and is maintained for the specified duration?")
          ]),
        
          // 🧱 PARAPET WALL
          makeCheck("1_4_3_2", 2, "Parapet Wall", [
            makeCheck("1_4_3_2_0", 0, "Wall height checked against safety codes and drawings (usually minimum 1.0m)?"),
            makeCheck("1_4_3_2_1", 1, "Wall thickness is correct and uniform?"),
            makeCheck("1_4_3_2_2", 2, "Brick/Block material matches specifications?"),
            makeCheck("1_4_3_2_3", 3, "Mortar mix ratio is correct and securely bonded?"),
            makeCheck("1_4_3_2_4", 4, "Reinforcement/Stiffeners (vertical and horizontal bands/columns) are included as specified in structural drawings?"),
            makeCheck("1_4_3_2_5", 5, "Wall is plumb (vertical) and straight (aligned) checked with a plumb bob and string line?"),
            makeCheck("1_4_3_2_6", 6, "Damp Proof Course (DPC) is provided at the base of the parapet wall (where it meets the roof slab)?"),
            makeCheck("1_4_3_2_7", 7, "Waterproofing membrane (if specified) is terminated correctly, extending up the wall?"),
            makeCheck("1_4_3_2_8", 8, "Coping material (e.g., concrete, stone, pre-cast) matches specifications?"),
            makeCheck("1_4_3_2_9", 9, "Joints in the coping are correctly filled with sealant or mortar and are watertight?"),
            makeCheck("1_4_3_2_10", 10, "Weep holes or small drainage holes are provided at the DPC level (if required)?"),
            makeCheck("1_4_3_2_11", 11, "The wall does not obstruct the flow of water towards the roof drainage outlets?"),
            makeCheck("1_4_3_2_12", 12, "Plastering/Rendering (if applied) checked for correct thickness, finish, and curing?"),
            makeCheck("1_4_3_2_13", 13, "Plaster is checked for hollowness by tapping?")
          ])
        
        ]),
        makeCheck("1_4_4", 0, "Plastering", [
        
          // ⚡ Electrical Conduiting
          makeCheck("1_4_4_0", 0, "Electrical Conduiting", [
            makeCheck("1_4_4_0_0", 0, "All conduits are the correct size (diameter) as specified for the number of wires?"),
            makeCheck("1_4_4_0_1", 1, "Piping material (e.g., PVC, GI) is correct and free from damage/cracks?"),
            makeCheck("1_4_4_0_2", 2, "Conduits run straight and parallel (or perpendicular) to the walls/beams?"),
            makeCheck("1_4_4_0_3", 3, "Check for slab PVC pipes blockages?"),
            makeCheck("1_4_4_0_4", 4, "Conduits are firmly secured to the wall/ceiling with saddle clamps or nails at specified intervals?"),
            makeCheck("1_4_4_0_5", 5, "Chases (cuts in the wall) are filled with a cement-sand mix or chicken mesh over the conduit before plastering?"),
            makeCheck("1_4_4_0_6", 6, "Draw wires (fish wires) are placed inside conduits (if required by local practice) to facilitate future wiring?"),
            makeCheck("1_4_4_0_7", 7, "All junction boxes, switch boxes, and fan boxes are secured firmly and flush with the final plaster line?"),
            makeCheck("1_4_4_0_8", 8, "Boxes are mounted at the correct height from the floor level (e.g., switches at 1.2m)?"),
            makeCheck("1_4_4_0_9", 9, "All box covers are in place to prevent debris/mortar from entering?"),
            makeCheck("1_4_4_0_10", 10, "All open ends of conduits are plugged or sealed with tape/rubber caps to prevent entry of mortar during plastering?"),
            makeCheck("1_4_4_0_11", 11, "Conduiting should be 6 inches away from windows or doors?"),
            makeCheck("1_4_4_0_12", 12, "Conduits are completely recessed within the wall/ceiling surface and do not project out?"),
            makeCheck("1_4_4_0_13", 13, "Conduits are not placed near sharp edges or corners that could damage them?"),
            makeCheck("1_4_4_0_14", 14, "Conduit placement does not compromise the structural integrity of columns, beams, or thin walls?"),
            makeCheck("1_4_4_0_15", 15, "Conduits are separated from plumbing pipes and other services as required by code?")
          ]),
        
          // 🛠️ While Plastering
          makeCheck("1_4_4_1", 1, "While Plastering", [
            makeCheck("1_4_4_1_0", 0, "The base surface (brickwork/concrete) is clean, free of oil, dust, and loose mortar?"),
            makeCheck("1_4_4_1_1", 1, "Joints in brickwork are properly raked (roughed up) to provide a key for plaster?"),
            makeCheck("1_4_4_1_2", 2, "Concrete surfaces are properly chipped or hacked to ensure bonding?"),
            makeCheck("1_4_4_1_3", 3, "Chicken mesh is fixed on electrical pipes?"),
            makeCheck("1_4_4_1_4", 4, "Chicken mesh is installed at all junctions of dissimilar materials (e.g., brick to concrete)?"),
            makeCheck("1_4_4_1_5", 5, "Mortar mix ratio (cement:sand) and grade confirmed as per specifications?"),
            makeCheck("1_4_4_1_6", 6, "Plastering river sand used is clean, sharp, and correctly graded (sieved)?"),
            makeCheck("1_4_4_1_7", 7, "Bull marking is done before plastering?"),
            makeCheck("1_4_4_1_8", 8, "Grounds/screed strips are fixed to ensure uniform plaster thickness?"),
            makeCheck("1_4_4_1_9", 9, "Plaster thickness is checked and confirmed to be within specified limits (typically 12mm for walls)?"),
            makeCheck("1_4_4_1_10", 10, "Plaster is applied in the correct number of coats (e.g., single or double coat)?"),
            makeCheck("1_4_4_1_11", 11, "Internal and external corners are finished straight and sharp using a trowel/corner tool?")
          ]),
        
          // 🧱 After Plastering
          makeCheck("1_4_4_2", 2, "After Plastering", [
            makeCheck("1_4_4_2_0", 0, "The finished surface is plumb (vertical) checked with a plumb bob?"),
            makeCheck("1_4_4_2_1", 1, "The finished surface is straight and checked using a straight edge with aluminium foil?"),
            makeCheck("1_4_4_2_2", 2, "The finished surface level (especially on ceilings) is checked with a level?"),
            makeCheck("1_4_4_2_3", 3, "The plaster surface is checked for hollowness by gently tapping with a wooden mallet?"),
            makeCheck("1_4_4_2_4", 4, "Curing (wetting) starts soon after initial set and is maintained for the specified duration (e.g., 7 days)?"),
            makeCheck("1_4_4_2_5", 5, "The freshly plastered surface is protected from direct sun, rain, and rapid drying?"),
            makeCheck("1_4_4_2_6", 6, "The plaster surface is checked again for hollowness by gently tapping with a wooden mallet?"),
            makeCheck("1_4_4_2_7", 7, "Hardness is tested with a coin or nail?")
          ])
        ]),
        makeCheck("1_4_5", 0, "Plumbing Piping", [
          makeCheck("1_4_5_0", 0, "Plumbing Piping in Site", [
            makeCheck("1_4_5_0_0", 0, "Confirm pipe materials (type, size, schedule) match the approved specifications."),
            makeCheck("1_4_5_0_1", 1, "Visually inspect all incoming pipes, fittings, and valves for any damage or defects."),
            makeCheck("1_4_5_0_2", 2, "Ensure proper material handling and storage on-site to prevent contamination or damage."),
            makeCheck("1_4_5_0_3", 3, "Drainage, Waste, and Vent (DWV) piping has the correct slope/gradient (e.g., per foot)."),
            makeCheck("1_4_5_0_4", 4, "All pipe joints (solvent cement, threaded, mechanical) are complete and sealed correctly."),
            makeCheck("1_4_5_0_5", 5, "Piping is adequately supported by approved hangers and supports at required intervals to prevent sagging."),
            makeCheck("1_4_5_0_6", 6, "Pipes passing through concrete or structural framing are properly sleeved or protected (shield plates used)."),
            makeCheck("1_4_5_0_7", 7, "Cleanouts are installed at all required locations (e.g., main line, changes of direction) and are accessible."),
            makeCheck("1_4_5_0_8", 8, "Stub-outs for all fixtures are correctly positioned and aligned at the specified height and depth."),
            makeCheck("1_4_5_0_9", 9, "All required pipe insulation (hot water, cold water, exterior lines) is correctly installed."),
            makeCheck("1_4_5_0_10", 10, "Confirmed proper water pressure is maintained across the system (e.g., between 30-40 psi).")
          ])
        ]),
        makeCheck("1_4_6", 0, "Exterior and Elevation Civil Works", [
        
          // 1️⃣ Elevation
          makeCheck("1_4_6_0", 0, "Elevation", [
            makeCheck("1_4_6_0_0", 0, "All columns and walls are checked for plumb (perfect vertical alignment) using a plumb bob or total station?"),
            makeCheck("1_4_6_0_1", 1, "All beams are checked for straightness (no lateral bowing or deflection)?"),
            makeCheck("1_4_6_0_2", 2, "Beam soffit (bottom) levels are checked to ensure they are consistent and match the drawing elevation?"),
            makeCheck("1_4_6_0_3", 3, "Overall floor-to-floor height is correct as per the drawing?"),
            makeCheck("1_4_6_0_4", 4, "Vertical formwork faces are securely braced against pouring pressure?"),
            makeCheck("1_4_6_0_5", 5, "Formwork joints are tight to prevent cement slurry leakage, which causes honeycombing?"),
            makeCheck("1_4_6_0_6", 6, "Formwork is clean and coated with a proper release agent?"),
            makeCheck("1_4_6_0_7", 7, "Clear cover is maintained on all faces (sides, top, bottom) using adequate spacers/cover blocks?"),
            makeCheck("1_4_6_0_8", 8, "Beam and column steel is properly anchored and extended through the joints?"),
            makeCheck("1_4_6_0_9", 9, "Spacing and location of stirrups (beams) and ties (columns) are correct, especially at supports and splice locations?"),
            makeCheck("1_4_6_0_10", 10, "Openings for windows, doors, and vents are correctly sized and positioned in structural walls/beams?"),
            makeCheck("1_4_6_0_11", 11, "Lintel beams are cast at the correct height and have sufficient bearing length?"),
            makeCheck("1_4_6_0_12", 12, "All sleeves, conduits, and piping passing through the vertical elements are properly located, secured, and do not displace main reinforcement?"),
            makeCheck("1_4_6_0_13", 13, "Concrete is poured and thoroughly compacted using the appropriate vibrator to prevent honeycombing on the face?"),
            makeCheck("1_4_6_0_14", 14, "Exposed concrete faces (if applicable) are checked for a clean, consistent finish upon de-shuttering?"),
            makeCheck("1_4_6_0_15", 15, "Proper curing (wetting/spraying) is initiated immediately after casting and maintained for the specified duration?"),
            makeCheck("1_4_6_0_16", 16, "Any electrical works")
          ]),
        
          // 2️⃣ Setbacks / Miscellaneous Works
          makeCheck("1_4_6_1", 1, "Setbacks & Miscellaneous Works", [
            makeCheck("1_4_6_1_0", 0, "Backfill around foundation walls is fully compacted and stable?"),
            makeCheck("1_4_6_1_1", 1, "The ground is graded with a minimum slope (fall) of 1:100 (1%) away from the building foundation for drainage?"),
            makeCheck("1_4_6_1_2", 2, "Final finished level is set below the Damp Proof Course (DPC) level?"),
            makeCheck("1_4_6_1_3", 3, "Catch basins/trench drains are installed where rainwater accumulates?"),
            makeCheck("1_4_6_1_4", 4, "Stormwater drain lines are correctly laid out and connected to the main line?"),
            makeCheck("1_4_6_1_5", 5, "Plumbing cleanouts are installed, marked, and easily accessible?"),
            makeCheck("1_4_6_1_6", 6, "Covers for manholes, inspection chambers, and utility boxes are installed flush with the finished surface?"),
            makeCheck("1_4_6_1_7", 7, "A compacted layer of Plain Cement Concrete (PCC) or sub-base is laid to prevent settlement of the finish layer?"),
            makeCheck("1_4_6_1_8", 8, "The final finish material (e.g., paver blocks, concrete, stone slabs) is uniform and installed correctly?"),
            makeCheck("1_4_6_1_9", 9, "Control/expansion joints are provided in concrete surfaces to prevent cracking?"),
            makeCheck("1_4_6_1_10", 10, "The finish is visually aligned and coordinated with the main entrance path or surrounding landscaping?"),
            makeCheck("1_4_6_1_11", 11, "Any planned planting beds are located away from the immediate foundation and have proper drainage?"),
            makeCheck("1_4_6_1_12", 12, "The exposed plinth/foundation wall is plastered, painted, or clad to prevent moisture absorption?"),
            makeCheck("1_4_6_1_13", 13, "Provision for exterior/pathway lighting is installed and operational?")
          ]),
        
          // 3️⃣ Compound Wall
          makeCheck("1_4_6_2", 2, "Compound Wall", [
            makeCheck("1_4_6_2_0", 0, "Wall height checked against safety codes and drawings (usually minimum 1.0m)?"),
            makeCheck("1_4_6_2_1", 1, "Wall thickness is correct and uniform?"),
            makeCheck("1_4_6_2_2", 2, "Brick/Block material matches specifications?"),
            makeCheck("1_4_6_2_3", 3, "Mortar mix ratio is correct and securely bonded?"),
            makeCheck("1_4_6_2_4", 4, "Reinforcement/Stiffeners (vertical and horizontal bands/columns) are included as specified in structural drawings?"),
            makeCheck("1_4_6_2_5", 5, "Wall is plumb (vertical) and straight (aligned) checked with a plumb bob and string line?"),
            makeCheck("1_4_6_2_6", 6, "Damp Proof Course (DPC) is provided at the base of the parapet wall (where it meets the roof slab)?"),
            makeCheck("1_4_6_2_7", 7, "Waterproofing membrane (if specified) is terminated correctly, extending up the wall?"),
            makeCheck("1_4_6_2_8", 8, "Coping material (e.g., concrete, stone, pre-cast) matches specifications?"),
            makeCheck("1_4_6_2_9", 9, "Joints in the coping are correctly filled with sealant or mortar and are watertight?"),
            makeCheck("1_4_6_2_10", 10, "Weep holes or small drainage holes are provided at the DPC level (if required)?"),
            makeCheck("1_4_6_2_11", 11, "The wall does not obstruct the flow of water towards the roof drainage outlets?"),
            makeCheck("1_4_6_2_12", 12, "Plastering/Rendering (if applied) checked for correct thickness, finish, and curing?"),
            makeCheck("1_4_6_2_13", 13, "Plaster is checked for hollowness by tapping?")
          ])
        ]),
        makeCheck("1_4_7", 0, "Waterproofing", [
        
          // 1️⃣ Toilets
          makeCheck("1_4_7_0", 0, "Toilets", [
            makeCheck("1_4_7_0_0", 0, "Slab surface is clean, dry, and free of sharp projections, debris, oil, and loose concrete?"),
            makeCheck("1_4_7_0_1", 1, "All vertical and horizontal joints (wall-to-floor) are chamfered or rounded (using a polymer-modified mortar fillet)?"),
            makeCheck("1_4_7_0_2", 2, "All pipe penetrations are recessed and sealed (e.g., with non-shrink grout or cement plug) and ready for membrane application?"),
            makeCheck("1_4_7_0_3", 3, "Existing uneven screed is removed or repaired to provide a sound and level substrate?"),
            makeCheck("1_4_7_0_4", 4, "Waterproofing material (e.g., liquid membrane, cementitious slurry, sheet membrane) matches specifications?"),
            makeCheck("1_4_7_0_5", 5, "The correct primer (if required) is applied and allowed to dry as per manufacturer instructions?"),
            makeCheck("1_4_7_0_6", 6, "The membrane is applied at the specified thickness and covers the entire floor area uniformly?"),
            makeCheck("1_4_7_0_7", 7, "The membrane is fully extended up the walls to the specified height (min. 150mm)?"),
            makeCheck("1_4_7_0_8", 8, "Fiber mesh or reinforcing fabric (if specified) is properly embedded in the membrane at all joints/corners?"),
            makeCheck("1_4_7_0_9", 9, "The applied membrane is allowed to cure for the specified duration before any testing or protective measures?"),
            makeCheck("1_4_7_0_10", 10, "A ponding test is conducted: the area is flooded with water to a specific height (e.g., 50mm) and checked for leaks below for 24-48 hours?"),
            makeCheck("1_4_7_0_11", 11, "A protective screed or topping is laid over the cured membrane to prevent puncture during subsequent work?"),
            makeCheck("1_4_7_0_12", 12, "The protective screed is laid with the correct slope/gradient towards the floor drain?"),
            makeCheck("1_4_7_0_13", 13, "Waterproofing is protected from damage during tiling and fixture installation?"),
            makeCheck("1_4_7_0_14", 14, "The floor drain opening is sealed to the membrane and positioned correctly in the protective screed?")
          ]),
        
          // 2️⃣ Balconies
          makeCheck("1_4_7_1", 1, "Balconies", [
            makeCheck("1_4_7_1_0", 0, "Slab surface is clean, dry, and free of sharp projections, debris, and loose concrete?"),
            makeCheck("1_4_7_1_1", 1, "Any honeycombing or major cracks in the slab have been repaired with non-shrink grout or polymer mortar?"),
            makeCheck("1_4_7_1_2", 2, "All vertical and horizontal joints (wall-to-slab) are chamfered or rounded (using a polymer-modified mortar fillet)?"),
            makeCheck("1_4_7_1_3", 3, "All pipe or railing base penetrations are recessed, sealed, and ready for membrane application?"),
            makeCheck("1_4_7_1_4", 4, "Waterproofing material (e.g., PU membrane, cementitious slurry, bitumen sheet) matches specifications?"),
            makeCheck("1_4_7_1_5", 5, "The correct primer (if required) is applied and allowed to dry as per manufacturer instructions?"),
            makeCheck("1_4_7_1_6", 6, "The membrane is applied at the specified thickness/layers and covers the entire slab area uniformly?"),
            makeCheck("1_4_7_1_7", 7, "The membrane is fully extended up the perimeter walls/parapets to the specified height (min. 150mm)?"),
            makeCheck("1_4_7_1_8", 8, "Fiber mesh or reinforcing fabric (if specified) is properly embedded in the membrane at all joints, corners, and drains?"),
            makeCheck("1_4_7_1_9", 9, "The applied membrane is allowed to cure for the specified duration before testing?"),
            makeCheck("1_4_7_1_10", 10, "A ponding test is conducted: the area is flooded with water to a specific height (e.g., 50-75mm) and checked for leaks below for a minimum of 48 hours?"),
            makeCheck("1_4_7_1_11", 11, "A protective screed or topping (if required) is laid over the cured membrane to prevent puncture during subsequent work?"),
            makeCheck("1_4_7_1_12", 12, "The protective screed is laid with the correct slope/gradient towards the floor drains/outlets?"),
            makeCheck("1_4_7_1_13", 13, "The drain opening is sealed to the membrane and positioned correctly in the protective screed?"),
            makeCheck("1_4_7_1_14", 14, "Final railing bases/posts are sealed to the finished floor, and their attachment method does not compromise the membrane?")
          ]),
        
          // 3️⃣ Terrace
          makeCheck("1_4_7_2", 2, "Terrace", [
            makeCheck("1_4_7_2_0", 0, "Slab surface is completely clean, dry, and free of dust, oil, and loose concrete?"),
            makeCheck("1_4_7_2_1", 1, "All cracks, honeycombing, or structural defects in the slab have been repaired with non-shrink grout/polymer mortar?"),
            makeCheck("1_4_7_2_2", 2, "All pipe penetrations (vents, plumbing) are properly sealed and recessed with non-shrink grout?"),
            makeCheck("1_4_7_2_3", 3, "All vertical and horizontal joints (wall-to-slab) have been treated with a polymer mortar fillet (cove) to eliminate sharp corners?"),
            makeCheck("1_4_7_2_4", 4, "Waterproofing material (e.g., APP membrane, PU liquid membrane, cementitious system) matches specifications?"),
            makeCheck("1_4_7_2_5", 5, "The correct primer (if required) is applied at the specified coverage rate and allowed to dry?"),
            makeCheck("1_4_7_2_6", 6, "The membrane is fully extended up the parapet walls to the specified height (min. 150mm) and correctly terminated?"),
            makeCheck("1_4_7_2_7", 7, "The membrane is applied at the specified thickness or number of layers (e.g., two coats of liquid, one layer of sheet)?"),
            makeCheck("1_4_7_2_8", 8, "For sheet membranes, all overlaps are correctly sealed and fused?"),
            makeCheck("1_4_7_2_9", 9, "The applied membrane is allowed to cure for the specified duration before any testing or subsequent layers?"),
            makeCheck("1_4_7_2_10", 10, "A ponding test is conducted: the area is flooded with water (e.g., 50-75mm) and checked for leaks for a minimum of 48 to 72 hours?"),
            makeCheck("1_4_7_2_11", 11, "A protective screed (or brick bat coba/tile) is laid over the cured membrane to prevent damage?"),
            makeCheck("1_4_7_2_12", 12, "The protective screed is laid with the correct slope/gradient (typically 1:100 or 1:80) towards all drain points?"),
            makeCheck("1_4_7_2_13", 13, "Roof drain outlets are securely sealed to the membrane and positioned correctly in the screed?"),
            makeCheck("1_4_7_2_14", 14, "The final finish (tiles, cool roof paint, weathering course) is applied and is free of cracks or gaps?")
          ])
        ])
        
      ]),
      makeCheck("1", 3, "Finishings", [
        // ─────────────────────────────────────────
        // 1) False Ceiling
        // ─────────────────────────────────────────
        makeCheck("1_3", 0, "False Ceiling", [
          makeCheck(
            "1_3_0",
            0,
            "Frame material (e.g., GI, aluminum, wood) and gauge/thickness match specifications?"
          ),
          makeCheck(
            "1_3_0",
            1,
            "Hanger rods/wires are secured firmly to the main slab (not to MEP conduits)?"
          ),
          makeCheck(
            "1_3_0",
            2,
            "Hanger rods are spaced correctly as per manufacturer/drawing specifications?"
          ),
          makeCheck(
            "1_3_0",
            3,
            "Main grid members are level and correctly spaced?"
          ),
          makeCheck(
            "1_3_0",
            4,
            "Cross tees are installed, locked into the main runners, and correctly spaced?"
          ),
          makeCheck(
            "1_3_0",
            5,
            "The entire grid is securely braced to prevent swaying or lateral movement?"
          ),
          makeCheck(
            "1_3_0",
            6,
            "The finished ceiling level is checked against the required datum/FFL and is consistent across the room?"
          ),
          makeCheck(
            "1_3_0",
            7,
            "The bulkheads and drops (if any) are perfectly plumb (vertical)?"
          ),
          makeCheck(
            "1_3_0",
            8,
            "Tile layout (if applicable) is symmetrical, with equal border tiles around the perimeter?"
          ),
          makeCheck(
            "1_3_0",
            9,
            "Ceiling board/tile material (e.g., gypsum, mineral fiber) and thickness checked as specified?"
          ),
          makeCheck(
            "1_3_0",
            10,
            "Boards are secured to the frame using the correct screws (type and length) and at specified spacing?"
          ),
          makeCheck(
            "1_3_0",
            11,
            "Joints between boards are taped with fiber tape and filled with jointing compound before final finishing?"
          ),
          makeCheck(
            "1_3_0",
            12,
            "The finished surface is smooth and flat, free of screw bumps, tape bubbles, or imperfections?"
          ),
          makeCheck(
            "1_3_0",
            13,
            "Cutouts for light fixtures are accurate in size, location, and cleanly cut?"
          ),
          makeCheck(
            "1_3_0",
            14,
            "Vents, grilles, and diffusers are positioned correctly and aligned with the grid?"
          ),
          makeCheck(
            "1_3_0",
            15,
            "Access panels are installed at specified locations for maintenance of concealed services?"
          ),
          makeCheck(
            "1_3_0",
            16,
            "Acoustic infill or fire barriers (if specified) are correctly placed above the ceiling?"
          ),
        ]),

        // ─────────────────────────────────────────
        // 2) Fabrication (with sub-categories)
        // ─────────────────────────────────────────
        makeCheck("1_3", 1, "Fabrication", [
          // 2a) Stair Case
          makeCheck("1_3_1", 0, "Stair Case", [
            makeCheck(
              "1_3_1_0",
              0,
              "Material grade and size (e.g., I-beam, channels, plates) verified against structural drawings?"
            ),
            makeCheck(
              "1_3_1_0",
              1,
              "Steel members are clean and free of excessive rust, oil, or debris?"
            ),
            makeCheck(
              "1_3_1_0",
              2,
              "All cut pieces are accurately sized and prepped (e.g., beveling for full-penetration welds)?"
            ),
            makeCheck(
              "1_3_1_0",
              3,
              "Tread and Riser dimensions are uniform and match the architectural specifications?"
            ),
            makeCheck(
              "1_3_1_0",
              4,
              "Overall width and length of the stair flight match the opening/landing area?"
            ),
            makeCheck(
              "1_3_1_0",
              5,
              "All connections (landing plates, embed plates) are correctly positioned and aligned?"
            ),
            makeCheck(
              "1_3_1_0",
              6,
              "Weld procedure specifications (WPS) are followed?"
            ),
            makeCheck(
              "1_3_1_0",
              7,
              "Welds are continuous, full-sized, and free of defects (e.g., undercut, porosity, slag inclusion)?"
            ),
            makeCheck(
              "1_3_1_0",
              8,
              "All temporary welds (tack welds) are properly removed or completed?"
            ),
            makeCheck(
              "1_3_1_0",
              9,
              "The completed stair frame is checked for squareness and flatness?"
            ),
            makeCheck(
              "1_3_1_0",
              10,
              "All sharp edges, spatter, and burrs are ground smooth?"
            ),
            makeCheck(
              "1_3_1_0",
              11,
              "Bolt holes are correctly sized and align perfectly for site erection?"
            ),
          ]),

          // 2b) Balcony Railing
          makeCheck("1_3_1", 1, "Balcony Railing", [
            makeCheck(
              "1_3_1_1",
              0,
              "Material grade/section sizes conform to drawings and specifications?"
            ),
            makeCheck(
              "1_3_1_1",
              1,
              "Railing height meets drawing/code requirements and is consistent along the run?"
            ),
            makeCheck(
              "1_3_1_1",
              2,
              "Baluster/vertical member spacing is uniform and within specified maximum?"
            ),
            makeCheck(
              "1_3_1_1",
              3,
              "Anchors/fasteners (type, grade, length) match specification and achieve required embedment/torque?"
            ),
            makeCheck(
              "1_3_1_1",
              4,
              "Top rail and posts are plumb/level; lines are straight without waves or twists?"
            ),
            makeCheck(
              "1_3_1_1",
              5,
              "Welds are continuous and defect-free; no undercut, porosity, or slag inclusion?"
            ),
            makeCheck(
              "1_3_1_1",
              6,
              "All sharp edges and weld spatter removed; corners eased to avoid injury?"
            ),
            makeCheck(
              "1_3_1_1",
              7,
              "Base plates fit flush; grout pads/packers used where required; anchor holes sealed?"
            ),
            makeCheck(
              "1_3_1_1",
              8,
              "Corrosion protection: galvanizing/primer/paint or powder coat applied as specified and undamaged?"
            ),
            makeCheck(
              "1_3_1_1",
              9,
              "Drain/weep holes provided for hollow sections where required?"
            ),
            makeCheck(
              "1_3_1_1",
              10,
              "Glass/mesh/infill panels (if any) meet spec (tempered/laminated), properly gasketed and clipped?"
            ),
            makeCheck(
              "1_3_1_1",
              11,
              "All fasteners are stainless/appropriate grade; exposed heads capped or neatly finished?"
            ),
            makeCheck(
              "1_3_1_1",
              12,
              "Deflection/wobble test: railing is rigid under service load with no excessive movement?"
            ),
            makeCheck(
              "1_3_1_1",
              13,
              "Joints/alignment at corners and returns are tight and visually consistent?"
            ),
            makeCheck(
              "1_3_1_1",
              14,
              "Final cleaning and protection installed until handover?"
            ),
          ]),

          // 2c) Gate Fabrication
          makeCheck("1_3_1", 2, "Gate Fabrication", [
            makeCheck(
              "1_3_1_2",
              0,
              "Member sizes, material grade, and thickness comply with drawings/specifications?"
            ),
            makeCheck(
              "1_3_1_2",
              1,
              "Overall dimensions verified; frame is square—diagonals equal within tolerance?"
            ),
            makeCheck(
              "1_3_1_2",
              2,
              "Weld quality meets WPS; continuous where required; no cracks, porosity, or undercut?"
            ),
            makeCheck(
              "1_3_1_2",
              3,
              "Hinge type/capacity as specified; hinges aligned on a true axis for smooth operation?"
            ),
            makeCheck(
              "1_3_1_2",
              4,
              "Locks/hasps/bolts/handles fitted correctly; strike plates align and latch positively?"
            ),
            makeCheck(
              "1_3_1_2",
              5,
              "Ground clearance consistent and within specified limits across full swing?"
            ),
            makeCheck(
              "1_3_1_2",
              6,
              "Gate stops/hold-open devices installed and positioned as per drawings?"
            ),
            makeCheck(
              "1_3_1_2",
              7,
              "For sliding gates: track is level/straight; wheel alignment and end-stops installed?"
            ),
            makeCheck(
              "1_3_1_2",
              8,
              "Base plates/anchor bolts fixed to sound substrate; chemical anchors where specified?"
            ),
            makeCheck(
              "1_3_1_2",
              9,
              "Corrosion protection: galvanizing/primer/paint or powder coat complete and defect-free?"
            ),
            makeCheck(
              "1_3_1_2",
              10,
              "No sharp edges; all corners deburred and safe to touch?"
            ),
            makeCheck(
              "1_3_1_2",
              11,
              "Electrical provision (motor/sensors) prepped: conduit, junctions, and clearances allowed?"
            ),
            makeCheck(
              "1_3_1_2",
              12,
              "Free movement check: opens/closes smoothly without scraping or binding?"
            ),
            makeCheck(
              "1_3_1_2",
              13,
              "Safety: pinch points minimized; gaps meet safety guidelines; manual override accessible?"
            ),
            makeCheck(
              "1_3_1_2",
              14,
              "Final cleaning and protection applied until commissioning/handover?"
            ),
          ]),
        ]),

        // ─────────────────────────────────────────
        // 3) Putty
        // ─────────────────────────────────────────
        makeCheck("1_3", 2, "Putty", [
           makeCheck("1_3_2", 0, "The plastered/substrate surface is completely clean, free of dust, loose particles, oil, and grease?"),
           makeCheck("1_3_2", 1, "The surface has the correct moisture content (is fully dry) before putty application?"),
           makeCheck("1_3_2", 2, "A coat of sealer/primer (if specified) has been applied to the substrate before the first coat of putty?"),
           makeCheck("1_3_2", 3, "Putty material (e.g., acrylic/polymer-based, cement-based) matches the specification?"),
           makeCheck("1_3_2", 4, "Putty is mixed with the correct proportion of water as per the manufacturer's instructions?"),
           makeCheck("1_3_2", 5, "The putty paste is lump-free, smooth, and of the correct working consistency?"),
           makeCheck("1_3_2", 6, "The specified number of coats (usually two) has been applied?"),
           makeCheck("1_3_2", 7, "Putty is applied in thin layers to avoid cracking or flaking (maximum total thickness not exceeding 1–1.5 mm)?"),
           makeCheck("1_3_2", 8, "Sufficient drying time is allowed between consecutive coats?"),
           makeCheck("1_3_2", 9, "No patches of plaster are visible (full and even coverage is achieved)?"),
           makeCheck("1_3_2", 10, "The final coat is sanded smooth using the correct grade of sandpaper?"),
           makeCheck("1_3_2", 11, "The final sanded surface is completely flat and free of undulations, ridges, or trowel marks?"),
           makeCheck("1_3_2", 12, "The finished surface is checked against light for pinholes, micro-cracks, or air bubbles?")
      ]),

        // ─────────────────────────────────────────
        // 4) Flooring - Tiles
        // ─────────────────────────────────────────
        makeCheck("1_3", 3, "Flooring", [
          makeCheck("1_3_3", 0, "Tiles", [
            makeCheck("1_3_3_0", 0, "The base subfloor (concrete slab, screed) is clean, dry, and free of oil, debris, or curing compound?"),
            makeCheck("1_3_3_0", 1, "The subfloor is checked for flatness and levelness; deviations are within tolerance?"),
            makeCheck("1_3_3_0", 2, "A moisture barrier or primer (if required for certain materials like wood/vinyl) is installed?"),
            makeCheck("1_3_3_0", 3, "The specified flooring material (tile, stone, wood, carpet) and grade match the drawing?"),
            makeCheck("1_3_3_0", 4, "All material for one continuous area is from the same batch/shade to ensure color consistency?"),
            makeCheck("1_3_3_0", 5, "The setting-out lines are clearly marked, and the layout (pattern) is verified?"),
            makeCheck("1_3_3_0", 6, "The layout is symmetrical with equal border cuts or a visually pleasing arrangement?"),
            makeCheck("1_3_3_0", 7, "The correct type of adhesive or mortar is used, and mixing is done as per manufacturer specs?"),
            makeCheck("1_3_3_0", 8, "All tiles/slabs are laid in straight lines (checked with a string line)?"),
            makeCheck("1_3_3_0", 9, "The finished floor level (FFL) is checked and is consistent across the room?"),
            makeCheck("1_3_3_0", 10, "The flooring is checked for hollowness (lack of full mortar/adhesive bedding) by tapping lightly?"),
            makeCheck("1_3_3_0", 11, "Grout joints or seams are uniform in width, depth, and completely filled?"),
            makeCheck("1_3_3_0", 12, "Lippage (unevenness between adjacent edges) is checked and is within tolerance?"),
            makeCheck("1_3_3_0", 13, "In wet areas (bathrooms, balconies), the floor has the correct slope towards the drain?"),
            makeCheck("1_3_3_0", 14, "Thresholds, transition strips, and reducers between different flooring types are installed neatly?"),
            makeCheck("1_3_3_0", 15, "Skirting/baseboards are installed correctly and align with the flooring?"),
            makeCheck("1_3_3_0", 16, "The newly installed floor is protected from foot traffic, heavy loads, and staining until fully cured?"),
            makeCheck("1_3_3_0", 17, "Fresh mortar is used (within its initial setting time)?"),
            makeCheck("1_3_3_0", 18, "Raking (scratching the joints) is done to provide key for plaster (if specified)?"),
            makeCheck("1_3_3_0", 19, "Curing (wetting/spraying) is maintained for the specified duration (e.g., 7 days)?")
          ])
        ]),


        // ─────────────────────────────────────────
        // 5) Electrical - Final Fittings
        // ─────────────────────────────────────────
        makeCheck("1_3", 4, "Electrical", [
         makeCheck("1_3_4", 0, "Final Fittings", [
           makeCheck("1_3_4_0", 0, "All light fixtures, fans, and appliances match the type and model specified in the drawings/schedule?"),
           makeCheck("1_3_4_0", 1, "All light points, fans, and appliances are tested and fully functional?"),
           makeCheck("1_3_4_0", 2, "Fixtures are securely mounted and straight/level/plumb? (e.g., ceiling fans firmly fixed to the concrete box)"),
           makeCheck("1_3_4_0", 3, "Visible portions of fittings are clean, undamaged, and free of scratches or paint spatter?"),
           makeCheck("1_3_4_0", 4, "Correct wire size and color-coding used for connections - Green for Earth, Black/Blue for Neutral, Red/Yellow for Live)?"),
           makeCheck("1_3_4_0", 5, "Every switch and socket outlet is tested for proper operation and power output?"),
           makeCheck("1_3_4_0", 6, "All switch and socket plates are installed at the correct height from the finished floor level (FFL)?"),
           makeCheck("1_3_4_0", 7, "Plates are horizontal/vertical and aligned flush with the finished wall surface?"),
           makeCheck("1_3_4_0", 8, "The earthing (grounding) connection is correctly made to every switchboard, socket, and metal fixture?"),
           makeCheck("1_3_4_0", 9, "Polarity is correct (Live and Neutral wires correctly terminated) at all sockets and light points?"),
           makeCheck("1_3_4_0", 10, "Circuit breaker ratings in the distribution board (DB) match the connected load/cable size?"),
           makeCheck("1_3_4_0", 11, "All connections are neatly and securely insulated inside boxes and fittings?"),
           makeCheck("1_3_4_0", 12, "DB is installed plumb, level, and securely fixed?"),
           makeCheck("1_3_4_0", 13, "All circuit breakers are clearly labeled to indicate the areas/loads they control?"),
           makeCheck("1_3_4_0", 14, "Internal wiring within the DB is neatly dressed and properly terminated?"),
           makeCheck("1_3_4_0", 15, "All unused openings in the DB enclosure are covered with blanking plates?")
         ])
        ]),


        // ─────────────────────────────────────────
        // 6) Plumbing - Fittings
        // ─────────────────────────────────────────
        makeCheck("1_3", 5, "Plumbing", [
         makeCheck("1_3_5", 0, "Fittings", [
           makeCheck("1_3_5_0", 0, "W.C. set flush to the finished floor level and sealed correctly (no wobbling)?"),
           makeCheck("1_3_5_0", 1, "Flush mechanism (cistern or flush valve) operates correctly and fills without leaks?"),
           makeCheck("1_3_5_0", 2, "Basin/sink bowls are securely fastened to the wall or countertop?"),
           makeCheck("1_3_5_0", 3, "P-traps are installed correctly below basins/sinks and sealed for odors?"),
           makeCheck("1_3_5_0", 4, "Shower mixer/diverter installed at the correct height and aligned with tiles?"),
           makeCheck("1_3_5_0", 5, "Drainage in shower floor/tub is checked to ensure all water flows to the drain point?"),
           makeCheck("1_3_5_0", 6, "All faucets/taps are correctly aligned (horizontal/vertical) and securely tightened?"),
           makeCheck("1_3_5_0", 7, "Faucets and fixtures are free of scratches or installation damage?"),
           makeCheck("1_3_5_0", 8, "Hot and cold water is correctly supplied to the corresponding valve (Hot on Left)?"),
           makeCheck("1_3_5_0", 9, "Water flow is checked for adequate pressure at all points?"),
           makeCheck("1_3_5_0", 10, "All valves and connections are checked for leaks under working pressure?"),
           makeCheck("1_3_5_0", 11, "System checked for water hammer (banging/vibration) when taps are closed rapidly?"),
           makeCheck("1_3_5_0", 12, "Cleanouts and access panels for hidden traps/valves are correctly positioned and accessible?"),
           makeCheck("1_3_5_0", 13, "Visible escutcheon plates/flanges are installed and properly seated to cover cutouts?"),
           makeCheck("1_3_5_0", 14, "All penetrations (e.g., around taps, drains) are properly sealed with a flexible sealant (e.g., silicone)?"),
           makeCheck("1_3_5_0", 15, "Proper curing (wetting/spraying) is initiated immediately after casting and maintained for the specified duration?"),
           makeCheck("1_3_5_0", 16, "any electrical works")
         ])
        ]),


        // ─────────────────────────────────────────
        // 7) HVAC - Split AC
        // ─────────────────────────────────────────
        makeCheck("1_3", 6, "HVAC", [
         makeCheck("1_3_6", 0, "Split AC", [
           makeCheck("1_3_6_0", 0, "Duct material (e.g., GI, aluminum) and gauge/thickness match specifications?"),
           makeCheck("1_3_6_0", 1, "All duct joints, seams, and connections are sealed with approved sealant and/or tape to prevent air leakage?"),
           makeCheck("1_3_6_0", 2, "Ductwork is supported by hangers/supports spaced correctly and fixed securely to the structure?"),
           makeCheck("1_3_6_0", 3, "Duct insulation (thickness and type) is correct and securely applied with all joints sealed?"),
           makeCheck("1_3_6_0", 4, "Duct interiors are clean and free of construction debris before sealing and terminal installation?"),
           makeCheck("1_3_6_0", 5, "Access doors/panels are provided at specified locations for internal cleaning and maintenance?"),
           makeCheck("1_3_6_0", 6, "Refrigerant pipe material (copper grade) and wall thickness meet specifications?"),
           makeCheck("1_3_6_0", 7, "All brazed/welded joints are clean, sound, and free of leaks (requires pressure testing)?"),
           makeCheck("1_3_6_0", 8, "Pipe insulation (thickness and type) is correct and covers all refrigeration lines fully?"),
           makeCheck("1_3_6_0", 9, "Condensate drain lines are laid with a consistent slope and connected to the proper drainage system?"),
           makeCheck("1_3_6_0", 10, "Grilles, diffusers, and registers match the type, size, and finish specified in the schedule?"),
           makeCheck("1_3_6_0", 11, "Terminal devices are securely and aesthetically mounted, flush with the finished surface (ceiling/wall)?"),
           makeCheck("1_3_6_0", 12, "All volume control dampers (VCDs) and fire/smoke dampers are installed and easily accessible?"),
           makeCheck("1_3_6_0", 13, "Visible devices are clean, undamaged, and correctly aligned with the ceiling grid or wall lines?"),
           makeCheck("1_3_6_0", 14, "Vibration isolators/dampers are correctly installed under air handling units (AHUs), chillers, and fans?"),
           makeCheck("1_3_6_0", 15, "Adequate service clearance is maintained around all equipment for maintenance access?"),
           makeCheck("1_3_6_0", 16, "Duct system undergoes a static pressure/leakage test (if specified) before commissioning?"),
           makeCheck("1_3_6_0", 17, "Final air balancing (using VCDs) is performed to ensure specified air volume at each outlet?")
         ])
        ]),


        // ─────────────────────────────────────────
        // 8) Painting - Final Paint
        // ─────────────────────────────────────────
        makeCheck("1_3", 7, "Painting", [
         makeCheck("1_3_7", 0, "Final Paint", [
           makeCheck("1_3_7_0", 0, "Surface (putty/plaster) is completely clean, dry, and free of dust, grease, or oil?"),
           makeCheck("1_3_7_0", 1, "The surface is sanded smooth and free of ridges, trowel marks, or pinholes?"),
           makeCheck("1_3_7_0", 2, "Moisture content of the wall is checked and within acceptable limits before painting?"),
           makeCheck("1_3_7_0", 3, "All major cracks, undulations, and holes have been filled and repaired?"),
           makeCheck("1_3_7_0", 4, "The type of paint (e.g., acrylic, oil-based, enamel) matches the specification for the specific area?"),
           makeCheck("1_3_7_0", 5, "The color/shade (verified by paint code) is correct and consistent across all batches?"),
           makeCheck("1_3_7_0", 6, "Paint is thinned strictly as per the manufacturer's instructions?"),
           makeCheck("1_3_7_0", 7, "The correct primer or sealer has been applied for the substrate type?"),
           makeCheck("1_3_7_0", 8, "The specified number of primer and top coats has been applied?"),
           makeCheck("1_3_7_0", 9, "Sufficient drying time is allowed between coats as per manufacturer guidelines?"),
           makeCheck("1_3_7_0", 10, "The final coat is uniform in texture and color, with no visible brush/roller marks or patchiness?"),
           makeCheck("1_3_7_0", 11, "Edges around doors, windows, trims, and ceilings are straight and clean (using painter's tape)?"),
           makeCheck("1_3_7_0", 12, "Check for signs of peeling, blistering, or flaking?"),
           makeCheck("1_3_7_0", 13, "The finished surface is free of runs, drips, or sagging?"),
           makeCheck("1_3_7_0", 14, "Areas behind pipes, radiators, or fixtures have been fully painted?"),
           makeCheck("1_3_7_0", 15, "Adjacent surfaces (floors, windows, hardware) are protected from paint splatter and overspray?")
         ])
       ])

      ]),
    ],
    createdAt: new Date().toISOString(),
  },
];

// -------------------------------------------------------------------
// Recursive helpers (support nested subChecks)
// -------------------------------------------------------------------

/** Get project by id */
export const getProjectById = (projectId: string): Project | null =>
  projects.find((p) => p.id === projectId) ?? null;

/** Recursively find a check */
const findCheckRecursive = (checks: Check[], checkId: string): Check | null => {
  for (const c of checks) {
    if (c.id === checkId) return c;
    if (c.subChecks && c.subChecks.length > 0) {
      const found = findCheckRecursive(c.subChecks, checkId);
      if (found) return found;
    }
  }
  return null;
};

/** Get photo count */
export const getPhotoCount = (projectId: string, checkId: string): number => {
  const p = getProjectById(projectId);
  if (!p) return 0;
  const chk = findCheckRecursive(p.checks, checkId);
  return chk ? chk.photos.length : 0;
};

/** Add photos to a check */
export const addPhotosToCheck = (
  projectId: string,
  checkId: string,
  photoUrls: string[]
): boolean => {
  const p = getProjectById(projectId);
  if (!p) return false;
  const chk = findCheckRecursive(p.checks, checkId);
  if (!chk) return false;

  const newPhotos: PhotoReview[] = photoUrls.map((url) => ({
    url,
    status: null,
    reason: null,
    correctiveMeasure: null,
    processMiss: false, // 👈 added
    technicalMiss: false, // 👈 added
  }));

  chk.photos.push(...newPhotos);
  chk.completed = chk.photos.length > 0;
  chk.submittedAt = new Date().toISOString();
  return true;
};

/** Mark a photo review as pass/fail with reason + corrective measure */
export const reviewPhoto = (
  projectId: string,
  checkId: string,
  photoIndex: number,
  status: "pass" | "fail",
  reason?: "process_miss" | "technical_miss",
  correctiveMeasure?: string
): boolean => {
  const p = getProjectById(projectId);
  if (!p) return false;
  const chk = findCheckRecursive(p.checks, checkId);
  if (!chk) return false;
  if (!chk.photos[photoIndex]) return false;

  chk.photos[photoIndex].status = status;
  chk.photos[photoIndex].reason = status === "fail" ? reason ?? null : null;
  chk.photos[photoIndex].correctiveMeasure =
    status === "fail" ? correctiveMeasure ?? null : null;

  return true;
};

/** Get all missed checks (not completed) */
export const getMissedChecks = (projectId: string): Check[] => {
  const p = getProjectById(projectId);
  if (!p) return [];
  const result: Check[] = [];
  const traverse = (checks: Check[]) => {
    for (const c of checks) {
      if (!c.completed) result.push(c);
      if (c.subChecks) traverse(c.subChecks);
    }
  };
  traverse(p.checks);
  return result;
};

/** Get all errors (failed photos) */
export const getErrors = (projectId: string): PhotoReview[] => {
  const p = getProjectById(projectId);
  if (!p) return [];
  const errors: PhotoReview[] = [];
  const traverse = (checks: Check[]) => {
    for (const c of checks) {
      if (c.photos.length > 0) {
        errors.push(...c.photos.filter((ph) => ph.status === "fail"));
      }
      if (c.subChecks) traverse(c.subChecks);
    }
  };
  traverse(p.checks);
  return errors;
};

/** Can update client (only if all checks done) */
export const canUpdateClient = (projectId: string): boolean => {
  const p = getProjectById(projectId);
  if (!p) return false;
  const traverse = (checks: Check[]): boolean =>
    checks.every((c) => c.completed && (!c.subChecks || traverse(c.subChecks)));
  return traverse(p.checks);
};


/**
 * Recursively checks if all checks (and their subChecks) are completed
 */
const areAllChecksCompleted = (checks: Check[]): boolean => {
  for (const check of checks) {
    // If this check has subChecks, go deeper (it's not a final check)
    if (check.subChecks && check.subChecks.length > 0) {
      // Recursively check all sub-checks
      if (!areAllChecksCompleted(check.subChecks)) {
        return false;
      }
    } else {
      // This is a FINAL check (no subChecks) - it must be completed
      if (!check.completed) {
        console.log(`❌ Found incomplete check: ${check.label} (${check.id})`);
        return false;
      }
    }
  }
  return true;
};

/**
 * Get completion status for all main checks in a project
 */
export const getMainCheckCompletionStatus = (projectId: string) => {
  const project = getProjectById(projectId);
  if (!project) return null;

  const mainCheckStatuses = project.checks.map(mainCheck => ({
    id: mainCheck.id,
    label: mainCheck.label,
    isCompleted: areAllChecksCompleted(mainCheck.subChecks || []),
    completedAt: mainCheck.completed ? mainCheck.submittedAt : null,
  }));

  return mainCheckStatuses;
};

/**
 * Get detailed report of a specific main check
 */
export const getMainCheckReport = (projectId: string, mainCheckId: string) => {
  const project = getProjectById(projectId);
  if (!project) return null;

  const mainCheck = project.checks.find(c => c.id === mainCheckId);
  if (!mainCheck) return null;

  // This function counts ONLY final checks (leaf nodes)
  const countChecks = (checks: Check[]): { total: number; completed: number } => {
    let total = 0;
    let completed = 0;

    for (const check of checks) {
      if (check.subChecks && check.subChecks.length > 0) {
        // This check has children, go deeper (don't count it)
        const subResult = countChecks(check.subChecks);
        total += subResult.total;
        completed += subResult.completed;
      } else {
        // This is a FINAL check (leaf node) - count it
        total++;
        if (check.completed) {
          completed++;
          console.log(`✅ Counted completed: ${check.label}`);
        } else {
          console.log(`⏳ Counted pending: ${check.label}`);
        }
      }
    }

    return { total, completed };
  };

  // Build and return a structured report for the main check
  const counts = countChecks(mainCheck.subChecks || []);
  const totalChecks = counts.total;
  const completedChecks = counts.completed;
  const percentComplete = totalChecks === 0 ? 100 : Math.round((completedChecks / totalChecks) * 100);
  const isCompleted = totalChecks > 0 ? completedChecks === totalChecks : !!mainCheck.completed;

  return {
    totalChecks,
    completedChecks,
    percentComplete,
    isCompleted,
  };

};

/**
 * Send email notification when a main check is completed
 */
export const notifyMainCheckCompletion = async (
  projectId: string,
  mainCheckId: string,
  userName: string
) => {
  const project = getProjectById(projectId);
  if (!project) return { success: false, error: "Project not found" };

  const mainCheck = project.checks.find(c => c.id === mainCheckId);
  if (!mainCheck) return { success: false, error: "Main check not found" };

  const report = getMainCheckReport(projectId, mainCheckId);
  if (!report || !report.isCompleted) {
    return { success: false, error: "Main check is not completed yet" };
  }

  const now = new Date().toLocaleString();
  const subject = `${mainCheck.label} - Main Check Completed | ${project.title}`;
  // Get all sub-checks with their status
  type CheckReport = {
    name: string;
    status: string;
    photos: Array<{
      status: string;
      details?: {
        failure?: string;
        processMiss: boolean;
        technicalMiss: boolean;
        fix?: string;
      };
    }>;
    isCompleted: boolean;
  };

  const getAllSubChecks = (checks: Check[]): CheckReport[] => {
    const result: CheckReport[] = [];
    const traverse = (items: Check[]) => {
      for (const check of items) {
        if (check.subChecks && check.subChecks.length > 0) {
          traverse(check.subChecks);
        } else {
          // It's a final check
          const photos = check.photos || [];
          const photoDetails = photos.map(p => ({
            status: p.status === "pass" ? "✅ Pass" : 
                    p.status === "fail" ? "❌ Fail" : 
                    "⏳ Pending",
            details: p.status === "fail" ? {
              failure: p.reasonForFailure || undefined,
              processMiss: p.processMiss,
              technicalMiss: p.technicalMiss,
              fix: p.correctiveMeasure || undefined
            } : undefined
          }));

          // Check is passed only if it has photos and all photos are reviewed
          const hasPhotos = photos.length > 0;
          const allPhotosReviewed = hasPhotos && photos.every(p => p.status === "pass" || p.status === "fail");
          const anyPhotosFailed = photos.some(p => p.status === "fail");
          
          const checkStatus = hasPhotos
            ? allPhotosReviewed
              ? anyPhotosFailed
                ? "❌ Failed"
                : "✅ Passed"
              : "⏳ Pending"
            : "📷 No Photos";
          
          result.push({
            name: check.label,
            status: checkStatus,
            photos: photoDetails,
            isCompleted: check.completed
          });
        }
      }
    };
    traverse(checks);
    return result;
  };

  const subChecks = getAllSubChecks(mainCheck.subChecks || []);
  const failedChecks = subChecks.filter(check => 
    check.photos.some(p => p.status.includes('Fail'))
  );

  const html = `
    <h2>✅ Main Check Completed</h2>
    <p><strong>Project:</strong> ${project.title}</p>
    <p><strong>Main Check:</strong> ${mainCheck.label}</p>
    <p><strong>Completed By:</strong> ${userName}</p>
    <p><strong>Completion Time:</strong> ${now}</p>
    <hr>
    <h3>Summary</h3>
    <p><strong>Total Sub-Checks:</strong> ${report.totalChecks}</p>
    <p><strong>Completed:</strong> ${report.completedChecks}</p>
    <p><strong>Completion Rate:</strong> ${report.percentComplete}%</p>
    <hr>
    <h3>Detailed Sub-Checks</h3>
    <div style="max-width: 600px;">
      ${subChecks.map((check, index) => `
        <!-- Check Item -->
        <div style="margin-bottom: 16px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <div style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb; background-color: #f9fafb;">
            <div style="font-weight: 500;">${index + 1}. ${check.name}</div>
            <div style="margin-top: 4px; font-size: 14px; color: ${
              check.status.includes('Failed') ? '#dc2626' :
              check.status.includes('Passed') ? '#059669' :
              check.status.includes('No Photos') ? '#6b7280' : '#d97706'
            };">
              ${check.status}
            </div>
          </div>

          ${check.photos.map((photo, photoIndex) => `
            <div style="padding: 12px 16px; ${photoIndex < check.photos.length - 1 ? 'border-bottom: 1px solid #f3f4f6;' : ''}">
              <div style="display: flex; align-items: center;">
                <div style="color: ${
                  photo.status.includes('Pass') ? '#059669' :
                  photo.status.includes('Fail') ? '#dc2626' : '#d97706'
                };">
                  Photo ${photoIndex + 1}: ${photo.status}
                </div>
              </div>
              ${photo.details ? `
                <div style="margin-top: 8px; margin-left: 16px; font-size: 14px;">
                  ${photo.details.failure ? `
                    <div style="color: #dc2626; margin-bottom: 4px;">• ${photo.details.failure}</div>
                  ` : ''}
                  ${photo.details.processMiss || photo.details.technicalMiss ? `
                    <div style="color: #6b7280; margin-bottom: 4px;">
                      • ${[
                        photo.details.processMiss ? 'Process Miss' : '',
                        photo.details.technicalMiss ? 'Technical Miss' : ''
                      ].filter(Boolean).join(', ')}
                    </div>
                  ` : ''}
                  ${photo.details.fix ? `
                    <div style="color: #059669; margin-bottom: 4px;">• ${photo.details.fix}</div>
                  ` : ''}
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
      `).join('')}
    </div>
    ${failedChecks.length > 0 ? `
    <hr>
    <h3>⚠️ Failed Checks Summary</h3>
    <p>There are ${failedChecks.length} check(s) with failures that need attention.</p>
    ` : ''}
    <hr>
    <p>All sub-checks under <strong>${mainCheck.label}</strong> have been completed and reviewed.</p>
  `;

  try {
    const response = await fetch("https://sendemailapi-seven.vercel.app/api/send-completion-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        email: "rathlavath.raghavendra@gmail.com", 
        subject, 
        html 
      }),
    });

    if (!response.ok) {
      throw new Error("Email send failed");
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
};

/**
 * Hook to check and notify when a main check becomes complete
 * Call this after each check submission
 */
export const checkAndNotifyMainCheckCompletion = async (
  projectId: string,
  checkId: string,
  userName: string
) => {
  const project = getProjectById(projectId);
  if (!project) return;

  // Find which main check this sub-check belongs to
  for (const mainCheck of project.checks) {
    const belongsToMainCheck = (checks: Check[], targetId: string): boolean => {
      for (const check of checks) {
        if (check.id === targetId) return true;
        if (check.subChecks && belongsToMainCheck(check.subChecks, targetId)) {
          return true;
        }
      }
      return false;
    };

    if (belongsToMainCheck(mainCheck.subChecks || [], checkId)) {
      // Check if this main check just became complete
      const isNowComplete = areAllChecksCompleted(mainCheck.subChecks || []);
      
      if (isNowComplete) {
        // Send notification
        console.log(`🎉 Main check "${mainCheck.label}" is now complete!`);
        await notifyMainCheckCompletion(projectId, mainCheck.id, userName);
      }
      break;
    }
  }
};
