function makeInstructionsReadable(text) {
    if (!text) return [];

    return text
        .split(/\. +/) // split op punt + spatie(s)
        .map((sentence) => sentence.trim())
        .filter(Boolean);
}

export default makeInstructionsReadable;