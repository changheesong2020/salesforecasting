"""Simple HTML parser utility."""
from typing import Any

try:  # Try to use lxml for strict HTML parsing
    from lxml import etree

    def parse_html(html_content: str) -> Any:
        """Parse HTML content and return the root element.

        Raises:
            ValueError: If the HTML is malformed.
        """
        try:
            return etree.fromstring(html_content)
        except etree.XMLSyntaxError as exc:
            raise ValueError(f"Failed to parse HTML: {exc}") from exc

except Exception:  # pragma: no cover - fallback if lxml is unavailable
    import xml.etree.ElementTree as ET

    def parse_html(html_content: str) -> Any:
        """Parse HTML content using ElementTree as a fallback.

        Raises:
            ValueError: If the HTML is malformed.
        """
        try:
            return ET.fromstring(html_content)
        except ET.ParseError as exc:
            raise ValueError(f"Failed to parse HTML: {exc}") from exc
