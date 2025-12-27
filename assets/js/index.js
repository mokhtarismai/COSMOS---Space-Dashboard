const apiKey = "lymd0KobZsdxnrhHiB6Dw2vSuF04Wlk8dUAd4Wh2";

let currentImageUrl = "";

const navLinks = document.querySelectorAll(".nav-link");

const sections = document.querySelectorAll(".app-section");

const titleEl = document.getElementById("apod-title");

const dateDetailEl = document.getElementById("apod-date-detail");

const dateDisplayEl = document.getElementById("apod-date-display"); 

const imageEl = document.getElementById("apod-image");

const explanationEl = document.getElementById("apod-explanation");

const copyrightEl = document.getElementById("apod-copyright");

const mediaTypeEl = document.getElementById("apod-media-type");

const dateInfoEl = document.getElementById("apod-date-info");

const apodDateEl = document.getElementById("apod-date");

const dateInput = document.getElementById("apod-date-input");

const loadDateBtn = document.getElementById("load-date-btn");

const todayBtn = document.getElementById("today-apod-btn");

const loadingEl = document.getElementById("apod-loading");

const viewFullResBtn = document.getElementById("view-full-res"); 

const planetCards = document.querySelectorAll('.planet-card');

const planetDetailImage = document.getElementById('planet-detail-image');

const planetDetailName = document.getElementById('planet-detail-name');

const planetDetailDescription = document.getElementById('planet-detail-description');

const planetDistance = document.getElementById('planet-distance');

const planetRadius = document.getElementById('planet-radius');

const planetMass = document.getElementById('planet-mass');

const planetDensity = document.getElementById('planet-density');

const planetOrbitalPeriod = document.getElementById('planet-orbital-period');

const planetRotation = document.getElementById('planet-rotation');

const planetMoons = document.getElementById('planet-moons');

const planetGravity = document.getElementById('planet-gravity');

const planetDiscoverer = document.getElementById('planet-discoverer');

const planetDiscoveryDate = document.getElementById('planet-discovery-date');

const planetBodyType = document.getElementById('planet-body-type');

const planetVolume = document.getElementById('planet-volume');

const planetPerihelion = document.getElementById('planet-perihelion');

const planetAphelion = document.getElementById('planet-aphelion');

const planetEccentricity = document.getElementById('planet-eccentricity');

const planetInclination = document.getElementById('planet-inclination');

const planetAxialTilt = document.getElementById('planet-axial-tilt');

const planetTemp = document.getElementById('planet-temp');

const planetEscape = document.getElementById('planet-escape');

let planetsData = [];


for (let i = 0; i < navLinks.length; i++) {
    navLinks[i].addEventListener("click", function () {
        const targetSection = this.dataset.section;
        for (let j = 0; j < sections.length; j++) {
            sections[j].classList.add("hidden");
        }
        for (let k = 0; k < navLinks.length; k++) {
            navLinks[k].classList.remove("bg-blue-500/10", "text-blue-400");
            navLinks[k].classList.add("text-slate-300");
        }
        const activeSection = document.getElementById(targetSection);
        if (activeSection) activeSection.classList.remove("hidden");
        this.classList.add("bg-blue-500/10", "text-blue-400");
        this.classList.remove("text-slate-300");
    });
}


async function fetchAPOD(date = null) {
    try {
        loadingEl.classList.remove("hidden");
        imageEl.classList.add("hidden");

        let url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`;
        if (date) url += `&date=${date}`;

        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch APOD");
        const data = await response.json();

        currentImageUrl = data.hdurl || data.url;

        titleEl.textContent = data.title;
        explanationEl.textContent = data.explanation;
        copyrightEl.textContent = data.copyright ? `© ${data.copyright}` : "";
        mediaTypeEl.textContent = data.media_type;
        dateInfoEl.textContent = data.date;
        apodDateEl.textContent = `Astronomy Picture of the Day - ${data.date}`;
        dateInput.value = data.date;

        const dateObj = new Date(data.date);
        const formattedDate = dateObj.toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric'
        });
        if (dateDisplayEl) dateDisplayEl.textContent = formattedDate;

        if (data.media_type === "video") {
            imageEl.src = ""; 
            imageEl.alt = "This is a video content.";
            loadingEl.classList.add("hidden");
            viewFullResBtn.style.display = "none";
        } else {
            imageEl.src = data.url;
            imageEl.alt = data.title;
            viewFullResBtn.style.display = "block";

            imageEl.onload = function() {
                loadingEl.classList.add("hidden");
                imageEl.classList.remove("hidden");
            };
        }

    } catch (error) {
        console.error("Error:", error);
        alert("Erorr For Data");
        loadingEl.classList.add("hidden");
    }
}


const todayStr = new Date().toISOString().split("T")[0];
dateInput.max = todayStr; 

fetchAPOD();


viewFullResBtn.addEventListener("click", () => {
    if (currentImageUrl) {
        window.open(currentImageUrl, "_blank");
    } else {
        alert("Image Not Found");
    }
});


loadDateBtn.addEventListener("click", () => {
    if (dateInput.value) fetchAPOD(dateInput.value);
});


todayBtn.addEventListener("click", () => {
    const today = new Date().toISOString().split("T")[0];
    dateInput.value = today;
    fetchAPOD(today);
});


async function fetchUpcomingLaunches() {
  try {
    const response = await fetch('https://ll.thespacedevs.com/2.2.0/launch/upcoming/?limit=10');
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching launches:', error);
    return [];
  }
}


function createLaunchCard(launch) {
  const statusColor = launch.status?.id === 1 ? 'bg-green-500/90' : 'bg-yellow-500/90';
  const statusText = launch.status?.name || 'TBD';

  const imageHtml = launch.image
    ? `<img src="${launch.image}" 
            alt="${launch.name}" 
            referrerpolicy="no-referrer"
            onerror="this.src='https://via.placeholder.com/400x200/1e293b/64748b?text=No+Image+Available'"
            class="w-full h-full object-cover rounded-2xl transition-transform duration-500 group-hover:scale-110" />`
    : `<div class="flex items-center justify-center h-full"><i class="fas fa-rocket text-5xl text-slate-700"></i></div>`;

  return `
    <div class="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all group cursor-pointer">
      <div class="relative h-48 bg-slate-900/50 flex items-center justify-center overflow-hidden">
        ${imageHtml}
        <div class="absolute top-3 right-3">
          <span class="px-3 py-1 ${statusColor} text-white backdrop-blur-sm rounded-full text-xs font-semibold">
            ${statusText}
          </span>
        </div>
      </div>
      <div class="p-5">
        <div class="mb-3">
          <h4 class="font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
            ${launch.name}
          </h4>
          <p class="text-sm text-slate-400 flex items-center gap-2">
            <i class="fas fa-building text-xs"></i>
            ${launch.launch_service_provider?.name || 'Unknown'}
          </p>
        </div>
        <div class="space-y-2 mb-4">
          <div class="flex items-center gap-2 text-sm">
            <i class="fas fa-calendar text-slate-500 w-4"></i>
            <span class="text-slate-300">${new Date(launch.net).toDateString()}</span>
          </div>
          <div class="flex items-center gap-2 text-sm">
            <i class="fas fa-clock text-slate-500 w-4"></i>
            <span class="text-slate-300">${new Date(launch.net).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} UTC</span>
          </div>
          <div class="flex items-center gap-2 text-sm">
            <i class="fas fa-rocket text-slate-500 w-4"></i>
            <span class="text-slate-300">${launch.rocket?.configuration?.name || 'Unknown'}</span>
          </div>
          <div class="flex items-center gap-2 text-sm">
            <i class="fas fa-map-marker-alt text-slate-500 w-4"></i>
            <span class="text-slate-300 line-clamp-1">${launch.pad?.name || 'Unknown'}</span>
          </div>
        </div>
        <div class="flex items-center gap-2 pt-4 border-t border-slate-700">
          <button class="flex-1 px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors text-sm font-semibold">Details</button>
          <button class="px-3 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
            <i class="far fa-heart"></i>
          </button>
        </div>
      </div>
    </div>
  `;
}


function createFeaturedLaunch(launch) {
  const statusColor = launch.status?.id === 1 ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400';
  const statusText = launch.status?.name || 'TBD';
  
  const imageHtml = launch.image
    ? `<img src="${launch.image}" 
            alt="${launch.name}" 
            referrerpolicy="no-referrer"
            onerror="this.src='https://via.placeholder.com/800x600/1e293b/64748b?text=Space+Launch+Image'"
            class="w-full h-full object-cover rounded-2xl" />`
    : `<div class="flex items-center justify-center h-full min-h-[400px] bg-slate-800">
         <i class="fas fa-rocket text-9xl text-slate-700/50"></i>
       </div>`;

  const daysUntil = Math.max(0, Math.ceil((new Date(launch.net) - new Date()) / (1000*60*60*24)));

  return `
    <div class="relative bg-slate-800/30 border border-slate-700 rounded-3xl overflow-hidden group hover:border-blue-500/50 transition-all">
      <div class="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div class="relative grid grid-cols-1 lg:grid-cols-2 gap-6 p-8">
        <div class="flex flex-col justify-between">
          <div>
            <div class="flex items-center gap-3 mb-4">
              <span class="px-4 py-1.5 bg-blue-500/20 text-blue-400 rounded-full text-sm font-semibold flex items-center gap-2">
                <i class="fas fa-star"></i> Featured Launch
              </span>
              <span class="px-4 py-1.5 ${statusColor} rounded-full text-sm font-semibold">
                ${statusText}
              </span>
            </div>
            <h3 class="text-3xl font-bold mb-3 leading-tight">
              ${launch.name}
            </h3>
            <div class="flex flex-col xl:flex-row xl:items-center gap-4 mb-6 text-slate-400">
              <div class="flex items-center gap-2">
                <i class="fas fa-building"></i>
                <span>${launch.launch_service_provider?.name || 'Unknown'}</span>
              </div>
              <div class="flex items-center gap-2">
                <i class="fas fa-rocket"></i>
                <span>${launch.rocket?.configuration?.name || 'Unknown'}</span>
              </div>
            </div>
            <div class="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl mb-6">
              <i class="fas fa-clock text-2xl text-blue-400"></i>
              <div>
                <p class="text-2xl font-bold text-blue-400">${daysUntil}</p>
                <p class="text-xs text-slate-400">Days Until Launch</p>
              </div>
            </div>
            <div class="grid xl:grid-cols-2 gap-4 mb-6">
              <div class="bg-slate-900/50 rounded-xl p-4">
                <p class="text-xs text-slate-400 mb-1 flex items-center gap-2">
                  <i class="fas fa-calendar"></i> Launch Date
                </p>
                <p class="font-semibold">${new Date(launch.net).toDateString()}</p>
              </div>
              <div class="bg-slate-900/50 rounded-xl p-4">
                <p class="text-xs text-slate-400 mb-1 flex items-center gap-2">
                  <i class="fas fa-clock"></i> Launch Time
                </p>
                <p class="font-semibold">${new Date(launch.net).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} UTC</p>
              </div>
            </div>
            <p class="text-slate-300 leading-relaxed mb-6 line-clamp-3">
              ${launch.mission?.description || 'No description available for this mission.'}
            </p>
          </div>
          <div class="flex flex-col md:flex-row gap-3">
            <button class="flex-1 px-6 py-3 bg-blue-500 rounded-xl hover:bg-blue-600 transition-colors font-semibold flex items-center justify-center gap-2">
              <i class="fas fa-info-circle"></i> View Full Details
            </button>
            <div class="flex gap-2">
              <button class="px-4 py-3 bg-slate-700 rounded-xl hover:bg-slate-600 transition-colors">
                <i class="far fa-heart"></i>
              </button>
              <button class="px-4 py-3 bg-slate-700 rounded-xl hover:bg-slate-600 transition-colors">
                <i class="fas fa-bell"></i>
              </button>
            </div>
          </div>
        </div>
        <div class="relative h-full min-h-[300px] lg:min-h-[400px]">
          <div class="h-full rounded-2xl overflow-hidden bg-slate-900/50">
            ${imageHtml}
            <div class="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60"></div>
          </div>
        </div>
      </div>
    </div>
  `;
}


async function displayLaunches() {
  const featured = document.getElementById('featured-launch');
  const grid = document.getElementById('launches-grid');

  if (featured) featured.innerHTML = '<div class="text-center p-10 text-slate-500">Loading Featured Launch...</div>';
  if (grid) grid.innerHTML = '<div class="text-center p-10 text-slate-500">Loading Missions...</div>';

  const launches = await fetchUpcomingLaunches();
  
  if (!launches || launches.length === 0) {
    if (featured) featured.innerHTML = '<div class="text-red-400 text-center p-10">Failed to load launch data.</div>';
    return;
  }

  if (featured) featured.innerHTML = createFeaturedLaunch(launches[0]);
  if (grid) {
    const otherLaunches = launches.slice(1);
    grid.innerHTML = otherLaunches.map(createLaunchCard).join('');
  }
}

displayLaunches();


const planetIdMap = {
  mercury: 'mercure',
  venus: 'venus',
  earth: 'terre',
  mars: 'mars',
  jupiter: 'jupiter',
  saturn: 'saturne',
  uranus: 'uranus',
  neptune: 'neptune'
};


async function fetchPlanets() {
  try {
    const res = await fetch('https://solar-system-opendata-proxy.vercel.app/api/planets');
    const data = await res.json();
    planetsData = data.bodies.filter(function(p) { return p.isPlanet; });
  } catch (err) {
    console.error(err);
  }
}

fetchPlanets();


for (let i = 0; i < planetCards.length; i++) {
  planetCards[i].addEventListener('click', function () {
    const planetId = this.dataset.planetId;
    const apiId = planetIdMap[planetId];
    const data = planetsData.find(function(p) { return p.id === apiId; });

    if (data) {
      planetDetailImage.src = data.image || './assets/images/default.png';
      planetDetailName.textContent = data.englishName;
      planetDetailDescription.textContent = data.description || "No description available.";
      planetDistance.textContent = data.semimajorAxis ? data.semimajorAxis.toLocaleString() + " km" : "N/A";
      planetRadius.textContent = data.meanRadius ? data.meanRadius.toLocaleString() + " km" : "N/A";
      planetMass.textContent = data.mass ? data.mass.massValue + " × 10^" + data.mass.massExponent + " kg" : "N/A";
      planetDensity.textContent = data.density ? data.density + " g/cm³" : "N/A";
      planetOrbitalPeriod.textContent = data.sideralOrbit ? data.sideralOrbit + " days" : "N/A";
      planetRotation.textContent = data.sideralRotation ? data.sideralRotation + " hours" : "N/A";
      planetMoons.textContent = data.moons ? data.moons.length : 0;
      planetGravity.textContent = data.gravity ? data.gravity + " m/s²" : "N/A";
      planetDiscoverer.textContent = data.discoveredBy || "Unknown";
      planetDiscoveryDate.textContent = data.discoveryDate || "Unknown";
      planetBodyType.textContent = data.bodyType || "Planet";
      planetVolume.textContent = data.vol ? data.vol.volValue.toLocaleString() + " × 10^" + data.vol.volExponent + " km³" : "N/A";
      planetPerihelion.textContent = data.perihelion ? data.perihelion.toLocaleString() + " km" : "N/A";
      planetAphelion.textContent = data.aphelion ? data.aphelion.toLocaleString() + " km" : "N/A";
      planetEccentricity.textContent = data.eccentricity || "N/A";
      planetInclination.textContent = data.inclination ? data.inclination + "°" : "N/A";
      planetAxialTilt.textContent = data.axialTilt ? data.axialTilt + "°" : "N/A";
      planetTemp.textContent = data.avgTemp ? data.avgTemp + "°C" : "N/A";
      planetEscape.textContent = data.escape ? data.escape + " km/s" : "N/A";
    }
  });
}









