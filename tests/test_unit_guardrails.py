"""Tests for micro-unit output guardrails."""

from src.unit_guardrails import validate_unit_output


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
        "timing_notes": "50 min lesson",
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
