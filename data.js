// ============================================================
// GABSTRONOMY — Data Layer
// ============================================================

const TAXONOMY = {
  cuisines: ["Filipino"],
  mealTypes: ["Breakfast", "Lunch / Dinner", "Dessert", "Soups"],
  cookingMethods: ["Braised / Slow-cooked", "Sautéed / Stir-fried", "Boiled / Simmered", "Grilled", "Raw / No-cook", "Roasted"],
  ingredientCategories: {
    vegetables: ["ampalaya", "carrot", "kalabasa", "kamatis", "kangkong", "malunggay", "okra", "patola", "pechay", "potatoes", "sayote", "sitaw", "talong", "upo"],
    meat: {
      pork: ["pork"],
      chicken: ["chicken"],
      beef: ["beef"],
      lamb: []
    },
    seafood: {
      fish: ["fish"],
      shrimp: [],
      crab: [],
      shellfish: ["shellfish"]
    },
    grainsStarches: [],
    dairyEggs: [],
    herbsSpices: ["achuete", "bay leaf", "black pepper", "garlic", "ginger", "onion", "siling haba", "siling labuyo", "star anise", "tanglad"],
    pantryCondiments: []
  }
};

const ALL_INGREDIENTS = [
  ...TAXONOMY.ingredientCategories.vegetables,
  ...TAXONOMY.ingredientCategories.meat.pork,
  ...TAXONOMY.ingredientCategories.meat.chicken,
  ...TAXONOMY.ingredientCategories.meat.beef,
  ...TAXONOMY.ingredientCategories.seafood.fish,
  ...TAXONOMY.ingredientCategories.seafood.shellfish,
  ...TAXONOMY.ingredientCategories.herbsSpices
];

const DISHES = [
  {
    id: "chicken-adobo",
    name: "Chicken Adobo",
    tagline: "The unofficial national dish.",
    description: "Chicken braised in a savory, tangy mixture of soy sauce, vinegar, garlic, and black peppercorns. It gets better the longer it sits.",
    cuisine: "Filipino",
    mealType: "Lunch / Dinner",
    cookingMethod: "Braised / Slow-cooked",
    cookTime: "45 min",
    servings: 4,
    difficulty: "Easy",
    coreIngredients: ["chicken", "garlic", "bay leaf", "black pepper"],
    specialIngredients: [
      { ingredient: "Pineapple", note: "Add pineapple chunks and syrup for a sweeter, tropical twist." }
    ],
    steps: [
      "Combine chicken, soy sauce, vinegar, crushed garlic, bay leaves, and black peppercorns in a pot.",
      "Bring to a boil, then lower the heat and simmer until the chicken is tender.",
      "Optional: Remove the chicken and pan-fry it in a little oil until brown, then return to the sauce.",
      "Simmer until the sauce reduces and thickens slightly. Serve with steamed rice."
    ],
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&q=80",
    featured: true,
  },
  {
    id: "pork-sinigang",
    name: "Pork Sinigang",
    tagline: "Sour, savory, comforting.",
    description: "A sour tamarind-based soup with tender pork and a colorful assortment of vegetables. The ultimate comfort food on a rainy day.",
    cuisine: "Filipino",
    mealType: "Soups",
    cookingMethod: "Boiled / Simmered",
    cookTime: "1 hr",
    servings: 4,
    difficulty: "Medium",
    coreIngredients: ["pork", "onion", "kamatis", "kangkong", "talong", "sitaw"],
    specialIngredients: [
      { ingredient: "Siling haba", note: "Add long green chilis for a subtle, aromatic heat in the broth." }
    ],
    steps: [
      "Boil pork chunks with onions and tomatoes until the meat is fork-tender.",
      "Add the souring agent (tamarind paste or fresh tamarind extract).",
      "Add the vegetables in order of cooking time: eggplant and string beans first.",
      "Turn off the heat and stir in the leafy kangkong so it wilts but stays bright green."
    ],
    image: "https://images.unsplash.com/photo-1621841315664-50f9db9117eb?w=800&q=80",
    featured: true,
  },
  {
    id: "chicken-tinola",
    name: "Chicken Tinola",
    tagline: "Ginger-infused chicken soup.",
    description: "A light and restorative chicken soup flavored heavily with ginger and onions, featuring tender cuts of green papaya or chayote and malunggay leaves.",
    cuisine: "Filipino",
    mealType: "Soups",
    cookingMethod: "Boiled / Simmered",
    cookTime: "40 min",
    servings: 4,
    difficulty: "Easy",
    coreIngredients: ["chicken", "ginger", "garlic", "onion", "sayote", "malunggay"],
    specialIngredients: [
      { ingredient: "Tanglad (lemongrass)", note: "Bruise and simmer with the broth for a bright, citrusy aroma." }
    ],
    steps: [
      "Sauté garlic, ginger, and onion until fragrant.",
      "Add the chicken pieces and cook until lightly browned.",
      "Pour in water or chicken broth and bring to a boil. Simmer until chicken is cooked.",
      "Add the sayote slices and cook until tender.",
      "Turn off the heat and stir in the malunggay leaves."
    ],
    image: "https://images.unsplash.com/photo-1548943487-a2e4b43b5936?w=800&q=80",
    featured: false,
  },
  {
    id: "pinakbet",
    name: "Pinakbet",
    tagline: "The bounty of the vegetable garden.",
    description: "A robust vegetable stew from the Ilocos region, featuring bitter gourd, eggplant, and squash, all tied together with the deep umami of shrimp paste.",
    cuisine: "Filipino",
    mealType: "Lunch / Dinner",
    cookingMethod: "Sautéed / Stir-fried",
    cookTime: "30 min",
    servings: 4,
    difficulty: "Medium",
    coreIngredients: ["pork", "garlic", "onion", "kamatis", "ampalaya", "kalabasa", "sitaw", "talong", "okra"],
    specialIngredients: [
      { ingredient: "Bagoong alamang (shrimp paste)", note: "Sauté with the aromatics for an authentic, deep umami flavor." }
    ],
    steps: [
      "Sauté small pieces of pork (usually belly) until fat renders. Add garlic, onion, and tomatoes.",
      "Add squash (kalabasa) and a little water; cover and cook until slightly tender.",
      "Add the remaining vegetables (ampalaya, sitaw, talong, okra).",
      "Cook until vegetables are tender but not mushy. Serve hot."
    ],
    image: "https://images.unsplash.com/photo-1593504049359-74330189a345?w=800&q=80",
    featured: false,
  },
  {
    id: "nilagang-baka",
    name: "Nilagang Baka",
    tagline: "Clear beef broth for the soul.",
    description: "A straightforward, comforting boiled beef soup with potatoes and leafy greens, seasoned simply with salt and whole black peppercorns.",
    cuisine: "Filipino",
    mealType: "Soups",
    cookingMethod: "Boiled / Simmered",
    cookTime: "1.5 hrs",
    servings: 4,
    difficulty: "Easy",
    coreIngredients: ["beef", "onion", "black pepper", "potatoes", "pechay"],
    specialIngredients: [
      { ingredient: "Saging na saba (plantain)", note: "Adds a comforting, subtle sweetness to the savory broth." }
    ],
    steps: [
      "Place beef chunks, quartered onions, and whole black peppercorns in a large pot with water.",
      "Bring to a boil, skim off the scum, and simmer until the beef is very tender (about 1.5 hours).",
      "Add the potatoes and cook until fork-tender.",
      "Turn off the heat and stir in the pechay leaves."
    ],
    image: "https://images.unsplash.com/photo-1594991196323-0136faab74de?w=800&q=80",
    featured: false,
  },
  {
    id: "chicken-inasal",
    name: "Chicken Inasal",
    tagline: "Char-grilled, annatto-stained perfection.",
    description: "Bacolod's famous grilled chicken, marinated in vinegar, lemongrass, and ginger, then basted with vibrant annatto oil as it chars over hot coals.",
    cuisine: "Filipino",
    mealType: "Lunch / Dinner",
    cookingMethod: "Grilled",
    cookTime: "30 min",
    servings: 4,
    difficulty: "Medium",
    coreIngredients: ["chicken", "garlic", "ginger", "tanglad", "achuete"],
    specialIngredients: [
      { ingredient: "Calamansi juice", note: "Use in the marinade to tenderize the chicken and add bright acidity." }
    ],
    steps: [
      "Blend garlic, ginger, chopped lemongrass, vinegar, and salt to make a marinade.",
      "Marinate the chicken pieces for at least 3 hours or overnight.",
      "Make basting oil by heating achuete (annatto) seeds in oil until the color bleeds, then discard seeds.",
      "Grill the chicken over hot coals, basting generously with the achuete oil until cooked through and nicely charred."
    ],
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80",
    featured: true,
  },
  {
    id: "ginataang-kalabasa",
    name: "Ginataang Kalabasa at Sitaw",
    tagline: "Sweet squash in rich coconut milk.",
    description: "Squash and string beans cooked slowly in coconut milk until the squash breaks down and thickens the rich, sweet-savory sauce.",
    cuisine: "Filipino",
    mealType: "Lunch / Dinner",
    cookingMethod: "Braised / Slow-cooked",
    cookTime: "35 min",
    servings: 4,
    difficulty: "Easy",
    coreIngredients: ["pork", "garlic", "onion", "ginger", "kalabasa", "sitaw"],
    specialIngredients: [
      { ingredient: "Siling labuyo", note: "Add bird's eye chili to cut through the richness of the coconut milk with some heat." }
    ],
    steps: [
      "Sauté pork pieces until browned. Add garlic, onion, and ginger.",
      "Pour in coconut milk and bring to a gentle simmer.",
      "Add cubed squash (kalabasa) and cook until it starts to soften.",
      "Add string beans (sitaw) and simmer until vegetables are tender and the sauce has reduced."
    ],
    image: "https://images.unsplash.com/photo-1604908177453-74b882eb7597?w=800&q=80",
    featured: false,
  },
  {
    id: "beef-kaldereta",
    name: "Beef Kaldereta",
    tagline: "Rich, hearty tomato-based stew.",
    description: "A hearty beef stew in a rich tomato sauce with potatoes and carrots, often thickened with liver spread for deep, savory complexity.",
    cuisine: "Filipino",
    mealType: "Lunch / Dinner",
    cookingMethod: "Braised / Slow-cooked",
    cookTime: "2 hrs",
    servings: 6,
    difficulty: "Hard",
    coreIngredients: ["beef", "garlic", "onion", "potatoes", "carrot"],
    specialIngredients: [
      { ingredient: "Liver spread", note: "Stir in at the end to thicken the sauce and add deep, savory richness." },
      { ingredient: "Siling labuyo", note: "Mince a few bird's eye chilis for a fiery kick." }
    ],
    steps: [
      "Sear the beef chunks until browned on all sides. Set aside.",
      "Sauté garlic and onions. Return the beef to the pot, add tomato sauce and water.",
      "Simmer covered on low heat until the beef is very tender (1.5 to 2 hours).",
      "Add carrots and potatoes, cooking until tender.",
      "Stir in liver spread (if using) and simmer until the sauce thickens."
    ],
    image: "https://images.unsplash.com/photo-1544378730-8b5afcbce748?w=800&q=80",
    featured: false,
  },
  {
    id: "ginisang-upo",
    name: "Ginisang Upo",
    tagline: "Simple, savory bottle gourd.",
    description: "A quick, humble stir-fry of bottle gourd (upo) with ground pork and tomatoes, perfect for a light, healthy weeknight dinner.",
    cuisine: "Filipino",
    mealType: "Lunch / Dinner",
    cookingMethod: "Sautéed / Stir-fried",
    cookTime: "20 min",
    servings: 3,
    difficulty: "Easy",
    coreIngredients: ["pork", "garlic", "onion", "kamatis", "upo"],
    specialIngredients: [
      { ingredient: "Misua", note: "Stir fine wheat noodles in at the end for a more filling, comforting soup." }
    ],
    steps: [
      "Sauté ground pork until lightly browned.",
      "Add minced garlic, diced onions, and chopped tomatoes. Cook until tomatoes soften.",
      "Add peeled and sliced upo.",
      "Cover and simmer in its own juices (or add a splash of water) until the upo is translucent and tender."
    ],
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80",
    featured: false,
  }
];

// Provide globally
window.TAXONOMY = TAXONOMY;
window.ALL_INGREDIENTS = ALL_INGREDIENTS;
window.DISHES = DISHES;
