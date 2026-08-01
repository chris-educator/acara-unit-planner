"""Tests for micro-unit output guardrails."""

from src.unit_guardrails import validate_unit_output


def _resources() -> list[dict]:
    return [
        {
            "title": "Water cycle overview clip search",
            "kind": "video",
            "why": "Short visual hook before labelling a diagram.",
            "search_query": "ABC Education Year 5 water cycle",
            "portal": "ABC Education",
        },
        {
            "title": "Interactive diagram",
            "kind": "interactive",
            "why": "Lets students reorder stages and check understanding.",
            "search_query": "Scootle water cycle interactive primary",
            "portal": "Scootle",
        },
    ]


def _lesson(number: int, title: str) -> dict:
    return {
        "lesson_number": number,
        "title": title,
        "learning_objectives": [
            "Students identify key concepts in the topic.",
            "Students explain ideas using classroom vocabulary.",
        ],
        "materials_needed": [
            "Student workbooks",
            "Projector or display",
            "Chart paper and markers",
        ],
        "teacher_prep": [
            "Print diagram handouts",
            "Queue the search query on the class device",
        ],
        "suggested_resources": _resources(),
        "starter": "Quick retrieval quiz: students recall prior learning in pairs for five minutes.",
        "main_activity": (
            "Guided investigation where students analyse examples, record observations in "
            "their books, and discuss findings in small groups for twenty-five minutes."
        ),
        "exit_ticket": "One sentence: what changed your thinking today?",
        "differentiation_support": (
            "Provide sentence starters and a partially completed example for students who need scaffolding."
        ),
        "differentiation_extension": (
            "Invite advanced learners to evaluate a counter-example and justify their reasoning in writing."
        ),
        "differentiation_eald": (
            "Pre-teach key vocabulary with visuals and allow oral rehearsal before written responses."
        ),
        "differentiation_adjustments": (
            "Offer alternative recording options and reduce task length while keeping the same learning goal."
        ),
        "timing_notes": "Week 1 · 3–4 × 40–60 min lessons",
    }


def _sample(lesson_count: int = 6) -> dict:
    return {
        "unit_title": "Ecosystem Interactions Term Plan",
        "topic": "Ecosystem interactions",
        "year_level": "Year 8",
        "subject": "Science",
        "lesson_count": lesson_count,
        "overview": (
            "A short sequence building understanding of food webs, energy flow, and human "
            "impacts on ecosystems through practical classroom tasks."
        ),
        "success_criteria": [
            "Students describe relationships within a food web.",
            "Students explain one human impact on an ecosystem.",
            "Students use evidence from class tasks in their responses.",
        ],
        "key_vocabulary": [
            {"term": f"Term {i}", "gloss": f"Student-friendly meaning for term {i}."}
            for i in range(1, 9)
        ],
        "common_misconceptions": [
            {
                "misconception": "Energy is created by producers.",
                "address": "Clarify that producers transform light energy; energy is transferred, not created.",
            },
            {
                "misconception": "All consumers are predators.",
                "address": "Use examples of herbivores and decomposers alongside predators.",
            },
            {
                "misconception": "Food webs are the same as food chains.",
                "address": "Show branching connections and multiple pathways with a class diagram.",
            },
        ],
        "term_materials_checklist": [
            "Workbooks",
            "Chart paper",
            "Markers",
            "Printed diagrams",
            "Device and display",
        ],
        "parent_carer_blurb": (
            "This term we explore how living things interact in ecosystems. Students will "
            "build food webs and discuss how people affect local environments."
        ),
        "sequence_at_a_glance": [f"Week {i} — focus area {i}" for i in range(1, lesson_count + 1)],
        "suggested_descriptors": [
            {
                "id": "sci-investigation",
                "label": "Planning and conducting investigations",
                "summary": "Design fair tests and collect evidence to answer questions.",
            }
        ],
        "lessons": [_lesson(i, f"Week {i} focus") for i in range(1, lesson_count + 1)],
        "unit_assessment": {
            "title": "End-of-unit check",
            "instructions": "Answer in full sentences unless stated otherwise.",
            "tasks": [
                "Draw and label a food web for a local ecosystem.",
                "Explain one human impact and a possible response.",
            ],
            "rubric": [
                {
                    "criterion": "Scientific accuracy",
                    "developing": "Identifies some relationships with minor errors.",
                    "meeting": "Accurately describes key ecosystem relationships.",
                    "exceeding": "Explains relationships with precise scientific vocabulary.",
                },
                {
                    "criterion": "Use of evidence",
                    "developing": "Uses limited examples from class tasks.",
                    "meeting": "Uses relevant evidence from investigations.",
                    "exceeding": "Synthesises multiple sources of evidence clearly.",
                },
            ],
        },
    }


def test_valid_unit_passes():
    validated, err = validate_unit_output(_sample())
    assert err is None
    assert validated is not None
    assert validated["lesson_count"] == 6
    assert len(validated["key_vocabulary"]) == 8
    assert len(validated["lessons"][0]["suggested_resources"]) == 2


def test_rejects_lesson_count_mismatch():
    payload = _sample(lesson_count=6)
    payload["lessons"] = payload["lessons"][:5]
    validated, err = validate_unit_output(payload)
    assert validated is None
    assert err is not None


def test_rejects_duplicate_lesson_titles():
    payload = _sample(lesson_count=6)
    payload["lessons"][2]["title"] = payload["lessons"][0]["title"]
    validated, err = validate_unit_output(payload)
    assert validated is None
    assert "duplicate" in err.lower()


def test_rejects_short_main_activity():
    payload = _sample()
    payload["lessons"][0]["main_activity"] = "Too short."
    validated, err = validate_unit_output(payload)
    assert validated is None
    assert err is not None


def test_rejects_missing_eald_differentiation():
    payload = _sample()
    payload["lessons"][0]["differentiation_eald"] = "Too short"
    validated, err = validate_unit_output(payload)
    assert validated is None
    assert err is not None
    assert "eald" in err.lower()


def test_rejects_invented_resource_urls():
    payload = _sample()
    payload["lessons"][0]["suggested_resources"][0]["search_query"] = (
        "https://youtube.com/watch?v=abc123"
    )
    validated, err = validate_unit_output(payload)
    assert validated is None
    assert err is not None
    assert "url" in err.lower()


def test_rejects_missing_teacher_prep():
    payload = _sample()
    payload["lessons"][0]["teacher_prep"] = ["Only one"]
    validated, err = validate_unit_output(payload)
    assert validated is None
    assert err is not None
