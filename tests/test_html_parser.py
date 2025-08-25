from pathlib import Path
import sys

import pytest

# Ensure src package is on path
sys.path.append(str(Path(__file__).resolve().parents[1]))

from src.html_parser import parse_html


def test_parse_valid_html():
    html_path = Path("templates/index.html")
    content = html_path.read_text()
    parsed = parse_html(content)
    assert parsed is not None


def test_parse_invalid_html():
    malformed = "<html><head></head><body><p></html>"
    with pytest.raises(ValueError):
        parse_html(malformed)
