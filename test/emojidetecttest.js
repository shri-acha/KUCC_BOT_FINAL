function containsEmoji(str) {
    const emojiRegex = /(\p{Emoji_Presentation}|\p{Emoji}\uFE0F|\p{Emoji_Modifier_Base}|\p{Emoji_Component}|\u200D[\p{Emoji}]+|\p{Emoji})(\uFE0F|\u20E3)?/gu;
    return emojiRegex.test(str);
}

// Example usage:
const testString = '😊';
console.log(containsEmoji(testString)); // Output: true

const testString2 = 'Hello';
console.log(containsEmoji(testString2)); // Output: false
