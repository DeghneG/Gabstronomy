// ============================================================
// GABSTRONOMY — Data Layer (Single Source of Truth)
// ============================================================
// TO SWAP IMAGES: Replace the `image` URL string on any dish
// with your own image path, e.g. "images/my-dish.jpg"
// ============================================================

const TAXONOMY = {
  ingredientCategories: {
    vegetables: ["garlic", "onion", "tomato", "bell pepper", "spinach", "broccoli", "carrot", "potato", "zucchini", "mushroom", "corn", "avocado", "lettuce", "cucumber", "eggplant", "sweet potato", "green beans", "asparagus", "kale", "cabbage", "celery", "peas"],
    meat: {
      pork: ["pork belly", "pork chop", "bacon", "ham", "ground pork", "pork shoulder"],
      chicken: ["chicken breast", "chicken thigh", "whole chicken", "chicken wings", "ground chicken"],
      beef: ["ground beef", "steak", "beef chuck", "short ribs", "beef brisket"],
      lamb: ["lamb chop", "ground lamb", "lamb shoulder"],
    },
    seafood: {
      fish: ["salmon", "tuna", "cod", "sea bass", "tilapia", "mackerel"],
      shrimp: ["shrimp"],
      crab: ["crab"],
      shellfish: ["mussels", "clams", "scallops", "oysters"],
    },
    grainsStarches: ["rice", "pasta", "bread", "flour", "noodles", "quinoa", "couscous", "tortilla", "pita", "oats", "cornmeal", "panko"],
    dairyEggs: ["egg", "butter", "milk", "cream", "parmesan", "mozzarella", "cheddar", "cream cheese", "yogurt", "sour cream", "feta", "ricotta"],
    herbsSpices: ["salt", "pepper", "basil", "oregano", "thyme", "rosemary", "cumin", "paprika", "chili flakes", "cinnamon", "ginger", "turmeric", "cilantro", "parsley", "bay leaf", "mint", "dill", "coriander", "cayenne", "nutmeg", "lemongrass", "star anise", "fennel"],
    pantryCondiments: ["olive oil", "soy sauce", "vinegar", "sugar", "honey", "sesame oil", "fish sauce", "coconut milk", "tomato paste", "mustard", "mayonnaise", "hot sauce", "worcestershire sauce", "miso paste", "tahini", "maple syrup", "lemon juice", "lime juice", "stock", "wine"],
  },

  cookingMethods: [
    "Fried", "Oven-baked / Roasted", "Grilled", "Steamed",
    "Boiled / Simmered", "Braised / Slow-cooked", "Raw / No-cook", "Sautéed / Stir-fried"
  ],

  mealTypes: [
    "Breakfast", "Lunch / Dinner", "Soups", "Salads",
    "Dessert", "Appetizers / Small Plates", "Drinks / Beverages"
  ],

  cuisines: [
    "Italian", "Mexican", "Chinese", "Japanese", "Thai",
    "Vietnamese", "Korean", "Indian", "Mediterranean",
    "American", "French", "Middle Eastern"
  ],
};

// Helper: flatten all ingredients into a single searchable list
const ALL_INGREDIENTS = (() => {
  const list = [];
  const cats = TAXONOMY.ingredientCategories;
  list.push(...cats.vegetables);
  Object.values(cats.meat).forEach(a => list.push(...a));
  Object.values(cats.seafood).forEach(a => list.push(...a));
  list.push(...cats.grainsStarches);
  list.push(...cats.dairyEggs);
  list.push(...cats.herbsSpices);
  list.push(...cats.pantryCondiments);
  return [...new Set(list)].sort();
})();

const DISHES = [
  {
    id: "cacio-e-pepe",
    name: "Cacio e Pepe",
    tagline: "Three ingredients. Infinite restraint.",
    description: "A Roman classic that proves mastery lies in simplicity. Pecorino and black pepper are emulsified with starchy pasta water to create an impossibly silky sauce — no cream, no butter, just technique.",
    cuisine: "Italian",
    mealType: "Lunch / Dinner",
    cookingMethod: "Boiled / Simmered",
    cookTime: "20 min",
    servings: 2,
    difficulty: "Medium",
    ingredients: ["pasta", "parmesan", "pepper", "salt", "olive oil"],
    steps: [
      "Bring salted water to a boil and cook pasta until just shy of al dente, reserving 2 cups pasta water.",
      "Toast freshly cracked black pepper in a dry pan until fragrant, about 1 minute.",
      "Add a ladle of pasta water to the pepper and bring to a simmer.",
      "Transfer pasta to the pan. Off heat, add finely grated Pecorino/Parmesan in stages, tossing vigorously.",
      "Add pasta water as needed to create a creamy, glossy emulsion. Serve immediately."
    ],
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&q=80",
    featured: true,
  },
  {
    id: "miso-glazed-salmon",
    name: "Miso-Glazed Salmon",
    tagline: "Umami meets caramelization.",
    description: "Salmon fillets marinated in a sweet-savory miso glaze, then roasted at high heat until the edges caramelize into a deep, lacquered crust. Served over steamed rice for a complete Japanese-inspired meal.",
    cuisine: "Japanese",
    mealType: "Lunch / Dinner",
    cookingMethod: "Oven-baked / Roasted",
    cookTime: "25 min",
    servings: 2,
    difficulty: "Easy",
    ingredients: ["salmon", "miso paste", "honey", "soy sauce", "sesame oil", "ginger", "rice"],
    steps: [
      "Whisk miso paste, honey, soy sauce, sesame oil, and grated ginger into a smooth glaze.",
      "Marinate salmon fillets for at least 15 minutes (overnight for depth).",
      "Roast at 400°F / 200°C for 12–15 minutes until caramelized and flaky.",
      "Serve over steamed rice with a drizzle of remaining glaze."
    ],
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=80",
    featured: false,
  },
  {
    id: "thai-basil-chicken",
    name: "Thai Basil Chicken",
    tagline: "Wok hei in under ten minutes.",
    description: "A fiery Thai street food staple — ground chicken stir-fried with holy basil, garlic, and chili in a blazing-hot wok. The basil wilts into the sauce at the last second, releasing its peppery, anise-like aroma.",
    cuisine: "Thai",
    mealType: "Lunch / Dinner",
    cookingMethod: "Sautéed / Stir-fried",
    cookTime: "15 min",
    servings: 2,
    difficulty: "Easy",
    ingredients: ["ground chicken", "basil", "garlic", "chili flakes", "soy sauce", "fish sauce", "sugar", "olive oil", "rice", "egg"],
    steps: [
      "Heat oil in a wok over high heat until smoking.",
      "Add minced garlic and chili, stir-fry 30 seconds.",
      "Add ground chicken, breaking apart, cook until no longer pink.",
      "Season with soy sauce, fish sauce, and a pinch of sugar.",
      "Kill the heat, toss in a generous handful of Thai basil until just wilted.",
      "Serve over jasmine rice, topped with a crispy fried egg."
    ],
    image: "https://images.unsplash.com/photo-1569058242567-93de6f36f8e6?w=800&q=80",
    featured: false,
  },
  {
    id: "shakshuka",
    name: "Shakshuka",
    tagline: "Eggs cradled in spiced tomato.",
    description: "Eggs poached directly in a bubbling skillet of spiced, cumin-scented tomato sauce with peppers and onion. Finished with crumbled feta and torn herbs — best eaten communally, straight from the pan with crusty bread.",
    cuisine: "Middle Eastern",
    mealType: "Breakfast",
    cookingMethod: "Boiled / Simmered",
    cookTime: "30 min",
    servings: 4,
    difficulty: "Easy",
    ingredients: ["egg", "tomato", "onion", "garlic", "bell pepper", "cumin", "paprika", "chili flakes", "olive oil", "salt", "pepper", "cilantro", "feta", "bread"],
    steps: [
      "Sauté diced onion and bell pepper in olive oil until soft.",
      "Add garlic, cumin, paprika, and chili flakes — toast until fragrant.",
      "Pour in crushed tomatoes, season, and simmer 10 minutes until thickened.",
      "Create wells in the sauce and crack eggs into each.",
      "Cover and cook on low until whites are set but yolks remain runny.",
      "Finish with crumbled feta, fresh cilantro, and crusty bread."
    ],
    image: "https://images.unsplash.com/photo-1590412200988-a436970781fa?w=800&q=80",
    featured: true,
  },
  {
    id: "beef-tacos",
    name: "Carne Asada Tacos",
    tagline: "Charred beef. Warm tortillas. Nothing else needed.",
    description: "Lime-and-cumin marinated steak, grilled over high heat until deeply charred, then sliced thin against the grain. Piled into warm corn tortillas with nothing but fresh avocado, diced onion, and cilantro.",
    cuisine: "Mexican",
    mealType: "Lunch / Dinner",
    cookingMethod: "Grilled",
    cookTime: "25 min",
    servings: 4,
    difficulty: "Easy",
    ingredients: ["steak", "tortilla", "onion", "cilantro", "lime juice", "garlic", "cumin", "olive oil", "salt", "pepper", "avocado"],
    steps: [
      "Marinate steak with lime juice, garlic, cumin, oil, salt and pepper for 30 minutes.",
      "Grill over high heat 3–4 minutes per side for medium-rare.",
      "Rest 5 minutes, then slice against the grain into thin strips.",
      "Warm tortillas on the grill until lightly charred.",
      "Assemble with sliced avocado, diced onion, cilantro, and a squeeze of lime."
    ],
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&q=80",
    featured: false,
  },
  {
    id: "mushroom-risotto",
    name: "Mushroom Risotto",
    tagline: "Patience, stirred into every grain.",
    description: "Arborio rice slowly stirred with warm stock, one ladle at a time, until each grain releases its starch into a creamy, velvety sauce. Finished with deeply golden sautéed mushrooms, parmesan, and fresh thyme.",
    cuisine: "Italian",
    mealType: "Lunch / Dinner",
    cookingMethod: "Sautéed / Stir-fried",
    cookTime: "45 min",
    servings: 4,
    difficulty: "Medium",
    ingredients: ["rice", "mushroom", "onion", "garlic", "parmesan", "butter", "wine", "stock", "thyme", "olive oil", "salt", "pepper"],
    steps: [
      "Sauté sliced mushrooms in butter until deeply golden. Set aside.",
      "In the same pan, sweat diced onion and garlic in olive oil.",
      "Add arborio rice, toast 2 minutes until edges turn translucent.",
      "Deglaze with white wine, stir until absorbed.",
      "Add warm stock one ladle at a time, stirring constantly, for 18–20 minutes.",
      "Fold in mushrooms, parmesan, fresh thyme, and a knob of butter. Rest 2 minutes before serving."
    ],
    image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=800&q=80",
    featured: true,
  },
  {
    id: "pad-thai",
    name: "Pad Thai",
    tagline: "Sweet, sour, salty — the holy trinity.",
    description: "Stir-fried rice noodles tossed with shrimp, scrambled egg, and a tamarind-based sauce that balances sweet, sour, and salty in every bite. A Thai street food icon best finished with crushed peanuts and a squeeze of lime.",
    cuisine: "Thai",
    mealType: "Lunch / Dinner",
    cookingMethod: "Sautéed / Stir-fried",
    cookTime: "20 min",
    servings: 2,
    difficulty: "Medium",
    ingredients: ["noodles", "shrimp", "egg", "garlic", "fish sauce", "sugar", "lime juice", "chili flakes", "olive oil", "peas"],
    steps: [
      "Soak rice noodles in warm water until pliable, about 20 minutes.",
      "Mix fish sauce, sugar, and lime juice into a sauce.",
      "Stir-fry shrimp in hot oil until pink. Push to the side, scramble eggs in the same pan.",
      "Add drained noodles and sauce, toss until noodles are coated and slightly charred.",
      "Serve with lime wedges and crushed peanuts."
    ],
    image: "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=800&q=80",
    featured: false,
  },
  {
    id: "caesar-salad",
    name: "Classic Caesar",
    tagline: "The salad that doesn't apologize.",
    description: "Crisp romaine lettuce coated in a from-scratch emulsion of egg yolk, lemon, mustard, and Worcestershire — punchy, anchovy-forward, unapologetic. Finished with garlic croutons and generous shavings of aged parmesan.",
    cuisine: "American",
    mealType: "Salads",
    cookingMethod: "Raw / No-cook",
    cookTime: "15 min",
    servings: 2,
    difficulty: "Easy",
    ingredients: ["lettuce", "parmesan", "bread", "garlic", "egg", "lemon juice", "olive oil", "mustard", "worcestershire sauce", "salt", "pepper"],
    steps: [
      "Tear bread into rough croutons, toss with olive oil and garlic, bake at 375°F until golden.",
      "Whisk egg yolk, lemon juice, mustard, Worcestershire, and garlic into a dressing base.",
      "Slowly stream in olive oil while whisking to emulsify.",
      "Toss crisp romaine with dressing, top with croutons and shaved parmesan."
    ],
    image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800&q=80",
    featured: false,
  },
  {
    id: "butter-chicken",
    name: "Butter Chicken",
    tagline: "Velvet sauce. No shortcuts.",
    description: "Yogurt-marinated chicken thighs seared until charred, then simmered in a velvety tomato sauce enriched with butter, cream, and a backbone of warm spices. A North Indian comfort classic best served over fragrant basmati rice.",
    cuisine: "Indian",
    mealType: "Lunch / Dinner",
    cookingMethod: "Braised / Slow-cooked",
    cookTime: "50 min",
    servings: 4,
    difficulty: "Medium",
    ingredients: ["chicken thigh", "tomato", "butter", "cream", "onion", "garlic", "ginger", "cumin", "turmeric", "paprika", "cayenne", "yogurt", "salt", "rice"],
    steps: [
      "Marinate chicken in yogurt, turmeric, cumin, and salt for at least 1 hour.",
      "Sear marinated chicken in butter until charred. Set aside.",
      "In the same pan, cook onion, garlic, and ginger until golden.",
      "Add tomatoes, paprika, cayenne — simmer until sauce thickens.",
      "Blend sauce until smooth, return to pan with cream and butter.",
      "Add chicken, simmer gently 15 minutes. Serve over basmati rice."
    ],
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&q=80",
    featured: false,
  },
  {
    id: "pho",
    name: "Phở Bò",
    tagline: "A broth that takes all day — and earns it.",
    description: "A slow-simmered beef bone broth perfumed with charred onion, ginger, star anise, and cinnamon — poured boiling over rice noodles and paper-thin raw beef that cooks on contact. Served with a garden of fresh herbs.",
    cuisine: "Vietnamese",
    mealType: "Soups",
    cookingMethod: "Boiled / Simmered",
    cookTime: "3 hrs",
    servings: 6,
    difficulty: "Hard",
    ingredients: ["beef chuck", "noodles", "onion", "ginger", "star anise", "cinnamon", "fish sauce", "sugar", "salt", "basil", "lime juice", "cilantro", "bean sprouts"],
    steps: [
      "Char onion and ginger under a broiler until blackened.",
      "Simmer beef bones and chuck in water, skimming impurities, for 2–3 hours.",
      "Add charred aromatics, star anise, cinnamon, fish sauce, and sugar.",
      "Strain broth. Slice beef thin against the grain.",
      "Pour boiling broth over rice noodles and raw beef slices in bowls.",
      "Serve with fresh herbs, bean sprouts, lime, and chili."
    ],
    image: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800&q=80",
    featured: true,
  },
  {
    id: "greek-salad",
    name: "Horiatiki",
    tagline: "No lettuce. That's the point.",
    description: "A traditional Greek village salad — chunky tomatoes, cucumbers, and red onion topped with a thick slab of feta and a generous pour of olive oil. No lettuce, no fuss, just ripe produce at its peak.",
    cuisine: "Mediterranean",
    mealType: "Salads",
    cookingMethod: "Raw / No-cook",
    cookTime: "10 min",
    servings: 4,
    difficulty: "Easy",
    ingredients: ["tomato", "cucumber", "onion", "feta", "olive oil", "oregano", "salt", "pepper", "vinegar"],
    steps: [
      "Cut ripe tomatoes and cucumbers into rough, generous chunks.",
      "Thinly slice red onion into half-moons.",
      "Arrange on a platter — no tossing needed.",
      "Place a thick slab of feta on top. Drizzle generously with olive oil.",
      "Season with dried oregano, salt, pepper, and a splash of red wine vinegar."
    ],
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&q=80",
    featured: false,
  },
  {
    id: "korean-bibimbap",
    name: "Bibimbap",
    tagline: "Everything in one bowl. Mixed at the table.",
    description: "A Korean rice bowl arranged with precision — individually seasoned vegetables, savory ground beef, and a fried egg over warm rice. Served with fiery gochujang and mixed together just before eating for a harmony of textures.",
    cuisine: "Korean",
    mealType: "Lunch / Dinner",
    cookingMethod: "Sautéed / Stir-fried",
    cookTime: "40 min",
    servings: 2,
    difficulty: "Medium",
    ingredients: ["rice", "ground beef", "egg", "spinach", "carrot", "mushroom", "zucchini", "garlic", "sesame oil", "soy sauce", "hot sauce", "sugar", "salt"],
    steps: [
      "Cook rice and keep warm. Prepare each vegetable separately.",
      "Blanch spinach, squeeze dry, season with sesame oil and garlic.",
      "Sauté julienned carrot, zucchini, and mushrooms individually.",
      "Brown ground beef with soy sauce, garlic, sugar, and sesame oil.",
      "Assemble: rice base, vegetables arranged in sections, beef in center.",
      "Top with a fried egg and gochujang. Mix everything together before eating."
    ],
    image: "https://images.unsplash.com/photo-1553163147-622ab57be1c7?w=800&q=80",
    featured: false,
  },
  {
    id: "french-onion-soup",
    name: "French Onion Soup",
    tagline: "Caramelization is not a shortcut.",
    description: "Six onions, slowly caramelized over an hour until deeply golden and sweet, simmered in rich beef stock with thyme. Topped with toasted bread and broiled Gruyère until bubbling and molten.",
    cuisine: "French",
    mealType: "Soups",
    cookingMethod: "Braised / Slow-cooked",
    cookTime: "1 hr 30 min",
    servings: 4,
    difficulty: "Medium",
    ingredients: ["onion", "butter", "stock", "wine", "bread", "mozzarella", "thyme", "bay leaf", "salt", "pepper", "sugar"],
    steps: [
      "Slice 6 large onions thinly. Melt butter in a heavy pot over medium heat.",
      "Cook onions slowly for 45–60 minutes, stirring occasionally, until deeply caramelized.",
      "Deglaze with white wine, scraping fond from the bottom.",
      "Add beef stock, thyme, and bay leaf. Simmer 20 minutes.",
      "Ladle into oven-safe bowls, top with toasted bread and grated Gruyère.",
      "Broil until cheese is bubbling and golden."
    ],
    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=80",
    featured: false,
  },
  {
    id: "avocado-toast",
    name: "Avocado Toast",
    tagline: "Simple enough to be perfect.",
    description: "Thick-cut sourdough toasted until deeply crisp, topped with chunky smashed avocado, flaky salt, chili flakes, and a squeeze of fresh lemon. Optionally crowned with a soft-boiled egg for a complete breakfast.",
    cuisine: "American",
    mealType: "Breakfast",
    cookingMethod: "Raw / No-cook",
    cookTime: "5 min",
    servings: 1,
    difficulty: "Easy",
    ingredients: ["avocado", "bread", "lemon juice", "chili flakes", "salt", "pepper", "olive oil", "egg"],
    steps: [
      "Toast thick-cut sourdough until deeply golden and crisp.",
      "Halve a ripe avocado, scoop onto toast, and smash with a fork — leave it chunky.",
      "Season with flaky salt, cracked pepper, chili flakes, and a squeeze of lemon.",
      "Drizzle with your best olive oil. Optional: top with a soft-boiled egg."
    ],
    image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=800&q=80",
    featured: false,
  },
  {
    id: "carbonara",
    name: "Carbonara",
    tagline: "No cream. Never cream.",
    description: "The real Roman carbonara — crispy guanciale rendered in its own fat, tossed with hot pasta and an emulsion of egg yolks, aged Pecorino, and cracked black pepper. Silky, rich, and absolutely no cream.",
    cuisine: "Italian",
    mealType: "Lunch / Dinner",
    cookingMethod: "Sautéed / Stir-fried",
    cookTime: "25 min",
    servings: 2,
    difficulty: "Medium",
    ingredients: ["pasta", "bacon", "egg", "parmesan", "pepper", "salt"],
    steps: [
      "Cook pasta in well-salted water until al dente. Reserve 1 cup pasta water.",
      "Crisp guanciale or bacon in a cold pan, rendering fat slowly.",
      "Whisk egg yolks with finely grated Pecorino/Parmesan and black pepper.",
      "Toss hot pasta into the bacon fat, remove from heat.",
      "Pour egg mixture over pasta, tossing quickly. Add pasta water to reach silky consistency.",
      "Serve immediately with an extra crack of pepper and grated cheese."
    ],
    image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800&q=80",
    featured: false,
  },
  {
    id: "tom-yum",
    name: "Tom Yum Goong",
    tagline: "Sour, spicy, alive.",
    description: "A Thai hot-and-sour soup built on a fragrant broth of lemongrass, galangal, and kaffir lime — loaded with plump shrimp, mushrooms, and tomatoes. Every spoonful is an electric balance of sour, spicy, and herbaceous.",
    cuisine: "Thai",
    mealType: "Soups",
    cookingMethod: "Boiled / Simmered",
    cookTime: "25 min",
    servings: 4,
    difficulty: "Easy",
    ingredients: ["shrimp", "mushroom", "tomato", "lemongrass", "lime juice", "fish sauce", "chili flakes", "ginger", "cilantro", "stock", "coconut milk", "sugar"],
    steps: [
      "Bring stock to a boil with lemongrass, galangal/ginger, and kaffir lime leaves.",
      "Add mushrooms and tomatoes, simmer 5 minutes.",
      "Add shrimp, cook until pink — about 2 minutes.",
      "Season with fish sauce, lime juice, chili, and a touch of sugar.",
      "Optional: add a splash of coconut milk for the creamy version (Tom Yum Nam Khon).",
      "Finish with fresh cilantro."
    ],
    image: "https://images.unsplash.com/photo-1548943487-a2e4e43b4853?w=800&q=80",
    featured: false,
  },
  {
    id: "steak-frites",
    name: "Steak Frites",
    tagline: "The French bistro benchmark.",
    description: "A thick-cut steak seared in a scorching cast iron pan, basted with foaming butter, garlic, and thyme. Served alongside double-fried golden frites — crispy outside, fluffy within. The definitive French bistro plate.",
    cuisine: "French",
    mealType: "Lunch / Dinner",
    cookingMethod: "Fried",
    cookTime: "35 min",
    servings: 2,
    difficulty: "Medium",
    ingredients: ["steak", "potato", "butter", "garlic", "thyme", "salt", "pepper", "olive oil"],
    steps: [
      "Cut potatoes into thick frites. Soak in cold water 30 minutes, dry thoroughly.",
      "Fry at 300°F until soft, drain. Fry again at 375°F until golden and crisp.",
      "Season steak generously with salt and pepper.",
      "Sear in a ripping-hot cast iron pan with oil, 3–4 minutes per side.",
      "Add butter, garlic, and thyme. Baste steak with foaming butter.",
      "Rest 5 minutes. Serve with frites and a simple herb salad."
    ],
    image: "https://images.unsplash.com/photo-1558030006-450675393462?w=800&q=80",
    featured: false,
  },
  {
    id: "spring-rolls",
    name: "Fresh Spring Rolls",
    tagline: "Translucent. Verdant. No heat required.",
    description: "Delicate rice paper wrappers filled with poached shrimp, rice vermicelli, crisp vegetables, and fragrant herbs — rolled tightly into translucent, jewel-like parcels. Served cold with a rich peanut dipping sauce.",
    cuisine: "Vietnamese",
    mealType: "Appetizers / Small Plates",
    cookingMethod: "Raw / No-cook",
    cookTime: "30 min",
    servings: 4,
    difficulty: "Easy",
    ingredients: ["shrimp", "noodles", "lettuce", "cucumber", "carrot", "mint", "cilantro", "rice paper"],
    steps: [
      "Cook and halve shrimp lengthwise. Prepare thin rice noodles.",
      "Julienne cucumber and carrot. Prepare lettuce leaves and herb sprigs.",
      "Dip rice paper in warm water until just pliable — don't over-soak.",
      "Layer shrimp (cut-side down), then noodles, vegetables, and herbs.",
      "Fold sides in, then roll tightly from bottom to top.",
      "Serve with peanut dipping sauce or nuoc cham."
    ],
    image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&q=80",
    featured: false,
  },
  {
    id: "tiramisu",
    name: "Tiramisù",
    tagline: "Coffee-soaked. Mascarpone clouds.",
    description: "Layers of espresso-soaked ladyfingers alternating with clouds of whipped mascarpone enriched with egg yolks and sugar. Dusted with bitter cocoa powder and chilled overnight until the flavors meld into something transcendent.",
    cuisine: "Italian",
    mealType: "Dessert",
    cookingMethod: "Raw / No-cook",
    cookTime: "30 min + chill",
    servings: 6,
    difficulty: "Medium",
    ingredients: ["egg", "sugar", "cream cheese", "cream", "flour", "vanilla", "cocoa powder"],
    steps: [
      "Whisk egg yolks with sugar until pale, thick ribbons form.",
      "Fold in mascarpone (or cream cheese + cream) until smooth.",
      "Whip egg whites to stiff peaks, gently fold into mascarpone mixture.",
      "Briefly dip ladyfingers (or sponge) in strong espresso — don't soak.",
      "Layer: soaked biscuits, cream, soaked biscuits, cream.",
      "Dust generously with cocoa powder. Refrigerate at least 4 hours, ideally overnight."
    ],
    image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&q=80",
    featured: false,
  },
  {
    id: "kung-pao-chicken",
    name: "Kung Pao Chicken",
    tagline: "Numbing heat. Roasted peanuts. Controlled chaos.",
    description: "Cubed chicken stir-fried with dried chilis and Sichuan peppercorns that deliver a distinctive numbing heat, coated in a glossy sweet-sour-savory sauce. Roasted peanuts folded in at the last moment for crunch.",
    cuisine: "Chinese",
    mealType: "Lunch / Dinner",
    cookingMethod: "Sautéed / Stir-fried",
    cookTime: "20 min",
    servings: 2,
    difficulty: "Medium",
    ingredients: ["chicken breast", "garlic", "ginger", "soy sauce", "vinegar", "sugar", "chili flakes", "corn", "bell pepper", "sesame oil", "cornmeal", "rice"],
    steps: [
      "Cube chicken, toss with soy sauce, rice wine/vinegar, and cornstarch.",
      "Mix sauce: soy sauce, vinegar, sugar, sesame oil.",
      "Stir-fry dried chilis and Sichuan peppercorns in hot oil until fragrant.",
      "Add chicken, sear until golden. Add garlic, ginger, vegetables.",
      "Pour in sauce, toss until glossy and coating everything.",
      "Fold in roasted peanuts at the last second. Serve over rice."
    ],
    image: "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=800&q=80",
    featured: false,
  },
];

// Make globally accessible
window.TAXONOMY = TAXONOMY;
window.ALL_INGREDIENTS = ALL_INGREDIENTS;
window.DISHES = DISHES;
