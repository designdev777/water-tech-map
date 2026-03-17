// Sample water technology projects data
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

let map;
let markers = [];

// Initialize the map
function initMap() {
    map = L.map('map').setView([20, 0], 2);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    // Add all markers
    addMarkers(waterProjects);
    
    // Update statistics
    updateStats(waterProjects);
    
    // Populate research section
    populateResearch(waterProjects);
    
    // Populate funding sources
    updateFundingSources(waterProjects);
}

// Add markers to the map
function addMarkers(projects) {
    // Clear existing markers
    markers.forEach(marker => marker.remove());
    markers = [];
    
    projects.forEach(project => {
        const marker = L.marker([project.location.lat, project.location.lng], {
            icon: L.divIcon({
                className: 'custom-marker',
                html: `<div style="background: ${getMarkerColor(project.type)}; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">${project.name.charAt(0)}</div>`
            })
        }).addTo(map);
        
        marker.on('click', () => showProjectDetails(project));
        markers.push(marker);
    });
}

// Get marker color based on technology type
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

// Show project details in sidebar
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

// Update funding sources display
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

// Update statistics
function updateStats(projects) {
    const totalProjects = projects.length;
    const totalFunding = projects.reduce((sum, p) => sum + p.funding, 0);
    const activeResearch = projects.filter(p => p.status === 'active').length;
    
    document.getElementById('total-projects').textContent = totalProjects;
    document.getElementById('total-funding').textContent = `$${(totalFunding / 1000000).toFixed(1)}M`;
    document.getElementById('active-research').textContent = activeResearch;
}

// Populate research section
function populateResearch(projects) {
    const researchDiv = document.getElementById('research-list');
    
    let html = '';
    projects.forEach(project => {
        html += `
            <div class="research-card">
                <h4>${project.research.institution}</h4>
                <div class="institution">${project.name}</div>
                <div class="year">${project.research.year}</div>
                <div class="description">${project.research.description}</div>
            </div>
        `;
    });
    
    researchDiv.innerHTML = html;
}

// Filter projects based on selections
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
    populateResearch(filtered);
    
    if (filtered.length === 0) {
        document.getElementById('project-details').innerHTML = '<p class="placeholder">No projects match the selected filters</p>';
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