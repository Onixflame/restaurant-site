import type { MenuItem } from '../types/domain';

export const MENU_DEFAULTS: MenuItem[] = [
  {
    "id": 1,
    "name": "Smoked Oyster",
    "category": "Snacks",
    "price": 12,
    "desc": "Gillardeau oyster, smoked cream, apple vinegar and chive oil.",
    "ingredients": [
      "oyster",
      "smoked cream",
      "apple",
      "chive"
    ],
    "tags": [
      "shellfish"
    ],
    "featured": true,
    "img": "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=1600&q=88"
  },
  {
    "id": 2,
    "name": "Buckwheat Tart",
    "category": "Snacks",
    "price": 11,
    "desc": "Buckwheat tartlet, whipped goat cheese, preserved lemon and dill.",
    "ingredients": [
      "buckwheat",
      "goat cheese",
      "lemon",
      "dill"
    ],
    "tags": [
      "vegetarian"
    ],
    "featured": false,
    "img": "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1600&q=88"
  },
  {
    "id": 3,
    "name": "Potato & Caviar",
    "category": "Snacks",
    "price": 18,
    "desc": "Crisp potato, cultured cream, trout roe and chive.",
    "ingredients": [
      "potato",
      "cultured cream",
      "roe",
      "chive"
    ],
    "tags": [
      "fish"
    ],
    "featured": true,
    "img": "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1600&q=88"
  },
  {
    "id": 4,
    "name": "Beetroot & Blackcurrant",
    "category": "Raw",
    "price": 22,
    "desc": "Salt-baked beetroot, blackcurrant, horseradish and smoked crème fraîche.",
    "ingredients": [
      "beetroot",
      "blackcurrant",
      "horseradish",
      "smoked cream"
    ],
    "tags": [
      "vegetarian"
    ],
    "featured": false,
    "img": "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1600&q=88"
  },
  {
    "id": 5,
    "name": "Venison Tartare",
    "category": "Raw",
    "price": 29,
    "desc": "Hand-cut venison, black garlic, juniper, pickled mustard seed and rye.",
    "ingredients": [
      "venison",
      "black garlic",
      "juniper",
      "mustard"
    ],
    "tags": [
      "meat"
    ],
    "featured": true,
    "img": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1600&q=88"
  },
  {
    "id": 6,
    "name": "Hand-dived Scallop",
    "category": "Sea",
    "price": 36,
    "desc": "Hand-dived scallop, brown butter, caviar, charred leek and sea herbs.",
    "ingredients": [
      "scallop",
      "caviar",
      "leek",
      "brown butter"
    ],
    "tags": [
      "shellfish"
    ],
    "featured": true,
    "img": "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1600&q=88"
  },
  {
    "id": 7,
    "name": "Trout & Sorrel",
    "category": "Sea",
    "price": 34,
    "desc": "River trout, sorrel, smoked roe, potato and preserved lemon.",
    "ingredients": [
      "trout",
      "sorrel",
      "roe",
      "potato"
    ],
    "tags": [
      "fish"
    ],
    "featured": true,
    "img": "https://images.unsplash.com/photo-1534766555764-ce878a5e3a2b?auto=format&fit=crop&w=1600&q=88"
  },
  {
    "id": 8,
    "name": "Langoustine",
    "category": "Sea",
    "price": 41,
    "desc": "Roasted langoustine, shellfish butter, tomato water, fennel and basil.",
    "ingredients": [
      "langoustine",
      "tomato",
      "fennel",
      "basil"
    ],
    "tags": [
      "shellfish"
    ],
    "featured": false,
    "img": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1600&q=88"
  },
  {
    "id": 9,
    "name": "Zander",
    "category": "Sea",
    "price": 39,
    "desc": "Zander, confit leek, mussel velouté, dill and charred lemon.",
    "ingredients": [
      "zander",
      "leek",
      "mussel",
      "dill"
    ],
    "tags": [
      "fish"
    ],
    "featured": false,
    "img": "https://images.unsplash.com/photo-1466637574441-749b8f19452f?auto=format&fit=crop&w=1600&q=88"
  },
  {
    "id": 10,
    "name": "Charred Cabbage",
    "category": "From the Garden",
    "price": 27,
    "desc": "Hispi cabbage, hazelnut miso, pear, burnt onion broth and chive.",
    "ingredients": [
      "cabbage",
      "hazelnut",
      "pear",
      "onion"
    ],
    "tags": [
      "vegetarian"
    ],
    "featured": true,
    "img": "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1600&q=88"
  },
  {
    "id": 11,
    "name": "Celeriac Ember",
    "category": "From the Garden",
    "price": 28,
    "desc": "Coal-roasted celeriac, fermented mushroom, apple and brown butter.",
    "ingredients": [
      "celeriac",
      "mushroom",
      "apple",
      "brown butter"
    ],
    "tags": [
      "vegetarian"
    ],
    "featured": false,
    "img": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1600&q=88"
  },
  {
    "id": 12,
    "name": "Pumpkin & Sage",
    "category": "From the Garden",
    "price": 26,
    "desc": "Wood-roasted pumpkin, sage, smoked ricotta and toasted seed praline.",
    "ingredients": [
      "pumpkin",
      "sage",
      "ricotta",
      "pumpkin seeds"
    ],
    "tags": [
      "vegetarian"
    ],
    "featured": false,
    "img": "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=1600&q=88"
  },
  {
    "id": 13,
    "name": "Ember Duck",
    "category": "Fire",
    "price": 42,
    "desc": "Aged duck, black plum, juniper and a lightly smoked jus. Finished over oak.",
    "ingredients": [
      "duck",
      "black plum",
      "juniper",
      "oak smoke"
    ],
    "tags": [
      "signature"
    ],
    "featured": true,
    "dishOfDay": true,
    "img": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1600&q=90"
  },
  {
    "id": 14,
    "name": "Dry-aged Beef",
    "category": "Fire",
    "price": 58,
    "desc": "Thirty-day beef, bone marrow, cep, fermented pepper and roasted shallot.",
    "ingredients": [
      "beef",
      "bone marrow",
      "cep",
      "shallot"
    ],
    "tags": [
      "signature"
    ],
    "featured": true,
    "img": "https://images.unsplash.com/photo-1546241072-48010ad2862c?auto=format&fit=crop&w=1600&q=88"
  },
  {
    "id": 15,
    "name": "Pork Collar",
    "category": "Fire",
    "price": 38,
    "desc": "Iberico pork collar, burnt apple, mustard greens and cider glaze.",
    "ingredients": [
      "pork",
      "apple",
      "mustard greens",
      "cider"
    ],
    "tags": [
      "meat"
    ],
    "featured": false,
    "img": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1600&q=88"
  },
  {
    "id": 16,
    "name": "Lamb & Nettle",
    "category": "Fire",
    "price": 46,
    "desc": "Lamb saddle, nettle purée, smoked yoghurt, garlic and spring onion.",
    "ingredients": [
      "lamb",
      "nettle",
      "yoghurt",
      "garlic"
    ],
    "tags": [
      "meat"
    ],
    "featured": true,
    "img": "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1600&q=88"
  },
  {
    "id": 17,
    "name": "Coal-roasted Potatoes",
    "category": "Sides",
    "price": 12,
    "desc": "New potatoes, rosemary salt and cultured butter.",
    "ingredients": [
      "potato",
      "rosemary",
      "butter"
    ],
    "tags": [
      "vegetarian"
    ],
    "featured": false,
    "img": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1600&q=88"
  },
  {
    "id": 18,
    "name": "Bitter Leaves",
    "category": "Sides",
    "price": 11,
    "desc": "Chicory, pear, walnut, sherry vinegar and aged cheese.",
    "ingredients": [
      "chicory",
      "pear",
      "walnut",
      "cheese"
    ],
    "tags": [
      "vegetarian"
    ],
    "featured": false,
    "img": "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1600&q=88"
  },
  {
    "id": 19,
    "name": "Brown Butter Bread",
    "category": "Sides",
    "price": 9,
    "desc": "Warm sourdough, cultured brown butter and smoked salt.",
    "ingredients": [
      "sourdough",
      "butter",
      "salt"
    ],
    "tags": [
      "vegetarian"
    ],
    "featured": false,
    "img": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1600&q=88"
  },
  {
    "id": 20,
    "name": "Dark Chocolate",
    "category": "Desserts & Cheese",
    "price": 19,
    "desc": "72% chocolate, blackberry, toasted rye, whey caramel and sea salt.",
    "ingredients": [
      "chocolate",
      "blackberry",
      "rye",
      "caramel"
    ],
    "tags": [
      "dessert"
    ],
    "featured": true,
    "img": "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=1600&q=88"
  },
  {
    "id": 21,
    "name": "Pear & Woodruff",
    "category": "Desserts & Cheese",
    "price": 18,
    "desc": "Poached pear, sweet woodruff, crème fraîche and almond.",
    "ingredients": [
      "pear",
      "woodruff",
      "cream",
      "almond"
    ],
    "tags": [
      "dessert"
    ],
    "featured": true,
    "img": "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?auto=format&fit=crop&w=1600&q=88"
  },
  {
    "id": 22,
    "name": "Malted Milk",
    "category": "Desserts & Cheese",
    "price": 17,
    "desc": "Malted milk ice cream, burnt honey, cocoa nibs and warm brioche.",
    "ingredients": [
      "malted milk",
      "honey",
      "cocoa",
      "brioche"
    ],
    "tags": [
      "dessert"
    ],
    "featured": false,
    "img": "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1600&q=88"
  },
  {
    "id": 23,
    "name": "Czech Cheese",
    "category": "Desserts & Cheese",
    "price": 21,
    "desc": "Three local cheeses, quince, walnut bread and wildflower honey.",
    "ingredients": [
      "cheese",
      "quince",
      "walnut",
      "honey"
    ],
    "tags": [
      "cheese"
    ],
    "featured": false,
    "img": "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=1600&q=88"
  },
  {
    "id": 24,
    "name": "Smoked Martini",
    "category": "Bar",
    "price": 17,
    "desc": "Dry gin, fino sherry, smoked olive brine and lemon oil.",
    "ingredients": [
      "gin",
      "sherry",
      "olive",
      "lemon"
    ],
    "tags": [
      "cocktail"
    ],
    "featured": true,
    "img": "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=1600&q=88"
  },
  {
    "id": 25,
    "name": "Black Orchard",
    "category": "Bar",
    "price": 16,
    "desc": "Calvados, black tea, plum, verjus and toasted spice.",
    "ingredients": [
      "calvados",
      "black tea",
      "plum",
      "verjus"
    ],
    "tags": [
      "cocktail"
    ],
    "featured": false,
    "img": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=1600&q=88"
  },
  {
    "id": 26,
    "name": "Zero Proof No. 4",
    "category": "Bar",
    "price": 12,
    "desc": "Roasted apple, lapsang, verjus, juniper and soda.",
    "ingredients": [
      "apple",
      "tea",
      "verjus",
      "juniper"
    ],
    "tags": [
      "zero proof"
    ],
    "featured": false,
    "img": "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=1600&q=88"
  },
  {
    "id": 27,
    "name": "Glass of Moravia",
    "category": "Bar",
    "price": 14,
    "desc": "Rotating Czech white or orange wine selected by the cellar team.",
    "ingredients": [
      "wine"
    ],
    "tags": [
      "wine"
    ],
    "featured": false,
    "img": "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1600&q=88"
  },
  {
    "id": 28,
    "name": "Late-night Toast",
    "category": "Bar",
    "price": 15,
    "desc": "Grilled sourdough, smoked cheese, onion jam and mustard.",
    "ingredients": [
      "sourdough",
      "smoked cheese",
      "onion",
      "mustard"
    ],
    "tags": [
      "bar food"
    ],
    "featured": false,
    "img": "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=1600&q=88"
  }  ,
  {
    "id": 29,
    "name": "Sea Bream Crudo",
    "category": "Raw",
    "price": 31,
    "desc": "Sea bream, green strawberry, elderflower, cucumber and verbena oil.",
    "ingredients": ["sea bream", "strawberry", "cucumber", "verbena"],
    "tags": ["fish"],
    "featured": true,
    "img": "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=1600&q=88"
  },
  {
    "id": 30,
    "name": "Tomato & Lovage",
    "category": "From the Garden",
    "price": 25,
    "desc": "Heritage tomato, lovage, smoked almond, tomato consommé and basil seed.",
    "ingredients": ["tomato", "lovage", "almond", "basil"],
    "tags": ["vegetarian"],
    "featured": false,
    "img": "https://images.unsplash.com/photo-1565299507177-b0ac66763828?auto=format&fit=crop&w=1600&q=88"
  },
  {
    "id": 31,
    "name": "Monkfish & Saffron",
    "category": "Sea",
    "price": 44,
    "desc": "Roasted monkfish, saffron mussel broth, fennel pollen and confit tomato.",
    "ingredients": ["monkfish", "mussel", "saffron", "fennel"],
    "tags": ["fish"],
    "featured": true,
    "img": "https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=1600&q=88"
  },
  {
    "id": 32,
    "name": "Veal & Morel",
    "category": "Fire",
    "price": 49,
    "desc": "Milk-fed veal, morel, young garlic, roasted onion and madeira jus.",
    "ingredients": ["veal", "morel", "garlic", "madeira"],
    "tags": ["meat"],
    "featured": false,
    "img": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1600&q=88"
  },
  {
    "id": 33,
    "name": "Strawberry & Elderflower",
    "category": "Desserts & Cheese",
    "price": 18,
    "desc": "Wild strawberry, elderflower cream, lemon verbena and crisp meringue.",
    "ingredients": ["strawberry", "elderflower", "verbena", "meringue"],
    "tags": ["dessert"],
    "featured": true,
    "img": "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=1600&q=88"
  },
  {
    "id": 34,
    "name": "Apricot & Chamomile",
    "category": "Desserts & Cheese",
    "price": 17,
    "desc": "Roasted apricot, chamomile custard, almond praline and cultured cream.",
    "ingredients": ["apricot", "chamomile", "almond", "cream"],
    "tags": ["dessert"],
    "featured": false,
    "img": "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=1600&q=88"
  },
  {
    "id": 35,
    "name": "Golden Hour",
    "category": "Bar",
    "price": 16,
    "desc": "Slivovice, apricot, chamomile, sparkling wine and a saline finish.",
    "ingredients": ["slivovice", "apricot", "chamomile", "sparkling wine"],
    "tags": ["cocktail"],
    "featured": true,
    "img": "https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&w=1600&q=88"
  },
  {
    "id": 36,
    "name": "Garden Tonic",
    "category": "Bar",
    "price": 11,
    "desc": "Cucumber, spruce tip, verjus, lemon thyme and house tonic.",
    "ingredients": ["cucumber", "spruce", "verjus", "thyme"],
    "tags": ["zero proof"],
    "featured": false,
    "img": "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=1600&q=88"
  }
] as MenuItem[];
