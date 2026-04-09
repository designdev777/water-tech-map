// Currency state
let currentCurrency = 'USD';
const exchangeRate = 0.79; // 1 USD = 0.79 GBP
let map;
let markers = [];
let waterProjects = []; // Will be dynamically populated from WASH Portal
let lastAccessed = new Date();

// ============================================
// WASH PORTAL DATA FETCHING - FULLY DYNAMIC
// ============================================

async function fetchWashPortalData() {
    try {
        lastAccessed = new Date();
        
        // Use multiple CORS proxies as fallbacks
        const proxies = [
            'https://api.allorigins.win/raw?url=',
            'https://cors-anywhere.herokuapp.com/',
            'https://thingproxy.freeboard.io/fetch/'
        ];
        
        const targetUrl = 'https://water-research.onrender.com';
        let htmlText = null;
        let workingProxy = null;
        
        // Try each proxy
        for (const proxy of proxies) {
            try {
                console.log(`Trying proxy: ${proxy}`);
                const response = await fetch(proxy + encodeURIComponent(targetUrl));
                if (response.ok) {
                    htmlText = await response.text();
                    workingProxy = proxy;
                    console.log(`Successfully fetched using proxy: ${workingProxy}`);
                    break;
                }
            } catch (err) {
                console.log(`Proxy ${proxy} failed:`, err.message);
            }
        }
        
        if (!htmlText) {
            throw new Error('All CORS proxies failed');
        }
        
        // Parse the HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');
        
        // Extract projects dynamically
        const projects = await extractProjectsFromPortalDynamic(doc, targetUrl);
        
        console.log(`Successfully extracted ${projects.length} projects from WASH Portal`);
        return projects;
        
    } catch (error) {
        console.error('Error fetching WASH Portal data:', error);
        return []; // Return empty array - no hard-coded fallbacks
    }
}

// Dynamically extract projects from portal HTML
async function extractProjectsFromPortalDynamic(doc, sourceUrl) {
    const projects = [];
    const textContent = doc.body.textContent || '';
    
    // Extract IWMI publications (dc.title fields)
    const iwmiProjects = extractIWMIFromText(textContent, sourceUrl);
    projects.push(...iwmiProjects);
    
    // Extract arXiv preprints
    const arxivProjects = extractArxivFromText(textContent, sourceUrl);
    projects.push(...arxivProjects);
    
    // Extract journal articles
    const journalProjects = extractJournalsFromText(textContent, sourceUrl);
    projects.push(...journalProjects);
    
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

// Extract IWMI publications from text content
function extractIWMIFromText(textContent, sourceUrl) {
    const projects = [];
    const lines = textContent.split('\n');
    
    let currentProject = null;
    let abstractBuffer = [];
    let inAbstract = false;
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        // Look for dc.title: (IWMI publication title)
        if (line.includes('dc.title:')) {
            // Save previous project if exists
            if (currentProject && currentProject.name) {
                if (abstractBuffer.length > 0) {
                    currentProject.research.description = abstractBuffer.join(' ').substring(0, 300);
                }
                enrichProjectWithDefaults(currentProject);
                projects.push(currentProject);
            }
            
            // Start new project
            const title = line.replace('dc.title:', '').trim();
            currentProject = {
                id: projects.length + 1,
                name: title,
                type: null,
                location: null,
                funding: null,
                fundingUSD: null,
                fundingGBP: null,
                fundingSources: [],
                research: {
                    institution: 'International Water Management Institute (IWMI)',
                    year: null,
                    description: ''
                },
                status: 'active',
                dateAccessed: lastAccessed.toISOString().split('T')[0],
                sourceUrl: sourceUrl,
                reference: `IWMI Publication - ${new Date().getFullYear()}`
            };
            abstractBuffer = [];
            inAbstract = false;
            continue;
        }
        
        // Look for dcterms.abstract: (description)
        if (currentProject && line.includes('dcterms.abstract:')) {
            let abstract = line.replace('dcterms.abstract:', '').trim();
            abstractBuffer.push(abstract);
            inAbstract = true;
            continue;
        }
        
        // Continue collecting abstract (multi-line)
        if (currentProject && inAbstract && !line.includes('dc.title:') && !line.includes('cg.contributor')) {
            if (line.length > 20 && !line.includes('http')) {
                abstractBuffer.push(line);
            }
        }
        
        // Look for year in cg.contributor or other fields
        if (currentProject && !currentProject.research.year) {
            const yearMatch = line.match(/\b(20\d{2})\b/);
            if (yearMatch) {
                currentProject.research.year = parseInt(yearMatch[1]);
            }
        }
        
        // Look for location hints
        if (currentProject && !currentProject.location) {
            const location = detectLocationInText(line);
            if (location) {
                currentProject.location = location;
            }
        }
        
        // Look for funding amounts
        if (currentProject && !currentProject.funding) {
            const funding = detectFundingInText(line);
            if (funding) {
                currentProject.funding = funding.amount;
                currentProject.fundingUSD = funding.amount;
                currentProject.fundingGBP = Math.round(funding.amount * exchangeRate);
                if (funding.source) {
                    currentProject.fundingSources.push({
                        name: funding.source,
                        amount: funding.amount,
                        type: inferFundingType(funding.source)
                    });
                }
            }
        }
        
        // Look for investment potential
        if (currentProject && line.includes('Investment Potential:')) {
            currentProject.investmentPotential = line.replace('Investment Potential:', '').trim();
        }
    }
    
    // Add the last project
    if (currentProject && currentProject.name) {
        if (abstractBuffer.length > 0) {
            currentProject.research.description = abstractBuffer.join(' ').substring(0, 300);
        }
        enrichProjectWithDefaults(currentProject);
        projects.push(currentProject);
    }
    
    return projects;
}

// Extract arXiv preprints
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
        const context = textContent.substring(index, Math.min(index + 800, textContent.length));
        
        // Extract title (look for capitalized words after the ID)
        let title = '';
        const lines = context.split('\n');
        for (const line of lines) {
            if (line.length > 20 && line.length < 150 && !line.includes('arXiv:') && !line.includes('http')) {
                const cleanLine = line.replace(/^\d+\.\s*/, '').trim();
                if (cleanLine.length > 10 && /[A-Z]/.test(cleanLine)) {
                    title = cleanLine.substring(0, 100);
                    break;
                }
            }
        }
        
        if (!title) {
            title = `Research Preprint ${arxivId}`;
        }
        
        // Extract description
        let description = '';
        const abstractMatch = context.match(/[A-Z][^.!?]*[.!?][^.!?]*[.!?]/);
        if (abstractMatch) {
            description = abstractMatch[0].substring(0, 200);
        }
        
        // Determine location based on content
        let location = { lat: 37.0902, lng: -95.7129, city: 'Various', country: 'International' };
        if (context.includes('Cambridge') || context.includes('MIT') || context.includes('Harvard')) {
            location = { lat: 42.3601, lng: -71.0589, city: 'Cambridge', country: 'USA' };
        } else if (context.includes('London') || context.includes('Oxford') || context.includes('Cambridge UK')) {
            location = { lat: 51.5074, lng: -0.1278, city: 'London', country: 'UK' };
        } else if (context.includes('Berlin') || context.includes('Germany')) {
            location = { lat: 52.5200, lng: 13.4050, city: 'Berlin', country: 'Germany' };
        } else if (context.includes('Tokyo') || context.includes('Japan')) {
            location = { lat: 35.6895, lng: 139.6917, city: 'Tokyo', country: 'Japan' };
        }
        
        projects.push({
            id: projects.length + 1000,
            name: title,
            type: 'purification',
            location: location,
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
    
    return projects;
}

// Extract journal articles
function extractJournalsFromText(textContent, sourceUrl) {
    const projects = [];
    const journals = ['PLOS Water', 'Nature Water', 'Water International'];
    
    for (const journal of journals) {
        if (textContent.includes(journal)) {
            // Find context around the journal mention
            const index = textContent.indexOf(journal);
            const context = textContent.substring(index, Math.min(index + 300, textContent.length));
            
            // Try to extract date
            let year = new Date().getFullYear();
            const dateMatch = context.match(/(Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2},\s+(\d{4})/);
            if (dateMatch) {
                year = parseInt(dateMatch[2]);
            }
            
            // Try to extract title/description
            let description = `Latest research publication from ${journal}`;
            const sentences = context.match(/[^.!?]+[.!?]/g);
            if (sentences && sentences.length > 1) {
                description = sentences[1].trim().substring(0, 200);
            }
            
            projects.push({
                id: projects.length + 2000,
                name: `${journal} Publication`,
                type: 'monitoring',
                location: { lat: 0, lng: 0, city: 'Global', country: 'International' },
                funding: null,
                fundingUSD: null,
                fundingGBP: null,
                fundingSources: [],
                research: {
                    institution: journal,
                    year: year,
                    description: description
                },
                status: 'active',
                investmentPotential: 'Varies by article',
                impact: 'Global water research community',
                dateAccessed: lastAccessed.toISOString().split('T')[0],
                sourceUrl: sourceUrl,
                reference: `${journal} - ${year}`
            });
        }
    }
    
    return projects;
}

// Helper: Detect location in text
function detectLocationInText(text) {
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
        'Ethiopia': { lat: 9.1450, lng: 40.4897, city: 'Addis Ababa', country: 'Ethiopia' },
        'Uganda': { lat: 1.3733, lng: 32.2903, city: 'Kampala', country: 'Uganda' },
        'Tanzania': { lat: -6.3690, lng: 34.8888, city: 'Dodoma', country: 'Tanzania' },
        'South Africa': { lat: -30.5595, lng: 22.9375, city: 'Pretoria', country: 'South Africa' }
    };
    
    for (const [key, coords] of Object.entries(locationMap)) {
        if (text.includes(key)) {
            return coords;
        }
    }
    return null;
}

// Helper: Detect funding in text
function detectFundingInText(text) {
    // Look for USD amounts
    const usdMatch = text.match(/\$\s*(\d+(?:\.\d+)?)\s*(billion|million|B|M)/i);
    if (usdMatch) {
        let amount = parseFloat(usdMatch[1]);
        const unit = usdMatch[2].toLowerCase();
        
        if (unit === 'billion' || unit === 'b') {
            amount = amount * 1000000000;
        } else if (unit === 'million' || unit === 'm') {
            amount = amount * 1000000;
        }
        
        // Try to find funding source
        let source = null;
        const sourceMatch = text.match(/([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(?:provided|funded|supported|grant)/i);
        if (sourceMatch) {
            source = sourceMatch[1];
        }
        
        return { amount: amount, source: source };
    }
    
    // Look for numeric amounts with billion/million
    const numMatch = text.match(/(\d+(?:\.\d+)?)\s*(billion|million)/i);
    if (numMatch) {
        let amount = parseFloat(numMatch[1]);
        const unit = numMatch[2].toLowerCase();
        
        if (unit === 'billion') {
            amount = amount * 1000000000;
        } else if (unit === 'million') {
            amount = amount * 1000000;
        }
        
        return { amount: amount, source: null };
    }
    
    return null;
}

// Helper: Infer funding type
function inferFundingType(sourceName) {
    if (!sourceName) return 'Unknown';
    
    if (sourceName.match(/Bank|Government|Agency|Ministry|Board/i)) {
        return 'Government';
    } else if (sourceName.match(/Venture|Capital|Equity|Partners/i)) {
        return 'Private Equity';
    } else if (sourceName.match(/UN|World Bank|Development|Foundation/i)) {
        return 'Development Bank';
    } else if (sourceName.match(/CGIAR|Research|University|Institute/i)) {
        return 'Research Grant';
    }
    return 'Unknown';
}

// Helper: Enrich project with default values
function enrichProjectWithDefaults(project) {
    // Set type based on name
    if (!project.type) {
        const name = project.name.toLowerCase();
        if (name.includes('solar') || name.includes('irrigation') || name.includes('conservation') || name.includes('water')) {
            project.type = 'conservation';
        } else if (name.includes('membrane') || name.includes('purification') || name.includes('filter') || name.includes('treatment')) {
            project.type = 'purification';
        } else if (name.includes('monitoring') || name.includes('governance') || name.includes('policy') || name.includes('assessment')) {
            project.type = 'monitoring';
        } else if (name.includes('desalination')) {
            project.type = 'desalination';
        } else if (name.includes('wastewater')) {
            project.type = 'wastewater';
        } else {
            project.type = 'conservation';
        }
    }
    
    // Set default location if missing
    if (!project.location) {
        project.location = { lat: 20, lng: 0, city: 'Various', country: 'Global' };
    }
    
    // Set default year if missing
    if (!project.research.year) {
        project.research.year = new Date().getFullYear();
    }
    
    // Set default description if missing
    if (!project.research.description) {
        project.research.description = 'Research publication from WASH Investment Research Portal';
    }
    
    // Ensure funding arrays exist
    if (!project.fundingSources) {
        project.fundingSources = [];
    }
    
    // Set status if missing
    if (!project.status) {
        project.status = 'active';
    }
}

// ============================================
// MAP INITIALIZATION AND RENDERING
// ============================================

async function initializeData() {
    const detailsDiv = document.getElementById('project-details');
    detailsDiv.innerHTML = '<div class="loading-spinner">Loading projects from WASH Portal...</div>';
    
    waterProjects = await fetchWashPortalData();
    
    if (waterProjects.length === 0) {
        detailsDiv.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Unable to load projects from WASH Portal.</p>
                <p>Please check your connection and try again.</p>
                <button onclick="refreshData()" class="retry-btn"><i class="fas fa-sync-alt"></i> Retry</button>
            </div>
        `;
        return;
    }
    
    console.log(`Loaded ${waterProjects.length} projects from WASH Portal`);
    updateLastAccessedDisplay();
    initMap();
    updateYearFilter();
    addCurrencyToggle();
    updateFundingRangeLabels();
    
    document.getElementById('tech-filter').addEventListener('change', filterProjects);
    document.getElementById('funding-filter').addEventListener('change', filterProjects);
    document.getElementById('year-filter').addEventListener('change', filterProjects);
}

function updateLastAccessedDisplay() {
    const formattedDate = lastAccessed.toLocaleString();
    const header = document.querySelector('header');
    
    const existingDate = document.querySelector('.last-accessed');
    if (existingDate) existingDate.remove();
    
    const dateDiv = document.createElement('div');
    dateDiv.className = 'last-accessed';
    dateDiv.innerHTML = `<i class="fas fa-clock"></i> Last data update: ${formattedDate} | Source: <a href="https://water-research.onrender.com" target="_blank">WASH Investment Research Portal</a> | ${waterProjects.length} projects loaded dynamically`;
    header.appendChild(dateDiv);
}

function initMap() {
    if (map) {
        map.remove();
    }
    
    map = L.map('map').setView([20, 0], 2);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
        referrerPolicy: 'no-referrer-when-downgrade'
    }).addTo(map);
    
    addMarkers(waterProjects);
    updateStats(waterProjects);
    
    if (waterProjects.length > 0) {
        showProjectDetails(waterProjects[0]);
    }
}

function addMarkers(projects) {
    markers.forEach(marker => marker.remove());
    markers = [];
    
    projects.forEach(project => {
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
            <b>${escapeHtml(project.name)}</b><br>
            ${escapeHtml(project.location.city)}, ${escapeHtml(project.location.country)}<br>
            Type: ${project.type}<br>
            ${fundingText}
        `);
        
        marker.on('click', () => showProjectDetails(project));
        markers.push(marker);
    });
}

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

function formatCurrency(amount) {
    if (!amount) return currentCurrency === 'GBP' ? '£N/A' : '$N/A';
    
    if (currentCurrency === 'GBP') {
        return `£${(amount * exchangeRate / 1000000).toFixed(1)}M`;
    } else {
        return `$${(amount / 1000000).toFixed(1)}M`;
    }
}

function formatFundingAmount(amount) {
    if (!amount) return currentCurrency === 'GBP' ? '£N/A' : '$N/A';
    
    if (currentCurrency === 'GBP') {
        return `£${(amount * exchangeRate / 1000000).toFixed(1)}M`;
    } else {
        return `$${(amount / 1000000).toFixed(1)}M`;
    }
}

function updateStats(projects) {
    const totalProjects = projects.length;
    const projectsWithFunding = projects.filter(p => p.funding);
    const totalFunding = projectsWithFunding.reduce((sum, p) => sum + p.funding, 0);
    const activeResearch = projects.filter(p => p.status === 'active').length;
    
    document.getElementById('total-projects').textContent = totalProjects;
    document.getElementById('total-funding').textContent = totalFunding ? formatCurrency(totalFunding) : 'N/A';
    document.getElementById('active-research').textContent = activeResearch;
}

function showProjectDetails(project) {
    const detailsDiv = document.getElementById('project-details');
    
    const impactHtml = project.impact ? 
        `<p style="margin-top: 10px;"><i class="fas fa-users"></i> <strong>Impact:</strong> ${escapeHtml(project.impact)}</p>` : '';
    
    const investmentHtml = project.investmentPotential ? 
        `<p style="color: #92400e; background: #fef3c7; padding: 5px 10px; border-radius: 5px; margin-top: 10px;"><i class="fas fa-chart-line"></i> <strong>Investment Potential:</strong> ${escapeHtml(project.investmentPotential)}</p>` : '';
    
    const referenceHtml = project.reference ? 
        `<p style="color: #667eea; margin-top: 10px;"><i class="fas fa-book"></i> <strong>Reference:</strong> ${escapeHtml(project.reference)}</p>` : '';
    
    const fundingHtml = project.funding ? 
        `<p style="color: #48bb78; font-weight: 600; margin-bottom: 5px;"><i class="fas fa-dollar-sign"></i> Total Funding: ${formatCurrency(project.funding)}</p>` :
        `<p style="color: #a0aec0; margin-bottom: 5px;"><i class="fas fa-dollar-sign"></i> Total Funding: Not specified</p>`;
    
    const accessDateHtml = `<p style="color: #718096; font-size: 0.85em; margin-top: 10px; border-top: 1px solid #e2e8f0; padding-top: 10px;"><i class="fas fa-calendar-alt"></i> <strong>Data accessed:</strong> ${project.dateAccessed || lastAccessed.toISOString().split('T')[0]}</p>`;
    
    const sourceLinkHtml = `<p style="color: #718096; font-size: 0.85em;"><i class="fas fa-link"></i> <strong>Source:</strong> <a href="${project.sourceUrl}" target="_blank">WASH Investment Research Portal</a></p>`;
    
    detailsDiv.innerHTML = `
        <div style="background: #f7fafc; padding: 15px; border-radius: 8px;">
            <h4 style="color: #2d3748; margin-bottom: 10px; font-size: 1.2em;">${escapeHtml(project.name)}</h4>
            <p style="color: #718096; margin-bottom: 5px;"><i class="fas fa-map-marker-alt"></i> ${escapeHtml(project.location?.city || 'Various')}, ${escapeHtml(project.location?.country || 'Global')}</p>
            <p style="color: #718096; margin-bottom: 5px;"><i class="fas fa-tag"></i> ${project.type ? project.type.charAt(0).toUpperCase() + project.type.slice(1) : 'Technology'}</p>
            ${fundingHtml}
            <p style="color: #718096; margin-bottom: 5px;"><i class="fas fa-circle" style="color: ${project.status === 'active' ? '#48bb78' : '#ecc94b'};"></i> Status: ${project.status}</p>
            
            ${investmentHtml}
            ${impactHtml}
            ${referenceHtml}
            
            <div style="margin-top: 15px;">
                <h5 style="color: #4a5568; margin-bottom: 10px;">Research</h5>
                <p style="color: #2d3748; font-weight: 500;">${escapeHtml(project.research?.institution || 'Research Institution')}</p>
                <p style="color: #718096; font-size: 0.9em;">${escapeHtml(project.research?.description || 'No description available')}</p>
            </div>
            
            <div style="margin-top: 15px;">
                ${sourceLinkHtml}
                ${accessDateHtml}
            </div>
        </div>
    `;
    
    updateFundingSources(project);
}

function updateFundingSources(project) {
    const fundingDiv = document.getElementById('funding-sources');
    
    if (!project.fundingSources || project.fundingSources.length === 0) {
        fundingDiv.innerHTML = '<p class="placeholder">No funding sources specified in portal data</p>';
        return;
    }
    
    let html = '';
    project.fundingSources.forEach(source => {
        html += `
            <div class="funding-source-item">
                <h4>${escapeHtml(source.name)}</h4>
                <div class="amount">${formatFundingAmount(source.amount)}</div>
                <div class="type">${source.type}</div>
            </div>
        `;
    });
    
    fundingDiv.innerHTML = html;
}

function getUniqueYears() {
    const years = new Set();
    waterProjects.forEach(project => {
        if (project.research && project.research.year) {
            let year = project.research.year.toString();
            const yearMatch = year.match(/\d{4}/);
            if (yearMatch) {
                years.add(yearMatch[0]);
            }
        }
    });
    return Array.from(years).sort((a, b) => b - a);
}

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

function filterProjects() {
    const techType = document.getElementById('tech-filter').value;
    const fundingRange = document.getElementById('funding-filter').value;
    const year = document.getElementById('year-filter').value;
    
    let filtered = waterProjects;
    
    if (techType !== 'all') {
        filtered = filtered.filter(p => p.type === techType);
    }
    
    if (fundingRange !== 'all') {
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

window.refreshData = async function() {
    const detailsDiv = document.getElementById('project-details');
    detailsDiv.innerHTML = '<div class="loading-spinner">Refreshing data from WASH Portal...</div>';
    
    waterProjects = await fetchWashPortalData();
    updateLastAccessedDisplay();
    
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
    
    if (waterProjects.length > 0) {
        showProjectDetails(waterProjects[0]);
    }
    
    markers.forEach(marker => {
        const project = waterProjects.find(p => 
            p.location && p.location.lat === marker.getLatLng().lat && 
            p.location.lng === marker.getLatLng().lng
        );
        if (project) {
            const fundingText = project.funding ? `Funding: ${formatCurrency(project.funding)}` : 'Funding: Not specified';
            marker.setPopupContent(`
                <b>${escapeHtml(project.name)}</b><br>
                ${escapeHtml(project.location?.city || 'Various')}, ${escapeHtml(project.location?.country || 'Global')}<br>
                Type: ${project.type}<br>
                ${fundingText}
            `);
        }
    });
};

function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    initializeData();
});
