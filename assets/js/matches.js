// Config - استبدل بالقيم الصحيحة
const API_URL = "https://rapidapi.com/";
const API_KEY = "795f377634msh4be097ebbb6dce3p1bf238jsn583f1b9cf438"; // استبدل بمفتاحك
const API_HOST = "api-football-v1.p.rapidapi.com";

async function fetchMatches() {
  try {
    showLoading(true);
    
    const today = new Date().toISOString().split('T')[0];
    const params = new URLSearchParams({
      date: today, // تاريخ اليوم
      league: "39", // مثال للدوري الإنجليزي
      season: new Date().getFullYear()
    });

    const response = await fetch(`${API_URL}?${params}`, {
      headers: {
        "X-RapidAPI-Key": API_KEY,
        "X-RapidAPI-Host": API_HOST
      }
    });

    if (!response.ok) throw new Error(`HTTP error! ${response.status}`);
    
    const data = await response.json();
    
    if (data.response && data.response.length > 0) {
      renderMatches(data.response);
    } else {
      showNoMatchesMessage();
    }
  } catch (error) {
    console.error("Fetch error:", error);
    showError("حدث خطأ في جلب البيانات");
  } finally {
    showLoading(false);
  }
}

function renderMatches(matches) {
  const tableBody = document.querySelector("#matches-table tbody");
  tableBody.innerHTML = "";

  matches.forEach(match => {
    const row = `
      <tr>
        <td>${match.league?.name || "غير معروف"}</td>
        <td>${new Date(match.fixture.date).toLocaleDateString('ar-EG')}</td>
        <td>${match.teams.home.name}</td>
        <td>${match.goals.home} - ${match.goals.away}</td>
        <td>${match.teams.away.name}</td>
        <td class="${getStatusClass(match.fixture.status)}">
          ${getStatusText(match.fixture.status)}
        </td>
      </tr>
    `;
    tableBody.innerHTML += row;
  });
}
// في ملف matches.js
function getStatusClass(status) {
  const statusMap = {
    "FT": "finished",
    "NS": "scheduled",
    "LIVE": "live",
    "HT": "live",
    "POSTPONED": "postponed"
  };
  return statusMap[status] || "";
}

function getStatusText(status) {
  const statusText = {
    "FT": "انتهت",
    "NS": "مجدولة",
    "LIVE": "مباشر",
    "HT": "استراحة",
    "POSTPONED": "مؤجلة"
  };
  return statusText[status] || status;
}

function showLoading(show) {
  const loader = document.getElementById("loading-spinner");
  if (show) {
    loader.style.display = "block";
  } else {
    loader.style.display = "none";
  }
}

function showNoMatchesMessage() {
  const tableBody = document.querySelector("#matches-table tbody");
  tableBody.innerHTML = `
    <tr>
      <td colspan="6" class="no-matches">
        لا توجد مباريات متاحة اليوم
      </td>
    </tr>
  `;
}

function showError(message) {
  const errorDiv = document.getElementById("error-message");
  errorDiv.textContent = message;
  errorDiv.style.display = "block";
}
