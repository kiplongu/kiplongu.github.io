# Rodgers Biwott Portfolio

Static, accessible professional portfolio for Senior DevOps, DevSecOps, SRE and Platform Engineering roles.

The site includes verified career history and skills from the 2026 CV, an engineering case study for ObserveX, and an evidence-led Production Readiness Assessment case study. It uses semantic HTML, hand-authored responsive CSS and a small progressive-enhancement JavaScript file with no build-time dependencies.

The portfolio intentionally remains personal and contains no employer or product-company branding. Product claims are limited to implemented engineering work, while illustrative report data is labelled accordingly.

## Local preview

```sh
python3 -m http.server 8090
```

Open `http://127.0.0.1:8090/`.

## Validation

```sh
python3 scripts/validate-site.py
```

The same dependency-free check runs in GitHub Actions. It validates local assets, fragment links, image accessibility attributes, baseline SEO files and the personal-brand boundary.

Live at [kiplongu.github.io](https://kiplongu.github.io/).
