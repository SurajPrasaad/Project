import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";

// Waits for the DOM to fully load, then highlights all code blocks inside <pre> tags using the Highlight.js library
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("pre code").forEach((block) => {
    hljs.highlightElement(block);
  });
});

//Creating Variable to store the textarea and the div element  
const data = document.getElementById("data");
const content = document.getElementById("content");

//Creating Emoji Map Object to store emoji codes and their corresponding emoji characters
const emojiMap = {
  ":smile:": "😃",
  ":heart:": "❤️",
  ":rocket:": "🚀",
  ":thumbsup:": "👍",
  ":fire:": "🔥",
  ":star:": "⭐",
  ":wave:": "👋",
  ":tada:": "🎉",
  ":thinking:": "🤔",
  ":sunglasses:": "😎",
  ":coffee:": "☕",
  ":checkmark:": "✅",
  ":x:": "❌",
  ":warning:": "⚠️",
  ":question:": "❓",
  ":laughing:": "😂",
  ":cry:": "😢",
  ":clap:": "👏",
  ":100:": "💯",
  ":gift:": "🎁",
  ":pizza:": "🍕",
  ":beer:": "🍺",
  ":sun:": "☀️",
  ":moon:": "🌙",
  ":earth:": "🌍",
  ":dog:": "🐶",
  ":cat:": "🐱",
  ":rabbit:": "🐰",
  ":lion:": "🦁",
  ":tiger:": "🐯",
  ":elephant:": "🐘",
  ":panda:": "🐼",
  ":monkey:": "🐵",
  ":zebra:": "🦓",
  ":whale:": "🐋",
  ":car:": "🚗",
  ":bike:": "🚲",
  ":airplane:": "✈️",
  ":train:": "🚆",
  ":ship:": "🚢",
  ":hourglass:": "⌛",
  ":bulb:": "💡",
  ":hammer:": "🔨",
  ":lock:": "🔒",
  ":key:": "🔑",
  ":book:": "📖",
  ":pencil:": "✏️",
  ":paint:": "🎨",
  ":camera:": "📷",
  ":microphone:": "🎤",
  ":music:": "🎵",
  ":tv:": "📺",
  ":phone:": "📱",
  ":computer:": "💻",
  ":game:": "🎮",
};

// Function to replace emoji codes (e.g., ":smile:") in the input text with their corresponding emoji characters
function replaceEmojis(text) {
  return Object.keys(emojiMap).reduce((acc, key) => {
    return acc.split(key).join(emojiMap[key]);
  }, text);
}

marked.setOptions({
  highlight: function (code) {
    return hljs.highlightAuto(code).value;
  },
});

// Add event listener to the textarea to parse the markdown text and display the result
data.addEventListener("input", (e) => {
  let parsedText = marked.parse(e.target.value);
  content.innerHTML = replaceEmojis(parsedText);
  document.querySelectorAll("pre code").forEach((block) => {
    hljs.highlightElement(block);
  });
});


//Add reset functionality to the clear button
const clearBtn = document.getElementById("clear");
clearBtn.addEventListener("click", () => {
  data.value = "";
  content.innerHTML = "";
});
