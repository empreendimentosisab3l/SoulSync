const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'lib', 'quizDataV2.ts');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Increment IDs starting from 52 down to 11 to avoid conflicts
// We use a regex replacement function
content = content.replace(/id:\s*(\d+),/g, (match, idStr) => {
    const id = parseInt(idStr, 10);
    if (id >= 11) {
        return `id: ${id + 1},`;
    }
    return match;
});

// 2. Insert the new Card 11 before Card 12 (which was Card 11)
const newCard = `
  // CARD 11: BMI SUMMARY (NEW)
  {
    id: 11,
    type: "bmi-summary",
    title: "Seu ponto de partida",
    progress: 19
  },
`;

// Find the place to insert. It should be before "// CARD 12:" (which was 11, but we just incremented it? No, comments aren't incremented yet)
// Actually, my regex replaced `id: 11,` with `id: 12,`.
// So I should look for `id: 12,` which corresponds to the old Card 11 (Motivation).
// But wait, I also need to update the comments if I want to be clean, but that's harder.
// Let's just find the object with `id: 12` and insert before it.

const insertPointRegex = /(\s+\/\/.*?\n\s+\{\s+id: 12,)/;
const match = content.match(insertPointRegex);

if (match) {
    content = content.replace(match[1], newCard + match[1]);
    console.log("Successfully inserted new card.");
} else {
    console.error("Could not find insertion point.");
}

fs.writeFileSync(filePath, content, 'utf8');
