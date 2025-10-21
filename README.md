# Digital Humanities Speech Extractor

This single-page tool helps you isolate every speech delivered by a specific character in a digitized play. Upload a plain-text script, type the character’s name, and download a curated text file containing only their lines — perfect for classroom activities, close reading, or thematic analysis.

## Getting Started

1. **Clone or download the repository.**
   ```bash
   git clone https://github.com/<your-username>/DH-SpeechExtractor.git
   cd DH-SpeechExtractor
   ```

2. **Start a lightweight web server.** Any static-file server works; Python’s built-in option keeps things simple:
   ```bash
   python -m http.server 8000
   ```

3. **Open the interface in your browser.**
   Navigate to [http://localhost:8000](http://localhost:8000) (or whichever port you chose). You should see the digital-humanities themed page with the upload form and instructions.

## Using the App

1. Upload a plain-text (`.txt`) version of the play. Many public-domain plays on [Project Gutenberg](https://www.gutenberg.org/) are already formatted this way.
2. Enter the exact character name as it appears in the script (for example, `HAMLET`).
3. Click **Gather Speeches**.
4. When speeches are found, click **Download File** to save a curated text document listing only that character’s lines.

If no speeches are returned, double-check the spelling or casing of the character name—the parser matches characters based on normalized uppercase names.

## Customizing or Extending

- **Styling:** Adjust colors, fonts, and layout in `styles.css` to match your course branding.
- **Parsing logic:** Modify `parseSpeeches` in `script.js` if your play uses a different notation for speakers.
- **Distribution:** Because this is a static site, you can deploy it anywhere that serves HTML, CSS, and JavaScript (GitHub Pages, Netlify, university web space, etc.).

Enjoy bringing a bit of digital humanities flair to your course activities!