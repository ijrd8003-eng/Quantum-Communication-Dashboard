// Sidebar tab switching
document.addEventListener("DOMContentLoaded", () => {
    // Add click listeners to sidebar navigation items
    const navItems = document.querySelectorAll(".nav-item");
    navItems.forEach(item => {
        item.addEventListener("click", (e) => {
            e.preventDefault();
            const tabId = item.getAttribute("data-tab");
            switchTab(tabId);
        });
    });

    // Display current date/time on badge
    const badge = document.getElementById("current-time");
    const updateTime = () => {
        const now = new Date();
        badge.textContent = `Console: ${now.toLocaleTimeString()}`;
    };
    updateTime();
    setInterval(updateTime, 1000);
});

function switchTab(tabId) {
    // Update active class on nav links
    const navItems = document.querySelectorAll(".nav-item");
    navItems.forEach(item => {
        if (item.getAttribute("data-tab") === tabId) {
            item.classList.add("active");
        } else {
            item.classList.remove("active");
        }
    });

    // Update active class on tab panels
    const tabPanels = document.querySelectorAll(".tab-panel");
    tabPanels.forEach(panel => {
        if (panel.id === `${tabId}-tab`) {
            panel.classList.add("active");
        } else {
            panel.classList.remove("active");
        }
    });

    // Update header title
    const headerTitle = document.getElementById("page-title");
    const titles = {
        overview: "Dashboard Overview",
        bell: "Bell States Lab",
        entanglement: "Quantum Entanglement Lab",
        teleportation: "Quantum Teleportation Lab"
    };
    headerTitle.textContent = titles[tabId] || "Quantum Lab";

    // Add a simple terminal log when switching tabs
    const capitalized = tabId.charAt(0).toUpperCase() + tabId.slice(1);
    appendTerminalLine(`<span class="t-prompt">quantum-lab@aer-simulator:~$</span> cd /labs/${tabId}`);
    appendTerminalLine(`<span class="t-text">Switched workspace to /labs/${tabId}. READY.</span>`);
}

// Terminal helper functions
function appendTerminalLine(htmlContent) {
    const terminalBody = document.getElementById("terminal-body");
    
    // Remove the blinking cursor line first if it exists
    const cursorLine = terminalBody.querySelector(".cursor-line");
    if (cursorLine) {
        cursorLine.remove();
    }

    // Append new line
    const p = document.createElement("p");
    p.innerHTML = htmlContent;
    terminalBody.appendChild(p);

    // Re-append the blinking cursor
    const cLine = document.createElement("p");
    cLine.className = "cursor-line";
    cLine.innerHTML = `<span class="t-prompt">quantum-lab@aer-simulator:~$</span> <span class="cursor"></span>`;
    terminalBody.appendChild(cLine);

    // Auto-scroll to bottom
    terminalBody.scrollTop = terminalBody.scrollHeight;
}

function clearTerminal() {
    const terminalBody = document.getElementById("terminal-body");
    terminalBody.innerHTML = `<p class="t-info">// Terminal cleared. Simulator operational.</p>`;
    const cLine = document.createElement("p");
    cLine.className = "cursor-line";
    cLine.innerHTML = `<span class="t-prompt">quantum-lab@aer-simulator:~$</span> <span class="cursor"></span>`;
    terminalBody.appendChild(cLine);
}

// Print logs sequentially with delays to simulate actual simulation steps
function playTerminalLogs(lines, callback) {
    let index = 0;
    
    function printNext() {
        if (index < lines.length) {
            const line = lines[index];
            appendTerminalLine(line.text);
            index++;
            setTimeout(printNext, line.delay || 150);
        } else if (callback) {
            callback();
        }
    }
    
    printNext();
}

// Main simulation trigger
function runQuantumSimulation(mode) {
    const btn = document.getElementById(`btn-simulate-${mode}`);
    if (btn) btn.disabled = true;

    clearTerminal();
    
    // 1. Initial terminal logs simulating execution startup
    const startLogs = [
        { text: `<span class="t-prompt">quantum-lab@aer-simulator:~$</span> python run_${mode}_simulation.py`, delay: 200 },
        { text: `<span class="t-info">[INFO]</span> Importing Qiskit libraries and Aer simulator backend...`, delay: 250 },
        { text: `<span class="t-info">[INFO]</span> Creating ${mode} quantum circuit configuration...`, delay: 300 }
    ];

    if (mode === "bell") {
        startLogs.push(
            { text: `<span class="t-info">[INFO]</span> Circuit defined: q_0 = H(0), CNOT(0->1), measure both qubits.`, delay: 200 },
            { text: `<span class="t-info">[INFO]</span> Quantum circuit initialized: 2 Qubits, 2 Classical Bits.`, delay: 200 }
        );
    } else if (mode === "entanglement") {
        startLogs.push(
            { text: `<span class="t-info">[INFO]</span> Circuit defined: q_0 = H(0), CNOT(0->1), measure both.`, delay: 200 },
            { text: `<span class="t-info">[INFO]</span> Creating EPR pair state on channels 0 and 1.`, delay: 200 }
        );
    } else if (mode === "teleportation") {
        startLogs.push(
            { text: `<span class="t-info">[INFO]</span> Circuit defined: 3 Qubits, 3 Classical Bits.`, delay: 200 },
            { text: `<span class="t-info">[INFO]</span> Alice's qubit q_0 prepared. EPR pair created on q_1 and q_2.`, delay: 200 },
            { text: `<span class="t-info">[INFO]</span> Bell measurement performed on qubits q_0 and q_1.`, delay: 200 }
        );
    }

    startLogs.push(
        { text: `<span class="t-info">[INFO]</span> Submitting quantum circuit to local AerSimulator backend...`, delay: 350 },
        { text: `<span class="t-info">[INFO]</span> Simulating circuit with 1024 shots...`, delay: 400 }
    );

    playTerminalLogs(startLogs, () => {
        // Fetch simulation results from backend
        fetch(`/simulate/${mode}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.status === "success") {
                    const counts = data.counts;
                    const totalShots = Object.values(counts).reduce((a, b) => a + b, 0);

                    // 2. Format a beautiful monospaced table for the output terminal
                    let tableHeader = `<span class="t-text">----------------------------------------------------</span><br>` +
                                      `<span class="t-highlight">| Outcome State | Simulated Counts | Probability   |</span><br>` +
                                      `<span class="t-text">----------------------------------------------------</span>`;
                    let tableRows = "";
                    
                    // Sort outcomes alphabetically for consistency
                    const sortedOutcomes = Object.keys(counts).sort();
                    sortedOutcomes.forEach(key => {
                        const count = counts[key];
                        const prob = ((count / totalShots) * 100).toFixed(2);
                        // String padding helper
                        const stateStr = key.padEnd(13);
                        const countStr = count.toString().padEnd(16);
                        const probStr = (prob + "%").padEnd(14);
                        
                        tableRows += `<span class="t-text">| ${stateStr} | ${countStr} | ${probStr} |</span><br>`;
                    });
                    
                    let tableFooter = `<span class="t-text">----------------------------------------------------</span><br>` +
                                      `<span class="t-text">Total Shots: ${totalShots}</span>`;
                    
                    const successLogs = [
                        { text: `<span class="t-success">[OK]</span> AerSimulator run completed successfully in 8.4ms.`, delay: 200 },
                        { text: `<span class="t-success">[OK]</span> Measurement counts loaded:`, delay: 100 },
                        { text: tableHeader, delay: 50 },
                        { text: tableRows + tableFooter, delay: 50 },
                        { text: `<span class="t-info">[INFO]</span> Exporting visualizations (Matplotlib backend)...`, delay: 200 },
                        { text: `<span class="t-success">[OK]</span> Circuit diagram saved: <a href="${data.circuit_url}" target="_blank" style="color:#57c7ff; text-decoration:underline;">${data.circuit_url.split('/').pop()}</a>`, delay: 150 },
                        { text: `<span class="t-success">[OK]</span> Histogram graph saved: <a href="${data.histogram_url}" target="_blank" style="color:#57c7ff; text-decoration:underline;">${data.histogram_url.split('/').pop()}</a>`, delay: 150 },
                        { text: `<span class="t-success">Simulations complete. Visualizing results in dashboard panels.</span>`, delay: 100 }
                    ];

                    playTerminalLogs(successLogs, () => {
                        // Re-enable button
                        if (btn) btn.disabled = false;

                        // 3. Update dashboard panels (images and graphs) with cache-busting timestamp
                        const timestamp = new Date().getTime();
                        
                        const circuitImg = document.getElementById(`${mode}-circuit-img`);
                        const circuitPlaceholder = document.getElementById(`${mode}-circuit-placeholder`);
                        if (circuitImg && circuitPlaceholder) {
                            circuitImg.src = `${data.circuit_url}?t=${timestamp}`;
                            circuitImg.style.display = "block";
                            circuitPlaceholder.style.display = "none";
                        }

                        const histogramImg = document.getElementById(`${mode}-histogram-img`);
                        const histogramPlaceholder = document.getElementById(`${mode}-histogram-placeholder`);
                        if (histogramImg && histogramPlaceholder) {
                            histogramImg.src = `${data.histogram_url}?t=${timestamp}`;
                            histogramImg.style.display = "block";
                            histogramPlaceholder.style.display = "none";
                        }
                    });
                } else {
                    throw new Error(data.message || "Unknown error during simulation.");
                }
            })
            .catch(error => {
                console.error("Simulation failed:", error);
                const errorLogs = [
                    { text: `<span class="t-error">[ERROR]</span> Simulation failed to execute: ${error.message}`, delay: 200 },
                    { text: `<span class="t-error">[ERROR]</span> Please check if pylatexenc or matplotlib is misconfigured in venv.`, delay: 200 }
                ];
                playTerminalLogs(errorLogs, () => {
                    if (btn) btn.disabled = false;
                });
            });
    });
}