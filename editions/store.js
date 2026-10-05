/* Play Store edition — replaces the EDITION block in index.html (see scripts/build-web.js).
   No personal names; longer zones and a tougher difficulty curve. */
var EDITION = {
  store: true,
  dedication: "",
  endTitle: "🏆 Ocean Master",
  endNote: "You dove all the way from the sunlit shallows to the midnight deep.",
  twinsToast: "Seahorse sisters Mochi & Boba cast a bubble shield around you — the next sting is blocked! They wave and swim away. 👋",
  chestToast: "A sunken treasure chest — +5 snacks and a boost deeper!",
  chestBadge: "Find the sunken treasure chest",
  lengths: [["Standard · 15",15],["Long · 25",25],["Epic · 40",40]],
  defaultLength: 25,
  jellyCaps: [2,2,3,3,3,4,4,4,5,5],
  jellyGap: 2600,
  snakeGap: 9000,
  fishSpeed: 1.2,
  loseProgressOnRest: true,
};
