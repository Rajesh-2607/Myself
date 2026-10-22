/* ==========================================================================
   Rajesh S - Portfolio Interactive Script
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* --- 1. Navbar Scroll & Mobile Toggle --- */
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    const navLinkItems = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        highlightNavOnScroll();
    });

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = navToggle.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.className = 'fa-solid fa-xmark';
            } else {
                icon.className = 'fa-solid fa-bars';
            }
        });
    }

    navLinkItems.forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                if (navToggle) navToggle.querySelector('i').className = 'fa-solid fa-bars';
            }
        });
    });

    function highlightNavOnScroll() {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.pageYOffset;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120;
            const sectionId = current.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-links a').forEach(a => {
                    a.classList.remove('active');
                    if (a.getAttribute('href') === `#${sectionId}`) {
                        a.classList.add('active');
                    }
                });
            }
        });
    }


    /* --- 2. Skill Category Filter --- */
    const filterBtns = document.querySelectorAll('.skill-filter-btn');
    const skillCards = document.querySelectorAll('.skill-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            skillCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                if (filterValue === 'all' || cardCategory === filterValue) {
                    card.classList.remove('hide');
                } else {
                    card.classList.add('hide');
                }
            });
        });
    });


    /* --- 3. Demo 1: Fraud Risk Score & SHAP Simulator --- */
    const txnAmount = document.getElementById('txnAmount');
    const txnVelocity = document.getElementById('txnVelocity');
    const accountAge = document.getElementById('accountAge');

    const valAmount = document.getElementById('valAmount');
    const valVelocity = document.getElementById('valVelocity');
    const valAge = document.getElementById('valAge');

    const riskScoreVal = document.getElementById('riskScoreVal');
    const riskLabel = document.getElementById('riskLabel');
    const shapVelocity = document.getElementById('shapVelocity');
    const shapAmount = document.getElementById('shapAmount');
    const shapAge = document.getElementById('shapAge');

    function updateFraudSimulator() {
        if (!txnAmount || !txnVelocity || !accountAge) return;

        const amt = parseFloat(txnAmount.value);
        const vel = parseInt(txnVelocity.value);
        const age = parseInt(accountAge.value);

        valAmount.textContent = `$${amt.toLocaleString()}`;
        valVelocity.textContent = `${vel} txns`;
        valAge.textContent = `${age} days`;

        // Calculate risk score heuristic
        let score = Math.round(
            (vel * 3.5) +
            ((amt / 5000) * 35) +
            Math.max(0, (180 - age) * 0.25)
        );
        score = Math.min(99, Math.max(5, score));

        riskScoreVal.textContent = `${score}%`;

        // SHAP contribution ratios
        let velContrib = Math.min(95, Math.round((vel / 20) * 85 + 10));
        let amtContrib = Math.min(95, Math.round((amt / 5000) * 80 + 15));
        let ageContrib = Math.min(95, Math.round(Math.max(10, (365 - age) / 365 * 70)));

        shapVelocity.style.width = `${velContrib}%`;
        shapAmount.style.width = `${amtContrib}%`;
        shapAge.style.width = `${ageContrib}%`;

        if (score >= 70) {
            riskScoreVal.style.color = 'var(--accent-red)';
            riskLabel.textContent = 'HIGH FRAUD RISK';
            riskLabel.style.color = 'var(--accent-red)';
        } else if (score >= 40) {
            riskScoreVal.style.color = 'var(--accent-orange)';
            riskLabel.textContent = 'ELEVATED RISK';
            riskLabel.style.color = 'var(--accent-orange)';
        } else {
            riskScoreVal.style.color = 'var(--accent-green)';
            riskLabel.textContent = 'LOW RISK / NORMAL';
            riskLabel.style.color = 'var(--accent-green)';
        }
    }

    [txnAmount, txnVelocity, accountAge].forEach(input => {
        if (input) input.addEventListener('input', updateFraudSimulator);
    });
    updateFraudSimulator();


    /* --- 4. Demo 2: AI Smart CCTV Stream Canvas Simulator --- */
    const cctvCanvas = document.getElementById('cctvCanvas');
    const cctvCamName = document.getElementById('cctvCamName');
    const cctvBtns = document.querySelectorAll('.cctv-btn');
    const cctvAlertFeed = document.getElementById('cctvAlertFeed');

    let currentCam = 'cam1';
    let cctvFrame = 0;

    const camData = {
        cam1: {
            title: 'CAM 01 - Warehouse',
            boxes: [
                { label: 'Hazard: Smoke / Fire', confidence: '0.94', color: '#ef4444', x: 220, y: 50, w: 120, h: 90 },
                { label: 'Person: Worker #12', confidence: '0.98', color: '#00f2fe', x: 80, y: 90, w: 55, h: 100 }
            ]
        },
        cam2: {
            title: 'CAM 02 - Main Entrance',
            boxes: [
                { label: 'Person: Visitor', confidence: '0.96', color: '#00f2fe', x: 140, y: 70, w: 60, h: 110 },
                { label: 'Vehicle: Delivery Van', confidence: '0.92', color: '#f59e0b', x: 260, y: 100, w: 110, h: 80 }
            ]
        },
        cam3: {
            title: 'CAM 03 - Loading Bay',
            boxes: [
                { label: 'Forklift #03', confidence: '0.95', color: '#4facfe', x: 90, y: 80, w: 140, h: 95 },
                { label: 'Person: Operator', confidence: '0.97', color: '#00f2fe', x: 250, y: 110, w: 50, h: 90 }
            ]
        }
    };

    cctvBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            cctvBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCam = btn.getAttribute('data-cam');
            if (cctvCamName) cctvCamName.textContent = camData[currentCam].title;
        });
    });

    function renderCCTVCanvas() {
        if (!cctvCanvas) return;
        const ctx = cctvCanvas.getContext('2d');
        const w = cctvCanvas.width;
        const h = cctvCanvas.height;

        cctvFrame++;

        // Clear canvas
        ctx.fillStyle = '#060911';
        ctx.fillRect(0, 0, w, h);

        // Draw camera room background lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 1;
        for (let x = 0; x < w; x += 40) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
        }
        for (let y = 0; y < h; y += 40) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
        }

        // Draw camera specifics
        const data = camData[currentCam];
        data.boxes.forEach((box, i) => {
            // Add slight subtle movement to boxes
            const jitterX = Math.sin(cctvFrame * 0.05 + i) * 3;
            const jitterY = Math.cos(cctvFrame * 0.05 + i) * 2;

            const bx = box.x + jitterX;
            const by = box.y + jitterY;

            // Draw bounding box
            ctx.strokeStyle = box.color;
            ctx.lineWidth = 2;
            ctx.strokeRect(bx, by, box.w, box.h);

            // Draw label background tag
            ctx.fillStyle = box.color;
            ctx.fillRect(bx, by - 20, box.w, 20);

            // Label text
            ctx.fillStyle = '#000';
            ctx.font = '10px "JetBrains Mono", monospace';
            ctx.fontWeight = 'bold';
            ctx.fillText(`${box.label} (${box.confidence})`, bx + 4, by - 6);
        });

        // Scanline effect
        const scanY = (cctvFrame * 2) % h;
        ctx.fillStyle = 'rgba(0, 242, 254, 0.08)';
        ctx.fillRect(0, scanY, w, 4);

        requestAnimationFrame(renderCCTVCanvas);
    }

    renderCCTVCanvas();


    /* --- 5. Demo 3: Voice Assistant HR Interview Simulator --- */
    const tierBtns = document.querySelectorAll('.tier-btn');
    const hrQuestionText = document.getElementById('hrQuestionText');
    const micBtn = document.getElementById('micBtn');
    const waveform = document.getElementById('waveform');
    const starAnalysis = document.getElementById('starAnalysis');

    const hrQuestions = {
        beginner: '"Can you explain how a REST API works and how FastAPI handles asynchronous endpoints?"',
        intermediate: '"Describe a situation where you had to optimize an API endpoint for high concurrency and heavy database read operations."',
        advanced: '"Walk me through your architectural design for a production RAG chatbot using FAISS vector indexing, fallback pipelines, and sub-200ms speech synthesis."'
    };

    tierBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tierBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const tier = btn.getAttribute('data-tier');
            if (hrQuestionText) hrQuestionText.textContent = hrQuestions[tier];
        });
    });

    if (micBtn) {
        let isSimulating = false;
        micBtn.addEventListener('click', () => {
            if (isSimulating) return;
            isSimulating = true;
            micBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Listening & Processing...';

            // Animate waveform
            const bars = waveform.querySelectorAll('.bar');
            let waveInterval = setInterval(() => {
                bars.forEach(bar => {
                    bar.style.height = `${Math.floor(Math.random() * 24) + 6}px`;
                });
            }, 120);

            setTimeout(() => {
                clearInterval(waveInterval);
                bars.forEach(bar => bar.style.height = '10px');
                micBtn.innerHTML = '<i class="fa-solid fa-check"></i> Response Evaluated!';
                micBtn.style.background = 'rgba(16, 185, 129, 0.2)';
                micBtn.style.borderColor = 'var(--accent-green)';
                micBtn.style.color = 'var(--accent-green)';

                if (starAnalysis) {
                    starAnalysis.style.boxShadow = '0 0 15px rgba(0, 242, 254, 0.3)';
                }

                setTimeout(() => {
                    micBtn.innerHTML = '<i class="fa-solid fa-microphone"></i> Test Voice Response';
                    micBtn.style.background = 'rgba(0, 242, 254, 0.15)';
                    micBtn.style.borderColor = 'var(--accent-cyan)';
                    micBtn.style.color = 'var(--accent-cyan)';
                    isSimulating = false;
                }, 3000);
            }, 2500);
        });
    }


    /* --- 6. Demo 4: Face Detection & Clustering Plot Canvas --- */
    const clusterCanvas = document.getElementById('clusterCanvas');
    const clusterBtns = document.querySelectorAll('.cluster-btn');

    let currentAlgo = 'dbscan';

    const clusterPoints = {
        dbscan: [
            { x: 70, y: 60, c: '#00f2fe' }, { x: 80, y: 75, c: '#00f2fe' }, { x: 65, y: 90, c: '#00f2fe' }, { x: 95, y: 65, c: '#00f2fe' },
            { x: 220, y: 130, c: '#7f00ff' }, { x: 240, y: 145, c: '#7f00ff' }, { x: 210, y: 155, c: '#7f00ff' }, { x: 255, y: 125, c: '#7f00ff' },
            { x: 330, y: 65, c: '#10b981' }, { x: 345, y: 80, c: '#10b981' }, { x: 320, y: 95, c: '#10b981' }, { x: 360, y: 70, c: '#10b981' }
        ],
        tsne: [
            { x: 100, y: 100, c: '#00f2fe' }, { x: 115, y: 120, c: '#00f2fe' }, { x: 90, y: 135, c: '#00f2fe' },
            { x: 200, y: 60, c: '#7f00ff' }, { x: 215, y: 75, c: '#7f00ff' }, { x: 185, y: 85, c: '#7f00ff' },
            { x: 300, y: 140, c: '#10b981' }, { x: 320, y: 155, c: '#10b981' }, { x: 285, y: 165, c: '#10b981' }
        ],
        umap: [
            { x: 80, y: 140, c: '#00f2fe' }, { x: 95, y: 150, c: '#00f2fe' }, { x: 110, y: 130, c: '#00f2fe' },
            { x: 260, y: 50, c: '#7f00ff' }, { x: 275, y: 70, c: '#7f00ff' }, { x: 245, y: 80, c: '#7f00ff' },
            { x: 330, y: 110, c: '#10b981' }, { x: 350, y: 125, c: '#10b981' }, { x: 315, y: 130, c: '#10b981' }
        ]
    };

    clusterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            clusterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentAlgo = btn.getAttribute('data-algo');
            renderClusterCanvas();
        });
    });

    function renderClusterCanvas() {
        if (!clusterCanvas) return;
        const ctx = clusterCanvas.getContext('2d');
        const w = clusterCanvas.width;
        const h = clusterCanvas.height;

        ctx.fillStyle = '#04060a';
        ctx.fillRect(0, 0, w, h);

        // Draw subtle grid axes
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(40, 0); ctx.lineTo(40, h); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, h - 30); ctx.lineTo(w, h - 30); ctx.stroke();

        // Label axes
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.fillText(`${currentAlgo.toUpperCase()} Dim-1`, w - 90, h - 10);
        ctx.fillText(`Dim-2`, 10, 20);

        // Draw scatter points
        const points = clusterPoints[currentAlgo] || clusterPoints.dbscan;
        points.forEach(pt => {
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 6, 0, Math.PI * 2);
            ctx.fillStyle = pt.c;
            ctx.shadowColor = pt.c;
            ctx.shadowBlur = 10;
            ctx.fill();
            ctx.shadowBlur = 0; // reset
        });
    }

    renderClusterCanvas();


    /* --- 7. One-Click Copy Functionality & Form Handler --- */
    const copyEmailBtn = document.getElementById('copyEmailBtn');
    const copyPhoneBtn = document.getElementById('copyPhoneBtn');

    function copyToClipboard(text, element) {
        navigator.clipboard.writeText(text).then(() => {
            const icon = element.querySelector('.copy-btn i');
            if (icon) {
                icon.className = 'fa-solid fa-check text-cyan';
                setTimeout(() => {
                    icon.className = 'fa-regular fa-copy';
                }, 2000);
            }
        }).catch(err => {
            console.error('Clipboard copy failed:', err);
        });
    }

    if (copyEmailBtn) {
        copyEmailBtn.addEventListener('click', () => {
            copyToClipboard('rajeshsv.182006@gmail.com', copyEmailBtn);
        });
    }

    if (copyPhoneBtn) {
        copyPhoneBtn.addEventListener('click', () => {
            copyToClipboard('+919790934031', copyPhoneBtn);
        });
    }

    // Contact Form Handler
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');
    const formSubmitBtn = document.getElementById('formSubmitBtn');

    // Set this to a form endpoint (e.g. Formspree/Web3Forms) to deliver
    // messages in the background. While it is empty the form falls back to
    // opening the visitor's mail client, so a message is never silently lost.
    const CONTACT_ENDPOINT = '';
    const CONTACT_EMAIL = 'rajeshsv.182006@gmail.com';

    const resetSubmitBtn = () => {
        formSubmitBtn.disabled = false;
        formSubmitBtn.innerHTML = '<span>Send Message</span> <i class="fa-solid fa-paper-plane"></i>';
    };

    const clearStatusLater = () => setTimeout(() => {
        formStatus.textContent = '';
        formStatus.className = 'form-status';
    }, 6000);

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const payload = {
                name: document.getElementById('formName').value.trim(),
                email: document.getElementById('formEmail').value.trim(),
                subject: document.getElementById('formSubject').value.trim(),
                message: document.getElementById('formMessage').value.trim()
            };

            formSubmitBtn.disabled = true;
            formSubmitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

            if (CONTACT_ENDPOINT) {
                try {
                    const res = await fetch(CONTACT_ENDPOINT, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                        body: JSON.stringify(payload)
                    });
                    if (!res.ok) throw new Error('Request failed with ' + res.status);

                    formSubmitBtn.innerHTML = '<span>Message Sent!</span> <i class="fa-solid fa-check"></i>';
                    formStatus.className = 'form-status success';
                    formStatus.textContent = 'Thanks! Your message has been sent.';
                    contactForm.reset();
                } catch (err) {
                    formStatus.className = 'form-status error';
                    formStatus.textContent = 'Could not send that — please email ' + CONTACT_EMAIL + ' directly.';
                }
                setTimeout(resetSubmitBtn, 4000);
                clearStatusLater();
                return;
            }

            // No endpoint configured: hand the message to the visitor's mail client.
            const subject = payload.subject || ('Portfolio enquiry from ' + (payload.name || 'a visitor'));
            const body = 'From: ' + payload.name + ' <' + payload.email + '>' +
                '\n\n' + payload.message;
            window.location.href = 'mailto:' + CONTACT_EMAIL +
                '?subject=' + encodeURIComponent(subject) +
                '&body=' + encodeURIComponent(body);

            formStatus.className = 'form-status success';
            formStatus.textContent = 'Opening your email app with the message ready to send.';
            resetSubmitBtn();
            clearStatusLater();
        });
    }
});
