// Sample water technology projects data (your existing data)
const waterProjects = [
    {
        id: 1,
        name: "Solar-Powered Desalination Plant",
        type: "desalination",
        location: { lat: 24.7136, lng: 46.6753, city: "Riyadh", country: "Saudi Arabia" },
        funding: 45000000,
        fundingSources: [
            { name: "Saudi Water Authority", amount: 30000000, type: "Government" },
            { name: "GreenTech Ventures", amount: 15000000, type: "Private Equity" }
        ],
        research: {
            institution: "King Abdullah University of Science and Technology",
            year: 2023,
            description: "Developing high-efficiency solar thermal desalination with zero brine discharge"
        },
        status: "active"
    },
    {
        id: 2,
        name: "Smart Water Monitoring Network",
        type: "monitoring",
        location: { lat: 37.7749, lng: -122.4194, city: "San Francisco", country: "USA" },
        funding: 8500000,
        fundingSources: [
            { name: "NSF", amount: 3500000, type: "Grant" },
            { name: "California Water Board", amount: 3000000, type: "Government" },
            { name: "TechStars", amount: 2000000, type: "Venture Capital" }
        ],
        research: {
            institution: "UC Berkeley",
            year: 2023,
            description: "IoT-based water quality monitoring using AI for predictive maintenance"
        },
        status: "active"
    },
    {
        id: 3,
        name: "Graphene Water Filtration System",
        type: "purification",
        location: { lat: 51.5074, lng: -0.1278, city: "London", country: "UK" },
        funding: 12000000,
        fundingSources: [
            { name: "UK Research and Innovation", amount: 5000000, type: "Government" },
            { name: "CleanWater VC", amount: 7000000, type: "Venture Capital" }
        ],
        research: {
            institution: "University of Manchester",
            year: 2024,
            description: "Next-generation graphene oxide membranes for ultra-fast water purification"
        },
        status: "development"
    },
    {
        id: 4,
        name: "AI-Powered Wastewater Treatment",
        type: "wastewater",
        location: { lat: 52.5200, lng: 13.4050, city: "Berlin", country: "Germany" },
        funding: 15000000,
        fundingSources: [
            { name: "EU Horizon 2020", amount: 8000000, type: "Grant" },
            { name: "Siemens", amount: 7000000, type: "Corporate" }
        ],
        research: {
            institution: "Technical University of Berlin",
            year: 2023,
            description: "Machine learning optimization of biological wastewater treatment processes"
        },
        status: "active"
    },
    {
        id: 5,
        name: "Atmospheric Water Generator",
        type: "conservation",
        location: { lat: -33.8688, lng: 151.2093, city: "Sydney", country: "Australia" },
        funding: 5000000,
        fundingSources: [
            { name: "Australian Renewable Energy Agency", amount: 2500000, type: "Government" },
            { name: "WaterTech Fund", amount: 2500000, type: "Venture Capital" }
        ],
        research: {
            institution: "University of Sydney",
            year: 2023,
            description: "High-efficiency water harvesting from air using MOF materials"
        },
        status: "pilot"
    },
    {
        id: 6,
        name: "Membrane Bioreactor Innovation",
        type: "wastewater",
        location: { lat: 35.6895, lng: 139.6917, city: "Tokyo", country: "Japan" },
        funding: 25000000,
        fundingSources: [
            { name: "NEDO", amount: 15000000, type: "Government" },
            { name: "Toray Industries", amount: 10000000, type: "Corporate" }
        ],
        research: {
            institution: "University of Tokyo",
            year: 2022,
            description: "Advanced membrane bioreactors with energy recovery systems"
        },
        status: "active"
    }
];

// WASH Portal data cache
let washPortalData = [];
let map;
let markers = [];

// Initialize the map
function initMap() {
    map = L.map('map').setView([20, 0], 2);
    
    // Use multiple tile providers as fallback
    const tileProviders = [
        {
            url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
        },
        {
            url: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
            attribution: '© OpenStreetMap contributors, Tiles style by Humanitarian OpenStreetMap Team',
            maxZoom: 19
        }
    ];
    
    // Try primary tile provider
    L.tileLayer(tileProviders[0].url, {
        attribution: tileProviders[0].attribution,
        maxZoom: tileProviders[0].maxZoom,
        referrerPolicy: 'no-referrer-when-downgrade'
    }).addTo(map);
    
    // Add error handler for tile loading
    map.on('layeradd', function(e) {
        if (e.layer instanceof L.TileLayer) {
            e.layer.on('tileerror', function(error) {
                console.log('Tile loading error, switching to fallback...');
                // Switch to fallback tile provider if primary fails
                map.eachLayer(function(layer) {
                    if (layer instanceof L.TileLayer) {
                        map.removeLayer(layer);
                    }
                });
                L.tileLayer(tileProviders[1].url, {
                    attribution: tileProviders[1].attribution,
                    maxZoom: tileProviders[1].maxZoom
                }).addTo(map);
            });
        }
    });
    
    // Load WASH Portal data and then initialize everything
    loadWashPortalData().then(() => {
        // Add all markers
        addMarkers(waterProjects);
        
        // Update statistics
        updateStats(waterProjects);
        
        // Populate research section with combined data
        populateResearch();
        
        // Populate funding sources
        updateFundingSources(waterProjects);
    });
}

// NEW: Function to fetch and parse WASH Portal data
async function loadWashPortalData() {
    // Show loading indicator
    const researchDiv = document.getElementById('research-list');
    researchDiv.innerHTML = '<div class="loading-spinner">Loading latest research...</div>';
    
    try {
        // Try to fetch via a CORS proxy (for development)
        // In production, you'd want to use your own backend proxy
        const proxyUrl = 'https://api.allorigins.win/raw?url=';
        const targetUrl = 'https://water-research.onrender.com';
        
        const response = await fetch(proxyUrl + encodeURIComponent(targetUrl));
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const htmlText = await response.text();
        
        // Parse the HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');
        
        // Extract research items - based on the visible content
        washPortalData = [];
        
        // Look for IWMI Publications (they appear frequently in the content)
        const publications = extractPublications(doc);
        washPortalData.push(...publications);
        
        // Look for arXiv preprints
        const preprints = extractPreprints(doc);
        washPortalData.push(...preprints);
        
        // Look for PLOS Water and Nature Water items
        const journals = extractJournalArticles(doc);
        washPortalData.push(...journals);
        
        console.log(`Loaded ${washPortalData.length} items from WASH Portal`);
        
    } catch (error) {
        console.error('Error fetching WASH Portal data:', error);
        // Fallback to generating sample data based on what we saw in the portal
        generateFallbackWashData();
    }
}

// NEW: Extract IWMI Publications
function extractPublications(doc) {
    const publications = [];
    
    // Look for elements containing IWMI publication patterns
    // This is a simplified approach - you'd need to adjust selectors based on actual HTML structure
    const textContent = doc.body.textContent || '';
    
    // Split into lines and look for publication titles
    const lines = textContent.split('\n');
    let currentPub = null;
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Look for publication titles (often start with "dc.title:" or are in bold)
        if (line.includes('dc.title:') || line.match(/^[A-Z][^.]{20,}:/)) {
            if (currentPub) {
                publications.push(currentPub);
            }
            
            // Extract title
            let title = line.replace('dc.title:', '').trim();
            if (title.length < 10) continue;
            
            currentPub = {
                institution: 'IWMI',
                year: '2025-2026',
                description: '',
                type: 'publication',
                title: title,
                url: 'https://water-research.onrender.com'
            };
        }
        
        // Look for descriptions
        if (currentPub && line.includes('dcterms.abstract:')) {
            currentPub.description = line.replace('dcterms.abstract:', '').trim().substring(0, 150) + '...';
        }
        
        // Look for investment potential
        if (currentPub && line.includes('Investment Potential:')) {
            currentPub.investmentPotential = line.replace('Investment Potential:', '').trim();
        }
    }
    
    if (currentPub) {
        publications.push(currentPub);
    }
    
    return publications;
}

// NEW: Extract arXiv preprints
function extractPreprints(doc) {
    const preprints = [];
    const textContent = doc.body.textContent || '';
    
    // Look for arXiv preprint patterns
    const preprintRegex = /arXiv:\d+\.\d+v\d+/g;
    const matches = textContent.match(preprintRegex);
    
    if (matches) {
        // Get surrounding context for each arXiv ID
        matches.forEach((arxivId, index) => {
            const context = textContent.split(arxivId)[1]?.substring(0, 200) || '';
            
            preprints.push({
                institution: 'arXiv Preprints',
                year: '2026',
                description: context.substring(0, 150) + '...',
                type: 'preprint',
                title: `Research Preprint ${arxivId}`,
                arxivId: arxivId,
                url: 'https://arxiv.org/search/?query=' + arxivId
            });
        });
    }
    
    return preprints;
}

// NEW: Extract journal articles
function extractJournalArticles(doc) {
    const journals = [];
    const textContent = doc.body.textContent || '';
    
    // Look for journal names
    const journalPatterns = ['PLOS Water', 'Nature Water', 'Water International'];
    
    journalPatterns.forEach(journal => {
        if (textContent.includes(journal)) {
            // Find context around journal mentions
            const index = textContent.indexOf(journal);
            const context = textContent.substring(index, index + 150);
            
            journals.push({
                institution: journal,
                year: 'Mar 17, 2026',
                description: context,
                type: 'journal',
                title: `${journal} Publication`,
                url: 'https://water-research.onrender.com'
            });
        }
    });
    
    return journals;
}

// NEW: Generate fallback data based on actual portal content
function generateFallbackWashData() {
    washPortalData = [
        {
            institution: 'IWMI - Solar Energy for Agricultural Resilience (SoLAR)',
            year: '2025',
            description: 'Phase II Inception Workshop in Bangladesh focusing on scaling solar irrigation with USD 1.8 billion investment potential.',
            type: 'project',
            title: 'Solar Irrigation Scaling in Bangladesh',
            investmentPotential: 'Medium - Stable government contracts'
        },
        {
            institution: 'IWMI - Nigeria Solar Irrigation Study',
            year: '2025',
            description: 'Co-designing scaling pathways for solar irrigation technology ownership in northern Nigeria with household surveys.',
            type: 'research',
            title: 'Solar-Based Irrigation Systems in Northern Nigeria',
            investmentPotential: 'Medium'
        },
        {
            institution: 'arXiv Preprint - physics.chem-ph',
            year: '2026',
            description: 'Hydroxide ion transport in anion-exchange membranes for green hydrogen production studied with machine-learned interatomic potentials.',
            type: 'preprint',
            title: 'Hydroxide Transport in Anion-Exchange Membranes'
        },
        {
            institution: 'arXiv Preprint - cs.CE',
            year: '2026',
            description: 'Time-dependent modeling framework for autogenous self-healing concrete coupling moisture diffusion with damage evolution.',
            type: 'preprint',
            title: 'Self-Healing Concrete Modeling Framework'
        },
        {
            institution: 'IWMI - Jordan Refugee Camp Study',
            year: '2025',
            description: 'Integrated watershed and climate risk hotspot mapping to support adaptation strategies in refugee camp landscapes.',
            type: 'research',
            title: 'Water Security in Refugee-Hosting Landscapes'
        },
        {
            institution: 'IWMI - India Agroecology',
            year: '2025',
            description: 'Agroecological transition pathways for India scaling from homesteads to multifunctional landscapes.',
            type: 'publication',
            title: 'Agroecological Transition Pathways for India'
        },
        {
            institution: 'PLOS Water',
            year: 'Mar 17, 2026',
            description: 'Latest research publication in water science and technology.',
            type: 'journal',
            title: 'PLOS Water - Recent Advances'
        },
        {
            institution: 'Nature Water',
            year: 'Mar 17, 2026',
            description: 'New findings in water research and technology innovation.',
            type: 'journal',
            title: 'Nature Water - Current Issue'
        },
        {
            institution: 'IWMI - Ghana Cocoa Study',
            year: '2025',
            description: 'Pathways to climate-resilient cocoa: solar-powered Irrigation-as-a-Service as an adaptation strategy.',
            type: 'research',
            title: 'Solar Irrigation for Cocoa in Ghana'
        },
        {
            institution: 'IWMI - Kenya Finance Workshop',
            year: '2025',
            description: 'Co-designing blended finance mechanisms for farmer-led irrigation in Kenya.',
            type: 'workshop',
            title: 'Blended Finance for Irrigation in Kenya'
        }
    ];
}

// Updated: Populate research section with WASH Portal data
function populateResearch() {
    const researchDiv = document.getElementById('research-list');
    
    // Combine local project research with WASH Portal data
    const localResearch = waterProjects.map(p => ({
        institution: p.research.institution,
        year: p.research.year,
        description: p.research.description,
        type: 'project',
        title: p.name
    }));
    
    // Use WASH Portal data if available, otherwise use local
    const displayData = washPortalData.length > 0 ? washPortalData : localResearch;
    
    // Sort by year (most recent first)
    displayData.sort((a, b) => {
        const yearA = parseInt(a.year) || 0;
        const yearB = parseInt(b.year) || 0;
        return yearB - yearA;
    });
    
    // Take top 12 items to display
    const topItems = displayData.slice(0, 12);
    
    let html = '';
    topItems.forEach(item => {
        // Add investment potential badge if available
        const investmentBadge = item.investmentPotential ? 
            `<span class="investment-badge">💰 ${item.investmentPotential}</span>` : '';
        
        // Add type badge
        const typeBadge = item.type ? 
            `<span class="type-badge type-${item.type}">${item.type}</span>` : '';
        
        html += `
            <div class="research-card ${item.type || ''}">
                <div class="card-header">
                    ${typeBadge}
                    ${investmentBadge}
                </div>
                <h4>${item.institution}</h4>
                <div class="institution">${item.title || item.institution}</div>
                <div class="year">${item.year}</div>
                <div class="description">${item.description || 'Research publication from WASH Investment Research Portal'}</div>
                ${item.url ? `<a href="${item.url}" target="_blank" class="research-link">Read more →</a>` : ''}
            </div>
        `;
    });
    
    // Add a refresh button and source attribution
    researchDiv.innerHTML = html + `
        <div class="research-footer">
            <button onclick="refreshWashData()" class="refresh-research-btn">
                <i class="fas fa-sync-alt"></i> Refresh Research Data
            </button>
            <p class="data-source">📊 Data source: <a href="https://water-research.onrender.com" target="_blank">WASH Investment Research Portal</a> + Local Database</p>
        </div>
    `;
}

// NEW: Function to manually refresh WASH Portal data
async function refreshWashData() {
    const researchDiv = document.getElementById('research-list');
    researchDiv.innerHTML = '<div class="loading-spinner">Refreshing research data...</div>';
    
    // Clear cache and reload
    washPortalData = [];
    await loadWashPortalData();
    populateResearch();
}

// Add markers to the map (unchanged from your version)
function addMarkers(projects) {
    // Clear existing markers
    markers.forEach(marker => marker.remove());
    markers = [];
    
    projects.forEach(project => {
        // Create custom icon
        const customIcon = L.divIcon({
            className: 'custom-marker',
            html: `<div style="background: ${getMarkerColor(project.type)}; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">${project.name.charAt(0)}</div>`,
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        });
        
        const marker = L.marker([project.location.lat, project.location.lng], {
            icon: customIcon
        }).addTo(map);
        
        // Add popup with basic info
        marker.bindPopup(`
            <b>${project.name}</b><br>
            ${project.location.city}, ${project.location.country}<br>
            Type: ${project.type}<br>
            Funding: $${(project.funding / 1000000).toFixed(1)}M
        `);
        
        marker.on('click', () => showProjectDetails(project));
        markers.push(marker);
    });
}

// Get marker color based on technology type (unchanged)
function getMarkerColor(type) {
    const colors = {
        'purification': '#4299e1',
        'monitoring': '#48bb78',
        'conservation': '#ecc94b',
        'desalination': '#ed64a6',
        'wastewater': '#9f7aea'
    };
    return colors[type] || '#667eea';
}

// Show project details in sidebar (unchanged)
function showProjectDetails(project) {
    const detailsDiv = document.getElementById('project-details');
    
    detailsDiv.innerHTML = `
        <div style="background: #f7fafc; padding: 15px; border-radius: 8px;">
            <h4 style="color: #2d3748; margin-bottom: 10px; font-size: 1.2em;">${project.name}</h4>
            <p style="color: #718096; margin-bottom: 5px;"><i class="fas fa-map-marker-alt"></i> ${project.location.city}, ${project.location.country}</p>
            <p style="color: #718096; margin-bottom: 5px;"><i class="fas fa-tag"></i> ${project.type.charAt(0).toUpperCase() + project.type.slice(1)}</p>
            <p style="color: #48bb78; font-weight: 600; margin-bottom: 5px;"><i class="fas fa-dollar-sign"></i> Total Funding: $${(project.funding / 1000000).toFixed(1)}M</p>
            <p style="color: #718096; margin-bottom: 5px;"><i class="fas fa-circle" style="color: ${project.status === 'active' ? '#48bb78' : '#ecc94b'};"></i> Status: ${project.status}</p>
            
            <div style="margin-top: 15px;">
                <h5 style="color: #4a5568; margin-bottom: 10px;">Research</h5>
                <p style="color: #2d3748; font-weight: 500;">${project.research.institution}</p>
                <p style="color: #718096; font-size: 0.9em;">${project.research.description}</p>
            </div>
        </div>
    `;
    
    updateFundingSources([project]);
}

// Update funding sources display (unchanged)
function updateFundingSources(projects) {
    const fundingDiv = document.getElementById('funding-sources');
    
    if (projects.length === 0) {
        fundingDiv.innerHTML = '<p class="placeholder">No funding sources available</p>';
        return;
    }
    
    let html = '';
    projects.forEach(project => {
        project.fundingSources.forEach(source => {
            html += `
                <div class="funding-source-item">
                    <h4>${source.name}</h4>
                    <div class="amount">$${(source.amount / 1000000).toFixed(1)}M</div>
                    <div class="type">${source.type}</div>
                </div>
            `;
        });
    });
    
    fundingDiv.innerHTML = html || '<p class="placeholder">No funding sources available</p>';
}

// Update statistics (unchanged)
function updateStats(projects) {
    const totalProjects = projects.length;
    const totalFunding = projects.reduce((sum, p) => sum + p.funding, 0);
    const activeResearch = projects.filter(p => p.status === 'active').length;
    
    document.getElementById('total-projects').textContent = totalProjects;
    document.getElementById('total-funding').textContent = `$${(totalFunding / 1000000).toFixed(1)}M`;
    document.getElementById('active-research').textContent = activeResearch;
}

// Filter projects based on selections (unchanged)
function filterProjects() {
    const techType = document.getElementById('tech-filter').value;
    const fundingRange = document.getElementById('funding-filter').value;
    const year = document.getElementById('year-filter').value;
    
    let filtered = waterProjects;
    
    if (techType !== 'all') {
        filtered = filtered.filter(p => p.type === techType);
    }
    
    if (fundingRange !== 'all') {
        switch(fundingRange) {
            case '0-1M':
                filtered = filtered.filter(p => p.funding <= 1000000);
                break;
            case '1M-10M':
                filtered = filtered.filter(p => p.funding > 1000000 && p.funding <= 10000000);
                break;
            case '10M+':
                filtered = filtered.filter(p => p.funding > 10000000);
                break;
        }
    }
    
    if (year !== 'all') {
        filtered = filtered.filter(p => p.research.year.toString() === year);
    }
    
    addMarkers(filtered);
    updateStats(filtered);
    // Don't filter research - keep showing WASH Portal data
    populateResearch();
    
    if (filtered.length === 0) {
        document.getElementById('project-details').innerHTML = '<p class="placeholder">No projects match the selected filters</p>';
        document.getElementById('funding-sources').innerHTML = '<p class="placeholder">No funding sources available</p>';
    } else {
        showProjectDetails(filtered[0]);
    }
}

// Add event listeners for filters
document.addEventListener('DOMContentLoaded', () => {
    initMap();
    
    document.getElementById('tech-filter').addEventListener('change', filterProjects);
    document.getElementById('funding-filter').addEventListener('change', filterProjects);
    document.getElementById('year-filter').addEventListener('change', filterProjects);
});