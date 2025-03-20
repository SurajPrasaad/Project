let date = new Date();
let year = date.getFullYear();
let month = date.getMonth();

const day = document.querySelector(".calendar-dates");
const currDate = document.querySelector(".calendar-current-date");
const prenexIcons = document.querySelectorAll(".calendar-navigation span");

// Load stored emoji data from localStorage
let emojiData = JSON.parse(localStorage.getItem("emojiData")) || {};

const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const availableEmojis = ["😃", "😄", "😁", "😆", "😊", "🙂", "🤗", "🥰", "😍", "🎉",  
    "😞", "😔", "😟", "😕", "😢", "😭", "🥺",  
    "😐", "😑", "🤔", "😶", "😏", "🙃",  
    "😠", "😡", "🤬", "😤", "😖",  
    "😛", "😝", "😜", "🤪", "😈",  
    "🙏", "🤝"];

const manipulate = () => {
    let firstDay = new Date(year, month, 1).getDay();
    let lastDate = new Date(year, month + 1, 0).getDate();
    let lastDay = new Date(year, month, lastDate).getDay();
    let prevMonthLastDate = new Date(year, month, 0).getDate();

    let lit = "";

    for (let i = firstDay; i > 0; i--) {
        lit += `<li class="inactive">${prevMonthLastDate - i + 1}</li>`;
    }

    for (let i = 1; i <= lastDate; i++) {
        let isToday = i === new Date().getDate() &&
                      month === new Date().getMonth() &&
                      year === new Date().getFullYear()
                      ? "active" : "";

        let key = `${year}-${month}-${i}`;
        let emoji = emojiData[key] || "";

        lit += `<li class="${isToday}" data-date="${key}" data-emoji="${emoji}">${i}</li>`;
    }

    for (let i = lastDay; i < 6; i++) {
        lit += `<li class="inactive">${i - lastDay + 1}</li>`;
    }

    currDate.innerText = `${months[month]} ${year}`;
    day.innerHTML = lit;

    document.querySelectorAll(".calendar-dates li").forEach(dateEl => {
        dateEl.addEventListener("click", () => {
            let selectedDate = dateEl.getAttribute("data-date");
            if (!selectedDate) return;
            showEmojiPopup(selectedDate);
        });
    });
    
    applyEmojiBackgrounds();
};

const applyEmojiBackgrounds = () => {
    document.querySelectorAll(".calendar-dates li").forEach(dateEl => {
        let emoji = dateEl.getAttribute("data-emoji");
        if (emoji) {
            dateEl.style.position = "relative";
            dateEl.style.display = "flex";
            dateEl.style.alignItems = "center";
            dateEl.style.justifyContent = "center";
            dateEl.innerHTML += `<span class="emoji-bg">${emoji}</span>`;
        }
    });
};

const showEmojiPopup = (selectedDate) => {
    let popup = document.createElement("div");
    popup.classList.add("emoji-popup");
    
    popup.innerHTML = `
        <p>Select an emoji:</p>
        <div class="emoji-options">
            ${availableEmojis.map(emoji => `<button class="emoji-btn">${emoji}</button>`).join("")}
        </div>
        <button class="close-btn">Cancel</button>
    `;

    document.body.appendChild(popup);

    document.querySelectorAll(".emoji-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            emojiData[selectedDate] = btn.textContent;
            localStorage.setItem("emojiData", JSON.stringify(emojiData)); // Save to localStorage
            document.body.removeChild(popup);
            manipulate();
        });
    });

    document.querySelector(".close-btn").addEventListener("click", () => {
        document.body.removeChild(popup);
    });
};

manipulate();

prenexIcons.forEach(icon => {
    icon.addEventListener("click", () => {
        month = icon.id === "calendar-prev" ? month - 1 : month + 1;

        if (month < 0) {
            year--;
            month = 11;  
        } else if (month > 11) {
            year++;
            month = 0;   
        }

        manipulate();
    });
});


const getMoodTimeline = (view) => {
    let timelineData = {};

    Object.keys(emojiData).forEach(date => {
        let [year, month, day] = date.split('-').map(Number);
        let week = `${year}-W${Math.ceil(day / 7)}`;
        let monthKey = `${year}-${month + 1}`;

        if (view === "day") {
            timelineData[date] = emojiData[date];
        } else if (view === "week") {
            if (!timelineData[week]) timelineData[week] = {};
            let emoji = emojiData[date];
            timelineData[week][emoji] = (timelineData[week][emoji] || 0) + 1;
        } else if (view === "month") {
            if (!timelineData[monthKey]) timelineData[monthKey] = {};
            let emoji = emojiData[date];
            timelineData[monthKey][emoji] = (timelineData[monthKey][emoji] || 0) + 1;
        }
    });

    return timelineData;
};



const renderMoodChart = (view) => {
    let moodData = getMoodTimeline(view);
    let labels = Object.keys(moodData);
    let moodCounts = labels.map(label => {
        if (view === "day") {
            return 1; // Single mood per day
        }
        let emojiData = moodData[label];
        return Object.values(emojiData).reduce((sum, count) => sum + count, 0); // Sum of all emoji occurrences
    });

    let ctx = document.getElementById("moodChart").getContext("2d");

    if (window.moodChartInstance) {
        window.moodChartInstance.destroy();
    }

    window.moodChartInstance = new Chart(ctx, {
        type: "bar", // Changed to bar for better visualization
        data: {
            labels: labels,
            datasets: [{
                label: `Mood Count (${view}-wise)`,
                data: moodCounts,
                backgroundColor: "rgba(54, 162, 235, 0.5)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: (tooltipItem) => {
                            let label = labels[tooltipItem.dataIndex];
                            let emojiData = moodData[label];

                            if (view === "day") {
                                return `Mood: ${emojiData}`;
                            }

                            // Show all emojis with counts for week/month
                            let emojiBreakdown = Object.entries(emojiData)
                                .map(([emoji, count]) => `${emoji}: ${count} times`)
                                .join(", ");
                            
                            return emojiBreakdown;
                        }
                    }
                }
            }
        }
    });
};


// Handle dropdown change
document.getElementById("timelineFilter").addEventListener("change", function () {
    renderMoodChart(this.value);
});

// Initial load with day-wise view
renderMoodChart("day");

