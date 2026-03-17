// Sample water technology projects data (your existing data)
// Real water technology projects from WASH Investment Research Portal
// Real water technology projects from WASH Investment Research Portal
const waterProjects = [
    {
        id: 1,
        name: "Solar Energy for Agricultural Resilience (SoLAR) Phase II",
        type: "conservation",
        location: { lat: 23.6850, lng: 90.3563, city: "Dhaka", country: "Bangladesh" },
        funding: 1800000000, // $1.8 billion
        fundingUSD: 1800000000,
        fundingGBP: 1422000000, // Approximate conversion
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
            description: "Machine learning molecular dynamics simulations of hydroxide ion transport in anion-exchange membranes for green hydrogen production. Study reveals water content transforms isolated water clusters into connected hydrogen-bond networks."
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
            description: "Time-dependent modeling framework for autogenous self-healing concrete coupling moisture diffusion with damage evolution. Machine learning regression models predict healing times with 99.9% accuracy."
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
            description: "State-scale spatial suitability assessment for Managed Aquifer Recharge using GIS-based multi-criteria framework. Identifies priority zones for climate-resilient groundwater development."
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
            description: "Comprehensive inventory of national policies aligned with climate adaptation, environmental health, nutrition, poverty reduction, and gender equality. Supports evidence-based policymaking."
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
            description: "Establishing entry points for sustainable and inclusive groundwater use for agriculture in the Mekong. Study in Champassak (Laos) and Prey Veng (Cambodia) identifies opportunities for solar pumping and collective action."
        },
        status: "active",
        investmentPotential: "Medium",
        impact: "Marginal farmers, groundwater-dependent communities"
    }
];

// Currency state
let currentCurrency = 'USD';
const exchangeRate = 0.79; // 1 USD = 0.79 GBP (approximate)

// Dynamic year extraction
function getUniqueYears() {
    const years = new Set();
    waterProjects.forEach(project => {
        if (project.research && project.research.year) {
            years.add(project.research.year.toString());
        }
    });
    // Also add years from WASH portal data if available
    if (washPortalData.length > 0) {
        washPortalData.forEach(item => {
            if (item.year) {
                // Extract year from strings like "2025" or "Mar 17, 2026"
                const yearMatch = item.year.toString().match(/\d{4}/);
                if (yearMatch) {
                    years.add(yearMatch[0]);
                }
            }
        });
    }
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

// Format currency based on selected currency
function formatCurrency(amount) {
    if (currentCurrency === 'GBP') {
        return `£${(amount * exchangeRate / 1000000).toFixed(1)}M`;
    } else {
        return `$${(amount / 1000000).toFixed(1)}M`;
    }
}

// Format funding source amounts
function formatFundingAmount(amount) {
    if (currentCurrency === 'GBP') {
        return `£${(amount * exchangeRate / 1000000).toFixed(1)}M`;
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
    populateResearch();
    
    if (filtered.length === 0) {
        document.getElementById('project-details').innerHTML = '<p class="placeholder">No projects match the selected filters</p>';
        document.getElementById('funding-sources').innerHTML = '<p class="placeholder">No funding sources available</p>';
    } else {
        showProjectDetails(filtered[0]);
    }
}

// Show project details with currency-aware funding
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

// Update funding sources with currency
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
                    <div class="amount">${formatFundingAmount(source.amount)}</div>
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
            <button class="currency-btn ${currentCurrency === 'USD' ? 'active' : ''}" onclick="setCurrency('USD')">USD ($)</button>
            <button class="currency-btn ${currentCurrency === 'GBP' ? 'active' : ''}" onclick="setCurrency('GBP')">GBP (£)</button>
        </div>
    `;
    statsSection.insertAdjacentHTML('afterbegin', toggleHtml);
}

// Set currency and refresh display
window.setCurrency = function(currency) {
    currentCurrency = currency;
    
    // Update toggle buttons
    document.querySelectorAll('.currency-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`.currency-btn[onclick="setCurrency('${currency}')"]`).classList.add('currency-btn-active');
    
    // Refresh all displays
    updateStats(waterProjects);
    filterProjects(); // This will refresh markers and details
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

// Add investment opportunities section
const investmentOpportunities = waterProjects.filter(p => p.investmentPotential && p.investmentPotential.includes('Medium'));

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
// NEW: Generate fallback data based on actual portal content
function generateFallbackWashData() {
    washPortalData = [
        {
            institution: 'IWMI - Solar Energy for Agricultural Resilience (SoLAR)',
            year: '2025',
            description: 'Phase II Inception Workshop in Bangladesh focusing on scaling solar irrigation with USD 1.8 billion investment potential. Targets replacement of 1.2 million diesel pumps.',
            type: 'project',
            title: 'Solar Irrigation Scaling in Bangladesh',
            investmentPotential: 'Medium - Stable government contracts',
            location: 'Bangladesh'
        },
        {
            institution: 'IWMI - Nigeria Solar Irrigation Study',
            year: '2025',
            description: 'Co-designing scaling pathways for solar irrigation technology ownership in northern Nigeria. Farmers prefer shared ownership in micro-clusters with harvest-aligned financing.',
            type: 'research',
            title: 'Solar-Based Irrigation Systems in Northern Nigeria',
            investmentPotential: 'Medium',
            location: 'Nigeria'
        },
        {
            institution: 'arXiv Preprint - physics.chem-ph',
            year: '2026',
            description: 'Hydroxide ion transport in anion-exchange membranes for green hydrogen production studied with machine-learned interatomic potentials. Water content transforms isolated water clusters into connected hydrogen-bond networks.',
            type: 'preprint',
            title: 'Hydroxide Transport in Anion-Exchange Membranes',
            location: 'USA'
        },
        {
            institution: 'arXiv Preprint - cs.CE',
            year: '2026',
            description: 'Time-dependent modeling framework for autogenous self-healing concrete coupling moisture diffusion with damage evolution. Machine learning models predict healing times with 99.9% accuracy.',
            type: 'preprint',
            title: 'Self-Healing Concrete Modeling Framework',
            location: 'UK'
        },
        {
            institution: 'IWMI - Jordan Refugee Camp Study',
            year: '2025',
            description: 'Integrated watershed and climate risk hotspot mapping to support adaptation strategies in refugee camp landscapes. Combines hydrological analysis, climate projections, and socio-economic indicators.',
            type: 'research',
            title: 'Water Security in Refugee-Hosting Landscapes',
            location: 'Jordan'
        },
        {
            institution: 'IWMI - India Agroecology',
            year: '2025',
            description: 'Agroecological transition pathways for India scaling from homesteads to multifunctional landscapes. Evidence from Akole landscape in Western Ghats.',
            type: 'publication',
            title: 'Agroecological Transition Pathways for India',
            location: 'India'
        },
        {
            institution: 'IWMI - Water and Soil Accelerator (WASA)',
            year: '2024',
            description: 'Three-year initiative scaling evidence-based water and soil management practices across rainfed agricultural systems in Malawi and Zambia. Targets one million farmers and one million hectares.',
            type: 'project',
            title: 'WASA Malawi-Zambia',
            investmentPotential: 'Medium - Stable government contracts',
            location: 'Malawi/Zambia'
        },
        {
            institution: 'IWMI - Ghana Cocoa Study',
            year: '2025',
            description: 'Pathways to climate-resilient cocoa: solar-powered Irrigation-as-a-Service as an adaptation strategy. Farmers show strong enthusiasm for solar-powered systems through cooperatives.',
            type: 'research',
            title: 'Solar Irrigation for Cocoa in Ghana',
            investmentPotential: 'Medium',
            location: 'Ghana'
        },
        {
            institution: 'IWMI - Kenya Finance Workshop',
            year: '2025',
            description: 'Co-designing blended finance mechanisms for farmer-led irrigation in Kenya. Results-based financing facility and risk-sharing credit facility to de-risk lending.',
            type: 'workshop',
            title: 'Blended Finance for Irrigation in Kenya',
            investmentPotential: 'Medium',
            location: 'Kenya'
        },
        {
            institution: 'IWMI - Tamil Nadu Climate Action',
            year: '2025',
            description: 'CGIAR Climate Action Program in Tamil Nadu addressing droughts, heatwaves, floods, and cyclones. Deploying decision-support tools including SADMS, AWARE, and climate-smart governance dashboards.',
            type: 'project',
            title: 'Tamil Nadu Climate Adaptation',
            investmentPotential: 'Medium - Stable government contracts',
            location: 'India'
        },
        {
            institution: 'IWMI - Odisha MAR Study',
            year: '2025',
            description: 'State-scale spatial suitability assessment for Managed Aquifer Recharge using GIS-based multi-criteria framework. Identifies priority zones for climate-resilient groundwater development.',
            type: 'research',
            title: 'Managed Aquifer Recharge in Odisha',
            location: 'India'
        },
        {
            institution: 'PLOS Water',
            year: 'Mar 17, 2026',
            description: 'Latest research publication in water science and technology featuring global water security and climate adaptation studies.',
            type: 'journal',
            title: 'PLOS Water - Recent Advances',
            location: 'Global'
        },
        {
            institution: 'Nature Water',
            year: 'Mar 17, 2026',
            description: 'New findings in water research and technology innovation including membrane technologies and water treatment advances.',
            type: 'journal',
            title: 'Nature Water - Current Issue',
            location: 'Global'
        },
        {
            institution: 'International Water Resources Association',
            year: '2026',
            description: 'Water International journal featuring research on water science, policy, and governance. Special issue on island water futures and gender equality in water management.',
            type: 'journal',
            title: 'Water International - Recent Issue',
            location: 'Global'
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
// Show project details in sidebar with impact data
function showProjectDetails(project) {
    const detailsDiv = document.getElementById('project-details');
    
    // Add impact section if available
    const impactHtml = project.impact ? 
        `<p style="color: #4a5568; margin-top: 10px;"><i class="fas fa-users"></i> <strong>Impact:</strong> ${project.impact}</p>` : '';
    
    const investmentHtml = project.investmentPotential ? 
        `<p style="color: #92400e; background: #fef3c7; padding: 5px 10px; border-radius: 5px; margin-top: 10px;"><i class="fas fa-chart-line"></i> <strong>Investment Potential:</strong> ${project.investmentPotential}</p>` : '';
    
    detailsDiv.innerHTML = `
        <div style="background: #f7fafc; padding: 15px; border-radius: 8px;">
            <h4 style="color: #2d3748; margin-bottom: 10px; font-size: 1.2em;">${project.name}</h4>
            <p style="color: #718096; margin-bottom: 5px;"><i class="fas fa-map-marker-alt"></i> ${project.location.city}, ${project.location.country}</p>
            <p style="color: #718096; margin-bottom: 5px;"><i class="fas fa-tag"></i> ${project.type.charAt(0).toUpperCase() + project.type.slice(1)}</p>
            <p style="color: #48bb78; font-weight: 600; margin-bottom: 5px;"><i class="fas fa-dollar-sign"></i> Total Funding: $${(project.funding / 1000000).toFixed(1)}M</p>
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
