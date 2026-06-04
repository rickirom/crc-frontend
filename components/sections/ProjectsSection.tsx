import Image from 'next/image'
import { ExternalLink } from 'lucide-react'

const PROJECTS = [
  {
    title: 'Cloud Resume Challenge',
    subtitle: 'This website',
    description:
      'Full-stack cloud resume using AWS S3, CloudFront, Route53, and Lambda for the backend API. Infrastructure provisioned with Terraform and deployed via CI/CD pipelines.',
    image: '/cloud_resume.png',
    tags: ['AWS', 'Terraform', 'Lambda', 'CI/CD', 'Python'],
    link: {
      label: 'GitHub',
      href: 'https://github.com/ricardorompar/cloudResumeChallenge',
    },
  },
  {
    title: '3DOF Helicopter',
    subtitle: "Bachelor's thesis",
    description:
      'Low-cost 3-DOF helicopter testbench controlled by hand gestures and arm movements using a Myo Armband. Demonstrated effective multimodal control via gesture recognition and IMU data.',
    image: '/3dof.png',
    tags: ['Python', 'Myo Armband', 'Control Systems', 'IMU'],
    link: {
      label: 'Thesis',
      href: 'https://bibdigital.epn.edu.ec/handle/15000/22245',
    },
  },
  {
    title: 'Wingy',
    subtitle: "Master's capstone",
    description:
      'Stock visualizer web app built with Flask and React, deployed on Oracle Cloud and GCP. Enabled real-time equity data visualization and portfolio tracking.',
    image: '/wingy.png',
    tags: ['Flask', 'React', 'Oracle Cloud', 'GCP', 'Python'],
    link: {
      label: 'GitHub',
      href: 'https://github.com/ricardorompar/capstoneT2',
    },
  },
  {
    title: 'FastAPI + MongoDB',
    subtitle: 'End of master project',
    description:
      'Full-stack app migrating the FastAPI full-stack template from PostgreSQL to MongoDB. Built with FastAPI and React, running on GCP with Docker. Supports all CRUD operations on users and items.',
    image: '/mongo_mockup.png',
    tags: ['FastAPI', 'React', 'MongoDB', 'GCP', 'Docker'],
    link: {
      label: 'GitHub',
      href: 'https://github.com/ricardorompar/full-stack-fastapi-mongo-template',
    },
  },
]

export default function ProjectsSection() {
  return (
    <section id="projects" className="py-24 px-6 border-t border-gray-800">
      <div className="max-w-3xl mx-auto space-y-12">
        <div className="space-y-2">
          <h2 className="font-mono text-xs text-gray-500 uppercase tracking-widest">// projects</h2>
          <p className="font-mono text-sm text-gray-500">
            A few things I&apos;ve built. More on{' '}
            <a
              href="https://github.com/ricardorompar"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white underline underline-offset-2 transition-colors"
            >
              GitHub
            </a>
            .
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {PROJECTS.map((project) => (
            <div
              key={project.title}
              className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden flex flex-col hover:border-gray-600 transition-colors duration-300"
            >
              <div className="relative h-40 bg-gray-950">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover opacity-70"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
              </div>

              <div className="p-5 flex flex-col gap-3 flex-1">
                <div>
                  <p className="font-mono text-xs text-gray-500">{project.subtitle}</p>
                  <h3 className="font-mono font-semibold text-white text-sm">{project.title}</h3>
                </div>

                <p className="font-mono text-xs text-gray-400 leading-relaxed flex-1">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-mono text-xs px-2 py-0.5 bg-gray-800 text-gray-400 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <a
                  href={project.link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs text-gray-400 hover:text-white flex items-center gap-1.5 transition-colors w-fit"
                >
                  <ExternalLink className="w-3 h-3" />
                  {project.link.label}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
