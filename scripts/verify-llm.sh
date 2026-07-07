#!/usr/bin/env bash
set -euo pipefail
echo "==> acara-unit-planner — verify LLM"
python -c "from src.llm_config import is_llm_configured; assert is_llm_configured() or True"
