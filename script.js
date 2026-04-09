const sections = document.querySelectorAll('section');
        const topButton = document.getElementById('topButton');
        const counters = document.querySelectorAll('[data-target]');
        const chatWindow = document.getElementById('chatWindow');
        const chatInput = document.getElementById('chatInput');

        window.addEventListener('scroll', () => {
            const y = window.scrollY;
            topButton.classList.toggle('show', y > 600);
            sections.forEach(section => {
                const rect = section.getBoundingClientRect();
                if (rect.top < window.innerHeight * 0.8) section.style.opacity = 1;
            });
        });

        function scrollToSection(id) {
            document.getElementById(id).scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        function scrollToTop() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        function scrollToInput() {
            chatInput.focus();
        }

        function animateCounters() {
            counters.forEach(counter => {
                const target = +counter.getAttribute('data-target');
                const increment = target / 80;
                let current = 0;
                const update = () => {
                    current += increment;
                    if (current < target) {
                        counter.textContent = `${Math.ceil(current)}${counter.textContent.includes('+') ? '+' : ''}`;
                        requestAnimationFrame(update);
                    } else {
                        counter.textContent = `${target}${counter.textContent.includes('+') ? '+' : ''}`;
                    }
                };
                update();
            });
        }

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = 1;
                    entry.target.style.transform = 'none';
                    if (entry.target.id === 'home') animateCounters();
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        document.querySelectorAll('section').forEach(section => {
            section.style.opacity = 0;
            section.style.transform = 'translateY(40px)';
            section.style.transition = 'opacity 0.9s ease, transform 0.9s ease';
            observer.observe(section);
        });

        function addChatMessage(content, type = 'bot') {
            const message = document.createElement('div');
            message.className = `chat-message ${type}`;
            message.textContent = content;
            chatWindow.appendChild(message);
            chatWindow.scrollTop = chatWindow.scrollHeight;
        }

        function sendChat() {
            const text = chatInput.value.trim();
            if (!text) return;
            addChatMessage(text, 'user');
            chatInput.value = '';
            setTimeout(() => {
                const reply = generateReply(text.toLowerCase());
                addChatMessage(reply, 'bot');
            }, 600);
        }

        function generateReply(input) {
            const responses = [
                'Our team can build a premium platform with luxury design, AI integration, and global scalability.',
                'We specialize in brand strategy, digital transformation, and AI solutions for high-end businesses.',
                'The Standard plan is our best choice for ambitious companies seeking exceptional growth.',
                'Yes, we offer custom AI workflows, predictive analytics, and immersive digital experiences.',
                'Let’s schedule a strategic consultation and align your project with world-class execution.'
            ];
            if (input.includes('price') || input.includes('cost')) return 'Our pricing plans range from Basic to Premium. The Standard package is ideal for premium growth engagements.';
            if (input.includes('ai') || input.includes('intelligence')) return 'We create smart AI solutions that automate workflows, analyze data, and personalize experiences in real time.';
            if (input.includes('brand') || input.includes('design')) return 'Our branding team delivers iconic visual systems, elite identities, and immersive digital experiences.';
            if (input.includes('contact') || input.includes('start')) return 'Send us a message through the contact form and our concierge team will respond within 24 hours.';
            return responses[Math.floor(Math.random() * responses.length)];
        }

        chatInput.addEventListener('keydown', event => {
            if (event.key === 'Enter') sendChat();
        });

        document.querySelectorAll('nav a').forEach(link => {
            link.addEventListener('click', () => {
                document.querySelectorAll('nav a').forEach(item => item.classList.remove('active'));
                link.classList.add('active');
            });
        });