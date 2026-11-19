// The roadmap to the Platinum, in nine stages, built from the official descriptions:
// which story chapters and missions, which collectibles and counts, in what order.
// Step order follows PowerPyx's three-step roadmap and the Of Zen nine-step order;
// the wording here is our own.
export const ROADMAP_STAGES = [
  {
    title: 'Play the story — Chapters 1 to 5',
    text: 'Finish the campaign first. That earns all five chapter trophies, the named-mission trophies and the five vague story trophies on its own. Do the Chapter 1 meditation for Positive Mental Attitude while you are here — it may be the only missable trophy in the game.',
  },
  {
    title: 'Side-character finales',
    text: 'Complete the final missions for Andy, Kenton, Billy, Randy and Tyrone, plus Bret’s unique animal hunt. Their strands unlock as the story advances — play their missions whenever they appear.',
  },
  {
    title: 'Strangers & Freaks — 8 strands',
    text: 'Finish eight full stranger mission strands across Leonida for the silver. Start a strand when it appears on the map; optional missions can disappear after a while.',
  },
  {
    title: 'Explore Leonida',
    text: 'Reveal all 52 areas, WAiNK It at 100 locations, discover 100 vehicles and meditate at the remaining spots. Scan vehicles and animals as you travel — this stage is mostly done by the time you finish the story if you explored along the way.',
  },
  {
    title: 'Races, stunts and the shooting range',
    text: 'Win 20 different races, win a Top Fun drone race at all 14 venues, land 250 stunts, gold all 42 Shooting Range challenges, try every activity type once, beat Cal at fishing and finish an arcade game.',
  },
  {
    title: 'Robberies and wanted-level play',
    text: 'Rob 5 bank vaults, an armored truck, a jewelry store undetected and one illegal operation per gang (9 gangs). With your partner: lose a 4-star wanted level together and rob 3 shops back-to-back without losing the heat. Take down 5 enemies in one Combat Focus.',
  },
  {
    title: 'Collectibles and money',
    text: 'Complete 3 collectible card sets, buy all 8 garage properties, register 10 vehicles in the Scooter Bros app, launder $250,000 in Marked Bills and spend $100,000 across all shops. The robberies from stage 6 fund most of this.',
  },
  {
    title: 'Challenges and one-off moments',
    text: 'Complete 50 challenges (the 100% checklist needs about 70 of 80), then mop up the one-offs: the Ocean Beach cocktail, the showroom smash, bowling at Kolt & Associates and the melee drive-by.',
  },
  {
    title: '100% completion — then the Platinum',
    text: 'Finish the in-game 100% checklist for A Long Road (gold). It is roughly 60% of true completion, per PowerPyx, and most of it is already done by now. The moment it pops, Vice Got a Price! — the Platinum — follows.',
  },
];

// Render the roadmap stages into the ordered list, with a chip per trophy in each stage.
export function renderRoadmap(listElement, trophies, earned, onJump) {
  listElement.replaceChildren();
  for (const stage of ROADMAP_STAGES) {
    const stageNumber = ROADMAP_STAGES.indexOf(stage) + 1;
    const members = trophies.filter((trophy) => trophy.stage === stageNumber);
    const item = document.createElement('li');
    const heading = document.createElement('h3');
    heading.textContent = stage.title;
    const text = document.createElement('p');
    text.textContent = stage.text;
    const chips = document.createElement('div');
    chips.className = 'stage-trophies';
    for (const trophy of members) {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'chip' + (earned.has(trophy.name) ? ' earned' : '');
      chip.textContent = (earned.has(trophy.name) ? '✓ ' : '') + trophy.name + ' · ' + trophy.grade;
      chip.addEventListener('click', () => onJump(trophy.name));
      chips.append(chip);
    }
    item.append(heading, text, chips);
    listElement.append(item);
  }
}
