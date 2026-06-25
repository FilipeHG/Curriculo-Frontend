(function () {
    const DATA_URL = 'data/curriculo-filipe-v1.json';
    const LANGUAGE_STORAGE_KEY = 'curriculoLanguage';
    const DEFAULT_LANGUAGE = 'pt';
    const LANGUAGE_CONFIG = {
        pt: { label: 'Português', flag: 'https://cdn.jsdelivr.net/npm/country-flag-icons@1.5.7/3x2/BR.svg' },
        en: { label: 'English', flag: 'https://cdn.jsdelivr.net/npm/country-flag-icons@1.5.7/3x2/US.svg' }
    };

    function getInitialLanguage(data) {
        const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
        return data.translations[savedLanguage] ? savedLanguage : DEFAULT_LANGUAGE;
    }

    function setTextContent(selector, text) {
        const element = document.querySelector(selector);
        if (element) element.textContent = text;
    }

    function createSectionTitle(iconClass, title) {
        return `<h2 class="section-title"><i class="${iconClass}"></i> ${title}</h2>`;
    }

    function renderSidebar(data, content) {
        const contactRows = data.contact.items.map(item => {
            const value = content.contact[item.key] || item.value;
            if (item.href) {
                return `
						<div class="contact-row">
							<i class="${item.iconClass}"></i>
							<a href="${item.href}" title="${item.title}" target="${item.target || '_self'}">
								${value}
							</a>
						</div>`;
            }

            return `
						<div class="contact-row">
							<i class="${item.iconClass}"></i>
							<span>${value}</span>
						</div>`;
        }).join('');

        const languageLines = content.languages.items.map(language => {
            return `<strong>${language.name}:</strong> ${language.level}`;
        }).join('<br>\n\t\t\t\t\t\t');

        return `
    <!-- COLUNA ESQUERDA (Vira Master Header Boxed no PDF) -->
    <div class="sidebar">
        <div class="profile-box">
            <img src="${data.profile.photo}" alt="${data.profile.photoAlt}" class="profile-pic">
        </div>

        <div class="user-name">${data.profile.name}</div>
        <div class="user-designation">${data.profile.designation}</div>
        
        <!-- Linha geométrica de separação visível apenas no PDF -->
        <hr class="header-sep">

		<div class="contact-box">
			<!-- COLUNA ESQUERDA -->
			<div class="contact-box-left">
				<div class="sidebar-meta-col">
			
					<div class="sidebar-heading">
						<i class="${data.contact.iconClass}"></i>
						${content.contact.title}
					</div>

					<div class="card-soft">${contactRows}
					</div>
				</div>
			</div>

			<!-- COLUNA DIREITA -->
			<div class="contact-box-right">
				<div class="sidebar-meta-col">

					<div class="sidebar-heading">
						<i class="${data.languages.iconClass}"></i>
						${content.languages.title}
					</div>

					<div class="card-soft">
						${languageLines}
					</div>

				</div>
			</div>

		</div>
    </div>`;
    }

    function renderSummary(summary) {
        return `
        <!-- RESUMO -->
        <section class="section">
            ${createSectionTitle(summary.iconClass, summary.title)}
            <div class="summary-wrapper">
                ${summary.paragraphs.map(paragraph => `<p class="summary-p">\n\t\t\t\t\t${paragraph}\n\t\t\t\t</p>`).join('\n\t\t\t\t')}
            </div>
        </section>`;
    }

    function renderSkills(skills) {
        const categories = skills.categories.map(category => {
            const pills = category.items.map(item => `<span class="skill-pill ${category.pillClass}">${item}</span>`).join('\n\t\t\t\t\t');

            return `
			<!-- ${category.title} -->
			<div class="skill-category-card">
				<div class="skill-category-title">
					${category.title}
				</div>

				<div>
					${pills}
				</div>
			</div>`;
        }).join('\n');

        return `
		<!-- HABILIDADES TÉCNICAS -->
		<section class="section">
			<h2 class="section-title">
				<i class="${skills.iconClass}"></i>
				${skills.title}
			</h2>
${categories}
		</section>`;
    }

    function renderDescription(description) {
        if (Array.isArray(description)) {
            return `
                        <ul>
                            ${description.map(item => `<li>${item}</li>`).join('\n                            ')}
                        </ul>`;
        }

        return `<p class="mb-0">${description}</p>`;
    }

    function renderExperience(experience) {
        const jobs = experience.jobs.map((job, index) => {
            const lastClass = index === experience.jobs.length - 1 ? ' mb-0' : '';
            const tags = job.tags.map(tag => `<span class="micro-tag">${tag}</span>`).join('');

            return `
                <div class="job-slot${lastClass}">
                    <div class="d-flex justify-content-between align-items-baseline mb-1">
                        <h3 class="job-company">${job.company}</h3>
                        <span class="job-period">${job.period}</span>
                    </div>
                    <div class="job-role">${job.role}</div>
                    <div class="job-desc">
                        ${renderDescription(job.description)}
                    </div>
                    <div class="micro-skill-box">
                        ${tags}
                    </div>
                </div>`;
        }).join('\n');

        return `
        <!-- EXPERIÊNCIA PROFISSIONAL (Cada vaga virou um Card isolado) -->
        <section class="section">
            ${createSectionTitle(experience.iconClass, experience.title)}
            
            <div class="timeline">
${jobs}

            </div>
        </section>`;
    }

    function renderEducationBox(item, isLast, extraBoxClass) {
        const boxClass = `edu-box${extraBoxClass ? ` ${extraBoxClass}` : ''}${isLast ? ' mb-0' : ''}`;
        const meta = item.meta ? `\n                <div class="edu-meta">${item.meta}</div>` : '';
        const box = `
            <div class="${boxClass}">
                <div class="edu-title">${item.title}</div>${meta}
            </div>`;

        if (!item.href) return box;

        return `
			<a href="${item.href}" title="${item.linkTitle}" target="_blank" class="edu-box-link">
				<div class="${boxClass}">
					<div class="edu-title">
						${item.title}
					</div>

					<div class="edu-meta">${item.meta}</div>
				</div>
			</a>`;
    }

    function renderSimpleListSection(section, comment) {
        const items = section.items.map((item, index) => renderEducationBox(item, index === section.items.length - 1)).join('\n');

        return `
        <!-- ${comment} -->
        <section class="section">
            ${createSectionTitle(section.iconClass, section.title)}
            ${items}
        </section>`;
    }

    function renderCertifications(certifications) {
        const items = certifications.items.map((item, index) => {
            const lastClass = index === certifications.items.length - 1 ? ' mb-0' : '';
            return `
			<div class="edu-box${lastClass}">
				<div class="edu-title">
					${item}
				</div>
			</div>`;
        }).join('\n');

        return `
		<section class="section">
			<h2 class="section-title">
				<i class="${certifications.iconClass}"></i>
				${certifications.title}
			</h2>
${items}
		</section>`;
    }

    function renderCourses(courses) {
        const items = courses.items.map(item => {
            return `
                <div class="col-6">
                    <div class="edu-box h-100 mb-0">
                        <div class="edu-title">${item.title}</div>
                        <div class="edu-meta">${item.meta}</div>
                    </div>
                </div>`;
        }).join('\n');

        return `
        <!-- CURSOS COMPLEMENTARES -->
        <section class="section mb-0">
            ${createSectionTitle(courses.iconClass, courses.title)}
            
            <div class="row g-3">
${items}
            </div>
        </section>`;
    }

    function renderResume(data, language) {
        const content = data.translations[language];

        document.documentElement.lang = language === 'pt' ? 'pt-BR' : 'en';
        document.title = content.meta.title;
        setTextContent('#exportPdfButton span', content.ui.exportPdf);

        const root = document.getElementById('resumeRoot');
        root.innerHTML = `
<div class="resume-wrapper">
${renderSidebar(data, content)}

    <!-- COLUNA DIREITA (Vira o corpo sequencial em Cards no PDF) -->
    <div class="main-content">
${renderSummary(content.summary)}
${renderSkills(content.skills)}
${renderExperience(content.experience)}
${renderSimpleListSection(content.education, 'FORMAÇÃO ACADÊMICA')}
${renderCertifications(content.certifications)}
${renderCourses(content.courses)}

    </div>
</div>`;
    }

    function updateLanguagePicker(language) {
        const pickerButton = document.getElementById('languagePickerButton');
        const pickerFlag = document.getElementById('languagePickerFlag');
        const pickerLabel = document.getElementById('languagePickerLabel');
        const options = document.querySelectorAll('.language-picker__option');
        const config = LANGUAGE_CONFIG[language] || LANGUAGE_CONFIG[DEFAULT_LANGUAGE];

        if (!pickerButton || !pickerFlag || !pickerLabel) return;

        pickerFlag.src = config.flag;
        pickerFlag.alt = language.toUpperCase();
        pickerLabel.textContent = config.label;

        options.forEach(option => {
            const isActive = option.getAttribute('data-language') === language;
            option.classList.toggle('is-active', isActive);
            option.setAttribute('aria-selected', String(isActive));
        });
    }

    function initialize(data) {
        const languageSelect = document.getElementById('languageSelect');
        const pickerButton = document.getElementById('languagePickerButton');
        const pickerMenu = document.getElementById('languagePickerMenu');
        const initialLanguage = getInitialLanguage(data);

        if (!languageSelect) return;

        languageSelect.value = initialLanguage;
        updateLanguagePicker(initialLanguage);
        renderResume(data, initialLanguage);

        languageSelect.addEventListener('change', event => {
            const language = event.target.value;
            localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
            updateLanguagePicker(language);
            renderResume(data, language);
        });

        pickerButton?.addEventListener('click', () => {
            const isExpanded = pickerButton.getAttribute('aria-expanded') === 'true';
            pickerButton.setAttribute('aria-expanded', String(!isExpanded));
            pickerMenu?.classList.toggle('show', !isExpanded);
        });

        document.querySelectorAll('.language-picker__option').forEach(option => {
            option.addEventListener('click', () => {
                const language = option.getAttribute('data-language');
                if (!language) return;

                languageSelect.value = language;
                languageSelect.dispatchEvent(new Event('change'));
                pickerButton?.setAttribute('aria-expanded', 'false');
                pickerMenu?.classList.remove('show');
            });
        });

        document.addEventListener('click', event => {
            if (!event.target.closest('.language-picker')) {
                pickerButton?.setAttribute('aria-expanded', 'false');
                pickerMenu?.classList.remove('show');
            }
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        fetch(DATA_URL)
            .then(response => {
                if (!response.ok) throw new Error(`Unable to load ${DATA_URL}`);
                return response.json();
            })
            .then(initialize)
            .catch(error => {
                const root = document.getElementById('resumeRoot');
                root.innerHTML = '<div class="resume-wrapper"><div class="main-content"><section class="section"><p class="summary-p">Não foi possível carregar os dados do currículo.</p></section></div></div>';
                console.error(error);
            });
    });
})();
