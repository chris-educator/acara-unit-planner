"""Curated curriculum descriptor picks for teacher selection."""

from __future__ import annotations

from dataclasses import dataclass

KLA_OPTIONS = (
    "English",
    "Mathematics",
    "Science",
    "Geography",
    "History",
    "Digital Technologies",
    "Economics & Business",
    "Civics & Citizenship",
    "The Arts",
    "Health and Physical Education",
)


@dataclass(frozen=True)
class DescriptorOption:
    id: str
    kla: str
    label: str
    summary: str


DESCRIPTORS: tuple[DescriptorOption, ...] = (
    # English
    DescriptorOption(
        id="eng-text-analysis",
        kla="English",
        label="Text analysis and interpretation",
        summary="Analyse how language, structure and multimodal features shape meaning.",
    ),
    DescriptorOption(
        id="eng-writing",
        kla="English",
        label="Creating written texts",
        summary="Plan, draft and refine texts for purpose, audience and context.",
    ),
    DescriptorOption(
        id="eng-speaking",
        kla="English",
        label="Oral language and presentation",
        summary="Present ideas clearly using evidence and appropriate register.",
    ),
    DescriptorOption(
        id="eng-literacy",
        kla="English",
        label="Language conventions and literacy",
        summary="Apply spelling, grammar and punctuation to improve clarity.",
    ),
    # Mathematics
    DescriptorOption(
        id="math-data-rep",
        kla="Mathematics",
        label="Data representation and interpretation",
        summary="Construct and interpret tables, graphs and summary statistics.",
    ),
    DescriptorOption(
        id="math-problem-solving",
        kla="Mathematics",
        label="Problem-solving and reasoning",
        summary="Apply mathematical models to practical problems and justify solutions.",
    ),
    DescriptorOption(
        id="math-number-algebra",
        kla="Mathematics",
        label="Number and algebra",
        summary="Use algebraic and numeric techniques to solve structured problems.",
    ),
    DescriptorOption(
        id="math-measurement",
        kla="Mathematics",
        label="Measurement and geometry",
        summary="Apply measurement, spatial reasoning and geometric properties.",
    ),
    # Science
    DescriptorOption(
        id="sci-investigation",
        kla="Science",
        label="Planning and conducting investigations",
        summary="Design fair tests and collect evidence to answer scientific questions.",
    ),
    DescriptorOption(
        id="sci-evidence",
        kla="Science",
        label="Evidence and conclusions",
        summary="Use investigation evidence to develop and refine explanations.",
    ),
    DescriptorOption(
        id="sci-models",
        kla="Science",
        label="Scientific models and systems",
        summary="Use models to explain patterns, relationships and change over time.",
    ),
    DescriptorOption(
        id="sci-sustainability",
        kla="Science",
        label="Science and sustainability",
        summary="Evaluate human impacts and sustainable responses using scientific ideas.",
    ),
    # Geography
    DescriptorOption(
        id="geo-patterns",
        kla="Geography",
        label="Geographical patterns and relationships",
        summary="Analyse spatial and temporal patterns using maps, data and fieldwork.",
    ),
    DescriptorOption(
        id="geo-inquiry",
        kla="Geography",
        label="Geographical inquiry",
        summary="Collect and interpret data to investigate place-based questions.",
    ),
    DescriptorOption(
        id="geo-environment",
        kla="Geography",
        label="Environment and sustainability",
        summary="Explain interactions between people, places and environments.",
    ),
    # History
    DescriptorOption(
        id="hist-sources",
        kla="History",
        label="Historical sources and evidence",
        summary="Evaluate sources to construct evidence-based historical narratives.",
    ),
    DescriptorOption(
        id="hist-cause-effect",
        kla="History",
        label="Cause, consequence and significance",
        summary="Analyse causes and effects to explain historical change.",
    ),
    DescriptorOption(
        id="hist-perspectives",
        kla="History",
        label="Historical perspectives",
        summary="Compare viewpoints to understand contested historical interpretations.",
    ),
    # Digital Technologies
    DescriptorOption(
        id="dt-data",
        kla="Digital Technologies",
        label="Data collection and interpretation",
        summary="Acquire, validate and interpret data using digital tools.",
    ),
    DescriptorOption(
        id="dt-algorithms",
        kla="Digital Technologies",
        label="Algorithms and programming",
        summary="Design and implement algorithms to solve defined problems.",
    ),
    DescriptorOption(
        id="dt-systems",
        kla="Digital Technologies",
        label="Digital systems and networks",
        summary="Explain how digital systems transmit, store and process information.",
    ),
    # Economics & Business
    DescriptorOption(
        id="econ-decisions",
        kla="Economics & Business",
        label="Economic decision-making",
        summary="Interpret economic data to explain choices, trade-offs and impacts.",
    ),
    DescriptorOption(
        id="econ-enterprise",
        kla="Economics & Business",
        label="Enterprise and financial literacy",
        summary="Apply business concepts to real-world enterprise scenarios.",
    ),
    # Civics
    DescriptorOption(
        id="civics-issues",
        kla="Civics & Citizenship",
        label="Civic issues and viewpoints",
        summary="Analyse information to understand civic issues and diverse perspectives.",
    ),
    DescriptorOption(
        id="civics-participation",
        kla="Civics & Citizenship",
        label="Democratic participation",
        summary="Explain how citizens participate in and influence democratic processes.",
    ),
    # The Arts
    DescriptorOption(
        id="arts-responding",
        kla="The Arts",
        label="Responding to artworks",
        summary="Interpret and evaluate artistic works using subject-specific language.",
    ),
    DescriptorOption(
        id="arts-making",
        kla="The Arts",
        label="Making and presenting",
        summary="Create and refine artworks through structured design and performance processes.",
    ),
    # HPE
    DescriptorOption(
        id="hpe-movement",
        kla="Health and Physical Education",
        label="Movement and performance",
        summary="Apply movement concepts and tactics in physical activity contexts.",
    ),
    DescriptorOption(
        id="hpe-wellbeing",
        kla="Health and Physical Education",
        label="Health and wellbeing",
        summary="Analyse factors that influence personal and community health decisions.",
    ),
)


def list_kla_options() -> list[str]:
    return list(KLA_OPTIONS)


def list_descriptors_for_kla(kla: str) -> list[dict[str, str]]:
    return [
        {"id": d.id, "kla": d.kla, "label": d.label, "summary": d.summary}
        for d in DESCRIPTORS
        if d.kla == kla
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
