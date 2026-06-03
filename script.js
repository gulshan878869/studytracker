// ================= CURRENT USER =================
let currentUser = localStorage.getItem("currentUser") || "";

// ================= ADD STUDY =================
function addStudy() {
  let sub = document.getElementById("subject")?.value;
  let hrs = document.getElementById("hours")?.value;

  if (!sub || !hrs) {
    alert("Fill subject and hours");
    return;
  }

  let today = new Date().toISOString().split("T")[0];

  let data = JSON.parse(localStorage.getItem(currentUser + "_data")) || [];

  data.push({
    subject: sub,
    hours: Number(hrs),
    date: today
  });

  localStorage.setItem(currentUser + "_data", JSON.stringify(data));

  alert("Study Added ✅");
  loadData();
}

// ================= LOAD =================
function loadData() {
  if (!currentUser) return;

  let data = JSON.parse(localStorage.getItem(currentUser + "_data")) || [];

  showData(data);
  drawChart(data);

  let totalEl = document.getElementById("total");
  if (totalEl) {
    totalEl.innerText = data.reduce((sum, d) => sum + d.hours, 0);
  }
}

// ================= SHOW =================
function showData(data) {
  let el = document.getElementById("data");
  if (!el) return;

  if (data.length === 0) {
    el.innerHTML = "No data found";
    return;
  }

  let grouped = {};

  data.forEach(d => {
    let key = d.date + "_" + d.subject;

    if (!grouped[key]) {
      grouped[key] = {
        date: d.date,
        subject: d.subject,
        hours: 0
      };
    }

    grouped[key].hours += d.hours;
  });

  let output = "";

  Object.values(grouped).forEach(d => {
    output += `
      <div style="
        background: rgba(255,255,255,0.05);
        margin:10px 0;
        padding:10px;
        border-radius:10px;
      ">
        📅 ${d.date} → <b>${d.subject}</b> 
        <span style="color:#22c55e;">(${d.hours} hrs)</span>
      </div>
    `;
  });

  el.innerHTML = output;
}

// ================= FILTER =================
function filterByDate() {
  let selectedDate = document.getElementById("filterDate")?.value;

  let data = JSON.parse(localStorage.getItem(currentUser + "_data")) || [];

  if (!selectedDate) {
    showData(data);
    drawChart(data);
    return;
  }

  let filtered = data.filter(d => d.date === selectedDate);

  showData(filtered);
  drawChart(filtered);
}

// ================= CHART =================
let chart;

function drawChart(data) {
  let canvas = document.getElementById("chart");
  if (!canvas) return;

  let ctx = canvas.getContext("2d");

  let subjects = {};

  data.forEach(d => {
    subjects[d.subject] = (subjects[d.subject] || 0) + d.hours;
  });

  let labels = Object.keys(subjects);
  let values = Object.values(subjects);

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [{
        label: "Study Hours",
        data: values
      }]
    }
  });
}

// ================= TODAY =================
function showToday() {
  let today = new Date().toISOString().split("T")[0];

  let data = JSON.parse(localStorage.getItem(currentUser + "_data")) || [];

  let filtered = data.filter(d => d.date === today);

  showData(filtered);
  drawChart(filtered);
}

// ================= WEEK =================
function showWeek() {
  let now = new Date();
  let weekAgo = new Date();
  weekAgo.setDate(now.getDate() - 7);

  let data = JSON.parse(localStorage.getItem(currentUser + "_data")) || [];

  let filtered = data.filter(d => {
    let dDate = new Date(d.date);
    return dDate >= weekAgo && dDate <= now;
  });

  showData(filtered);
  drawChart(filtered);
}

// ================= MONTH =================
function showMonth() {
  let now = new Date();
  let monthAgo = new Date();
  monthAgo.setMonth(now.getMonth() - 1);

  let data = JSON.parse(localStorage.getItem(currentUser + "_data")) || [];

  let filtered = data.filter(d => {
    let dDate = new Date(d.date);
    return dDate >= monthAgo && dDate <= now;
  });

  showData(filtered);
  drawChart(filtered);
}

// ================= RESET =================
function resetData() {
  if (confirm("Are you sure you want to delete all data?")) {
    localStorage.removeItem(currentUser + "_data");
    loadData();
  }
}

// ================= LOGOUT =================
function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
}

// ================= AUTO LOAD =================
window.onload = function () {
  loadData();
};