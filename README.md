# Quality in Practice | 5 Whys Root Cause Analysis App

This is a lightweight static web app based on the attached `5 Whys QIP.xlsx` template and branded for Quality in Practice. It keeps the same core structure:

- Problem Statement
- Five Why entries
- Five Therefore summary entries
- Root Cause Identified
- Corrective Actions table

## What it does

- Saves work automatically in the browser
- Adds and removes corrective action rows
- Includes a Quality in Practice branded presentation layer
- Exports the current analysis as a JSON file
- Prints a clean report view for sharing or saving as PDF
- Works as a simple static site with no build step

## Files

- `index.html` contains the app structure
- `styles.css` contains the visual design and print layout
- `script.js` handles autosave, export, and action rows

## Publish on GitHub

This project is intended for `JRW0116/Fivewhys`.

1. In GitHub, open the `Fivewhys` repository settings.
2. Go to `Pages`.
3. Under `Build and deployment`, choose `Deploy from a branch`.
4. Select the `main` branch and `/root`.
5. Save, then wait for GitHub Pages to publish the site.

Your app should publish at:

`https://jrw0116.github.io/Fivewhys/`

## Linking from your website

Add a normal link or button on your website that points to the published GitHub Pages URL.

## Notes

- Data is stored locally in the visitor's browser unless they export it.
- This version uses a text-based Quality in Practice brand treatment so it can publish cleanly without extra asset dependencies.
- If you want, this can be extended later with a formal logo asset, PDF export, sign-off fields, or submission to a database or email workflow.
