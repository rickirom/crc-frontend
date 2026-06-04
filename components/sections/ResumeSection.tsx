import { Briefcase, Download, GraduationCap } from 'lucide-react'

const RESUME_PDF_URL = '#' // Replace with actual URL to resume PDF

const EXPERIENCE = [
  {
    company: 'HashiCorp (an IBM Company)',
    role: 'Solutions Engineer',
    period: 'Aug 2024 – Present',
    location: 'Madrid, Spain',
    bullets: [
      'Influenced $10M+ ARR in first 6 months through technical sales cycles',
      'Led technical webinars on Terraform, Vault, and Boundary for enterprise clients',
      'Architected cloud infrastructure solutions aligned with the HashiCorp product suite',
    ],
  },
  {
    company: 'Ingelin',
    role: 'Technical Service Engineer',
    period: 'Jan 2022 – Sep 2023',
    location: 'Quito, Ecuador',
    bullets: [
      'Delivered 15+ customer solutions for medical imaging and equipment systems',
      'Provided technical support for PACS/RIS healthcare software platforms',
      'Managed end-to-end troubleshooting for mission-critical medical hardware',
    ],
  },
  {
    company: 'Larscript',
    role: 'Customer Support Engineer',
    period: 'Jul 2021 – Jan 2022',
    location: 'Quito, Ecuador',
    bullets: [
      'Led IT infrastructure projects for enterprise clients',
      'Implemented and supported PACS/RIS software solutions',
    ],
  },
]

const EDUCATION = [
  {
    institution: 'IE University',
    degree: 'Master in Computer Science & Business Technology',
    period: 'Sep 2023 – Jul 2024',
    highlights: [
      'IE Foundation Scholarship recipient',
      "Dean's List – Top 3 in cohort",
    ],
  },
  {
    institution: 'Escuela Politécnica Nacional',
    degree: 'Bachelor in Electronics & Control Engineering',
    period: 'Sep 2015 – May 2021',
    highlights: [
      'Graduated Summa Cum Laude, GPA 3.87/4.0',
      '8× Academic Excellence Scholarship',
    ],
  },
]

export default function ResumeSection() {
  return (
    <section id="resume" className="py-24 px-6 border-t border-gray-800">
      <div className="max-w-3xl mx-auto space-y-16">
        <h2 className="font-mono text-xs text-gray-500 uppercase tracking-widest">// resume</h2>

        {/* Summary */}
        <p className="font-mono text-sm text-gray-300 leading-relaxed">
          Solutions Engineer with 3+ years in client-facing technical roles.
          Passionate about AI, cloud infrastructure, security, and DevOps. Bridging the gap
          between engineering depth and business value.
        </p>

        {/* Experience */}
        <div className="space-y-8">
          <h3 className="font-mono text-sm text-gray-400 flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            experience
          </h3>
          <div className="space-y-10">
            {EXPERIENCE.map((job) => (
              <div key={job.company} className="border-l border-gray-700 pl-5 space-y-3">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                  <div>
                    <p className="font-mono font-semibold text-white">{job.company}</p>
                    <p className="font-mono text-sm text-gray-400">{job.role}</p>
                  </div>
                  <div className="sm:text-right">
                    <p className="font-mono text-xs text-gray-500">{job.period}</p>
                    <p className="font-mono text-xs text-gray-600">{job.location}</p>
                  </div>
                </div>
                <ul className="space-y-1.5">
                  {job.bullets.map((bullet, i) => (
                    <li key={i} className="font-mono text-xs text-gray-400 flex gap-2">
                      <span className="text-gray-600 shrink-0">&gt;</span>
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Education */}
        <div className="space-y-8">
          <h3 className="font-mono text-sm text-gray-400 flex items-center gap-2">
            <GraduationCap className="w-4 h-4" />
            education
          </h3>
          <div className="space-y-8">
            {EDUCATION.map((edu) => (
              <div key={edu.institution} className="border-l border-gray-700 pl-5 space-y-3">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                  <div>
                    <p className="font-mono font-semibold text-white">{edu.institution}</p>
                    <p className="font-mono text-sm text-gray-400">{edu.degree}</p>
                  </div>
                  <p className="font-mono text-xs text-gray-500 sm:text-right">{edu.period}</p>
                </div>
                <ul className="space-y-1.5">
                  {edu.highlights.map((h, i) => (
                    <li key={i} className="font-mono text-xs text-gray-400 flex gap-2">
                      <span className="text-gray-600 shrink-0">&gt;</span>
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Download */}
        <a
          href={RESUME_PDF_URL}
          download
          className="inline-flex items-center gap-2 font-mono text-xs border bg-gray-600 text-white hover:bg-gray-950 hover:border-white px-4 py-2 transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          download PDF resume
        </a>
      </div>
    </section>
  )
}
