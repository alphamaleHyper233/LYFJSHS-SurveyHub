document.addEventListener("DOMContentLoaded", () => {
  const toastEl = document.getElementById('phpToast');
  const toast = new bootstrap.Toast(toastEl, { delay: 4000 });

  const phpLinks = [
    '.nav-item.dropdown a.dropdown-item[href="#"]', 
    '.nav-item.dropdown.me-3 a.nav-link'           
  ];

  phpLinks.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      el.addEventListener("click", (e) => {
        e.preventDefault(); 
        toast.show();
      });
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const theme = localStorage.getItem("theme");
  const textSize = localStorage.getItem("textSize") || "medium";
  if (theme === "light") document.body.classList.add("light");
  document.body.style.fontSize = textSize === "small" ? "14px" : textSize === "large" ? "20px" : "16px";
});

const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vT-YWTeGWQSC8TH-UlRIRb7RPaJtX-Qum-RdPJBlc1n_d49XKHFDreC9XNPmww5zkAmGBB8NNrsYILE/pub?gid=2015938335&single=true&output=csv";
let surveys = [];

function parseCSV(text) {
  const rows = [];
  let current = [], inQuotes = false, value = "";
  for (let i=0;i<text.length;i++){
    const char=text[i];
    if(char=='"' && text[i+1]=='"'){ value+='"'; i++; }
    else if(char=='"'){ inQuotes=!inQuotes; }
    else if(char==',' && !inQuotes){ current.push(value.trim()); value=""; }
    else if((char=='\n'||char=='\r') && !inQuotes){
      if(char=='\r'&&text[i+1]=='\n'){i++;}
      current.push(value.trim());
      if(current.length>1) rows.push(current);
      current=[]; value="";
    } else { value+=char; }
  }
  if(value || current.length) current.push(value.trim());
  if(current.length) rows.push(current);
  return rows;
}

fetch(sheetURL)
  .then(res => res.text())
  .then(csv => {
    const rows = parseCSV(csv);
    rows.shift(); 
    surveys = rows.map((r,i)=>({
      id: i+1,
      title: r[0],
      description: r[1],
      strand: r[2],
      link: r[3],
      featured: r[4]?.trim().toLowerCase() === "yes" ? "yes" : "no",
      verified: r[5]?.trim().toLowerCase() === "yes" ? "yes" : "no",
      expired: r[6]?.trim().toLowerCase() === "yes" ? "yes" : "no"
    })).filter(s=>s.title && s.link);

    renderFeaturedSurveys();
    renderSurveys(surveys);
  });

function renderFeaturedSurveys(){
  const container = document.getElementById("featured-surveys");
  const titleElem = document.getElementById("featured-title");
  const featuredList = surveys.filter(s => s.featured==="yes");
  
  if(featuredList.length === 0){
    container.innerHTML = "";
    titleElem.style.display = "none";
    return;
  }

  container.style.display = "grid";
  titleElem.style.display = "block";
  container.innerHTML = "";

  featuredList.forEach(s=>{
    const expiredClass = s.expired==="yes" ? "expired" : "";
    const verifiedTag = s.verified==="yes" ? '<i class="fa-solid fa-check verified" title="Verified"></i>' : '';
    const featuredBadge = '<span class="badge featured-badge">Featured</span>';

    container.innerHTML+=`
      <div class="survey-card ${expiredClass}">
        <h5>${s.title} ${verifiedTag} ${featuredBadge}</h5>
        <p class="strand"><b>Strand:</b> ${s.strand || "N/A"}</p>
        <p class="description">${s.description || "No description available"}</p>
        <div class="survey-actions">
          <button class="take-btn" data-id="${s.id}" data-title="${encodeURIComponent(s.title)}"
            data-desc="${encodeURIComponent(s.description)}" data-link="${encodeURIComponent(s.link)}">
            <i class="fa-solid fa-pen"></i> Take Survey
          </button>
          <button class="share-btn" data-id="${s.id}" data-title="${encodeURIComponent(s.title)}"
            data-desc="${encodeURIComponent(s.description)}" data-link="${encodeURIComponent(s.link)}">
            <i class="fa-solid fa-share-nodes"></i> Share
          </button>
        </div>
      </div>`;
  });

  attachButtonEvents(container);
}

function renderSurveys(list){
  const container=document.getElementById("survey-container");
  container.innerHTML="";
  list.forEach(s=>{
    const expiredClass = s.expired==="yes" ? "expired" : "";
    const featuredBadge = s.featured==="yes" ? '<span class="badge featured-badge">Featured</span>' : '';
    const verifiedTag = s.verified==="yes" ? '<i class="fa-solid fa-check verified" title="Verified"></i>' : '';
    container.innerHTML+=`
      <div class="survey-card ${expiredClass}">
        <h5>${s.title} ${verifiedTag}</h5>
        <p class="strand"><b>Strand:</b> ${s.strand || "N/A"} ${featuredBadge}</p>
        <p class="description">${s.description || "No description available"}</p>
        <div class="survey-actions">
          <button class="take-btn" data-id="${s.id}" data-title="${encodeURIComponent(s.title)}"
            data-desc="${encodeURIComponent(s.description)}" data-link="${encodeURIComponent(s.link)}">
            <i class="fa-solid fa-pen"></i> Take Survey
          </button>
          <button class="share-btn" data-id="${s.id}" data-title="${encodeURIComponent(s.title)}"
            data-desc="${encodeURIComponent(s.description)}" data-link="${encodeURIComponent(s.link)}">
            <i class="fa-solid fa-share-nodes"></i> Share
          </button>
        </div>
      </div>`;
  });
  attachButtonEvents(container);
}

function attachButtonEvents(container){
  container.querySelectorAll(".take-btn").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const title = btn.dataset.title;
      const desc = btn.dataset.desc;
      const link = btn.dataset.link;
      window.location.href = `${window.location.origin}/LYFJSHS-SurveyHub/view-survey.html?title=${title}&desc=${desc}&link=${link}`;
    });
  });

 container.querySelectorAll(".share-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const title1 = decodeURIComponent(btn.dataset.title);
    const desc1 = decodeURIComponent(btn.dataset.desc);
    const title = btn.dataset.title;
    const desc = btn.dataset.desc;
    const link = btn.dataset.link;

    const shareURL = `https://alphamalehyper233.github.io/LYFJSHS-SurveyHub/view-survey.html?title=${title}&desc=${desc}&link=${link}`;
    const message = `${shareURL} \n \n Check out this research survey: "${title1}" \n \n ${desc1} `;

    navigator.clipboard.writeText(message)
      .then(() => {
        const toastEl = document.getElementById("linkToast");
        const toast = new bootstrap.Toast(toastEl);
        toast.show();
        console.log(" Copied:", shareURL);
      })
      .catch(err => console.error(" Failed to copy:", err));
  });
});
}

document.getElementById("search").addEventListener("input", applyFilters);
document.getElementById("strandFilter").addEventListener("change", applyFilters);

function applyFilters() {
  const query = document.getElementById("search").value.toLowerCase();
  const strand = document.getElementById("strandFilter").value;
  const featuredSection = document.getElementById("featured-section");

  console.log("Search query:", query);
  console.log("Selected strand:", strand);
  console.log("All surveys:", surveys);

  let filtered = surveys.filter(s => {
    if (!s.title) return false;
    const title = s.title.toLowerCase().trim();
    const search = query.toLowerCase().trim();
    return !search || title.includes(search);
  });

  console.log("After search filter:", filtered);

  if (strand !== "All") {
    filtered = filtered.filter(s =>
      (s.strand || "").toLowerCase() === strand.toLowerCase()
    );
    featuredSection.style.display = "none";
  }

  console.log("After strand filter:", filtered);

  if (query.trim().length > 0 || strand !== "All") {
    featuredSection.style.display = "none";
  } else {
    featuredSection.style.display = "block";
  }


  renderSurveys(filtered);

  console.log("Final rendered surveys:", filtered.length);
}