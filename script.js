// Currency state
let currentCurrency = 'USD';
const exchangeRate = 0.79; // 1 USD = 0.79 GBP
let map;
let markers = [];
let waterProjects = []; // Will be dynamically populated
let lastAccessed = new Date();

// WASH Portal data extraction function - FULLY DYNAMIC
async function fetchWashPortalData() {
    try {
        // Update last accessed time
        lastAccessed = new Date();
        
        // Try to fetch via a CORS proxy
        const proxyUrl = 'https://api.allorigins.win/raw?url=';
        const targetUrl = 'https://water-research.onrender.com';
        
        console.log('Fetching data from WASH Portal...');
        const response = await fetch(proxyUrl + encodeURIComponent(targetUrl));
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const htmlText = await response.text();
        console.log('Data fetched successfully, parsing HTML...');
        
        // Parse the HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');
        
        // Dynamically extract projects from the portal
        const projects = await extractProjectsFromPortalDynamic(doc, targetUrl);
        
        console.log(`Extracted ${projects.length} projects from portal`);
        return projects;
        
    } catch (error) {
        console.error('Error fetching WASH Portal data:', error);
        // Return empty array if fetch fails - no hard-coded fallbacks
        return [];
    }
}

// Dynamically extract projects from portal HTML
async function extractProjectsFromPortalDynamic(doc, sourceUrl) {
    const projects = [];
    const textContent = doc.body.textContent || '';
    
    // Method 1: Extract from visible text content
    const lines = textContent.split('\n');
    let currentSection = '';
    let currentProject = null;
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        // Detect IWMI Publications section
        if (line.includes('Latest IWMI Publications')) {
            currentSection = 'iwmi';
            continue;
        }
        
        // Detect arXiv section
        if (line.includes('arXiv Preprints')) {
            currentSection = 'arxiv';
            continue;
        }
        
        // Detect journal sections
        if (line.includes('PLOS Water') || line.includes('Nature Water') || line.includes('Water International')) {
            currentSection = 'journal';
            // Extract journal article
            const journalProject = extractJournalFromText(line, sourceUrl);
            if (journalProject) projects.push(journalProject);
            continue;
        }
        
        // Extract dc.title fields (IWMI publications)
        if (line.includes('dc.title:')) {
            if (currentProject) {
                // Finalize previous project
                if (currentProject.name && currentProject.location) {
                    enrichProjectWithDefaults(currentProject);
                    projects.push(currentProject);
                }
            }
            
            // Start new project
            currentProject = {
                name: line.replace('dc.title:', '').trim(),
                location: null,
                funding: null,
                fundingUSD: null,
                fundingGBP: null,
                fundingSources: [],
                research: {},
                status: 'active',
                dateAccessed: lastAccessed.toISOString().split('T')[0],
                sourceUrl: sourceUrl,
                reference: `IWMI Publication - ${new Date().getFullYear()}`
            };
            continue;
        }
        
        // Extract dc.contributor.author
        if (line.includes('dc.contributor.author:') && currentProject) {
            const authors = line.replace('dc.contributor.author:', '').trim();
            // Could use authors for something, but not essential
            continue;
        }
        
        // Extract dcterms.abstract for description
        if (line.includes('dcterms.abstract:') && currentProject) {
            let abstract = line.replace('dcterms.abstract:', '').trim();
            // Try to get more of the abstract if it continues
            let nextIndex = i + 1;
            while (nextIndex < lines.length && lines[nextIndex].trim() && !lines[nextIndex].includes('dc.title:') && !lines[nextIndex].includes('cg.contributor')) {
                abstract += ' ' + lines[nextIndex].trim();
                nextIndex++;
                i = nextIndex - 1;
            }
            currentProject.research.description = abstract.substring(0, 300);
            continue;
        }
        
        // Extract location hints from text
        if (currentProject && !currentProject.location) {
            const locationKeywords = ['Bangladesh', 'Nigeria', 'Malawi', 'Zambia', 'Jordan', 'India', 'Ghana', 'Kenya', 'Nepal', 'Cambodia', 'Tamil Nadu', 'Odisha', 'Maharashtra'];
            for (const keyword of locationKeywords) {
                if (line.includes(keyword)) {
                    currentProject.location = getLocationCoordinates(keyword);
                    break;
                }
            }
        }
        
        // Extract funding hints
        if (currentProject && !currentProject.funding) {
            const fundingMatch = line.match(/\$?\s*(\d+(?:\.\d+)?)\s*(billion|million|B|M)/i);
            if (fundingMatch) {
                let amount = parseFloat(fundingMatch[1]);
                const unit = fundingMatch[2].toLowerCase();
                
                if (unit === 'billion' || unit === 'b') {
                    amount = amount * 1000000000;
                } else if (unit === 'million' || unit === 'm') {
                    amount = amount * 1000000;
                }
                
                currentProject.funding = amount;
                currentProject.fundingUSD = amount;
                currentProject.fundingGBP = Math.round(amount * exchangeRate);
                
                // Try to extract funding source
                const sourceMatch = line.match(/([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s*(?:provided|funded|supported|grant)/i);
                if (sourceMatch && !currentProject.fundingSources.length) {
                    currentProject.fundingSources.push({
                        name: sourceMatch[1],
                        amount: amount,
                        type: inferFundingType(sourceMatch[1])
                    });
                }
            }
        }
        
        // Extract investment potential
        if (line.includes('Investment Potential:') && currentProject) {
            currentProject.investmentPotential = line.replace('Investment Potential:', '').trim();
        }
    }
    
    // Add the last project if valid
    if (currentProject && currentProject.name && currentProject.location) {
        enrichProjectWithDefaults(currentProject);
        projects.push(currentProject);
    }
    
    // Extract arXiv preprints dynamically
    const arxivProjects = extractArxivFromText(textContent, sourceUrl);
    projects.push(...arxivProjects);
    
    // Remove duplicates based on name
    const uniqueProjects = [];
    const names = new Set();
    for (const project of projects) {
        if (!names.has(project.name)) {
            names.add(project.name);
            uniqueProjects.push(project);
        }
    }
    
    return uniqueProjects;
}

// Extract arXiv preprints dynamically from text
function extractArxivFromText(textContent, sourceUrl) {
    const projects = [];
    const arxivRegex = /arXiv:(\d+\.\d+v\d+)/g;
    const matches = [...textContent.matchAll(arxivRegex)];
    
    const processedIds = new Set();
    
    for (const match of matches) {
        const arxivId = match[0];
        if (processedIds.has(arxivId)) continue;
        processedIds.add(arxivId);
        
        // Get context around the arXiv ID
        const index = textContent.indexOf(arxivId);
        const context = textContent.substring(index, index + 500);
        
        // Extract title (usually follows the arXiv ID)
        let title = '';
        const titleMatch = context.match(/[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\s+(?:[A-Z][a-z]+)*/);
        if (titleMatch) {
            title = titleMatch[0];
        }
        
        // Extract description
        let description = '';
        const descStart = context.indexOf('. ', context.indexOf(arxivId));
        if (descStart > 0) {
            description = context.substring(descStart + 2, Math.min(descStart + 300, context.length));
        }
        
        if (title) {
            projects.push({
                name: title,
                type: 'purification',
                location: getLocationFromArxiv(arxivId),
                funding: null,
                fundingUSD: null,
                fundingGBP: null,
                fundingSources: [],
                research: {
                    institution: 'arXiv Preprint',
                    year: new Date().getFullYear(),
                    description: description || 'Research preprint from arXiv.org'
                },
                status: 'research',
                investmentPotential: 'Research - Early Stage',
                impact: 'Under investigation',
                dateAccessed: lastAccessed.toISOString().split('T')[0],
                sourceUrl: sourceUrl,
                reference: arxivId
            });
        }
    }
    
    return projects;
}

// Extract journal articles dynamically
function extractJournalFromText(line, sourceUrl) {
    const journalMatch = line.match(/(PLOS Water|Nature Water|Water International)/);
    if (!journalMatch) return null;
    
    const journalName = journalMatch[1];
    const dateMatch = line.match(/(Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2},\s+\d{4}/);
    const year = dateMatch ? dateMatch[0] : new Date().getFullYear().toString();
    
    return {
        name: `${journalName} Publication`,
        type: 'monitoring',
        location: { lat: 0, lng: 0, city: 'Global', country: 'International' },
        funding: null,
        fundingUSD: null,
        fundingGBP: null,
        fundingSources: [],
        research: {
            institution: journalName,
            year: year,
            description: `Latest research publication from ${journalName} featuring water science and technology advances.`
        },
        status: 'active',
        investmentPotential: 'Varies by article',
        impact: 'Global water research community',
        dateAccessed: lastAccessed.toISOString().split('T')[0],
        sourceUrl: sourceUrl,
        reference: `${journalName} - ${year}`
    };
}

// Get coordinates for country/city names
function getLocationCoordinates(locationName) {
    const locationMap = {
        'Bangladesh': { lat: 23.6850, lng: 90.3563, city: 'Dhaka', country: 'Bangladesh' },
        'Nigeria': { lat: 9.0820, lng: 8.6753, city: 'Abuja', country: 'Nigeria' },
        'Malawi': { lat: -13.2543, lng: 34.3015, city: 'Lilongwe', country: 'Malawi' },
        'Zambia': { lat: -15.4167, lng: 28.2833, city: 'Lusaka', country: 'Zambia' },
        'Jordan': { lat: 32.2745, lng: 35.8964, city: 'Amman', country: 'Jordan' },
        'India': { lat: 20.5937, lng: 78.9629, city: 'New Delhi', country: 'India' },
        'Ghana': { lat: 7.9465, lng: -1.0232, city: 'Accra', country: 'Ghana' },
        'Kenya': { lat: -1.2921, lng: 36.8219, city: 'Nairobi', country: 'Kenya' },
        'Nepal': { lat: 28.3949, lng: 84.1240, city: 'Kathmandu', country: 'Nepal' },
        'Cambodia': { lat: 11.5449, lng: 104.8923, city: 'Phnom Penh', country: 'Cambodia' },
        'Tamil Nadu': { lat: 11.1271, lng: 78.6569, city: 'Chennai', country: 'India' },
        'Odisha': { lat: 20.9517, lng: 85.0985, city: 'Bhubaneswar', country: 'India' },
        'Maharashtra': { lat: 19.7515, lng: 75.7139, city: 'Mumbai', country: 'India' },
        'USA': { lat: 37.0902, lng: -95.7129, city: 'Washington DC', country: 'USA' },
        'UK': { lat: 55.3781, lng: -3.4360, city: 'London', country: 'UK' }
    };
    
    for (const [key, coords] of Object.entries(locationMap)) {
        if (locationName.includes(key)) {
            return coords;
        }
    }
    
    // Default fallback - but no hard-coded projects use this
    return { lat: 20, lng: 0, city: 'Various', country: 'Global' };
}

// Get location from arXiv ID (heuristic based on ID patterns)
function getLocationFromArxiv(arxivId) {
    // arXiv preprints are international, default to a research hub
    if (arxivId.includes('physics')) {
        return { lat: 42.3601, lng: -71.0589, city: 'Cambridge', country: 'USA' };
    } else if (arxivId.includes('cs')) {
        return { lat: 51.5074, lng: -0.1278, city: 'London', country: 'UK' };
    }
    return { lat: 37.0902, lng: -95.7129, city: 'Various', country: 'International' };
}

// Infer funding type from source name
function inferFundingType(sourceName) {
    if (sourceName.includes('Bank') || sourceName.includes('Government') || sourceName.includes('Agency')) {
        return 'Government';
    } else if (sourceName.includes('Venture') || sourceName.includes('Capital') || sourceName.includes('Equity')) {
        return 'Private Equity';
    } else if (sourceName.includes('UN') || sourceName.includes('World Bank') || sourceName.includes('Development')) {
        return 'Development Bank';
    } else if (sourceName.includes('CGIAR') || sourceName.includes('Research')) {
        return 'Research Grant';
    }
    return 'Unknown';
}

// Enrich project with default values for missing fields
function enrichProjectWithDefaults(project) {
    if (!project.type) {
        // Infer type from name
        const name = project.name.toLowerCase();
        if (name.includes('solar') || name.includes('irrigation') || name.includes('conservation')) {
            project.type = 'conservation';
        } else if (name.includes('membrane') || name.includes('purification') || name.includes('filter')) {
            project.type = 'purification';
        } else if (name.includes('monitoring') || name.includes('governance') || name.includes('policy')) {
            project.type = 'monitoring';
        } else if (name.includes('wastewater') || name.includes('treatment')) {
            project.type = 'wastewater';
        } else {
            project.type = 'conservation';
        }
    }
    
    if (!project.research.institution) {
        project.research.institution = 'International Water Management Institute (IWMI)';
    }
    
    if (!project.research.year) {
        project.research.year = new Date().getFullYear();
    }
    
    if (!project.research.description) {
        project.research.description = 'Research publication from WASH Investment Research Portal';
    }
    
    if (!project.funding) {
        project.funding = null;
        project.fundingUSD = null;
        project.fundingGBP = null;
    }
    
    if (!project.fundingSources || project.fundingSources.length === 0) {
        project.fundingSources = [];
    }
}

// Initialize data from WASH Portal
async function initializeData() {
    // Show loading indicator
    const detailsDiv = document.getElementById('project-details');
    detailsDiv.innerHTML = '<div class="loading-spinner">Loading projects from WASH Portal...</div>';
    
    // Fetch data from portal
    waterProjects = await fetchWashPortalData();
    
    if (waterProjects.length === 0) {
        detailsDiv.innerHTML = '<div class="error-message">Unable to load projects from WASH Portal. Please check your connection and try again.<br><button onclick="refreshData()" class="retry-btn">Retry</button></div>';
        return;
    }
    
    console.log(`Successfully loaded ${waterProjects.length} dynamic projects from WASH Portal`);
    
    // Update last accessed display
    updateLastAccessedDisplay();
    
    // Initialize map with data
    initMap();
    updateYearFilter();
    addCurrencyToggle();
    updateFundingRangeLabels();
    
    // Add event listeners
    document.getElementById('tech-filter').addEventListener('change', filterProjects);
    document.getElementById('funding-filter').addEventListener('change', filterProjects);
    document.getElementById('year-filter').addEventListener('change', filterProjects);
}

// Update last accessed display
function updateLastAccessedDisplay() {
    const formattedDate = lastAccessed.toLocaleString();
    const header = document.querySelector('header');
    
    // Remove existing if present
    const existingDate = document.querySelector('.last-accessed');
    if (existingDate) existingDate.remove();
    
    // Add new date display
    const dateDiv = document.createElement('div');
    dateDiv.className = 'last-accessed';
    dateDiv.innerHTML = `<i class="fas fa-clock"></i> Last data update: ${formattedDate} | Source: <a href="https://water-research.onrender.com" target="_blank">WASH Investment Research Portal</a> | ${waterProjects.length} projects loaded dynamically`;
    header.appendChild(dateDiv);
}

// Initialize the map
function initMap() {
    if (map) {
        map.remove();
    }
    
    map = L.map('map').setView([20, 0], 2);
    
    const tileProviders = [
        {
            url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
        },
        {
            url: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
        }
    ];
    
    L.tileLayer(tileProviders[0].url, {
        attribution: tileProviders[0].attribution,
        maxZoom: tileProviders[0].maxZoom,
        referrerPolicy: 'no-referrer-when-downgrade'
    }).addTo(map);
    
    addMarkers(waterProjects);
    updateStats(waterProjects);
    
    if (waterProjects.length > 0) {
        showProjectDetails(waterProjects[0]);
    }
}

// Add markers to the map
function addMarkers(projects) {
    markers.forEach(marker => marker.remove());
    markers = [];
    
    projects.forEach(project => {
        // Only add markers for projects with valid coordinates
        if (!project.location || !project.location.lat) return;
        
        const customIcon = L.divIcon({
            className: 'custom-marker',
            html: `<div style="background: ${getMarkerColor(project.type)}; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">${project.name.charAt(0)}</div>`,
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        });
        
        const marker = L.marker([project.location.lat, project.location.lng], {
            icon: customIcon
        }).addTo(map);
        
        const fundingText = project.funding ? `Funding: ${formatCurrency(project.funding)}` : 'Funding: Not specified';
        
        marker.bindPopup(`
            <b>${project.name}</b><br>
            ${project.location.city}, ${project.location.country}<br>
            Type: ${project.type}<br>
            ${fundingText}
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

// Format currency based on selected currency
function formatCurrency(amount) {
    if (!amount) return currentCurrency === 'GBP' ? '£N/A' : '$N/A';
    
    if (currentCurrency === 'GBP') {
        const project = waterProjects.find(p => p.funding === amount) || 
                       waterProjects.find(p => p.fundingUSD === amount);
        
        if (project && project.fundingGBP) {
            return `£${(project.fundingGBP / 1000000).toFixed(1)}M`;
        } else {
            return `£${(amount * exchangeRate / 1000000).toFixed(1)}M`;
        }
    } else {
        return `$${(amount / 1000000).toFixed(1)}M`;
    }
}

// Format funding source amounts
function formatFundingAmount(amount, sourceName) {
    if (!amount) return currentCurrency === 'GBP' ? '£N/A' : '$N/A';
    
    if (currentCurrency === 'GBP') {
        const project = waterProjects.find(p => 
            p.fundingSources && p.fundingSources.some(s => s.name === sourceName && s.amount === amount)
        );
        
        if (project && project.fundingGBP) {
            const proportion = amount / project.fundingUSD;
            const gbpAmount = project.fundingGBP * proportion;
            return `£${(gbpAmount / 1000000).toFixed(1)}M`;
        } else {
            return `£${(amount * exchangeRate / 1000000).toFixed(1)}M`;
        }
    } else {
        return `$${(amount / 1000000).toFixed(1)}M`;
    }
}

// Update statistics
function updateStats(projects) {
    const totalProjects = projects.length;
    const projectsWithFunding = projects.filter(p => p.funding);
    const totalFunding = projectsWithFunding.reduce((sum, p) => sum + p.funding, 0);
    const activeResearch = projects.filter(p => p.status === 'active').length;
    
    document.getElementById('total-projects').textContent = totalProjects;
    document.getElementById('total-funding').textContent = totalFunding ? formatCurrency(totalFunding) : 'N/A';
    document.getElementById('active-research').textContent = activeResearch;
}

// Show project details with reference and access date
function showProjectDetails(project) {
    const detailsDiv = document.getElementById('project-details');
    
    const impactHtml = project.impact ? 
        `<p style="color: #4a5568; margin-top: 10px;"><i class="fas fa-users"></i> <strong>Impact:</strong> ${project.impact}</p>` : '';
    
    const investmentHtml = project.investmentPotential ? 
        `<p style="color: #92400e; background: #fef3c7; padding: 5px 10px; border-radius: 5px; margin-top: 10px;"><i class="fas fa-chart-line"></i> <strong>Investment Potential:</strong> ${project.investmentPotential}</p>` : '';
    
    const referenceHtml = project.reference ? 
        `<p style="color: #667eea; margin-top: 10px;"><i class="fas fa-book"></i> <strong>Reference:</strong> ${project.reference}</p>` : '';
    
    const fundingHtml = project.funding ? 
        `<p style="color: #48bb78; font-weight: 600; margin-bottom: 5px;"><i class="fas fa-dollar-sign"></i> Total Funding: ${formatCurrency(project.funding)}</p>` :
        `<p style="color: #a0aec0; margin-bottom: 5px;"><i class="fas fa-dollar-sign"></i> Total Funding: Not specified</p>`;
    
    const accessDateHtml = project.dateAccessed ? 
        `<p style="color: #718096; font-size: 0.85em; margin-top: 10px; border-top: 1px solid #e2e8f0; padding-top: 10px;"><i class="fas fa-calendar-alt"></i> <strong>Data accessed:</strong> ${project.dateAccessed}</p>` : '';
    
    const sourceLinkHtml = project.sourceUrl ? 
        `<p style="color: #718096; font-size: 0.85em;"><i class="fas fa-link"></i> <strong>Source:</strong> <a href="${project.sourceUrl}" target="_blank">WASH Investment Research Portal</a></p>` : '';
    
    detailsDiv.innerHTML = `
        <div style="background: #f7fafc; padding: 15px; border-radius: 8px;">
            <h4 style="color: #2d3748; margin-bottom: 10px; font-size: 1.2em;">${project.name}</h4>
            <p style="color: #718096; margin-bottom: 5px;"><i class="fas fa-map-marker-alt"></i> ${project.location?.city || 'Various'}, ${project.location?.country || 'Global'}</p>
            <p style="color: #718096; margin-bottom: 5px;"><i class="fas fa-tag"></i> ${project.type ? project.type.charAt(0).toUpperCase() + project.type.slice(1) : 'Technology'}</p>
            ${fundingHtml}
            <p style="color: #718096; margin-bottom: 5px;"><i class="fas fa-circle" style="color: ${project.status === 'active' ? '#48bb78' : '#ecc94b'};"></i> Status: ${project.status}</p>
            
            ${investmentHtml}
            ${impactHtml}
            ${referenceHtml}
            
            <div style="margin-top: 15px;">
                <h5 style="color: #4a5568; margin-bottom: 10px;">Research</h5>
                <p style="color: #2d3748; font-weight: 500;">${project.research?.institution || 'Research Institution'}</p>
                <p style="color: #718096; font-size: 0.9em;">${project.research?.description || 'No description available'}</p>
            </div>
            
            <div style="margin-top: 15px;">
                ${sourceLinkHtml}
                ${accessDateHtml}
            </div>
        </div>
    `;
    
    if (project.fundingSources && project.fundingSources.length > 0) {
        updateFundingSources([project]);
    } else {
        document.getElementById('funding-sources').innerHTML = '<p class="placeholder">No funding sources specified in portal data</p>';
    }
}

// Update funding sources
function updateFundingSources(projects) {
    const fundingDiv = document.getElementById('funding-sources');
    
    if (!projects.length || !projects[0].fundingSources || projects[0].fundingSources.length === 0) {
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
    
    fundingDiv.innerHTML = html;
}

// Get unique years from projects
function getUniqueYears() {
    const years = new Set();
    waterProjects.forEach(project => {
        if (project.research && project.research.year) {
            let year = project.research.year.toString();
            // Extract 4-digit year if it's a date string
            const yearMatch = year.match(/\d{4}/);
            if (yearMatch) {
                years.add(yearMatch[0]);
            }
        }
    });
    return Array.from(years).sort((a, b) => b - a);
}

// Update year filter
function updateYearFilter() {
    const yearFilter = document.getElementById('year-filter');
    const years = getUniqueYears();
    
    while (yearFilter.options.length > 1) {
        yearFilter.remove(1);
    }
    
    years.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearFilter.appendChild(option);
    });
}

// Update funding range labels
function updateFundingRangeLabels() {
    const range1 = document.getElementById('range-0-1M');
    const range2 = document.getElementById('range-1M-10M');
    const range3 = document.getElementById('range-10M');
    
    if (currentCurrency === 'GBP') {
        const gbp1M = Math.round(1 * exchangeRate * 10) / 10;
        const gbp10M = Math.round(10 * exchangeRate * 10) / 10;
        
        range1.textContent = `£0 - £${gbp1M}M`;
        range2.textContent = `£${gbp1M}M - £${gbp10M}M`;
        range3.textContent = `£${gbp10M}M+`;
    } else {
        range1.textContent = '$0 - $1M';
        range2.textContent = '$1M - $10M';
        range3.textContent = '$10M+';
    }
}

// Filter projects
function filterProjects() {
    const techType = document.getElementById('tech-filter').value;
    const fundingRange = document.getElementById('funding-filter').value;
    const year = document.getElementById('year-filter').value;
    
    let filtered = waterProjects;
    
    if (techType !== 'all') {
        filtered = filtered.filter(p => p.type === techType);
    }
    
    if (fundingRange !== 'all' && fundingRange !== 'all') {
        let minUSD, maxUSD;
        if (fundingRange === '0-1M') {
            minUSD = 0;
            maxUSD = 1000000;
        } else if (fundingRange === '1M-10M') {
            minUSD = 1000000;
            maxUSD = 10000000;
        } else if (fundingRange === '10M+') {
            minUSD = 10000000;
            maxUSD = Infinity;
        }
        
        filtered = filtered.filter(p => p.fundingUSD && p.fundingUSD >= minUSD && p.fundingUSD <= maxUSD);
    }
    
    if (year !== 'all') {
        filtered = filtered.filter(p => {
            const projectYear = p.research?.year?.toString() || '';
            return projectYear.includes(year);
        });
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

// Add currency toggle
function addCurrencyToggle() {
    const statsSection = document.querySelector('.stats-section');
    const toggleHtml = `
        <div class="currency-toggle">
            <button class="currency-btn ${currentCurrency === 'USD' ? 'currency-btn-active' : ''}" onclick="setCurrency('USD')">USD ($)</button>
            <button class="currency-btn ${currentCurrency === 'GBP' ? 'currency-btn-active' : ''}" onclick="setCurrency('GBP')">GBP (£)</button>
            <button onclick="refreshData()" class="refresh-data-btn" style="margin-left: 10px;"><i class="fas fa-sync-alt"></i> Refresh Data</button>
        </div>
    `;
    statsSection.insertAdjacentHTML('afterbegin', toggleHtml);
}

// Refresh data from portal
window.refreshData = async function() {
    const detailsDiv = document.getElementById('project-details');
    detailsDiv.innerHTML = '<div class="loading-spinner">Refreshing data from WASH Portal...</div>';
    
    waterProjects = await fetchWashPortalData();
    updateLastAccessedDisplay();
    
    // Reinitialize everything
    if (map) {
        map.remove();
    }
    initMap();
    updateYearFilter();
    updateFundingRangeLabels();
    updateStats(waterProjects);
    
    if (waterProjects.length > 0) {
        showProjectDetails(waterProjects[0]);
    }
};

// Set currency
window.setCurrency = function(currency) {
    currentCurrency = currency;
    
    document.querySelectorAll('.currency-btn').forEach(btn => {
        btn.classList.remove('currency-btn-active');
    });
    document.querySelectorAll('.currency-btn').forEach(btn => {
        if (btn.textContent.includes(currency)) {
            btn.classList.add('currency-btn-active');
        }
    });
    
    updateFundingRangeLabels();
    updateStats(waterProjects);
    
    const selectedProject = waterProjects[0];
    if (selectedProject) {
        showProjectDetails(selectedProject);
    }
    
    markers.forEach(marker => {
        const project = waterProjects.find(p => 
            p.location && p.location.lat === marker.getLatLng().lat && 
            p.location.lng === marker.getLatLng().lng
        );
        if (project) {
            const fundingText = project.funding ? `Funding: ${formatCurrency(project.funding)}` : 'Funding: Not specified';
            marker.setPopupContent(`
                <b>${project.name}</b><br>
                ${project.location?.city || 'Various'}, ${project.location?.country || 'Global'}<br>
                Type: ${project.type}<br>
                ${fundingText}
            `);
        }
    });
};

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    initializeData();
});
