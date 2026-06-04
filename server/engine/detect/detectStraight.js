const { sortCards } = require("../../core/sort");

function detectStraight(cards) {
    if (cards.length < 3) return null;

    const normalSorted = sortCards(cards);

    let isNormal = true;
    for (let i = 0; i < normalSorted.length - 1; i++) {
        if (normalSorted[i + 1].rankValue !== normalSorted[i].rankValue + 1) {
            isNormal = false;
            break;
        }
    }

    const containsTwo = cards.some((c) => c.rankValue === 14);

    if (isNormal) {
        if (containsTwo) {
            isNormal = false;
        } else {
            return {
                type: "STRAIGHT",
                rank: normalSorted[normalSorted.length - 1].rankValue,
                suit: normalSorted[normalSorted.length - 1].suitValue,
                size: cards.length,
                containsTwo,
                sortedCards: normalSorted,
            };
        }
    }

    const getAlowRank = (rv) => {
        if (rv === 13) return 1;
        if (rv === 14) return 2;
        return rv + 1;
    };

    const aLowSorted = [...cards].sort(
        (a, b) => getAlowRank(a.rankValue) - getAlowRank(b.rankValue),
    );

    let isAlow = true;
    for (let i = 0; i < aLowSorted.length - 1; i++) {
        if (
            getAlowRank(aLowSorted[i + 1].rankValue) !==
            getAlowRank(aLowSorted[i].rankValue) + 1
        ) {
            isAlow = false;
            break;
        }
    }

    if (isAlow) {
        const highestALowCard = aLowSorted[aLowSorted.length - 1];
        return {
            type: "STRAIGHT",
            rank: highestALowCard.rankValue,
            suit: highestALowCard.suitValue,
            size: cards.length,
            containsTwo,
            sortedCards: aLowSorted,
        };
    }

    return null;
}

module.exports = detectStraight;
