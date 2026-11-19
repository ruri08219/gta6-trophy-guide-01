// The road to the Platinum in nine stages, built from the official descriptions:
// which story chapters and missions come first, which collectibles and counts
// follow, and what order to do them in. The wording is my own; the stage order
// follows the launch-era guides (PowerPyx, Of Zen) cited in trophies.json.
export const ROADMAP = [
  {
    stage: 1,
    title: 'Play the story — Chapters 1 to 4',
    text: 'Finish Gone Fishing, then Chapters 1–4 and the named story missions (Breakfast Run, The Cartel Heist, Child\u2019s Play, Headliners, VCIA Takedown, Operation Savage Glory) up to the final mission. While you are in Chapter 1, meditate at the first spot — Positive Mental Attitude is the list\u2019s one possibly missable trophy, and its Chapter 1 spot goes away when the chapter ends.',
    trophies: ['Just Like Paradise', 'Paradise Lost', 'T**s Ass Drug Money', 'Vice City, Baby!', 'Top Of The World, Ma', 'You Gotta Know When to Get Off', 'Trust', 'Break the Bank', 'Family Matters', 'DWNFALL', 'Hi-Jacked', 'Snow Storm', 'Positive Mental Attitude', 'Personal Best', 'Actions Speak Louder', 'Bad Luck, I Guess', 'The Truth Is Out There'],
  },
  {
    stage: 2,
    title: 'Side-character finales',
    text: 'Play the mission strands for Andy, Kenton, Billy, Randy and Tyrone through to each one\u2019s final mission, and hunt Bret\u2019s unique animal. These strands unlock as the story advances, so work them as they appear.',
    trophies: ['Road to Rehabilitation', 'This Was No Boat Accident', 'The Lone Rider', 'Supply & Demand', 'Spin On This!', 'Fair Game'],
  },
  {
    stage: 3,
    title: 'Strangers & Freaks',
    text: 'Complete 8 stranger mission strands across Leonida. Strangers show up as map icons while you explore — start a strand when you find it instead of leaving them all for the end.',
    trophies: ['Strangers & Freaks'],
  },
  {
    stage: 4,
    title: 'Explore Leonida',
    text: 'Open up the whole map: all 52 areas for The Goodtime State, WAiNK It at 100 locations, and 100 vehicles discovered. This pairs with the stranger strands — explore as you travel.',
    trophies: ['The Goodtime State', 'You WAiNKer!', 'Whip It Good'],
  },
  {
    stage: 5,
    title: 'Activities and medals',
    text: 'Sample every activity once, then chase the medals: 250 stunts, gold in all 42 Shooting Range challenges, 20 different race wins, a Top Fun drone win at every location, beating Cal at fishing, and one finished arcade game.',
    trophies: ['Master of None', 'Cunning Stunts', 'The Shootist', 'Earn Cash, Not Kudos', 'Top Fun', 'Baited My Tackle', 'Stick Fiddler'],
  },
  {
    stage: 6,
    title: 'Partner play and robberies',
    text: 'Bring your partner for the 4-star escape and the three-shop chain, then work the robbery set: 5 enemies in one Combat Focus, the unscheduled VCIA departure, the Rhino tanks, a silent jewelry store, 5 bank vaults, an armored truck, and one illegal operation per gang.',
    trophies: ['Hot Together', 'Retail Therapy', 'Gunslinger', 'Catch Me If You Can', 'Challenging Tank', 'Sneakthief', 'Maximum Withdrawal', 'A Classic Blitz Play', 'Pest Control'],
  },
  {
    stage: 7,
    title: 'Collectibles and money',
    text: 'Finish the long hunts: 3 collectible card sets, $250,000 of marked bills laundered, $100,000 spent across all shops, all 8 garage properties bought, and 10 vehicles registered to the Scooter Bros app.',
    trophies: ["Don't Touch My Deck", 'Dime on the Dollar', 'Treat Yo Self', 'Little Boxes', 'On the Spot'],
  },
  {
    stage: 8,
    title: 'One-offs and challenges',
    text: 'Clear the small moments — a cocktail on Ocean Beach, the showroom smash, a frame at the Kolt & Associates alley, a melee drive-by — and complete 50 challenges along the way.',
    trophies: ['In The Beginning…', 'Capital Offense', 'Let’s Go Bowling', 'Ten Pin', 'One Last Thing'],
  },
  {
    stage: 9,
    title: '100% and the Platinum',
    text: 'Check the in-game stats page, mop up whatever is left, and attain 100% completion for A Long Road. The Platinum, Vice Got a Price!, pops right after it.',
    trophies: ['A Long Road', 'Vice Got a Price!'],
  },
];

// Paint the nine stages into the page's ordered list, marking which of each
// stage's trophies are already earned.
export function paintRoadmap(listElement, earnedNames) {
  const earned = new Set(earnedNames);
  listElement.innerHTML = '';
  for (const step of ROADMAP) {
    const item = document.createElement('li');
    const heading = document.createElement('h3');
    heading.textContent = `Stage ${step.stage} — ${step.title}`;
    const body = document.createElement('p');
    body.textContent = step.text;
    const done = step.trophies.filter((name) => earned.has(name)).length;
    const count = document.createElement('p');
    count.className = 'stage-count';
    count.textContent = `${done} of ${step.trophies.length} earned in this stage`;
    const names = document.createElement('p');
    names.className = 'stage-trophies';
    names.textContent = step.trophies.join(' · ');
    item.append(heading, body, count, names);
    listElement.append(item);
  }
}
