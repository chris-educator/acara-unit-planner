"""Australian Curriculum (ACARA) subjects/KLAs and descriptor picks."""

from __future__ import annotations

from dataclasses import dataclass

# Default subject for Unit Setup — Australian Humanities focus.
DEFAULT_SUBJECT = "Humanities and Social Sciences"
DEFAULT_CURRICULUM_FRAMEWORK = "Australian Curriculum (ACARA)"

# Australian Curriculum F–10 learning areas and subjects (Version 9).
# A–Z — single source for /api/subjects and client fallbacks.
KLA_OPTIONS: tuple[str, ...] = tuple(
    sorted(
        {
            "Aboriginal Languages and Torres Strait Islander Languages",
            "Arabic",
            "Auslan",
            "Chinese",
            "Civics and Citizenship",
            "Classical Greek",
            "Dance",
            "Design and Technologies",
            "Digital Technologies",
            "Drama",
            "Economics and Business",
            "English",
            "French",
            "Geography",
            "German",
            "Health and Physical Education",
            "Hindi",
            "History",
            "Humanities and Social Sciences",
            "Indonesian",
            "Italian",
            "Japanese",
            "Korean",
            "Languages",
            "Latin",
            "Mathematics",
            "Media Arts",
            "Modern Greek",
            "Music",
            "Science",
            "Spanish",
            "Technologies",
            "The Arts",
            "Turkish",
            "Vietnamese",
            "Visual Arts",
            "Work Studies",
        },
        key=str.casefold,
    )
)


@dataclass(frozen=True)
class DescriptorOption:
    id: str
    kla: str
    label: str
    summary: str


def _d(id_: str, kla: str, label: str, summary: str) -> DescriptorOption:
    return DescriptorOption(id=id_, kla=kla, label=label, summary=summary)


# Descriptor banks — labels sorted A–Z within each subject when returned.
_RAW_DESCRIPTORS: tuple[DescriptorOption, ...] = (
    # Humanities and Social Sciences (default)
    _d("hass-inquiry", "Humanities and Social Sciences", "Inquiry questions and investigation", "Pose and investigate questions about people, places, cultures and societies using evidence."),
    _d("hass-perspectives", "Humanities and Social Sciences", "Perspectives and contestability", "Compare viewpoints and explain why interpretations of the past and present can differ."),
    _d("hass-sources", "Humanities and Social Sciences", "Sources and evidence", "Select, analyse and use sources to support explanations about society and citizenship."),
    _d("hass-significance", "Humanities and Social Sciences", "Significance and continuity", "Explain significance, continuity and change in Australian and global contexts."),
    # History
    _d("hist-cause", "History", "Cause, consequence and significance", "Analyse causes and effects to explain historical change and continuity."),
    _d("hist-perspectives", "History", "Historical perspectives", "Compare viewpoints to understand contested historical interpretations."),
    _d("hist-sources", "History", "Historical sources and evidence", "Evaluate sources to construct evidence-based historical narratives."),
    _d("hist-empathy", "History", "Historical empathy and context", "Interpret actions and ideas within their historical context without presentism."),
    # Ancient / Modern History
    _d("ahist-evidence", "Ancient History", "Ancient evidence and interpretation", "Evaluate archaeological and written evidence to reconstruct ancient societies."),
    _d("ahist-power", "Ancient History", "Power, belief and daily life", "Explain how power, belief systems and everyday life shaped ancient communities."),
    _d("mhist-change", "Modern History", "Modern change and continuity", "Analyse forces of change in the modern world using evidence-based arguments."),
    _d("mhist-ideology", "Modern History", "Ideologies and movements", "Evaluate how ideologies and movements shaped twentieth- and twenty-first-century events."),
    # Geography
    _d("geo-environment", "Geography", "Environment and sustainability", "Explain interactions between people, places and environments."),
    _d("geo-inquiry", "Geography", "Geographical inquiry", "Collect and interpret data to investigate place-based questions."),
    _d("geo-patterns", "Geography", "Geographical patterns and relationships", "Analyse spatial and temporal patterns using maps, data and fieldwork."),
    _d("geo-fieldwork", "Geography", "Fieldwork and spatial technologies", "Use fieldwork methods and spatial technologies to gather and present findings."),
    # Civics / Economics
    _d("civics-issues", "Civics and Citizenship", "Civic issues and viewpoints", "Analyse information to understand civic issues and diverse perspectives."),
    _d("civics-participation", "Civics and Citizenship", "Democratic participation", "Explain how citizens participate in and influence democratic processes."),
    _d("civics-law", "Civics and Citizenship", "Laws, rights and responsibilities", "Describe how laws, rights and responsibilities shape Australian democracy."),
    _d("econ-decisions", "Economics and Business", "Economic decision-making", "Interpret economic data to explain choices, trade-offs and impacts."),
    _d("econ-enterprise", "Economics and Business", "Enterprise and financial literacy", "Apply business concepts to real-world enterprise scenarios."),
    _d("econ-markets", "Economics", "Markets, scarcity and allocation", "Explain how scarcity and markets influence allocation of resources."),
    _d("econ-policy", "Economics", "Economic performance and policy", "Analyse indicators of economic performance and evaluate policy responses."),
    _d("bus-operations", "Business", "Business operations and strategy", "Analyse how businesses organise resources to create and deliver value."),
    _d("bus-stakeholders", "Business", "Stakeholders and ethics", "Evaluate business decisions from stakeholder and ethical perspectives."),
    _d("acc-records", "Accounting", "Recording and reporting", "Apply accounting processes to record, report and interpret financial information."),
    _d("acc-decisions", "Accounting", "Financial decision-making", "Use accounting information to support informed business decisions."),
    _d("legal-system", "Legal Studies", "Australian legal system", "Explain key features of Australia's legal system and how laws are made."),
    _d("legal-rights", "Legal Studies", "Rights, justice and dispute resolution", "Analyse how the law protects rights and resolves disputes."),
    # English / Literature / EAL/D
    _d("eng-literacy", "English", "Language conventions and literacy", "Apply spelling, grammar and punctuation to improve clarity."),
    _d("eng-speaking", "English", "Oral language and presentation", "Present ideas clearly using evidence and appropriate register."),
    _d("eng-analysis", "English", "Text analysis and interpretation", "Analyse how language, structure and multimodal features shape meaning."),
    _d("eng-writing", "English", "Creating written texts", "Plan, draft and refine texts for purpose, audience and context."),
    _d("lit-close", "Literature", "Close reading and interpretation", "Interpret literary texts through close reading of language, form and context."),
    _d("lit-context", "Literature", "Literary contexts and values", "Explain how context and values shape the production and reception of texts."),
    _d("eald-language", "English as an Additional Language or Dialect (EAL/D)", "Language development", "Build vocabulary, grammar and text structures for classroom and assessment tasks."),
    _d("eald-meaning", "English as an Additional Language or Dialect (EAL/D)", "Making meaning in English", "Comprehend and produce spoken and written English for learning purposes."),
    # Mathematics
    _d("math-data", "Mathematics", "Data representation and interpretation", "Construct and interpret tables, graphs and summary statistics."),
    _d("math-measurement", "Mathematics", "Measurement and geometry", "Apply measurement, spatial reasoning and geometric properties."),
    _d("math-number", "Mathematics", "Number and algebra", "Use algebraic and numeric techniques to solve structured problems."),
    _d("math-reasoning", "Mathematics", "Problem-solving and reasoning", "Apply mathematical models to practical problems and justify solutions."),
    # Science family
    _d("sci-evidence", "Science", "Evidence and conclusions", "Use investigation evidence to develop and refine explanations."),
    _d("sci-investigation", "Science", "Planning and conducting investigations", "Design fair tests and collect evidence to answer scientific questions."),
    _d("sci-models", "Science", "Scientific models and systems", "Use models to explain patterns, relationships and change over time."),
    _d("sci-sustainability", "Science", "Science and sustainability", "Evaluate human impacts and sustainable responses using scientific ideas."),
    _d("bio-systems", "Biology", "Biological systems and processes", "Explain structure–function relationships in living systems."),
    _d("bio-evidence", "Biology", "Biological inquiry and evidence", "Collect and analyse biological data to test explanations."),
    _d("chem-matter", "Chemistry", "Structure and properties of matter", "Explain chemical behaviour using particle models and bonding."),
    _d("chem-reactions", "Chemistry", "Chemical reactions and analysis", "Investigate reactions quantitatively and qualitatively."),
    _d("phys-energy", "Physics", "Energy, forces and motion", "Apply models of energy and forces to explain motion and interactions."),
    _d("phys-inquiry", "Physics", "Physical inquiry and modelling", "Use investigation and modelling to solve physics problems."),
    _d("ees-earth", "Earth and Environmental Science", "Earth systems", "Explain interactions within and between Earth’s spheres."),
    _d("ees-human", "Earth and Environmental Science", "Human impacts and management", "Evaluate human impacts on Earth systems and management responses."),
    _d("marine-systems", "Marine Science", "Marine systems and biodiversity", "Explain processes that shape marine environments and biodiversity."),
    _d("marine-human", "Marine Science", "Human use of marine environments", "Analyse sustainable use and management of marine resources."),
    _d("ag-systems", "Agricultural Science", "Agricultural systems", "Explain biological and environmental factors in agricultural production."),
    _d("ag-sustainability", "Agricultural Science", "Sustainable agriculture", "Evaluate sustainable practices in food and fibre production."),
    _d("psych-behaviour", "Psychology", "Behaviour and cognition", "Explain psychological concepts that influence behaviour and thinking."),
    _d("psych-research", "Psychology", "Psychological research methods", "Apply ethical research methods to investigate psychological questions."),
    # Technologies
    _d("dt-algorithms", "Digital Technologies", "Algorithms and programming", "Design and implement algorithms to solve defined problems."),
    _d("dt-data", "Digital Technologies", "Data collection and interpretation", "Acquire, validate and interpret data using digital tools."),
    _d("dt-systems", "Digital Technologies", "Digital systems and networks", "Explain how digital systems transmit, store and process information."),
    _d("des-design", "Design and Technologies", "Design thinking and processes", "Apply design processes to create preferred futures."),
    _d("des-materials", "Design and Technologies", "Materials and systems", "Select and evaluate materials, tools and systems for designed solutions."),
    _d("eng-design", "Engineering", "Engineering design and analysis", "Apply engineering principles to design, test and improve solutions."),
    _d("eng-systems", "Engineering", "Systems thinking", "Analyse engineered systems in terms of inputs, processes and outputs."),
    _d("food-nutrition", "Food Technology", "Food and nutrition", "Apply food and nutrition knowledge to practical food solutions."),
    _d("food-design", "Food Technology", "Food product design", "Design, prepare and evaluate food products for purpose and audience."),
    _d("tex-design", "Textiles and Design", "Textile design processes", "Design and produce textile items using appropriate techniques."),
    _d("tex-materials", "Textiles and Design", "Fibres, fabrics and sustainability", "Evaluate textile materials with attention to function and sustainability."),
    # The Arts
    _d("arts-making", "The Arts", "Making and presenting", "Create and refine artworks through structured design and performance processes."),
    _d("arts-responding", "The Arts", "Responding to artworks", "Interpret and evaluate artistic works using subject-specific language."),
    _d("dance-making", "Dance", "Dance making and performance", "Compose and perform dance works using safe dance practice."),
    _d("dance-respond", "Dance", "Responding to dance", "Analyse dance works with reference to elements, form and context."),
    _d("drama-making", "Drama", "Drama making and performance", "Devise and perform drama using dramatic elements and conventions."),
    _d("drama-respond", "Drama", "Responding to drama", "Evaluate dramatic works and performances using drama terminology."),
    _d("media-making", "Media Arts", "Media production", "Plan and produce media artworks for intended audiences."),
    _d("media-respond", "Media Arts", "Media analysis", "Analyse how media codes and conventions shape meaning."),
    _d("music-making", "Music", "Music making and performance", "Create and perform music using stylistic and technical understanding."),
    _d("music-respond", "Music", "Listening and responding", "Analyse music works with reference to elements and context."),
    _d("vis-making", "Visual Arts", "Art making practice", "Develop visual artworks through exploration of materials and ideas."),
    _d("vis-respond", "Visual Arts", "Critical and historical studies", "Interpret artworks with reference to artists, styles and contexts."),
    # HPE / Outdoor
    _d("hpe-movement", "Health and Physical Education", "Movement and performance", "Apply movement concepts and tactics in physical activity contexts."),
    _d("hpe-wellbeing", "Health and Physical Education", "Health and wellbeing", "Analyse factors that influence personal and community health decisions."),
    _d("outdoor-skills", "Outdoor Education", "Outdoor skills and safety", "Apply outdoor skills with attention to safety and environmental care."),
    _d("outdoor-env", "Outdoor Education", "People and environments", "Explain relationships between people, adventure activities and environments."),
    # Languages (generic + named)
    _d("lang-communicating", "Languages", "Communicating in the target language", "Exchange information and ideas in the target language for real purposes."),
    _d("lang-understanding", "Languages", "Understanding language and culture", "Explain how language and culture shape meaning and identity."),
    _d("tech-design", "Technologies", "Design and digital solutions", "Create designed and digital solutions that meet needs and opportunities."),
    _d("tech-systems", "Technologies", "Systems thinking in technologies", "Analyse how technologies systems interact with people and environments."),
    _d("arabic-comm", "Arabic", "Communicating in Arabic", "Interact and create texts in Arabic for familiar purposes."),
    _d("arabic-culture", "Arabic", "Arabic language and culture", "Explore connections between Arabic language and cultural practices."),
    _d("auslan-comm", "Auslan", "Communicating in Auslan", "Interact and create signed texts in Auslan for familiar purposes."),
    _d("auslan-culture", "Auslan", "Auslan and Deaf culture", "Explore connections between Auslan and Deaf community cultural practices."),
    _d("atsi-lang-comm", "Aboriginal Languages and Torres Strait Islander Languages", "Communicating in Country/Place languages", "Interact and create texts in Aboriginal or Torres Strait Islander languages for familiar purposes."),
    _d("atsi-lang-culture", "Aboriginal Languages and Torres Strait Islander Languages", "Language, Country and culture", "Explore connections between language, Country/Place, culture and identity."),
    _d("chinese-comm", "Chinese", "Communicating in Chinese", "Interact and create texts in Chinese for familiar purposes."),
    _d("chinese-culture", "Chinese", "Chinese language and culture", "Explore connections between Chinese language and cultural practices."),
    _d("classgreek-comm", "Classical Greek", "Reading Classical Greek", "Read and interpret Classical Greek texts with attention to language and context."),
    _d("classgreek-culture", "Classical Greek", "Classical Greek language and culture", "Explore connections between Classical Greek language and ancient cultures."),
    _d("french-comm", "French", "Communicating in French", "Interact and create texts in French for familiar purposes."),
    _d("french-culture", "French", "French language and culture", "Explore connections between French language and cultural practices."),
    _d("german-comm", "German", "Communicating in German", "Interact and create texts in German for familiar purposes."),
    _d("german-culture", "German", "German language and culture", "Explore connections between German language and cultural practices."),
    _d("hindi-comm", "Hindi", "Communicating in Hindi", "Interact and create texts in Hindi for familiar purposes."),
    _d("hindi-culture", "Hindi", "Hindi language and culture", "Explore connections between Hindi language and cultural practices."),
    _d("indo-comm", "Indonesian", "Communicating in Indonesian", "Interact and create texts in Indonesian for familiar purposes."),
    _d("indo-culture", "Indonesian", "Indonesian language and culture", "Explore connections between Indonesian language and cultural practices."),
    _d("italian-comm", "Italian", "Communicating in Italian", "Interact and create texts in Italian for familiar purposes."),
    _d("italian-culture", "Italian", "Italian language and culture", "Explore connections between Italian language and cultural practices."),
    _d("japanese-comm", "Japanese", "Communicating in Japanese", "Interact and create texts in Japanese for familiar purposes."),
    _d("japanese-culture", "Japanese", "Japanese language and culture", "Explore connections between Japanese language and cultural practices."),
    _d("korean-comm", "Korean", "Communicating in Korean", "Interact and create texts in Korean for familiar purposes."),
    _d("korean-culture", "Korean", "Korean language and culture", "Explore connections between Korean language and cultural practices."),
    _d("latin-comm", "Latin", "Reading Latin", "Read and interpret Latin texts with attention to language and context."),
    _d("latin-culture", "Latin", "Latin language and culture", "Explore connections between Latin language and classical cultures."),
    _d("modgreek-comm", "Modern Greek", "Communicating in Modern Greek", "Interact and create texts in Modern Greek for familiar purposes."),
    _d("modgreek-culture", "Modern Greek", "Modern Greek language and culture", "Explore connections between Modern Greek language and cultural practices."),
    _d("spanish-comm", "Spanish", "Communicating in Spanish", "Interact and create texts in Spanish for familiar purposes."),
    _d("spanish-culture", "Spanish", "Spanish language and culture", "Explore connections between Spanish language and cultural practices."),
    _d("turkish-comm", "Turkish", "Communicating in Turkish", "Interact and create texts in Turkish for familiar purposes."),
    _d("turkish-culture", "Turkish", "Turkish language and culture", "Explore connections between Turkish language and cultural practices."),
    _d("viet-comm", "Vietnamese", "Communicating in Vietnamese", "Interact and create texts in Vietnamese for familiar purposes."),
    _d("viet-culture", "Vietnamese", "Vietnamese language and culture", "Explore connections between Vietnamese language and cultural practices."),
    # Senior English / Mathematics strands
    _d("esseng-literacy", "Essential English", "Practical literacy and communication", "Use English effectively for everyday, workplace and community purposes."),
    _d("esseng-texts", "Essential English", "Responding to and creating texts", "Comprehend and create texts suited to familiar audiences and contexts."),
    _d("essmath-number", "Essential Mathematics", "Number and measurement in context", "Apply number and measurement skills to everyday and workplace problems."),
    _d("essmath-data", "Essential Mathematics", "Data for decision-making", "Interpret data to support informed personal and workplace decisions."),
    _d("genmath-modelling", "General Mathematics", "Mathematical modelling", "Use discrete mathematics and modelling to solve practical problems."),
    _d("genmath-stats", "General Mathematics", "Statistics and networks", "Analyse statistical and network problems using appropriate techniques."),
    _d("mathmeth-calculus", "Mathematical Methods", "Functions and calculus", "Apply functions, derivatives and integrals to model change."),
    _d("mathmeth-stats", "Mathematical Methods", "Statistical analysis", "Analyse variation and uncertainty using probability and statistics."),
    _d("specmath-proof", "Specialist Mathematics", "Proof and advanced techniques", "Develop rigorous mathematical arguments, proofs and extended models."),
    _d("specmath-vectors", "Specialist Mathematics", "Vectors, complex numbers and matrices", "Apply vectors, complex numbers and matrices to mathematical problems."),
    # Religion / Philosophy / Work
    _d("rel-belief", "Religion and Ethics", "Beliefs, values and ethics", "Analyse how beliefs and ethical frameworks guide decisions and actions."),
    _d("rel-dialogue", "Religion and Ethics", "Interfaith understanding", "Compare religious and ethical perspectives respectfully using evidence."),
    _d("sor-traditions", "Studies of Religion", "Religious traditions", "Explain key beliefs, practices and texts within religious traditions."),
    _d("sor-society", "Studies of Religion", "Religion and society", "Analyse the interaction of religion with Australian and global societies."),
    _d("phil-argument", "Philosophy", "Argument and reasoning", "Construct and evaluate philosophical arguments with clarity and rigour."),
    _d("phil-concepts", "Philosophy", "Philosophical concepts", "Apply philosophical concepts to contemporary ethical and social questions."),
    _d("work-skills", "Work Studies", "Workplace skills and pathways", "Develop skills, knowledge and attributes for work and further learning."),
    _d("work-enterprise", "Work Studies", "Enterprise and employability", "Apply enterprise and employability skills to authentic work contexts."),
)

DESCRIPTORS: tuple[DescriptorOption, ...] = _RAW_DESCRIPTORS

# Generic fallback when a subject has no dedicated bank (should be rare).
_GENERIC_FALLBACK: tuple[DescriptorOption, ...] = (
    _d("gen-inquiry", "_generic", "Disciplinary inquiry", "Investigate key questions using methods appropriate to the subject."),
    _d("gen-evidence", "_generic", "Evidence and reasoning", "Use evidence to support explanations and justified conclusions."),
    _d("gen-communication", "_generic", "Communication of learning", "Communicate understanding clearly for purpose and audience."),
)


def list_kla_options() -> list[str]:
    return list(KLA_OPTIONS)


def list_descriptors_for_kla(kla: str) -> list[dict[str, str]]:
    key = (kla or "").strip()
    items = [d for d in DESCRIPTORS if d.kla == key]
    if not items:
        items = [
            DescriptorOption(
                id=f"{d.id}-{abs(hash(key)) % 10_000}",
                kla=key or "Subject",
                label=d.label,
                summary=d.summary,
            )
            for d in _GENERIC_FALLBACK
        ]
    items = sorted(items, key=lambda d: d.label.casefold())
    return [
        {"id": d.id, "kla": d.kla, "label": d.label, "summary": d.summary}
        for d in items
    ]


def get_descriptor(descriptor_id: str) -> DescriptorOption | None:
    for item in DESCRIPTORS:
        if item.id == descriptor_id:
            return item
    return None


def descriptors_for_ids(descriptor_ids: list[str]) -> list[dict[str, str]]:
    items: list[dict[str, str]] = []
    for descriptor_id in descriptor_ids:
        item = get_descriptor(descriptor_id)
        if item:
            items.append(
                {
                    "id": item.id,
                    "kla": item.kla,
                    "label": item.label,
                    "summary": item.summary,
                }
            )
    return items
