/** Scope supplied in the combined brief. Explanatory copy introduces no results or customer claims. */
export const industryPages: Record<string, {
  title: string; description: string; opening: string; areas: { title: string; text: string }[];
  deliverables: string[]; applications: string[];
}> = {
  'dairy-alternatives-toppings-creams': {
    title: 'Dairy alternatives, toppings and creams',
    description: 'Ingredient system design (fats, proteins, emulsifiers and stabilisers), from bench trials to plant scale.',
    opening: 'A cream has to do more than taste good. It must whip, hold its shape, survive distribution and perform in the customer’s kitchen. We connect the fat blend, proteins, emulsifiers and stabilisers with the process and the finished application.',
    applications: ['Whipped toppings', 'Non-dairy creamers', 'Cooking creams', 'Ice cream fats', 'Cheese analogues'],
    areas: [
      { title: 'Ingredient systems: fats, proteins, emulsifiers and stabilisers', text: 'Design the ingredient system together, around the texture, melting profile and functionality required in the finished food.' },
      { title: 'Overrun and foam stability', text: 'Work through whipping behaviour, air incorporation and foam stability. Test how the product holds its volume and shape under its intended use conditions.' },
      { title: 'Freeze-thaw and piping performance', text: 'Evaluate the topping through freezing, thawing, storage and piping, so the bench result is tested against the conditions the customer actually sees.' },
      { title: 'Homogenisation, UHT and aeration', text: 'Connect the formulation with homogenisation, thermal treatment and aeration. Plan trials and scale-up around the equipment and operating conditions of the plant.' },
      { title: 'Cost-in-use', text: 'Assess the whole application: ingredient choice, dose, overrun, waste and process performance, alongside the eating experience.' },
    ],
    deliverables: ['Application and performance brief', 'Fat blend and emulsifier trial plan', 'Bench and pilot evaluation plan', 'Plant scale-up and operating recommendations', 'Cost-in-use review'],
  },
  'food-beverage-products': {
    title: 'Food and beverage products',
    description: 'Sauces and dressings, ready meals, snacks, beverages, Indian sweets and namkeen. From the right ingredient system to consistent performance in the finished product.',
    opening: 'From the crunch of a snack to the texture of a sauce, the ingredients and the process shape how food cooks, keeps and tastes. We work on the ingredient system and the finished product together, from formulation to the production line.',
    applications: ['Snacks and fried foods', 'Sauces and dressings', 'Ready meals', 'Beverages', 'Indian sweets and namkeen'],
    areas: [
      { title: 'Snacks and fried foods', text: 'Review the ingredients, the process and the finished snack together: frying performance, consistency, shelf life and cost-in-use.' },
      { title: 'Sauces, dressings and emulsions', text: 'Develop the emulsion (oil phase, emulsifiers and stabilisers) around the texture and stability the product needs, then evaluate it on the intended process.' },
      { title: 'Ready meals and prepared foods', text: 'Connect formulation with processing, storage and preparation. Evaluate how the ingredient system behaves in the finished dish and through its shelf life.' },
      { title: 'Beverages', text: 'Creamers, dairy-alternative drinks and ready-to-drink formats: emulsion stability, mouthfeel and shelf life.' },
      { title: 'Indian sweets and namkeen', text: 'Work through the role of each ingredient (fat, sugar, milk solids, flours) in texture, mouthfeel and cooking performance. Assess alternatives against the application, rather than ingredient price alone.' },
      { title: 'Reformulation and scale-up', text: 'Translate the product brief into trials, process recommendations and a cost-in-use review, with attention to consistent performance at plant scale.' },
    ],
    deliverables: ['Product and application brief', 'Formulation and prototype plan', 'Stability and application trial plan', 'Plant process and scale-up recommendations', 'Cost-in-use review'],
  },
};
