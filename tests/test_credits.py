from src.credits import credits_for_term_generate, credits_for_term_refine


def test_credit_costs():
    assert credits_for_term_generate() == 15
    assert credits_for_term_refine() == 3
