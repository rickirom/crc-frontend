import PDFDocument, { text } from 'pdfkit'
import SVGtoPDF from 'svg-to-pdfkit';
import fs from 'fs'
import path from 'path'
import { RESUME } from '../lib/resume'

const MARGIN = 50          // 1 inch (72)
const PAGE_W = 612         // Letter width in points (612)
const CONTENT_W = PAGE_W - MARGIN * 2

const doc = new PDFDocument({
  size: 'LETTER',
  margins: { top: 50, bottom: 50, left: MARGIN, right: MARGIN },
  info: { Title: `${RESUME.name} – Resume`, Author: RESUME.name },
})

// Registering fonts:
doc.registerFont('IBMPlexSans', path.join(__dirname, 'fonts/IBMPlexSans-Regular.ttf'));
doc.registerFont('IBMPlexSans-Light', path.join(__dirname, 'fonts/IBMPlexSans-Light.ttf'));
doc.registerFont('IBMPlexSans-Medium', path.join(__dirname, 'fonts/IBMPlexSans-Medium.ttf'));
doc.registerFont('IBMPlexSans-Italic', path.join(__dirname, 'fonts/IBMPlexSans-Italic.ttf'));

// Github and Linkedin icons:
const LINKEDIN_PATH = "M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z";
const GITHUB_PATH = "M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z";

//Function to render an SVG path as an icon in the PDF:
const iconSvg = (path: string, color = "#0f172a") => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}"><path d="${path}"/></svg>`;

SVGtoPDF(doc, iconSvg(LINKEDIN_PATH), 367, 82, { width: 12, height: 12 });
SVGtoPDF(doc, iconSvg(GITHUB_PATH), 478, 82, { width: 12, height: 12 });

const out = path.join(process.cwd(), 'public', 'resume.pdf')
doc.pipe(fs.createWriteStream(out))

// ── Helpers ────────────────────────────────────────────────────────────────

/** Two pieces of text on the same baseline: left-aligned and right-aligned. */
function rowLR(left: string, leftFont: string, right: string, rightFont: string, size: number) {
  const y = doc.y
  doc.font(leftFont).fontSize(size).text(left, MARGIN, y, { width: CONTENT_W })
  const afterLeft = doc.y
  doc.font(rightFont).fontSize(size).text(right, MARGIN, y, { width: CONTENT_W, align: 'right' })
  if (doc.y < afterLeft) doc.y = afterLeft
}

/** Bold uppercase section header with a rule underneath. */
function section(title: string) {
  doc.moveDown(0.6)
  doc.font('IBMPlexSans-Medium').fontSize(11).text(title.toUpperCase(), MARGIN)
  const ruleY = doc.y + 1
  doc.moveTo(MARGIN, ruleY).lineTo(PAGE_W - MARGIN, ruleY).lineWidth(0.6).stroke()
  doc.moveDown(0.4)
}

/** Bullet point indented under current section. */
function bullet(text: string) {
  doc.font('IBMPlexSans').fontSize(10).text(`•  ${text}`, MARGIN + 12, doc.y, { width: CONTENT_W - 12 })
}

// ── Header ─────────────────────────────────────────────────────────────────

doc.font('IBMPlexSans-Medium').fontSize(20).text(RESUME.name, { align: 'left' })
doc.moveDown(0.2) 

doc.fontSize(10)
doc
    .font('IBMPlexSans-Medium') 
    .text(`${RESUME.city}  |  `, { continued: true }) 
    .font('IBMPlexSans').text(`${RESUME.email}  ·  ${RESUME.phone}  |   `, { continued: true })
    .fillColor('#2757c7') //toggle color to blue for links
    .text(`         ${RESUME.linkedin}  ·`, { continued: true , link: `https://linkedin.com${RESUME.linkedin}` })
    .text(`         ${RESUME.github}`, { align: "right", link: `https://github.com${RESUME.github}` })

doc.fillColor('black')

// ── Summary ────────────────────────────────────────────────────────────────

section('Professional Summary')
doc.font('IBMPlexSans').fontSize(10).text(RESUME.summary, { align: 'justify' })

// ── Experience ─────────────────────────────────────────────────────────────

section('Experience')
for (const job of RESUME.experience) {
  rowLR(job.company, 'IBMPlexSans-Medium', job.period, 'IBMPlexSans', 10)
  rowLR(job.role, 'IBMPlexSans-Italic', job.location, 'IBMPlexSans', 10)
  doc.moveDown(0.15)
  for (const b of job.bullets) bullet(b)
  doc.moveDown(0.4)
}

// ── Education ──────────────────────────────────────────────────────────────

section('Education')
for (const edu of RESUME.education) {
  rowLR(edu.institution, 'IBMPlexSans-Medium', edu.period, 'IBMPlexSans', 10)
  doc.font('IBMPlexSans-Italic').fontSize(10).text(edu.degree, MARGIN)
  doc.moveDown(0.15)
  for (const h of edu.highlights) bullet(h)
  doc.moveDown(0.4)
}

// ── Projects ───────────────────────────────────────────────────────────────

section('Projects')
for (const proj of RESUME.projects) {
  doc
    .font('IBMPlexSans-Medium').fontSize(10)
    .text(proj.title, MARGIN, doc.y, { continued: true, width: CONTENT_W })
    .font('IBMPlexSans')
    .text(`  –  ${proj.subtitle}: `, { continued: true })
  doc.font('IBMPlexSans-Light').fontSize(10).text(proj.description, { align: 'justify' })
  doc
    .font('IBMPlexSans-Italic')
    .fontSize(9)
    .text(proj.tags.join(', '))
  doc.moveDown(0.35)
}

// ── Skills ─────────────────────────────────────────────────────────────────

section('Skills')
for (const skill of RESUME.skills) bullet(skill)

// ── Certifications ─────────────────────────────────────────────────────────

section('Certifications')
for (const cert of RESUME.certs) {
  doc.font('IBMPlexSans-Light').fontSize(10).text(`${cert.issuer} - `, MARGIN, doc.y, { continued: true })
  doc.font('IBMPlexSans').text(cert.name, { continued: true })
//   rowLR(`${cert.issuer} - ${cert.name}`, 'IBMPlexSans-Medium', `${cert.date}`, 'IBMPlexSans', 10)
  doc.text('· View badge ↗ ', { link: cert.link, continued: true, underline: true })
  doc.text(cert.date, MARGIN, doc.y, { align: 'right', width: CONTENT_W })
  doc.moveDown(0.3)
}

// ── Publications ───────────────────────────────────────────────────────────

section('Publications')
for (const pub of RESUME.publications) {
  doc.font('IBMPlexSans-Italic').fontSize(10).text(`"${pub.title}"`, { align: 'justify' })
  doc.font('IBMPlexSans').fontSize(10).text(`${pub.authors}. ${pub.venue}.`)
  doc.moveDown(0.3)
}

// ── Languages ──────────────────────────────────────────────────────────────

section('Languages')
for (const lang of RESUME.languages) {
  doc
    .font('IBMPlexSans-Medium').fontSize(10)
    .text(lang.language, MARGIN, doc.y, { continued: true })
    .font('IBMPlexSans')
    .text(`  –  ${lang.proficiency}`)
}

// ── Volunteering ───────────────────────────────────────────────────────────

section('Volunteering')
for (const v of RESUME.volunteering) bullet(v)

// ── Done ───────────────────────────────────────────────────────────────────

doc.end()
console.log(`✓ Resume written to ${out}`)
