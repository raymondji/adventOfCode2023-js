import { readFileSync } from 'fs';

export {
  pt1,
  pt2,
}

type Hand = {
  cards: string;
  bid: number;
}

function pt1() {
  const data = readFileSync('inputs/day7.txt', 'utf8');
  const hands: Hand[] = data.split("\n").map(l => {
    const [cards, bid] = l.split(" ");
    return {
      cards: cards,
      bid: parseInt(bid),
    };
  });
  hands.sort((a, b) => {
    const aType = getHandType(a);
    const bType = getHandType(b);
    if (aType != bType) {
      return aType - bType;
    }
    for (let i = 0; i < 5; i++) {
      const aVal = getCardValue(a.cards[i]);
      const bVal = getCardValue(b.cards[i]);
      if (aVal != bVal) {
        return aVal - bVal;
      }
    }
    console.error(`a and b are the same hand: ${a}, ${b}`);
    return 0;
  });

  let winnings = 0;
  for (let i = 0; i < hands.length; i++) {
    const rank = i + 1;
    console.log(`Hand: ${hands[i].cards}, rank: ${rank}`);
    winnings += rank * hands[i].bid;
  }
  console.log(winnings);
}

// higher is better
const fiveOfAKind = ["fiveOfAKind", 6];
const fourOfAKind = ["fourOfAKind", 5];
const fullHouse = ["fullHouse", 4];
const threeOfAKind = ["threeOfAKind", 3];
const twoPair = ["twoPair", 2];
const onePair = ["onePair", 1];
const highCard = ["highCard", 0];
function getHandType(hand: Hand): [string, number] {
  const cards = hand.cards.split("").sort();
  let matches = [1];
  let matchIndex = 0;
  for (let i = 1; i < 5; ++i) {
    if (cards[i] === cards[i - 1]) {
      matches[matchIndex]++;
    } else {
      matches.push(1);
      matchIndex++;
    }
  }
  const topMatches = matches.sort((a, b) => b - a).slice(0, 2);
  console.log(`got matches: ${matches}, top: ${topMatches}, cards: ${cards}`);
  if (topMatches[0] === 5) {
    return fiveOfAKind;
  } else if (topMatches[0] === 4) {
    return fourOfAKind;
  } else if (topMatches[0] === 3 && topMatches[1] === 2) {
    return fullHouse;
  } else if (topMatches[0] === 3) {
    return threeOfAKind;
  } else if (topMatches[0] === 2 && topMatches[1] === 2) {
    return twoPair;
  } else if (topMatches[0] === 2) {
    return onePair;
  } else {
    return highCard;
  }
}

function getHandTypePt2(hand: Hand): [string, number] {
  const cards = hand.cards.split("").filter(c => c !== "J").sort();
  const numJ = 5 - cards.length;

  let matches = [0];
  let matchIndex = 0;
  for (let i = 0; i < cards.length; ++i) {
    if (i === 0) {
      matches[i]++;
    } else if (cards[i] === cards[i - 1]) {
      matches[matchIndex]++;
    } else {
      matches.push(1);
      matchIndex++;
    }
  }
  const topMatches = matches.sort((a, b) => b - a).slice(0, 2);
  topMatches[0] += numJ;
  console.log(`got matches: ${matches}, top: ${topMatches}, cards: ${cards}`);
  if (topMatches[0] === 5) {
    return fiveOfAKind;
  } else if (topMatches[0] === 4) {
    return fourOfAKind;
  } else if (topMatches[0] === 3 && topMatches[1] === 2) {
    return fullHouse;
  } else if (topMatches[0] === 3) {
    return threeOfAKind;
  } else if (topMatches[0] === 2 && topMatches[1] === 2) {
    return twoPair;
  } else if (topMatches[0] === 2) {
    return onePair;
  } else {
    return highCard;
  }
}

function getCardValue(c: string, pt2 = false): number {
  switch (c) {
    case "A":
      return 14;
    case "K":
      return 13;
    case "Q":
      return 12;
    case "J":
      if (pt2) {
        return 1;
      } else {
        return 11;
      }
    case "T":
      return 10;
    default:
      return parseInt(c);
  }
}

const DEBUG = false;
function pt2() {
  const data = readFileSync('inputs/day7.txt', 'utf8');
  const hands: Hand[] = data.split("\n").map(l => {
    const [cards, bid] = l.split(" ");
    return {
      cards: cards,
      bid: parseInt(bid),
    };
  });

  if (DEBUG) {
    for (const hand of hands.slice(0, 50)) {
      const t = getHandTypePt2(hand);
      console.log(`hand: ${hand.cards}, type: ${t[0]}`);
    }
    return;
  }

  hands.sort((a, b) => {
    const aType = getHandTypePt2(a)[1];
    const bType = getHandTypePt2(b)[1];
    if (aType != bType) {
      return aType - bType;
    }
    for (let i = 0; i < 5; i++) {
      const aVal = getCardValue(a.cards[i], true);
      const bVal = getCardValue(b.cards[i], true);
      if (aVal != bVal) {
        return aVal - bVal;
      }
    }
    console.error(`a and b are the same hand: ${a}, ${b}`);
    return 0;
  });

  let winnings = 0;
  for (let i = 0; i < hands.length; i++) {
    const rank = i + 1;
    console.log(`Hand: ${hands[i].cards}, rank: ${rank}`);
    winnings += rank * hands[i].bid;
  }
  console.log(winnings);
}