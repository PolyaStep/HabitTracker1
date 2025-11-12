Habit Tracker

A simple web app that lets users add habits, tick daily progress and view streaks for the last 7 days.  
Built with HTML, CSS, and Vanilla JavaScript and data is saved locally using localStorage.

Key features
- Add new habits easily
- Toggle completion for the last 7 days
- Automatic streak calculation
- Data saved in browser
- Clean, minimalist design

How to run localy

On Windows:
1. Download or clone this repo.  
2. Open the folder in VS Code.  
3. Install the Live Server extension.  
4. Right click `index.html` – Open with Live Server.
   
On macOS:
1. Download or clone this repo.  
2. Open Terminal – `cd path/to/habit-tracker`  
3. Run a quick local server:
   ```bash
   python3 -m http.server

Reflection
This project helped me build a complete single page application using only HTML, CSS and vanilla JavaScript. I designed a simple data model where each habit stores a dictionary of date keys mapped to booleans. This made it easy to render the last seven days and compute a streak by walking backward from today until a gap is found. I implemented all UI updates through a single `render()` function, so state changes stay consistent.
A key learning was client side persistence** with `localStorage`. I added `try/catch` around reads/writes and a small shape guard to handle corrupted or old data, resetting safely while notifying the user via a live status region. I also avoided `innerHTML` for user input and used `textContent` to prevent XSS. For UX and accessibility, I added keyboard interaction, visible focus styles, an `aria live` status, a hidden table caption, and labels.
A practical challenge was Git remotes and deployment to GitHub Pages. I resolved it by correcting the remote URL, force pushing when the empty remote had an initial commit and enabling “Deploy from branch: main / (root)”. If I extend this app, I would add weekday headers with actual names, longest streak statistics and simple theming. Overall, I strengthened my understanding of DOM events, rendering patterns, and safe persistence in the browser.

Self assessment
|Section|Criteria|Status|Evidence|

|Core functionality|Add/toggle/delete, 7-day view, streak, persistence, empty & error states|yes|Live demo + code (`render()`, `calcStreak()`, empty/alerts)|
|Code qquality & architecture| Small functions, comments, formatting, defensive coding|yes|`load()/save()` with try/catch, shape guard, clear structure|
|UX & accessibility|Keyboard support, focus, labels, status, responsive|yes|`tabIndex`, enter/space, `.sr-only`, `role="status"`, CSS focus|
|Data handling |Safe read/write, JSON schema fallback, XSS-safe|yes|`load()` validation, `textContent` only|
|Documentation| Features, run steps Win/macOS, screenshots, reflection, self assessment|yes|This README|
|Deployment| GitHub pages live and linked|yes|Live URL below|
