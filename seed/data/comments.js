// Fragment pools for generating realistic buyer reviews.
//
// The DevMarket catalog is electronics/tech (smartphones, laptops, headphones,
// monitors, …), so the comment themes are adapted to that catalog rather than to
// food: build/quality, performance, packaging, delivery speed, accuracy to the
// description, value for money and overall impression.
//
// Fragments are grouped by sentiment so they can be paired with a matching rating:
//   rating 5 / 4  -> POSITIVE
//   rating 3      -> NEUTRAL
//   rating 2 / 1  -> NEGATIVE
//
// helpers.buildComment() composes opener + detail (+ optional closer), which yields
// thousands of unique combinations so no two seeded reviews read the same.

const POSITIVE = {
    openers: [
        "Absolutely love it.",
        "Really happy with this purchase.",
        "Exceeded my expectations.",
        "Couldn't be happier.",
        "Fantastic product overall.",
        "Genuinely impressed.",
        "Worth every penny.",
        "Solid buy, no regrets.",
        "This one is a keeper.",
        "Highly recommend it.",
        "Better than I hoped for.",
        "Top-notch from start to finish."
    ],
    details: [
        "The build quality feels premium and nothing creaks or flexes.",
        "Performance is fast and smooth even under heavy use.",
        "It arrived a day earlier than the estimated delivery date.",
        "Packaging was secure and everything was protected nicely.",
        "Matches the description and photos exactly — no surprises.",
        "Battery life easily lasts me a full day of work.",
        "Setup was painless and it worked right out of the box.",
        "The materials feel durable and well put together.",
        "Great value for the price compared to similar models.",
        "The display is crisp and the colors look excellent.",
        "Sound quality is rich and clear at every volume.",
        "It runs quiet and stays cool even after hours of use.",
        "Shipping was quick and the courier was careful with the box.",
        "Exactly what was advertised, down to the smallest spec.",
        "Feels much more expensive than what I actually paid."
    ],
    closers: [
        "Would buy from this seller again.",
        "Definitely recommend to anyone on the fence.",
        "Five stars well deserved.",
        "Doing exactly what I needed it to do.",
        "Very satisfied customer here.",
        "No complaints at all."
    ]
};

const NEUTRAL = {
    openers: [
        "It's okay, does the job.",
        "Decent, but nothing special.",
        "Mixed feelings about this one.",
        "Pretty average overall.",
        "Fine for the price.",
        "Not bad, not amazing.",
        "Reasonable purchase, with caveats.",
        "Gets the job done, mostly."
    ],
    details: [
        "Build quality is fine but feels a bit plasticky in places.",
        "Performance is adequate for everyday tasks, nothing more.",
        "Delivery took a little longer than I expected.",
        "Packaging was basic — it survived, but only just.",
        "Mostly matches the description, though one spec was off.",
        "Battery life is acceptable but drains faster than advertised.",
        "Works as intended once you get past the clunky setup.",
        "It's functional, but the design could be more thoughtful.",
        "The price is fair, though you can find better deals around.",
        "Display is decent but not as bright as I hoped.",
        "Sound is okay for casual listening, lacks a bit of depth.",
        "Does what it says, just without any wow factor."
    ],
    closers: [
        "Would consider other options next time.",
        "Good enough for now.",
        "Three stars feels right.",
        "Neither thrilled nor disappointed.",
        "Might suit someone with simpler needs."
    ]
};

const NEGATIVE = {
    openers: [
        "Disappointed with this one.",
        "Not what I expected.",
        "Wouldn't buy again.",
        "Regret this purchase.",
        "Expected much better.",
        "Honestly let down.",
        "Save your money.",
        "Frustrating experience overall."
    ],
    details: [
        "The build feels cheap and started showing wear almost immediately.",
        "Performance is sluggish and it struggles with basic tasks.",
        "Delivery was delayed by several days with no update.",
        "Packaging was flimsy and the box arrived dented.",
        "It does not match the description — a few specs were wrong.",
        "Battery barely lasts a couple of hours before needing a charge.",
        "Setup was a nightmare and the manual was useless.",
        "It stopped working properly after just a few days.",
        "Overpriced for what you actually get.",
        "The display has uneven backlighting that bothers me.",
        "Sound is tinny and distorts at higher volumes.",
        "It runs hot and the fan noise is hard to ignore."
    ],
    closers: [
        "Looking into a return.",
        "Cannot recommend it, unfortunately.",
        "Hoping the seller improves on this.",
        "Two stars is generous.",
        "Expected far more for the money."
    ]
};

module.exports = { POSITIVE, NEUTRAL, NEGATIVE };
