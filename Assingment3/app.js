let quoteElement = document.getElementById("quote");
let copyBtn = document.getElementById("copy-btn");
let shareBtn = document.getElementById("share-btn");
let addBtn = document.getElementById("add-btn");
let exportBtn = document.getElementById("export-btn");
let canvas = document.getElementById("quoteCanvas");
const ctx = canvas.getContext("2d");
let quoteAuthor = document.getElementById("quoteAuthor");
const uri = "https://api.freeapi.app/api/v1/public/quotes/quote/random";
let currentQuote = "";

const fetchQuote = async () => {
  try {
    const res = await fetch(uri);
    const obj = await res.json();
    currentQuote = `${obj.data.content}`;
    quoteElement.innerHTML = `<i class="fa-sharp-duotone fa-solid fa-quote-left icons"></i> ${currentQuote}<i class="fa-sharp-duotone fa-solid fa-quote-right icons"></i>`;
    quoteAuthor.textContent = `-${obj.data.author}`;
    drawQuoteOnImage();
  } catch (error) {
    console.error("Error fetching quote:", error);
    quoteElement.innerText = "Failed to load quote!";
  }
};

fetchQuote();

addBtn.addEventListener("click", () => {
  fetchQuote();
  generateRandomImage();
});

copyBtn.addEventListener("click", () => {
  navigator.clipboard
    .writeText(currentQuote)
    .then(() => {
      copyBtn.innerHTML = `<i class="fa-sharp-duotone fa-solid fa-check"></i>`;
      setTimeout(() => {
        copyBtn.innerHTML = `<i class="fa-sharp-duotone fa-solid fa-clipboard">`;
      }, 2000);
    })
    .catch((error) => {
      console.error("Failed to copy:", error);
    });
});


shareBtn.addEventListener("click", async () => {
  if (!currentQuote) {
    alert("Quote not loaded yet!");
    return;
  }

  try {
    const canvasImageUrl = canvas.toDataURL("image/png");
    const response = await fetch(canvasImageUrl);
    const blob = await response.blob();

    const file = new File([blob], "quote-image.png", { type: "image/png" });

    await navigator.share({
      title: "Inspiring Quote",
      text: currentQuote,
      files: [file], 
    });

    console.log("Successfully Shared!");
  } catch (error) {
    console.error("Sharing failed:", error);
  }
});

async function generateRandomImage() {
  const category = "nature";
  await fetch(
    "https://api.api-ninjas.com/v1/randomimage?category=" + category,
    {
      headers: {
        "X-Api-Key": "rGtxJFE8SmovcyUXzUF2yA==kefNxmVZSuE87gnL",
        Accept: "image/jpg",
      },
    }
  )
    .then((response) => response.blob())
    .then((blob) => {
      const imageUrl = URL.createObjectURL(blob);
      drawQuoteOnImage(imageUrl);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function drawQuoteOnImage(imageSrc = "bg.jpg") {
  const img = new Image();
  img.src = imageSrc;

  img.onload = function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(0, 0, 0, 0.4)"; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Text Styling
    ctx.font = "16px Poppins";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";


    const maxWidth = 450;
    const lineHeight = 30;
    const x = canvas.width / 2;
    const y = canvas.height / 2;

    wrapText(ctx, currentQuote, x, y, maxWidth, lineHeight);
  };
}
function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "";
  const lines = [];

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + " ";
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;

    if (testWidth > maxWidth && i > 0) {
      lines.push(line);
      line = words[i] + " ";
    } else {
      line = testLine;
    }
  }
  lines.push(line);

  
  const totalHeight = lines.length * lineHeight;
  const startY = y - totalHeight / 2;

  lines.forEach((line, index) => {
    ctx.fillText(line, x, startY + index * lineHeight);
  });
}

exportBtn.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "quote-image.png";
  link.href = canvas.toDataURL();
  link.click();
});

generateRandomImage();
