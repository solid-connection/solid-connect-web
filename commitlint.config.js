module.exports = {
  extends: ["@commitlint/config-conventional"],
  parserPreset: {
    parserOpts: {
      headerPattern: /^([\p{Emoji_Presentation}\p{Extended_Pictographic}]|\w+)(?:\((.+)\))?[:\s]+(.+)$/u,
      headerCorrespondence: ["type", "scope", "subject"],
    },
  },
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "refactor",
        "style",
        "test",
        "docs",
        "chore",
        // Gitmoji support
        "✨",
        "🐛",
        "🔧",
        "📝",
        "💄",
        "♻️",
        "🔥",
        "🚀",
        "✅",
        "🔒",
        "⬆️",
        "⬇️",
        "🎨",
        "🚧",
        "💚",
        "📦",
        "🔀",
      ],
    ],
  },
};
