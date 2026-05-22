import { RISK_WORDS_ID, RISK_WORD_WEIGHTS } from '../constants/riskWords';

export function getHighlightedSegments(text, riskWords = []) {
  if (!text) return [];

  // Map words to categories
  const wordCategoryMap = {};
  for (const [category, words] of Object.entries(RISK_WORDS_ID)) {
    for (const word of words) {
      wordCategoryMap[word.toLowerCase()] = category;
    }
  }

  // Find all matches
  const matches = [];
  const wordsToHighlight = riskWords.length > 0 ? riskWords : Object.keys(wordCategoryMap);

  for (const word of wordsToHighlight) {
    const regex = new RegExp(`\\b(${word})\\b`, 'gi');
    let match;
    while ((match = regex.exec(text)) !== null) {
      matches.push({
        start: match.index,
        end: match.index + match[0].length,
        text: match[0],
        category: wordCategoryMap[word.toLowerCase()] || 'LAINNYA',
        weight: RISK_WORD_WEIGHTS[word.toLowerCase()] || 1
      });
    }
  }

  // Sort matches by start index, then by length (longest first)
  matches.sort((a, b) => {
    if (a.start !== b.start) return a.start - b.start;
    return b.end - a.end;
  });

  // Merge overlapping matches (keep the longest one)
  const mergedMatches = [];
  for (const match of matches) {
    if (mergedMatches.length === 0) {
      mergedMatches.push(match);
    } else {
      const lastMatch = mergedMatches[mergedMatches.length - 1];
      if (match.start < lastMatch.end) {
        // Overlapping
        if (match.end > lastMatch.end) {
          // If the new one extends further, we could merge, but for simplicity, we just keep the first one
          // as it started earlier or at the same time and was longer.
          // In a complex scenario, you might want to split them, but taking the larger is fine.
          if (match.start === lastMatch.start) {
             mergedMatches[mergedMatches.length - 1] = match;
          }
        }
      } else {
        mergedMatches.push(match);
      }
    }
  }

  // Create segments
  const segments = [];
  let currentIndex = 0;

  for (const match of mergedMatches) {
    if (match.start > currentIndex) {
      segments.push({
        text: text.substring(currentIndex, match.start),
        isRisky: false
      });
    }
    segments.push({
      text: text.substring(match.start, match.end),
      isRisky: true,
      category: match.category,
      weight: match.weight
    });
    currentIndex = match.end;
  }

  if (currentIndex < text.length) {
    segments.push({
      text: text.substring(currentIndex),
      isRisky: false
    });
  }

  return segments;
}
