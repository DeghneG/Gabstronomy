// ============================================================
// GABSTRONOMY — Data Layer
// ============================================================

const TAXONOMY = {
  cuisines: ["Filipino", "Spanish", "Swiss", "Chinese"],
  mealTypes: ["Breakfast", "Lunch / Dinner", "Dessert", "Soups"],
  cookingMethods: ["Braised / Slow-cooked", "Sautéed / Stir-fried", "Boiled / Simmered", "Grilled", "Raw / No-cook", "Roasted", "Fried / Deep-fried"],
  ingredientCategories: {
    vegetables: ["ampalaya", "bellpepper", "carrot", "kalabasa", "kamatis", "kamote leaves", "kangkong", "malunggay", "mushroom", "okra", "patola", "pechay", "potatoes", "sayote", "sitaw", "talong", "upo"],
    meat: {
      pork: ["ham", "pork"],
      chicken: ["chicken"],
      beef: ["beef"],
      lamb: []
    },
    seafood: {
      fish: ["fish", "bangus"],
      shrimp: [],
      crab: [],
      shellfish: ["shellfish"]
    },
    grainsStarches: [],
    dairyEggs: ["cheese", "egg"],
    herbsSpices: ["achuete", "bay leaf", "black pepper", "calamansi", "chili powder", "garlic", "ginger", "onion", "siling haba", "siling labuyo", "spring onions", "star anise", "tanglad"],
    pantryCondiments: ["bagoong", "bread crumbs", "gata", "patis ng tagalog", "tomato paste"]
  }
};

const ALL_INGREDIENTS = [
  ...TAXONOMY.ingredientCategories.vegetables,
  ...TAXONOMY.ingredientCategories.meat.pork,
  ...TAXONOMY.ingredientCategories.meat.chicken,
  ...TAXONOMY.ingredientCategories.meat.beef,
  ...TAXONOMY.ingredientCategories.seafood.fish,
  ...TAXONOMY.ingredientCategories.seafood.shellfish,
  ...TAXONOMY.ingredientCategories.herbsSpices,
  ...TAXONOMY.ingredientCategories.dairyEggs,
  ...TAXONOMY.ingredientCategories.pantryCondiments
];

const DISHES = [
  {
    id: "chicken-adobo",
    name: "Chicken Adobo",
    tagline: "My go-to 'sud-an' when ingredients are limited.",
    description: "Chicken braised in a savory, tangy mixture of soy sauce, vinegar, garlic, and black peppercorns. It gets better the longer it sits.",
    cuisine: "Filipino",
    mealType: "Lunch / Dinner",
    cookingMethod: "Braised / Slow-cooked",
    cookTime: "20-25 min",
    servings: 4,
    difficulty: "Easy",
    coreIngredients: ["chicken", "garlic", "bay leaf", "black pepper"],
    specialIngredients: [
      { ingredient: "Pineapple", note: "Incorporate pineapple chunks and syrup for a sweeter, tropical profile." },
      { ingredient: "Potatoes", note: "Pan-fry until lightly charred before adding to the stew." },
      { ingredient: "Boiled egg", note: "Add during the final simmer to absorb the rich sauce." },
      { ingredient: "Chicken liver", note: "Sauté alongside the chicken for enhanced depth and richness." }
    ],
    steps: [
      "<span class=\"is-special\">If using potatoes, pan-fry them until golden and slightly charred, then set aside.</span>",
      "Heat oil in a pan and sauté the onions, garlic, and ginger until aromatic.",
      "Introduce the chicken <span class=\"is-special\">(and chicken liver, if desired)</span>, sautéing until the meat develops a light brown sear.",
      "Stir in the soy sauce, sugar, bay leaves, peppercorns, a splash of water, and your preferred seasoning (such as salt, MSG, or Magic Sarap). <span class=\"is-special\">You may also add pineapple for a touch more sweetness.</span>",
      "Allow the chicken to simmer until tender. Pour in the vinegar and let it cook without stirring to mellow the acidity.",
      "Gently fold in <span class=\"is-special\">the boiled eggs and the pre-fried potatoes</span>, allowing them to absorb the flavors.",
      "Continue to simmer until the sauce reduces and coats the chicken beautifully."
    ],
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&q=80",
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
    cookTime: "30-35 min",
    servings: 4,
    difficulty: "Easy",
    coreIngredients: ["chicken", "ginger", "garlic", "onion", "sayote", "malunggay", "siling haba"],
    specialIngredients: [
      { ingredient: "Tanglad (lemongrass)", note: "Bruise and simmer with the broth for a bright, citrusy aroma." }
    ],
    steps: [
      "Sauté the tanglad (lemongrass), garlic, and onion until they release their aromatic fragrance.",
      "Introduce the chicken pieces and cook until they develop a light brown sear.",
      "Pour in chicken broth (or water with a chicken bouillon cube, such as Knorr, if broth is unavailable), and bring to a boil. Allow it to simmer until the chicken is fully cooked.",
      "Add the sliced sayote and continue cooking until the vegetable softens and becomes tender.",
      "Season the broth to taste, utilizing your preferred savory enhancer (like salt, MSG, or Magic Sarap).",
      "Gently fold in the malunggay leaves and siling haba. Cover the pot, turn off the heat, and allow it to rest for 2 to 5 minutes before serving."
    ],
    image: "https://images.unsplash.com/photo-1548943487-a2e4b43b5936?w=800&q=80",
    featured: false,
  },


  {
    id: "garlic-chicken-mushroom",
    name: "Garlic Chicken Mushroom",
    tagline: "Rich, savory, and deeply comforting.",
    description: "A savory chicken dish bathed in a rich, buttery mushroom sauce. The technique of cold-starting garlic cloves infuses the oil, creating a deeply aromatic base.",
    cuisine: "Spanish",
    mealType: "Lunch / Dinner",
    cookingMethod: "Sautéed / Stir-fried",
    cookTime: "30-35 min",
    servings: 4,
    difficulty: "Medium",
    coreIngredients: ["chicken", "garlic", "onion", "mushroom"],
    specialIngredients: [
      { ingredient: "Calamansi", note: "Use in the marinade to add a bright, acidic contrast to the savory oyster sauce." }
    ],
    steps: [
      "Marinate the chicken in a blend of soy sauce, calamansi juice, and oyster sauce. For optimal flavor, allow it to rest as long as possible.",
      "Place oil and whole garlic cloves in a cold pan, then turn on low heat. Slowly infuse the oil and toast the garlic until golden, then set the cloves aside.",
      "In the same garlic-infused oil, lay the chicken pieces flat. Sear undisturbed until a deep crust forms, as this is essential for building the dish's foundational flavor.",
      "Wipe the pan clean, then melt butter over medium heat. Sauté the onions and minced garlic until softened, followed by the canned mushrooms (reserve the mushroom brine for later).",
      "Sprinkle cornstarch over the aromatics, stirring constantly to create a roux. Pour in the oyster sauce and mix until thoroughly combined.",
      "Return the seared chicken to the pan along with a moderate amount of the leftover marinade. Pour in the reserved mushroom brine and about one and a half glasses of water. Simmer gently until the chicken is fully cooked.",
      "Garnish with the reserved toasted garlic cloves just before serving."
    ],
    image: "images/garlic_chicken_mushroom.png",
    featured: true,
  },
  {
    id: "chicken-cordon-bleu",
    name: "Chicken Cordon Bleu",
    tagline: "Crispy on the outside, gooey on the inside.",
    description: "A decadent classic featuring tender chicken breast rolled around savory ham and melted cheese, coated in breadcrumbs and fried to golden perfection.",
    cuisine: "Swiss",
    mealType: "Lunch / Dinner",
    cookingMethod: "Fried / Deep-fried",
    cookTime: "30-35 min",
    servings: 4,
    difficulty: "Medium",
    coreIngredients: ["chicken", "ham", "cheese", "bread crumbs", "egg"],
    specialIngredients: [],
    steps: [
      "Butterfly the chicken breast and lay it flat. Using a meat tenderizer, carefully pound it until wide enough to hold the filling. <br/><br/><em>Deghne’s Tip: Lay a piece of plastic wrap over the chicken before pounding to avoid a mess. Also, use the weight of your elbow rather than your wrist for better control and less strain.</em>",
      "Season the flattened chicken evenly with salt and pepper.",
      "Layer the ham and cheese over the chicken, then roll it up tightly to enclose the filling.",
      "Scramble the eggs in a shallow dish and place the breadcrumbs in a separate container. Dredge the rolled chicken first in the egg, ensuring it's fully coated, and then generously roll it in the breadcrumbs.",
      "Heat oil in a deep pan and carefully deep-fry the chicken until it achieves a deep, golden-brown crust and is fully cooked through."
    ],
    image: "images/chicken_cordon_bleu.png",
    featured: false,
  },
  {
    id: "sinabawang-isda",
    name: "Sinabawang Isda",
    tagline: "A clean, comforting, and deeply savory fish soup.",
    description: "Fresh fish steeped in a light, aromatic broth of ginger, tomatoes, and onions, finished with vibrant kamote leaves and chili for a delicate kick.",
    cuisine: "Filipino",
    mealType: "Soups",
    cookingMethod: "Boiled / Simmered",
    cookTime: "10-15 min",
    servings: 4,
    difficulty: "Easy",
    coreIngredients: ["fish", "kamatis", "onion", "ginger", "spring onions", "siling haba"],
    specialIngredients: [
      { ingredient: "Kamote leaves", note: "Adds a subtle earthiness and beautiful color to the broth." },
      { ingredient: "Patis ng Tagalog", note: "Elevates the umami profile profoundly." }
    ],
    steps: [
      "In a cold, deep pan, add a splash of oil. Gently and slowly sauté the onions, tomatoes, and ginger until they soften and release their aromatics.",
      "Pour in water to form the broth. Season with salt, MSG, or Magic Sarap to taste. <span class=\"is-special\">For deeper flavor, add Patis ng Tagalog.</span>",
      "Once the broth reaches a rolling boil, gently lower the fish into the pan. Reduce the heat and simmer until the fish is tender and fully cooked.",
      "To finish, fold in the spring onions, <span class=\"is-special\">kamote leaves</span>, and siling haba. Simmer for 5mins for maximum flavor."
    ],
    image: "images/sinabawang_isda.png",
    featured: false,
  },
  {
    id: "sweet-and-sour-bukaw",
    name: "Sweet and Sour Bukaw",
    tagline: "A delightful balance of sweet, sour, and savory.",
    description: "Crispy fried fish smothered in a thick, vibrant sauce made from pineapple, ketchup, and colorful julienned vegetables.",
    cuisine: "Chinese",
    mealType: "Lunch / Dinner",
    cookingMethod: "Sautéed / Stir-fried",
    cookTime: "20-30 min",
    servings: 4,
    difficulty: "Medium",
    coreIngredients: ["onion", "garlic", "bellpepper", "carrots", "ketchup", "pineapple", "siling haba"],
    specialIngredients: [
      { ingredient: "Pineapple", note: "Juice is used in the sauce for a tropical sweetness, and chunks add texture." },
      { ingredient: "MSG", note: "Added to the aromatics for an umami boost." }
    ],
    steps: [
      "Fry the fish and make sure to score the fish before frying.",
      "Use the same pan but don't use all the oil, sauté onions, garlic, bellpepper, and carrots (julienne cut) until fragrant, then add MSG (for umami and better flavor).",
      "Add 2-3 tablespoons of sugar, and the remaining juice from the pineapple, then add water just enough to cover the fish later.",
      "When the sauce thickens, add the siling haba before adding the fish, mix to cover the fish fully, and turn off heat to rest for a few minutes for an even, smooth fragrance."
    ],
    image: "images/sweet_and_sour_bukaw.png",
    featured: false
  },
  {
    id: "bicol-express",
    name: "Bicol Express",
    tagline: "Spicy, creamy, and deeply savory.",
    description: "A fiery and rich pork stew cooked in creamy coconut milk with copious amounts of chili, garlic, and onions.",
    cuisine: "Filipino",
    mealType: "Lunch / Dinner",
    cookingMethod: "Braised / Slow-cooked",
    cookTime: "15-25 min",
    servings: 4,
    difficulty: "Medium",
    coreIngredients: ["pork", "onion", "garlic", "siling labuyo", "sitaw", "gata", "siling haba"],
    specialIngredients: [],
    steps: [
      "On a hot oil fry the pork till golden brown then set aside.",
      "In the same pan, sauté the onion, garlic, and the chili until fragrant.",
      "Add the pork then sauté until mixed beautifully.",
      "Season with salt, MSG or Magic Sarap, and black pepper, then add water enough to cover half the pork and wait for the fond to surface.",
      "Then add gata (coconut milk) and simmer until oil is visible.",
      "Then add the siling haba for garnish."
    ],
    image: "images/bicol_express.png",
    featured: false
  },
  {
    id: "bangus-steak",
    name: "Bangus Steak",
    tagline: "Savory, tangy, and topped with toasted garlic.",
    description: "A Filipino classic featuring fried milkfish steeped in a savory sauce of soy sauce, calamansi, and oyster sauce, finished with sweet onions and crispy garlic.",
    cuisine: "Filipino",
    mealType: "Lunch / Dinner",
    cookingMethod: "Sautéed / Stir-fried",
    cookTime: "20-25 min",
    servings: 4,
    difficulty: "Medium",
    coreIngredients: ["bangus", "onion", "garlic", "calamansi"],
    specialIngredients: [
      { ingredient: "Cornstarch slurry", note: "Thickens the sauce to perfectly coat the fried fish." }
    ],
    steps: [
      "Cut the bangus into supreme cuts, then season with salt and pepper.",
      "Fry until golden brown, then set aside.",
      "In a different cold pan, put the sliced garlic and oil. Slow cook until golden brown, then set the garlic aside. In the same pan, slightly caramelize the onions.",
      "Add soy sauce and squeeze the calamansi.",
      "Once mixed thoroughly, add water and a slurry (cornstarch and water mixture), then simmer for 3 to 5 minutes.",
      "After a few minutes, add a little sugar. When the sugar dissolves, add the fried bangus and cover for 2 minutes.",
      "Add the remaining fresh onions and top it with the fried garlic."
    ],
    image: "images/bangus_steak.png",
    featured: false
  },
  {
    id: "sweet-and-spicy-pork-ribs",
    name: "Sweet and Spicy Pork Ribs",
    tagline: "Sticky, savory, and perfectly tender.",
    description: "Tender pork ribs braised in a rich, sweet, and fiery tomato-based sauce, balanced with savory soy.",
    cuisine: "Chinese",
    mealType: "Lunch / Dinner",
    cookingMethod: "Braised / Slow-cooked",
    cookTime: "40-50 min",
    servings: 4,
    difficulty: "Medium",
    coreIngredients: ["pork", "onion", "garlic", "siling labuyo", "bellpepper", "tomato paste", "chili powder"],
    specialIngredients: [],
    steps: [
      "On hot oil fry the ribs until golden brown, then set aside.",
      "In the same pan, sauté onions, garlic, siling labuyo, bell pepper, and chili powder until fragrant.",
      "Add the fried ribs back into the pan and sauté until mixed beautifully.",
      "Pour in enough water to cover the pork. Stir in sugar, and let it simmer until the pork softens.",
      "Then add tomato paste and a little more sugar. Let it simmer until the sauce thickens into a rich glaze."
    ],
    image: "images/sweet_and_spicy_pork_ribs.png",
    featured: false
  },
  {
    id: "pork-binagoongan",
    name: "Pork Binagoongan",
    tagline: "Savory, funky, and deeply flavorful.",
    description: "Tender pork braised in savory fermented shrimp paste (bagoong), balanced with sweet tomatoes and finished with smoky seared eggplant.",
    cuisine: "Filipino",
    mealType: "Lunch / Dinner",
    cookingMethod: "Sautéed / Stir-fried",
    cookTime: "30-35 min",
    servings: 4,
    difficulty: "Medium",
    coreIngredients: ["pork", "onion", "garlic", "bagoong", "talong", "kamatis", "siling haba"],
    specialIngredients: [],
    steps: [
      "Sear the talong (eggplant) until toast marks are visible, then set aside.",
      "In the same pan, fry the pork until golden brown, then set aside.",
      "Using the same pan, sauté the onion, garlic, and tomato until fragrant. Add the bagoong and mix well.",
      "Add the pork back in, season with salt, black pepper, and sugar to taste. Add water and simmer until the pork softens.",
      "Add the seared eggplant and siling haba. Mix gently, turn off the heat, and let it rest for 5 minutes before serving. <button class='step-timer-btn' data-minutes='5' onclick='event.stopPropagation(); window.startRestTimer && window.startRestTimer(this)'>⏱ Start 5-min Timer</button>"
    ],
    image: "images/pork_binagoongan.png",
    featured: false
  }
];

// Provide globally
window.TAXONOMY = TAXONOMY;
window.ALL_INGREDIENTS = ALL_INGREDIENTS;
window.DISHES = DISHES;
