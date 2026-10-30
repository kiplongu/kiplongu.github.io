#!/usr/bin/env python3
"""Small dependency-free validator for this static portfolio."""

from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit
import sys

ROOT = Path(__file__).resolve().parents[1]
INDEX = ROOT / "index.html"


class PortfolioParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids: set[str] = set()
        self.references: list[tuple[str, str]] = []
        self.images: list[dict[str, str | None]] = []
        self.h1_count = 0

    def handle_starttag(self, tag, attrs):
        values = dict(attrs)
        if values.get("id"):
            self.ids.add(values["id"])
        if tag == "h1":
            self.h1_count += 1
        if tag in {"a", "link"} and values.get("href"):
            self.references.append((tag, values["href"]))
        if tag in {"img", "script"} and values.get("src"):
            self.references.append((tag, values["src"]))
        if tag == "img":
            self.images.append(values)


def main() -> int:
    source = INDEX.read_text(encoding="utf-8")
    parser = PortfolioParser()
    parser.feed(source)
    errors: list[str] = []

    if parser.h1_count != 1:
        errors.append(f"expected exactly one h1, found {parser.h1_count}")

    for tag, reference in parser.references:
        if reference.startswith("#"):
            if reference[1:] not in parser.ids:
                errors.append(f"broken fragment: {reference}")
            continue
        parsed = urlsplit(reference)
        if parsed.scheme or reference.startswith("//"):
            continue
        path = parsed.path
        if path and not (ROOT / path).is_file():
            errors.append(f"missing local asset ({tag}): {path}")

    for image in parser.images:
        if not image.get("alt"):
            errors.append(f"image missing alt text: {image.get('src')}")
        if not image.get("width") or not image.get("height"):
            errors.append(f"image missing intrinsic dimensions: {image.get('src')}")

    # Keep the personal portfolio independent from the product-company brand.
    forbidden_brand = "lit" + "anovo"
    if forbidden_brand in source.lower():
        errors.append("personal portfolio contains a forbidden company-brand reference")

    required_files = ["robots.txt", "sitemap.xml", "images/favicon.svg"]
    for filename in required_files:
        if not (ROOT / filename).is_file():
            errors.append(f"missing required site file: {filename}")

    if errors:
        print("Portfolio validation failed:")
        for error in errors:
            print(f"- {error}")
        return 1

    print(f"Portfolio validation passed: {len(parser.references)} references and {len(parser.images)} images checked.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
