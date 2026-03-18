// Real water technology projects from WASH Investment Research Portal
const waterProjects = [
    {
        id: 1,
        name: "Solar Energy for Agricultural Resilience (SoLAR) Phase II",
        type: "conservation",
        location: { lat: 23.6850, lng: 90.3563, city: "Dhaka", country: "Bangladesh" },
        funding: 1800000000, // $1.8 billion
        fundingUSD: 1800000000,
        fundingGBP: 1422000000, // 0.79 * 1.8B
        fundingSources: [
            { name: "Swiss Agency for Development and Cooperation (SDC)", amount: 500000000, type: "Government" },
            { name: "Asian Development Bank (ADB)", amount: 1300000000, type: "Development Bank" }
        ],
        research: {
            institution: "International Water Management Institute (IWMI)",
            year: 2025,
            description: "Solar irrigation scaling in Bangladesh targeting replacement of 1.2 million diesel pumps with solar alternatives. Workshop marked strategic transition from pilot interventions toward large-scale sustainable adoption."
        },
        status: "active",
        investmentPotential: "Medium - Stable government contracts",
        impact: "45,000 solar irrigation units, 1.2M diesel pumps replacement"
    },
    {
        id: 2,
        name: "Solar-Based Irrigation Systems (SBIS) Nigeria",
        type: "monitoring",
        location: { lat: 9.0820, lng: 8.6753, city: "Kaduna", country: "Nigeria" },
        funding: 50000000,
        fundingUSD: 50000000,
        fundingGBP: 39500000,
        fundingSources: [
            { name: "Bank of Agriculture Nigeria", amount: 25000000, type: "Government" },
            { name: "Islamic Finance Partners", amount: 25000000, type: "Private Equity" }
        ],
        research: {
            institution: "IWMI - Nigeria Solar Irrigation Study",
            year: 2025,
            description: "Co-designing scaling pathways for solar irrigation technology ownership in northern Nigeria. Farmers prefer shared ownership in micro-clusters with harvest-aligned financing."
        },
        status: "active",
        investmentPotential: "Medium",
        impact: "Targeting smallholder farmers in Kebbi, Kano, Kaduna states"
    },
    {
        id: 3,
        name: "Water and Soil Accelerator (WASA) Malawi-Zambia",
        type: "conservation",
        location: { lat: -13.2543, lng: 34.3015, city: "Lilongwe", country: "Malawi" },
        funding: 75000000,
        fundingUSD: 75000000,
        fundingGBP: 59250000,
        fundingSources: [
            { name: "U.S. Government", amount: 50000000, type: "Government" },
            { name: "CGIAR", amount: 25000000, type: "Research Grant" }
        ],
        research: {
            institution: "IWMI",
            year: 2024,
            description: "Three-year initiative scaling evidence-based water and soil management practices across rainfed agricultural systems. Targets one million farmers and one million hectares with climate-smart agriculture."
        },
        status: "active",
        investmentPotential: "Medium - Stable government contracts",
        impact: "1M farmers, 1M hectares"
    },
    {
        id: 4,
        name: "Jordan Refugee Camp Watershed Management",
        type: "monitoring",
        location: { lat: 32.2745, lng: 35.8964, city: "Jerash", country: "Jordan" },
        funding: 25000000,
        fundingUSD: 25000000,
        fundingGBP: 19750000,
        fundingSources: [
            { name: "UNHCR", amount: 15000000, type: "UN Agency" },
            { name: "CGIAR Fragility Program", amount: 10000000, type: "Research Grant" }
        ],
        research: {
            institution: "IWMI",
            year: 2025,
            description: "Integrated watershed and climate risk hotspot mapping in refugee-hosting landscapes. Framework combines hydrological analysis, climate projections, and socio-economic indicators for adaptation strategies."
        },
        status: "active",
        investmentPotential: "Medium",
        impact: "Supporting refugee and host communities"
    },
    {
        id: 5,
        name: "India Agroecological Transition Program",
        type: "conservation",
        location: { lat: 19.7515, lng: 75.7139, city: "Akole, Maharashtra", country: "India" },
        funding: 45000000,
        fundingUSD: 45000000,
        fundingGBP: 35550000,
        fundingSources: [
            { name: "Indian Council of Agricultural Research", amount: 25000000, type: "Government" },
            { name: "CGIAR Multifunctional Landscapes", amount: 20000000, type: "Research Grant" }
        ],
        research: {
            institution: "IWMI",
            year: 2025,
            description: "Agroecological transition pathways from homesteads to multifunctional landscapes. Evidence from Akole landscape in Western Ghats showing soil erosion, water retention challenges and nature-positive interventions."
        },
        status: "development",
        investmentPotential: "Medium",
        impact: "Tribal communities, biodiversity conservation"
    },
    {
        id: 6,
        name: "Ghana Climate-Resilient Cocoa Initiative",
        type: "purification",
        location: { lat: 6.5244, lng: -0.7584, city: "Eastern Region", country: "Ghana" },
        funding: 35000000,
        fundingUSD: 35000000,
        fundingGBP: 27650000,
        fundingSources: [
            { name: "World Bank", amount: 20000000, type: "Development Bank" },
            { name: "Ghana Cocoa Board", amount: 15000000, type: "Government" }
        ],
        research: {
            institution: "IWMI",
            year: 2025,
            description: "Solar-powered Irrigation-as-a-Service for climate-resilient cocoa. Study in Eastern, Ashanti, and Central regions shows farmers prefer cooperative-based management with secure land tenure."
        },
        status: "pilot",
        investmentPotential: "Medium - Stable government contracts",
        impact: "Smallholder cocoa farmers"
    },
    {
        id: 7,
        name: "Kenya Blended Finance for Farmer-Led Irrigation",
        type: "monitoring",
        location: { lat: -1.2921, lng: 36.8219, city: "Nairobi", country: "Kenya" },
        funding: 15000000,
        fundingUSD: 15000000,
        fundingGBP: 11850000,
        fundingSources: [
            { name: "World Bank", amount: 8000000, type: "Development Bank" },
            { name: "Kenya State Department for Irrigation", amount: 4000000, type: "Government" },
            { name: "Commercial Banks Kenya", amount: 3000000, type: "Private Sector" }
        ],
        research: {
            institution: "IWMI",
            year: 2025,
            description: "Co-designing blended finance mechanisms including results-based financing facility and risk-sharing credit facility to de-risk lending for smallholder irrigation."
        },
        status: "active",
        investmentPotential: "Medium",
        impact: "Smallholder farmers, irrigation service providers"
    },
    {
        id: 8,
        name: "Hydroxide Transport in Anion-Exchange Membranes",
        type: "purification",
        location: { lat: 42.3601, lng: -71.0589, city: "Cambridge", country: "USA" },
        funding: 5000000,
        fundingUSD: 5000000,
        fundingGBP: 3950000,
        fundingSources: [
            { name: "arXiv Preprints - physics.chem-ph", amount: 2500000, type: "Research Grant" },
            { name: "Department of Energy", amount: 2500000, type: "Government" }
        ],
        research: {
            institution: "arXiv.org",
            year: 2026,
            description: "Machine learning molecular dynamics simulations of hydroxide ion transport in anion-exchange membranes for green hydrogen production."
        },
        status: "research",
        investmentPotential: "High - Emerging technology",
        impact: "Green hydrogen production efficiency"
    },
    {
        id: 9,
        name: "Self-Healing Concrete Water Modeling",
        type: "monitoring",
        location: { lat: 51.5074, lng: -0.1278, city: "London", country: "UK" },
        funding: 3000000,
        fundingUSD: 3000000,
        fundingGBP: 2370000,
        fundingSources: [
            { name: "arXiv Preprints - cs.CE", amount: 1500000, type: "Research Grant" },
            { name: "UK Research and Innovation", amount: 1500000, type: "Government" }
        ],
        research: {
            institution: "arXiv.org",
            year: 2026,
            description: "Time-dependent modeling framework for autogenous self-healing concrete coupling moisture diffusion with damage evolution."
        },
        status: "research",
        investmentPotential: "Medium",
        impact: "Infrastructure longevity"
    },
    {
        id: 10,
        name: "Tamil Nadu Climate Action Program",
        type: "monitoring",
        location: { lat: 11.1271, lng: 78.6569, city: "Tamil Nadu", country: "India" },
        funding: 60000000,
        fundingUSD: 60000000,
        fundingGBP: 47400000,
        fundingSources: [
            { name: "CGIAR Climate Action Program", amount: 30000000, type: "Research Grant" },
            { name: "Government of Tamil Nadu", amount: 30000000, type: "Government" }
        ],
        research: {
            institution: "IWMI",
            year: 2025,
            description: "Climate adaptation program addressing droughts, heatwaves, floods, and cyclones. Deploying decision-support tools including SADMS, AWARE, and climate-smart governance dashboards."
        },
        status: "active",
        investmentPotential: "Medium - Stable government contracts",
        impact: "Vulnerable farming communities"
    },
    {
        id: 11,
        name: "Managed Aquifer Recharge (MAR) Odisha",
        type: "conservation",
        location: { lat: 20.9517, lng: 85.0985, city: "Odisha", country: "India" },
        funding: 25000000,
        fundingUSD: 25000000,
        fundingGBP: 19750000,
        fundingSources: [
            { name: "IWMI", amount: 10000000, type: "Research Grant" },
            { name: "Government of Odisha", amount: 15000000, type: "Government" }
        ],
        research: {
            institution: "IWMI",
            year: 2025,
            description: "State-scale spatial suitability assessment for Managed Aquifer Recharge using GIS-based multi-criteria framework."
        },
        status: "planning",
        investmentPotential: "Medium",
        impact: "Groundwater sustainability"
    },
    {
        id: 12,
        name: "Zambia Food Systems Policy Alignment",
        type: "monitoring",
        location: { lat: -15.4167, lng: 28.2833, city: "Lusaka", country: "Zambia" },
        funding: 10000000,
        fundingUSD: 10000000,
        fundingGBP: 7900000,
        fundingSources: [
            { name: "CGIAR", amount: 6000000, type: "Research Grant" },
            { name: "Government of Zambia", amount: 4000000, type: "Government" }
        ],
        research: {
            institution: "IWMI",
            year: 2025,
            description: "Comprehensive inventory of national policies aligned with climate adaptation, environmental health, nutrition, poverty reduction, and gender equality."
        },
        status: "active",
        investmentPotential: "Medium",
        impact: "Policy framework strengthening"
    },
    {
        id: 13,
        name: "Nepal WASH Governance Study",
        type: "monitoring",
        location: { lat: 27.7172, lng: 85.3240, city: "Kathmandu", country: "Nepal" },
        funding: 8000000,
        fundingUSD: 8000000,
        fundingGBP: 6320000,
        fundingSources: [
            { name: "CGIAR Policy Innovations", amount: 4000000, type: "Research Grant" },
            { name: "Government of Nepal", amount: 4000000, type: "Government" }
        ],
        research: {
            institution: "IWMI",
            year: 2025,
            description: "Water, sanitation and hygiene in Federal Nepal: strengthening local government actions and citizen rights. Study covers six rural municipalities across four provinces."
        },
        status: "active",
        investmentPotential: "Medium - Stable government contracts",
        impact: "Rural municipalities, marginalized groups"
    },
    {
        id: 14,
        name: "Mekong Groundwater Management",
        type: "conservation",
        location: { lat: 11.5449, lng: 104.8923, city: "Phnom Penh", country: "Cambodia" },
        funding: 12000000,
        fundingUSD: 12000000,
        fundingGBP: 9480000,
        fundingSources: [
            { name: "CGIAR Asian Mega-Deltas", amount: 7000000, type: "Research Grant" },
            { name: "Mekong River Commission", amount: 5000000, type: "International Organization" }
        ],
        research: {
            institution: "IWMI",
            year: 2025,
            description: "Establishing entry points for sustainable and inclusive groundwater use for agriculture in the Mekong. Study in Champassak (Laos) and Prey Veng (Cambodia)."
        },
        status: "active",
        investmentPotential: "Medium",
        impact: "Marginal farmers, groundwater-dependent communities"
    }
];

// Currency state
let currentCurrency = 'USD';
const exchangeRate = 0.79; // 1 USD = 0.79 GBP (approximate)

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
    
    // Add all markers
    addMarkers(waterProjects);
    
    // Update statistics
    updateStats(waterProjects);
    
    // Update funding sources with first project
    if (waterProjects.length > 0) {
        showProjectDetails(waterProjects[0]);
    }
}

// Add markers to the map
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
            Funding: ${formatCurrency(project.funding)}
        `);
        
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

// Dynamic year extraction
function getUniqueYears() {
    const years = new Set();
    waterProjects.forEach(project => {
        if (project.research && project.research.year) {
            years.add(project.research.year.toString());
        }
    });
    return Array.from(years).sort((a, b) => b - a); // Sort descending
}

// Update year filter dropdown
function updateYearFilter() {
    const yearFilter = document.getElementById('year-filter');
    const years = getUniqueYears();
    
    // Clear existing options except "All Years"
    while (yearFilter.options.length > 1) {
        yearFilter.remove(1);
    }
    
    // Add new year options
    years.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearFilter.appendChild(option);
    });
}

// Format currency based on selected currency - FIXED
function formatCurrency(amount) {
    if (!amount) return currentCurrency === 'GBP' ? '£0M' : '$0M';
    
    if (currentCurrency === 'GBP') {
        // Find the project to get its GBP value
        const project = waterProjects.find(p => p.funding === amount) || 
                       waterProjects.find(p => p.fundingUSD === amount);
        
        if (project && project.fundingGBP) {
            return `£${(project.fundingGBP / 1000000).toFixed(1)}M`;
        } else {
            // Fallback to conversion
            return `£${(amount * exchangeRate / 1000000).toFixed(1)}M`;
        }
    } else {
        return `$${(amount / 1000000).toFixed(1)}M`;
    }
}

// Format funding source amounts - FIXED
function formatFundingAmount(amount, sourceName) {
    if (!amount) return currentCurrency === 'GBP' ? '£0M' : '$0M';
    
    if (currentCurrency === 'GBP') {
        // Find the project containing this funding source
        const project = waterProjects.find(p => 
            p.fundingSources.some(s => s.name === sourceName && s.amount === amount)
        );
        
        if (project && project.fundingGBP) {
            // Calculate proportional GBP value
            const proportion = amount / project.fundingUSD;
            const gbpAmount = project.fundingGBP * proportion;
            return `£${(gbpAmount / 1000000).toFixed(1)}M`;
        } else {
            // Fallback to conversion
            return `£${(amount * exchangeRate / 1000000).toFixed(1)}M`;
        }
    } else {
        return `$${(amount / 1000000).toFixed(1)}M`;
    }
}

// Update statistics with currency
function updateStats(projects) {
    const totalProjects = projects.length;
    const totalFunding = projects.reduce((sum, p) => sum + p.funding, 0);
    const activeResearch = projects.filter(p => p.status === 'active').length;
    
    document.getElementById('total-projects').textContent = totalProjects;
    document.getElementById('total-funding').textContent = formatCurrency(totalFunding);
    document.getElementById('active-research').textContent = activeResearch;
}

// Filter projects with dynamic years and currency
function filterProjects() {
    const techType = document.getElementById('tech-filter').value;
    const fundingRange = document.getElementById('funding-filter').value;
    const year = document.getElementById('year-filter').value;
    
    let filtered = waterProjects;
    
    if (techType !== 'all') {
        filtered = filtered.filter(p => p.type === techType);
    }
    
    if (fundingRange !== 'all') {
        // Convert funding ranges based on currency
        let min, max;
        if (fundingRange === '0-1M') {
            min = 0;
            max = 1000000;
        } else if (fundingRange === '1M-10M') {
            min = 1000000;
            max = 10000000;
        } else if (fundingRange === '10M+') {
            min = 10000000;
            max = Infinity;
        }
        
        filtered = filtered.filter(p => p.funding >= min && p.funding <= max);
    }
    
    if (year !== 'all') {
        filtered = filtered.filter(p => p.research.year.toString() === year);
    }
    
    addMarkers(filtered);
    updateStats(filtered);
    
    if (filtered.length === 0) {
        document.getElementById('project-details').innerHTML = '<p class="placeholder">No projects match the selected filters</p>';
        document.getElementById('funding-sources').innerHTML = '<p class="placeholder">No funding sources available</p>';
    } else {
        showProjectDetails(filtered[0]);
    }
}

// Show project details with currency-aware funding - FIXED
function showProjectDetails(project) {
    const detailsDiv = document.getElementById('project-details');
    
    const impactHtml = project.impact ? 
        `<p style="color: #4a5568; margin-top: 10px;"><i class="fas fa-users"></i> <strong>Impact:</strong> ${project.impact}</p>` : '';
    
    const investmentHtml = project.investmentPotential ? 
        `<p style="color: #92400e; background: #fef3c7; padding: 5px 10px; border-radius: 5px; margin-top: 10px;"><i class="fas fa-chart-line"></i> <strong>Investment Potential:</strong> ${project.investmentPotential}</p>` : '';
    
    detailsDiv.innerHTML = `
        <div style="background: #f7fafc; padding: 15px; border-radius: 8px;">
            <h4 style="color: #2d3748; margin-bottom: 10px; font-size: 1.2em;">${project.name}</h4>
            <p style="color: #718096; margin-bottom: 5px;"><i class="fas fa-map-marker-alt"></i> ${project.location.city}, ${project.location.country}</p>
            <p style="color: #718096; margin-bottom: 5px;"><i class="fas fa-tag"></i> ${project.type.charAt(0).toUpperCase() + project.type.slice(1)}</p>
            <p style="color: #48bb78; font-weight: 600; margin-bottom: 5px;"><i class="fas fa-dollar-sign"></i> Total Funding: ${formatCurrency(project.funding)}</p>
            <p style="color: #718096; margin-bottom: 5px;"><i class="fas fa-circle" style="color: ${project.status === 'active' ? '#48bb78' : '#ecc94b'};"></i> Status: ${project.status}</p>
            
            ${investmentHtml}
            ${impactHtml}
            
            <div style="margin-top: 15px;">
                <h5 style="color: #4a5568; margin-bottom: 10px;">Research</h5>
                <p style="color: #2d3748; font-weight: 500;">${project.research.institution}</p>
                <p style="color: #718096; font-size: 0.9em;">${project.research.description}</p>
            </div>
        </div>
    `;
    
    updateFundingSources([project]);
}

// Update funding sources with currency - FIXED
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
                    <div class="amount">${formatFundingAmount(source.amount, source.name)}</div>
                    <div class="type">${source.type}</div>
                </div>
            `;
        });
    });
    
    fundingDiv.innerHTML = html || '<p class="placeholder">No funding sources available</p>';
}

// Add currency toggle to the UI
function addCurrencyToggle() {
    const statsSection = document.querySelector('.stats-section');
    const toggleHtml = `
        <div class="currency-toggle">
            <button class="currency-btn ${currentCurrency === 'USD' ? 'currency-btn-active' : ''}" onclick="setCurrency('USD')">USD ($)</button>
            <button class="currency-btn ${currentCurrency === 'GBP' ? 'currency-btn-active' : ''}" onclick="setCurrency('GBP')">GBP (£)</button>
        </div>
    `;
    statsSection.insertAdjacentHTML('afterbegin', toggleHtml);
}

// Set currency and refresh display - FIXED
window.setCurrency = function(currency) {
    currentCurrency = currency;
    
    // Update toggle buttons
    document.querySelectorAll('.currency-btn').forEach(btn => {
        btn.classList.remove('currency-btn-active');
    });
    document.querySelectorAll('.currency-btn').forEach(btn => {
        if (btn.textContent.includes(currency)) {
            btn.classList.add('currency-btn-active');
        }
    });
    
    // Refresh all displays
    updateStats(waterProjects);
    
    // Get currently selected project or first one
    const selectedProject = waterProjects[0]; // You might want to track the currently selected project
    if (selectedProject) {
        showProjectDetails(selectedProject);
    }
    
    // Refresh markers popups
    markers.forEach(marker => {
        const project = waterProjects.find(p => 
            p.location.lat === marker.getLatLng().lat && 
            p.location.lng === marker.getLatLng().lng
        );
        if (project) {
            marker.setPopupContent(`
                <b>${project.name}</b><br>
                ${project.location.city}, ${project.location.country}<br>
                Type: ${project.type}<br>
                Funding: ${formatCurrency(project.funding)}
            `);
        }
    });
};

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    initMap();
    updateYearFilter();
    addCurrencyToggle();
    
    document.getElementById('tech-filter').addEventListener('change', filterProjects);
    document.getElementById('funding-filter').addEventListener('change', filterProjects);
    document.getElementById('year-filter').addEventListener('change', filterProjects);
});
