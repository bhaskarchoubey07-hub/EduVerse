// Comprehensive Data & Asset Registry for EduVerse AI 3D Biology Lab

export type BodySystemType =
  | "skeletal"
  | "circulatory"
  | "respiratory"
  | "digestive"
  | "nervous"
  | "muscular"
  | "urinary"
  | "endocrine";

export type LabViewMode = "human_body" | "cell_lab" | "quiz_mode";
export type CellType = "animal_cell" | "plant_cell";

export interface AnatomicalStructure {
  id: string;
  name: string;
  system: BodySystemType | "cellular";
  category: string;
  location: string;
  function: string;
  ncertKeyPoints: string[];
  boardExamTips: string;
  coordinates: [number, number, number]; // 3D local anchor coordinate
  meshName: string;
  quizHint: string;
  relatedChapterId: string;
}

export interface BloodFlowStage {
  step: number;
  from: string;
  to: string;
  vessel: string;
  bloodType: "deoxygenated" | "oxygenated";
  description: string;
  pressure: string;
  valveAction: string;
}

export interface CellOrganelle {
  id: string;
  name: string;
  cellType: "animal" | "plant" | "both";
  function: string;
  analogy: string;
  keyEnzymesOrPigments: string;
  coordinates: [number, number, number];
  boardSignificance: string;
}

export interface Biology3DQuiz {
  id: string;
  system: BodySystemType | "cellular";
  question: string;
  targetStructureId: string;
  targetName: string;
  explanation: string;
  marks: number;
  hint: string;
}

// =========================================================================
// 1. ANATOMICAL STRUCTURES REGISTRY (Skeletal, Heart, Lungs, Brain, Gut)
// =========================================================================

export const ANATOMICAL_STRUCTURES: AnatomicalStructure[] = [
  // --- SKELETAL SYSTEM ---
  {
    id: "skull",
    name: "Cranium & Facial Bones (Skull)",
    system: "skeletal",
    category: "Axial Skeleton",
    location: "Superior most region of the axial skeleton",
    function: "Encloses and shields the brain in the cranial cavity; supports facial muscles and sensory organs.",
    ncertKeyPoints: [
      "Consists of 22 bones (8 cranial bones + 14 facial bones).",
      "Bones are joined by immovable fibrous joints called sutures.",
      "Occipital condyles (2) articulate with the atlas vertebra (dicondylic skull in humans)."
    ],
    boardExamTips: "Frequently asked 1-mark question: State the type of joint between cranial bones (Answer: Fibrous / Synarthrosis).",
    coordinates: [0, 3.4, 0],
    meshName: "skull_mesh",
    quizHint: "Look at the uppermost protective shell housing the brain.",
    relatedChapterId: "ch-sci10-07"
  },
  {
    id: "mandible",
    name: "Mandible (Lower Jaw)",
    system: "skeletal",
    category: "Axial Skeleton",
    location: "Inferior part of the facial skeleton",
    function: "Only movable bone in the skull; anchors the lower teeth and enables mastication and speech articulation.",
    ncertKeyPoints: [
      "Strongest and largest bone of the human face.",
      "Articulates with temporal bones at the temporomandibular joint (TMJ)."
    ],
    boardExamTips: "Identify the only movable bone of the human skull in board objective questions.",
    coordinates: [0, 3.1, 0.35],
    meshName: "mandible_mesh",
    quizHint: "Find the movable jaw bone used for chewing.",
    relatedChapterId: "ch-sci10-07"
  },
  {
    id: "clavicle",
    name: "Clavicle (Collar Bone)",
    system: "skeletal",
    category: "Appendicular Skeleton (Pectoral Girdle)",
    location: "Horizontal bone spanning between the sternum and scapula",
    function: "Acts as a structural strut connecting the upper limb to the axial trunk, allowing maximum arm mobility.",
    ncertKeyPoints: [
      "Slender S-shaped long bone; often called the collarbone.",
      "Part of the pectoral girdle (along with the dorsal scapula)."
    ],
    boardExamTips: "Identify the two bones comprising each half of the pectoral girdle: 1 Clavicle + 1 Scapula.",
    coordinates: [0.7, 2.7, 0.25],
    meshName: "clavicle_mesh",
    quizHint: "Locate the horizontal S-shaped collarbone near the upper shoulder.",
    relatedChapterId: "ch-sci10-07"
  },
  {
    id: "scapula",
    name: "Scapula (Shoulder Blade)",
    system: "skeletal",
    category: "Appendicular Skeleton (Pectoral Girdle)",
    location: "Posterior-lateral aspect of the thoracic cage (ribs 2 to 7)",
    function: "Triangular flat bone providing attachment for rotator cuff muscles and glenoid cavity for humerus articulation.",
    ncertKeyPoints: [
      "Features a prominent spine terminating in the acromion process.",
      "Glenoid cavity forms the ball-and-socket shoulder joint with the head of the humerus."
    ],
    boardExamTips: "Remember: Scapula is situated dorsally between the 2nd and 7th ribs.",
    coordinates: [0.8, 2.5, -0.4],
    meshName: "scapula_mesh",
    quizHint: "Look at the broad triangular blade on the back of the shoulder.",
    relatedChapterId: "ch-sci10-07"
  },
  {
    id: "sternum",
    name: "Sternum (Breastbone)",
    system: "skeletal",
    category: "Axial Skeleton (Thoracic Cage)",
    location: "Anterior midline of the thorax",
    function: "Anchors the true ribs via costal cartilages, protecting the underlying heart and pulmonary vessels.",
    ncertKeyPoints: [
      "Flat bone divided into manubrium, body, and xiphoid process.",
      "True ribs (1st to 7th pairs) attach directly to the sternum through hyaline cartilage."
    ],
    boardExamTips: "Differentiate between True Ribs (1-7), False Ribs (8-10), and Floating Ribs (11-12).",
    coordinates: [0, 2.3, 0.45],
    meshName: "sternum_mesh",
    quizHint: "Find the central dagger-shaped flat bone in the center of the chest.",
    relatedChapterId: "ch-sci10-07"
  },
  {
    id: "ribs",
    name: "Rib Cage (12 Pairs of Ribs)",
    system: "skeletal",
    category: "Axial Skeleton (Thoracic Cage)",
    location: "Enclosing the thoracic cavity",
    function: "Protects thoracic organs; expands during breathing through intercostal muscle contraction.",
    ncertKeyPoints: [
      "12 pairs of bicephalic ribs attached dorsally to thoracic vertebrae.",
      "Pairs 1-7: True ribs (vertebrosternal).",
      "Pairs 8-10: False ribs (vertebrochondral).",
      "Pairs 11-12: Floating ribs (vertebral) with free anterior ends."
    ],
    boardExamTips: "Board questions frequently ask why human ribs are termed 'bicephalic' (Two articulation surfaces on dorsal end).",
    coordinates: [0.75, 2.2, 0.2],
    meshName: "ribs_mesh",
    quizHint: "Select the curved cage protecting the lungs and heart.",
    relatedChapterId: "ch-sci10-07"
  },
  {
    id: "vertebral_column",
    name: "Vertebral Column (Spine)",
    system: "skeletal",
    category: "Axial Skeleton",
    location: "Mid-dorsal axis extending from skull base to pelvis",
    function: "Protects the spinal cord, supports the head trunk, and serves as point of attachment for ribs and musculature.",
    ncertKeyPoints: [
      "Composed of 26 serially arranged vertebrae: Cervical (7), Thoracic (12), Lumbar (5), Sacral (1 fused), Coccygeal (1 fused).",
      "Intervertebral discs of fibrocartilage allow limited movement (cartilaginous joints)."
    ],
    boardExamTips: "Write the human vertebral formula: C7 T12 L5 S(5) Co(4) = 26 adult bones.",
    coordinates: [0, 1.8, -0.35],
    meshName: "spine_mesh",
    quizHint: "Locate the segmented vertical backbone along the dorsal center.",
    relatedChapterId: "ch-sci10-07"
  },
  {
    id: "humerus",
    name: "Humerus (Upper Arm Bone)",
    system: "skeletal",
    category: "Appendicular Skeleton (Upper Limb)",
    location: "Brachial region between shoulder and elbow",
    function: "Long bone of the upper arm allowing lifting, rotation, and flexion at the glenohumeral and hinge elbow joints.",
    ncertKeyPoints: [
      "Proximal spherical head articulates into the glenoid cavity of the scapula.",
      "Distal trochlea and capitulum articulate with the ulna and radius."
    ],
    boardExamTips: "Name the type of joint between humerus and pectoral girdle (Ball-and-Socket Joint).",
    coordinates: [1.35, 2.2, 0.05],
    meshName: "humerus_mesh",
    quizHint: "Select the upper arm bone between the shoulder and elbow.",
    relatedChapterId: "ch-sci10-07"
  },
  {
    id: "radius_ulna",
    name: "Radius & Ulna (Forearm Bones)",
    system: "skeletal",
    category: "Appendicular Skeleton (Upper Limb)",
    location: "Forearm between elbow and wrist",
    function: "Ulna forms the stable elbow hinge; radius pivots around ulna to enable pronation and supination of the hand.",
    ncertKeyPoints: [
      "Radius is on the lateral (thumb) side; Ulna is on the medial (little finger) side.",
      "Pivot joint between radius and ulna allows rotation of the forearm."
    ],
    boardExamTips: "Pivot joint example in human body: Atlanto-axial joint & Radioulnar joint.",
    coordinates: [1.6, 1.3, 0.15],
    meshName: "radius_ulna_mesh",
    quizHint: "Find the paired parallel bones in the lower forearm.",
    relatedChapterId: "ch-sci10-07"
  },
  {
    id: "pelvis",
    name: "Pelvic Girdle (Hip Bones)",
    system: "skeletal",
    category: "Appendicular Skeleton (Pelvic Girdle)",
    location: "Base of the trunk articulating with the lower limbs",
    function: "Transfers upper body weight to the lower extremities; houses pelvic viscera and reproductive organs.",
    ncertKeyPoints: [
      "Consists of two coxal bones, each formed by fusion of Ilium, Ischium, and Pubis.",
      "Acetabulum cavity articulates with the head of the femur.",
      "Two halves meet ventrally at the pubic symphysis (fibrous cartilage)."
    ],
    boardExamTips: "Name the deep cavity into which the head of the thigh bone fits (Acetabulum).",
    coordinates: [0, 0.9, -0.05],
    meshName: "pelvis_mesh",
    quizHint: "Locate the sturdy basin-shaped hip structure at the base of the torso.",
    relatedChapterId: "ch-sci10-07"
  },
  {
    id: "femur",
    name: "Femur (Thigh Bone)",
    system: "skeletal",
    category: "Appendicular Skeleton (Lower Limb)",
    location: "Thigh region between hip and knee",
    function: "The longest, heaviest, and strongest bone in the human body; bears body weight during standing, running, and jumping.",
    ncertKeyPoints: [
      "Spherical head fits snugly inside the pelvic acetabulum.",
      "Distal condyles articulate with the tibia and patella at the knee joint."
    ],
    boardExamTips: "NCERT highlight: Femur is the longest and strongest bone of the human skeleton.",
    coordinates: [0.55, -0.2, 0.05],
    meshName: "femur_mesh",
    quizHint: "Select the massive long thigh bone connecting hip to knee.",
    relatedChapterId: "ch-sci10-07"
  },
  {
    id: "patella",
    name: "Patella (Kneecap)",
    system: "skeletal",
    category: "Appendicular Skeleton (Lower Limb)",
    location: "Anterior aspect of the knee joint",
    function: "Sesamoid bone embedded in the quadriceps tendon that increases lever arm efficiency and shields the knee joint.",
    ncertKeyPoints: [
      "Cup-shaped sesamoid bone formed by ossification within a tendon.",
      "Protects the vulnerable anterior articulation of the knee."
    ],
    boardExamTips: "Identify an example of a sesamoid bone in humans (Patella / Knee cap).",
    coordinates: [0.55, -1.05, 0.3],
    meshName: "patella_mesh",
    quizHint: "Find the small cup-shaped bone covering the front of the knee.",
    relatedChapterId: "ch-sci10-07"
  },
  {
    id: "tibia_fibula",
    name: "Tibia (Shin) & Fibula",
    system: "skeletal",
    category: "Appendicular Skeleton (Lower Limb)",
    location: "Lower leg between knee and ankle",
    function: "Tibia bears weight from the knee to the ankle; lateral slender fibula provides muscle attachment and ankle stability.",
    ncertKeyPoints: [
      "Tibia is the medial, weight-bearing bone (shin bone).",
      "Fibula is lateral and non-weight-bearing.",
      "Distal ends form the medial and lateral malleoli at the ankle joint."
    ],
    boardExamTips: "Remember: Only the tibia directly participates in the knee joint articulation.",
    coordinates: [0.55, -1.8, 0.05],
    meshName: "tibia_fibula_mesh",
    quizHint: "Select the lower leg shin bones extending down to the ankle.",
    relatedChapterId: "ch-sci10-07"
  },

  // --- CIRCULATORY SYSTEM & HEART ---
  {
    id: "heart",
    name: "Human Heart (4-Chambered Muscular Pump)",
    system: "circulatory",
    category: "Cardiovascular System",
    location: "Mediastinum of the thoracic cavity, tilted slightly to the left",
    function: "Pumps oxygen-poor blood to the lungs (pulmonary circuit) and oxygen-rich blood to systemic body tissues (systemic circuit).",
    ncertKeyPoints: [
      "Mesodermal in origin, enclosed by double-walled pericardium filled with pericardial fluid.",
      "Human heart exhibits Double Circulation (Systemic + Pulmonary circulation).",
      "Sinoatrial (SA) node in right atrium acts as natural pacemaker (generates ~72 bpm)."
    ],
    boardExamTips: "5-Mark Board Guarantee: Draw a labeled diagram of the human heart showing all four chambers and direction of double blood flow.",
    coordinates: [-0.15, 2.2, 0.25],
    meshName: "heart_mesh",
    quizHint: "Locate the primary muscular pump in the thoracic chest cavity.",
    relatedChapterId: "ch-sci10-06"
  },
  {
    id: "right_atrium",
    name: "Right Atrium",
    system: "circulatory",
    category: "Cardiac Chamber",
    location: "Upper right chamber of the heart",
    function: "Receives deoxygenated venous blood returning from superior/inferior vena cava and pumps it into the right ventricle.",
    ncertKeyPoints: [
      "Contains the SA Node (pacemaker) in its upper right corner and AV Node in lower left corner.",
      "Tricuspid valve prevents backflow into the right atrium during ventricular systole."
    ],
    boardExamTips: "Why is SA node called the Pacemaker? (Generates auto-rhythmic action potentials without external neural stimulus).",
    coordinates: [0.2, 2.35, 0.3],
    meshName: "right_atrium_mesh",
    quizHint: "Click the upper chamber receiving deoxygenated blood from the body.",
    relatedChapterId: "ch-sci10-06"
  },
  {
    id: "right_ventricle",
    name: "Right Ventricle",
    system: "circulatory",
    category: "Cardiac Chamber",
    location: "Lower anterior-right chamber of the heart",
    function: "Pumps deoxygenated blood through the pulmonary artery into the lungs for re-oxygenation.",
    ncertKeyPoints: [
      "Thinner muscular wall than left ventricle because pulmonary circulation requires lower pressure.",
      "Guarded by pulmonary semilunar valve at its exit."
    ],
    boardExamTips: "Compare wall thickness of right vs left ventricle: Left is 3x thicker to overcome systemic resistance.",
    coordinates: [0.15, 1.95, 0.35],
    meshName: "right_ventricle_mesh",
    quizHint: "Select the lower chamber pumping deoxygenated blood to the lungs.",
    relatedChapterId: "ch-sci10-06"
  },
  {
    id: "left_atrium",
    name: "Left Atrium",
    system: "circulatory",
    category: "Cardiac Chamber",
    location: "Upper left posterior chamber of the heart",
    function: "Receives freshly oxygenated blood from the four pulmonary veins returning from the lungs.",
    ncertKeyPoints: [
      "Pushes oxygenated blood across the bicuspid (mitral) valve into the left ventricle.",
      "Has thin walls typical of receiving chambers."
    ],
    boardExamTips: "Identify the only veins in the human body that carry oxygenated blood (Pulmonary Veins).",
    coordinates: [-0.35, 2.35, 0.25],
    meshName: "left_atrium_mesh",
    quizHint: "Find the upper chamber collecting oxygen-rich blood from the lungs.",
    relatedChapterId: "ch-sci10-06"
  },
  {
    id: "left_ventricle",
    name: "Left Ventricle",
    system: "circulatory",
    category: "Cardiac Chamber",
    location: "Lower left muscular apex of the heart",
    function: "Generates high pressure to propel oxygenated blood into the systemic Aorta to supply all organs and tissues.",
    ncertKeyPoints: [
      "Thickest myocardium of all four chambers.",
      "Guarded by aortic semilunar valve."
    ],
    boardExamTips: "Why does the left ventricle have the thickest muscular wall? (Needs to pump blood to entire systemic body against high vascular resistance).",
    coordinates: [-0.3, 1.9, 0.3],
    meshName: "left_ventricle_mesh",
    quizHint: "Select the thickest muscular chamber pumping blood through the aorta.",
    relatedChapterId: "ch-sci10-06"
  },
  {
    id: "aorta",
    name: "Systemic Aorta & Arch",
    system: "circulatory",
    category: "Great Vessels",
    location: "Emerging superiorly from the left ventricle and arching over the pulmonary trunk",
    function: "Main arterial trunk delivering oxygen-saturated blood under high pressure to all systemic arteries.",
    ncertKeyPoints: [
      "Largest artery in the human body (elastic artery).",
      "Branches into coronary, brachiocephalic, left common carotid, and subclavian arteries."
    ],
    boardExamTips: "State the blood pressure in human aorta during systole and diastole (120/80 mm Hg).",
    coordinates: [-0.1, 2.65, 0.2],
    meshName: "aorta_mesh",
    quizHint: "Look at the large red arching main artery rising out of the top of the heart.",
    relatedChapterId: "ch-sci10-06"
  },

  // --- RESPIRATORY SYSTEM & LUNGS ---
  {
    id: "lungs",
    name: "Lungs & Tracheobronchial Tree",
    system: "respiratory",
    category: "Respiratory Organs",
    location: "Thoracic cavity on either side of the heart, enclosed by the rib cage",
    function: "Facilitates pulmonary ventilation and external respiration ($O_2$ absorption and $CO_2$ excretion across the alveolar-capillary membrane).",
    ncertKeyPoints: [
      "Right lung has 3 lobes; Left lung has 2 lobes with cardiac notch.",
      "Enclosed in double-layered pleura with pleural fluid reducing friction.",
      "Alveoli provide vast surface area (~80 m²) for rapid gas diffusion."
    ],
    boardExamTips: "Explain the mechanism of inhalation in human lungs (Diaphragm contracts/flattens + external intercostals elevate ribs -> Thoracic volume increases -> Intrapulmonary pressure drops below atmospheric -> Air rushes in).",
    coordinates: [0.75, 2.2, 0.1],
    meshName: "lungs_mesh",
    quizHint: "Select the spongy paired organs responsible for breathing.",
    relatedChapterId: "ch-sci10-06"
  },
  {
    id: "alveoli_cluster",
    name: "Alveoli (Respiratory Units for Gas Exchange)",
    system: "respiratory",
    category: "Microscopic Respiratory Units",
    location: "Terminal ends of alveolar ducts inside lung parenchyma",
    function: "Primary sites of gas exchange where oxygen diffuses into pulmonary capillaries and carbon dioxide diffuses out.",
    ncertKeyPoints: [
      "Very thin diffusion boundary (~0.2 µm) consisting of alveolar squamous epithelium, basement membrane, and capillary endothelium.",
      "Lined with pulmonary surfactant reducing surface tension to prevent collapse."
    ],
    boardExamTips: "Name the structural and functional units of the human respiratory system (Alveoli).",
    coordinates: [0.95, 1.9, 0.2],
    meshName: "alveoli_mesh",
    quizHint: "Find the microscopic grape-like air sac clusters at the end of bronchioles.",
    relatedChapterId: "ch-sci10-06"
  },

  // --- DIGESTIVE SYSTEM & ALIMENTARY CANAL ---
  {
    id: "stomach",
    name: "Stomach (J-Shaped Gastric Reservoir)",
    system: "digestive",
    category: "Upper Gastrointestinal Tract",
    location: "Upper left quadrant of abdominal cavity under the diaphragm",
    function: "Stores food, secretes acidic gastric juice ($HCl$ + Pepsinogen), and churns food into liquid chyme.",
    ncertKeyPoints: [
      "Composed of Fundus, Body, and Pylorus.",
      "Gastric glands secrete $HCl$ ($pH \\approx 1.5-2.0$) to kill bacteria and activate Pepsin.",
      "Mucus protects stomach lining against auto-digestion."
    ],
    boardExamTips: "Why is $HCl$ crucial in the stomach? (Creates optimal acidic medium for Pepsin action and kills pathogens).",
    coordinates: [-0.3, 1.4, 0.25],
    meshName: "stomach_mesh",
    quizHint: "Locate the J-shaped acidic organ beneath the diaphragm.",
    relatedChapterId: "ch-sci10-06"
  },
  {
    id: "liver",
    name: "Liver & Gallbladder",
    system: "digestive",
    category: "Accessory Digestive Gland",
    location: "Upper right abdominal cavity beneath the diaphragm",
    function: "Largest gland in the body; secretes bile salts to emulsify fats, neutralizes acidic chyme, and metabolizes toxins.",
    ncertKeyPoints: [
      "Bile contains no digestive enzymes, yet is indispensable for fat emulsification (micelle formation).",
      "Gallbladder concentrates and stores bile until stimulated by CCK."
    ],
    boardExamTips: "Explain the dual digestive role of Bile Juice (1. Emulsification of large fat globules, 2. Providing alkaline $pH$ for pancreatic enzymes).",
    coordinates: [0.45, 1.45, 0.25],
    meshName: "liver_mesh",
    quizHint: "Select the large reddish-brown gland in the upper right abdomen.",
    relatedChapterId: "ch-sci10-06"
  },
  {
    id: "small_intestine",
    name: "Small Intestine (Duodenum, Jejunum, Ileum)",
    system: "digestive",
    category: "Lower Gastrointestinal Tract",
    location: "Central and lower abdominal cavity",
    function: "Site of complete chemical digestion of carbohydrates, proteins, and fats; absorbs nutrients via microvilli.",
    ncertKeyPoints: [
      "Receives pancreatic juice (Trypsin, Amylase, Lipase) and bile at the hepatopancreatic duct.",
      "Villi and microvilli enormously multiply absorption surface area.",
      "Lacteals (lymph vessels in villi) absorb fatty acids and glycerol."
    ],
    boardExamTips: "How is the small intestine uniquely adapted for absorption? (Extreme length + dense foldings of Villi & Microvilli + rich blood capillary network).",
    coordinates: [0, 0.8, 0.3],
    meshName: "small_intestine_mesh",
    quizHint: "Select the convoluted central intestine where complete nutrient absorption occurs.",
    relatedChapterId: "ch-sci10-06"
  },

  // --- NERVOUS SYSTEM & BRAIN ---
  {
    id: "brain_cerebrum",
    name: "Cerebrum (Frontal, Parietal, Temporal, Occipital)",
    system: "nervous",
    category: "Central Nervous System (Forebrain)",
    location: "Upper cranial cavity forming majority of the brain volume",
    function: "Seat of conscious thought, voluntary motor control, memory, language, sensory interpretation, and reasoning.",
    ncertKeyPoints: [
      "Divided into two cerebral hemispheres connected by the corpus callosum.",
      "Cerebral cortex (grey matter) contains motor areas, sensory areas, and large association areas responsible for memory and communication."
    ],
    boardExamTips: "What connects the two cerebral hemispheres of the human brain? (Corpus Callosum - dense tract of nerve fibers).",
    coordinates: [0, 3.5, 0.1],
    meshName: "cerebrum_mesh",
    quizHint: "Select the large convoluted upper forebrain governing thinking and consciousness.",
    relatedChapterId: "ch-sci10-07"
  },
  {
    id: "brain_cerebellum",
    name: "Cerebellum (Hindbrain Balance Center)",
    system: "nervous",
    category: "Central Nervous System (Hindbrain)",
    location: "Posterior-inferior part of the cranium below occipital lobes",
    function: "Coordinates voluntary motor movements, precision, equilibrium, and posture maintenance.",
    ncertKeyPoints: [
      "Known as 'little brain' with highly folded surface to accommodate extra neurons.",
      "Alcohol inhibits cerebellum function, resulting in uncoordinated gait and speech slur."
    ],
    boardExamTips: "Which part of the human brain maintains posture and balance of the body? (Cerebellum).",
    coordinates: [0, 3.15, -0.25],
    meshName: "cerebellum_mesh",
    quizHint: "Find the cauliflower-like hindbrain structure controlling balance and posture.",
    relatedChapterId: "ch-sci10-07"
  },
  {
    id: "brainstem",
    name: "Brainstem (Pons, Medulla Oblongata & Spinal Cord)",
    system: "nervous",
    category: "Central Nervous System (Brainstem)",
    location: "Base of the brain connecting to the spinal cord",
    function: "Regulates vital involuntary autonomic reflexes: respiration rhythm, heart rate, blood pressure, swallowing, vomiting.",
    ncertKeyPoints: [
      "Medulla oblongata contains the respiratory rhythm center and cardiovascular reflex center.",
      "Continuous inferiorly with the spinal cord passing through the foramen magnum."
    ],
    boardExamTips: "Name the brain center regulating involuntary actions like heartbeat, coughing, and vomiting (Medulla Oblongata).",
    coordinates: [0, 2.9, -0.15],
    meshName: "brainstem_mesh",
    quizHint: "Click the stalk at the base of the brain regulating vital involuntary reflexes.",
    relatedChapterId: "ch-sci10-07"
  }
];

// =========================================================================
// 2. EDUCATIONAL BLOOD FLOW SEQUENCE DATA (10-Step Cardiac Cycle)
// =========================================================================

export const BLOOD_FLOW_SEQUENCE: BloodFlowStage[] = [
  {
    step: 1,
    from: "Systemic Body Organs & Tissues",
    to: "Superior & Inferior Vena Cava",
    vessel: "Systemic Veins & Vena Cava",
    bloodType: "deoxygenated",
    description: "Cellular respiration across tissues depletes oxygen and enriches blood with CO₂ waste. Large vena cava veins collect this deoxygenated blood.",
    pressure: "Low (~2-6 mm Hg)",
    valveAction: "Passive venous return through non-return venous valves."
  },
  {
    step: 2,
    from: "Vena Cava",
    to: "Right Atrium",
    vessel: "Right Atrial Chamber",
    bloodType: "deoxygenated",
    description: "The right atrium relaxes (atrial diastole) to receive venous blood flowing from superior and inferior vena cava.",
    pressure: "Low (~0-4 mm Hg)",
    valveAction: "Tricuspid valve remains closed during filling phase."
  },
  {
    step: 3,
    from: "Right Atrium",
    to: "Right Ventricle",
    vessel: "Atrioventricular Orifice",
    bloodType: "deoxygenated",
    description: "SA node fires! Right atrium contracts (atrial systole), forcing deoxygenated blood across the open Tricuspid valve into right ventricle.",
    pressure: "Rising (~8-10 mm Hg)",
    valveAction: "Tricuspid valve opens wide; Pulmonary valve is closed."
  },
  {
    step: 4,
    from: "Right Ventricle",
    to: "Pulmonary Artery",
    vessel: "Pulmonary Trunk & Left/Right Arteries",
    bloodType: "deoxygenated",
    description: "Right ventricle contracts forcefully (ventricular systole). Tricuspid valve snaps shut ('LUB' sound) and blood shoots into the Pulmonary Artery.",
    pressure: "Moderate (~25 mm Hg)",
    valveAction: "Tricuspid valve closes (prevents backflow); Pulmonary semilunar valve opens."
  },
  {
    step: 5,
    from: "Pulmonary Artery",
    to: "Alveolar Capillaries of Lungs",
    vessel: "Pulmonary Microcirculation",
    bloodType: "deoxygenated",
    description: "Deoxygenated blood reaches microscopic alveolar capillary networks in the lungs. CO₂ is exhaled; fresh O₂ diffuses across alveolar membranes into hemoglobin.",
    pressure: "Low (~10-15 mm Hg)",
    valveAction: "Gas exchange diffusion driven by partial pressure gradients (pO₂ in alveoli > pO₂ in blood)."
  },
  {
    step: 6,
    from: "Lungs (Pulmonary Capillaries)",
    to: "Pulmonary Veins",
    vessel: "4 Pulmonary Veins (2 Left, 2 Right)",
    bloodType: "oxygenated",
    description: "Freshly oxygen-saturated, bright scarlet blood gathers into four pulmonary veins heading directly back toward the left side of the heart.",
    pressure: "Low (~8 mm Hg)",
    valveAction: "Smooth laminar venous return."
  },
  {
    step: 7,
    from: "Pulmonary Veins",
    to: "Left Atrium",
    vessel: "Left Atrial Chamber",
    bloodType: "oxygenated",
    description: "Left atrium relaxes (diastole) and fills with oxygenated blood returning from the pulmonary circuit.",
    pressure: "Low (~4-8 mm Hg)",
    valveAction: "Bicuspid (mitral) valve is initially closed as chamber fills."
  },
  {
    step: 8,
    from: "Left Atrium",
    to: "Left Ventricle",
    vessel: "Left Atrioventricular Canal",
    bloodType: "oxygenated",
    description: "Left atrium contracts, driving oxygenated blood across the Bicuspid (Mitral) valve into the thick-walled left ventricle.",
    pressure: "Rising (~10-12 mm Hg)",
    valveAction: "Bicuspid valve opens; Aortic valve closed."
  },
  {
    step: 9,
    from: "Left Ventricle",
    to: "Aorta & Systemic Arteries",
    vessel: "Ascending Aorta & Aortic Arch",
    bloodType: "oxygenated",
    description: "Powerful left ventricular systole! Bicuspid valve snaps shut ('LUB' component), Aortic semilunar valve bursts open, driving blood into the Aorta.",
    pressure: "Peak Systolic (120 mm Hg)",
    valveAction: "Bicuspid valve closes tight; Aortic semilunar valve opens."
  },
  {
    step: 10,
    from: "Aorta",
    to: "Systemic Capillaries & Body Cells",
    vessel: "Systemic Arterial Tree & Capillaries",
    bloodType: "oxygenated",
    description: "High-pressure oxygenated blood travels to brain, muscles, liver, kidneys, and extremities, unloading O₂ and nutrients to fuel life. Cycle repeats!",
    pressure: "Arterial (~120/80 mm Hg)",
    valveAction: "Aortic valve snaps shut during diastole ('DUB' heart sound)."
  }
];

// =========================================================================
// 3. MICROSCOPIC CELL LABORATORY (Animal vs Plant Cell Organelles)
// =========================================================================

export const CELL_ORGANELLES: CellOrganelle[] = [
  {
    id: "nucleus",
    name: "Nucleus (Master Genetic Control Center)",
    cellType: "both",
    function: "Stores genomic DNA in chromatin; directs transcription, protein synthesis, and cell division.",
    analogy: "The Central Executive / CPU of the cell.",
    keyEnzymesOrPigments: "DNA & RNA Polymerases, Histone proteins",
    coordinates: [0, 0, 0],
    boardSignificance: "Enclosed by a double nuclear membrane with nuclear pores; contains the nucleolus (ribosome assembly site)."
  },
  {
    id: "mitochondria",
    name: "Mitochondria (Powerhouse of the Cell)",
    cellType: "both",
    function: "Site of aerobic cellular respiration (Krebs cycle & oxidative phosphorylation); generates ATP.",
    analogy: "The Thermal Power Plant generating cellular energy currency.",
    keyEnzymesOrPigments: "ATP Synthase, Cytochrome c oxidase, Matrix dehydrogenase",
    coordinates: [1.3, 0.6, 0.4],
    boardSignificance: "Semi-autonomous organelle possessing its own circular 70S DNA and ribosomes (Endosymbiotic theory)."
  },
  {
    id: "chloroplast",
    name: "Chloroplast (Photosynthetic Sugar Factory)",
    cellType: "plant",
    function: "Captures radiant solar energy and converts $CO_2 + H_2O$ into glucose via light & dark photosynthetic reactions.",
    analogy: "Solar energy panels & organic food manufacturing kitchen.",
    keyEnzymesOrPigments: "Chlorophyll a, Chlorophyll b, RuBisCO enzyme",
    coordinates: [-1.2, 0.8, -0.3],
    boardSignificance: "Contains stacks of thylakoids (grana) for light reactions and stroma for the Calvin cycle."
  },
  {
    id: "vacuole",
    name: "Large Central Vacuole & Tonoplast",
    cellType: "plant",
    function: "Maintains cell turgidity and osmotic rigidity; stores cell sap, amino acids, sugars, and waste metabolites.",
    analogy: "High-capacity pressurized water reservoir & storage warehouse.",
    keyEnzymesOrPigments: "Hydrolases, Osmoregulatory ions ($K^+, Cl^-$)",
    coordinates: [0.3, -0.6, 0.2],
    boardSignificance: "Occupies up to 90% of plant cell volume; bounded by a semi-permeable membrane called the Tonoplast."
  },
  {
    id: "endoplasmic_reticulum",
    name: "Endoplasmic Reticulum (Rough & Smooth ER)",
    cellType: "both",
    function: "Rough ER (studded with ribosomes) synthesizes secretory proteins; Smooth ER synthesizes lipids, phospholipids, and detoxifies drugs.",
    analogy: "Industrial manufacturing assembly line & internal conveyor belt.",
    keyEnzymesOrPigments: "Signal peptidase, Cytochrome P450 detox enzymes",
    coordinates: [-0.8, -0.7, 0.5],
    boardSignificance: "Provides mechanical structural framework and continuous intracellular transport channel with outer nuclear membrane."
  },
  {
    id: "golgi_apparatus",
    name: "Golgi Apparatus (Packaging & Dispatch Unit)",
    cellType: "both",
    function: "Modifies, sorts, packages, and tags proteins/lipids from ER into secretory vesicles for intracellular delivery or exocytosis.",
    analogy: "The Post Office & courier packaging department of the cell.",
    keyEnzymesOrPigments: "Glycosyltransferases, Sulfotransferases",
    coordinates: [0.9, -0.9, -0.4],
    boardSignificance: "Characterized by distinct convex cis face (forming face) and concave trans face (maturing face)."
  },
  {
    id: "cell_wall",
    name: "Cell Wall (Rigid Cellulose Exoskeleton)",
    cellType: "plant",
    function: "Provides structural tensile strength, prevents osmotic lysis in hypotonic solutions, and protects against pathogen invasion.",
    analogy: "Protective outer fortress stone wall.",
    keyEnzymesOrPigments: "Cellulose, Hemicellulose, Pectin, Lignin",
    coordinates: [0, 0, 1.8],
    boardSignificance: "Non-living rigid outer layer permeable to water and solutes; interconnected by plasmodesmata cytoplasmic bridges."
  },
  {
    id: "plasma_membrane",
    name: "Plasma Membrane (Fluid Mosaic Barrier)",
    cellType: "both",
    function: "Selectively permeable phospholipid bilayer regulating transport of ions, nutrients, and waste in and out of the cell.",
    analogy: "Smart biometric security gate controlling entry and exit.",
    keyEnzymesOrPigments: "$Na^+/K^+$ ATPase pumps, Aquaporin channels",
    coordinates: [0, 0, 1.7],
    boardSignificance: "Described by Singer & Nicolson's Fluid Mosaic Model (1972): quasi-fluid lipid matrix with embedded integral proteins."
  }
];

// =========================================================================
// 4. INTERACTIVE 3D BIOLOGY QUIZZES
// =========================================================================

export const BIOLOGY_3D_QUIZZES: Biology3DQuiz[] = [
  {
    id: "quiz-bone-01",
    system: "skeletal",
    question: "Locate and select the longest and strongest weight-bearing bone in the human body.",
    targetStructureId: "femur",
    targetName: "Femur (Thigh Bone)",
    explanation: "Correct! The Femur (thigh bone) is the longest, heaviest, and strongest bone in the human skeleton.",
    marks: 4,
    hint: "Look along the upper leg between the hip socket and knee."
  },
  {
    id: "quiz-bone-02",
    system: "skeletal",
    question: "Identify the flat dagger-shaped chest bone that anchors true ribs 1 through 7.",
    targetStructureId: "sternum",
    targetName: "Sternum (Breastbone)",
    explanation: "Correct! The Sternum is the anterior medial flat bone articulating with true ribs through hyaline costal cartilage.",
    marks: 4,
    hint: "It lies centrally along the anterior midline of the rib cage."
  },
  {
    id: "quiz-heart-01",
    system: "circulatory",
    question: "Select the thickest muscular chamber responsible for pumping oxygenated blood into the systemic aorta.",
    targetStructureId: "left_ventricle",
    targetName: "Left Ventricle",
    explanation: "Correct! The Left Ventricle has the thickest myocardium because it must generate enough force to propel blood through the entire body.",
    marks: 4,
    hint: "It forms the muscular apex on the lower-left side of the heart."
  },
  {
    id: "quiz-heart-02",
    system: "circulatory",
    question: "Click the cardiac chamber that houses the Sinoatrial (SA) Node pacemaker.",
    targetStructureId: "right_atrium",
    targetName: "Right Atrium",
    explanation: "Correct! The SA node (pacemaker) is situated in the upper-right corner of the Right Atrium.",
    marks: 4,
    hint: "It is the upper chamber receiving deoxygenated blood from the vena cava."
  },
  {
    id: "quiz-brain-01",
    system: "nervous",
    question: "Select the hindbrain structure primarily responsible for balance, posture, and motor precision.",
    targetStructureId: "brain_cerebellum",
    targetName: "Cerebellum",
    explanation: "Correct! The Cerebellum maintains body posture, equilibrium, and coordinates smooth voluntary muscle movements.",
    marks: 4,
    hint: "Look at the smaller folded structure under the back of the cerebral hemispheres."
  },
  {
    id: "quiz-digestive-01",
    system: "digestive",
    question: "Click on the largest gland in the body that secretes bile for fat emulsification.",
    targetStructureId: "liver",
    targetName: "Liver",
    explanation: "Correct! The Liver is the largest gland, producing bile salts that break down large lipid globules into small micelles.",
    marks: 4,
    hint: "It is situated in the upper-right abdominal cavity beneath the diaphragm."
  },
  {
    id: "quiz-cell-01",
    system: "cellular",
    question: "Identify the semi-autonomous organelle responsible for generating cellular ATP energy via aerobic respiration.",
    targetStructureId: "mitochondria",
    targetName: "Mitochondria",
    explanation: "Correct! Mitochondria are the powerhouses of the cell where ATP is synthesized via oxidative phosphorylation.",
    marks: 4,
    hint: "Look for the bean-shaped organelle with folded inner cristae."
  }
];

// =========================================================================
// 5. NCERT BOARD CHAPTER MAPPING FOR BIOLOGY
// =========================================================================

export const BIOLOGY_CHAPTER_MAPPINGS = [
  {
    id: "life_processes",
    board: "CBSE / NCERT Class 10",
    title: "Life Processes (Nutrition, Respiration, Transportation, Excretion)",
    marksWeightage: 9,
    relevantSystems: ["circulatory", "respiratory", "digestive", "urinary"],
    description: "Core mechanisms sustaining living organisms: Autotrophic/heterotrophic nutrition, aerobic vs anaerobic respiration, human double circulation, and nephron excretion."
  },
  {
    id: "control_coordination",
    board: "CBSE / NCERT Class 10",
    title: "Control and Coordination (Nervous System & Reflexes)",
    marksWeightage: 6,
    relevantSystems: ["nervous", "endocrine", "skeletal"],
    description: "Neuron anatomy, synaptic transmission, reflex arc, human brain subdivisions, and plant phytohormones."
  },
  {
    id: "how_organisms_reproduce",
    board: "CBSE / NCERT Class 10",
    title: "How Do Organisms Reproduce & Cell Division",
    marksWeightage: 7,
    relevantSystems: ["cellular", "endocrine"],
    description: "Asexual & sexual reproduction, flowering plant fertilization, human male/female reproductive systems, and contraception."
  },
  {
    id: "cell_biology_foundations",
    board: "ICSE / State Boards",
    title: "Cell Structure, Organelles & Plant Physiology",
    marksWeightage: 8,
    relevantSystems: ["cellular"],
    description: "Comparative study of plant and animal cells, organelle ultrastructure, photosynthesis in chloroplasts, and osmosis."
  }
];
