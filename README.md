# Seek Job Ad Copier

A tiny Chrome extension: on any Seek job ad, one click copies the whole ad as clean, structured text — ready to paste into notes, a tracker, or an AI assistant to tailor your resume and cover letter.

## What gets copied

```
Job Title: Senior Software Engineer
Company: Example Pty Ltd
Work Type: Full time
URL: https://www.seek.com.au/job/…

Job Description:
About the role
…

Employer Questions:
1. Which of the following statements best describes your right to work in Australia?
2. What's your expected annual base salary?
3. How much notice are you required to give your current employer?
```

The **Employer questions** section is included when the ad has one, so you can prepare answers before you start applying.

## Install

1. Clone or download this repo.
2. Open `chrome://extensions`, turn on **Developer mode**, click **Load unpacked**, and select the folder.
3. Pin the extension from the puzzle-piece menu.

## Use

Open a Seek job ad, then click the extension icon or press **Alt+Shift+J**. A green toast confirms the copy; a red one means the job title wasn't found.

No extension? Paste the contents of [`copy-job-ad.js`](copy-job-ad.js) into the DevTools console on the job page — it works the same way.

## How it finds things

Seek's CSS class names are generated and change between deploys, so the script relies on Seek's own `data-automation` attributes (`job-detail-title`, `advertiser-name`, `job-detail-work-type`, `jobAdDetails`). The employer questions have no such attribute, so it finds the `<h2>` whose text is *Employer questions* and reads the list items under it.

## Privacy

Runs only on the tab you click it on (`activeTab`), only when you click. No network requests, no storage, no tracking.

## Disclaimer

Not affiliated with or endorsed by SEEK Limited. For personal use on job ads you're viewing.

## License

[MIT](LICENSE)
