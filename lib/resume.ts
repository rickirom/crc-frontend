export const RESUME = {
  name: 'Ricardo Romero',
  city: 'Madrid, Spain',
  email: 'ricardorompar@hotmail.com',
  linkedin: '/in/rickirom',
  github: '/rickirom',
  phone: '+34 664 421 942',

  summary:
    'Solutions Engineer with 3+ years in client-facing technical roles. Passionate about AI, cloud infrastructure, security, and DevOps. Bridging the gap between engineering depth and business value.',

  experience: [
    {
      company: 'HashiCorp (an IBM Company)',
      role: 'Solutions Engineer',
      period: 'Aug 2024 – Present',
      location: 'Madrid, Spain',
      bullets: [
        'Developed demos, documentation and presentations to support technical engagements for the wider team.',
        'Closed multiple deals as part of the Corporate SE team, contributing to $500k+ pipeline growth in the first year.',
        'Influenced $10M+ ARR in first 6 months through technical engagements with Enterprise customers as part of the SE Hub team.',
        'Led technical webinars and workshops on Terraform, Vault, and Boundary for various Enterprise clients.',
        'Architected cloud infrastructure solutions aligned with the HashiCorp product suite.',
      ],
    },
    {
      company: 'Ingelin',
      role: 'Technical Service Engineer',
      period: 'Jan 2022 – Sep 2023',
      location: 'Quito, Ecuador',
      bullets: [
        'Delivered 15+ customer solutions for medical imaging and equipment systems',
        'Implemented and oversaw over 10 projects of medical equipment installations.',
        "Started the company's new line of business, along with the primary stakeholders, by teaming up with a major Chinese manufacturer of medical imaging systems.",
      ],
    },
    {
      company: 'Larscript',
      role: 'Customer Support Engineer',
      period: 'Jul 2021 – Jan 2022',
      location: 'Quito, Ecuador',
      bullets: [
        'Led IT infrastructure projects (PACS/RIS) for enterprise clients',
        'Supervised an IT infrastructure improvement project for a major hospital, resulting in increased capacity of medical imaging exams.',
      ],
    },
  ],

  education: [
    {
      institution: 'IE University',
      degree: 'Master in Computer Science & Business Technology',
      period: 'Sep 2023 – Jul 2024',
      highlights: [
        'IE Foundation Scholarship recipient (direct award)',
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
  ],

  projects: [
    {
      title: 'Cloud Resume Challenge',
      subtitle: 'This website',
      description:
        'Full-stack cloud resume using AWS S3, CloudFront, Route53, and Lambda for the backend API. Infrastructure provisioned with Terraform and deployed via GitHub actions.',
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
  ],

  skills: [
    'Infra: AWS, Azure, (less GCP and OCP).',
    'DevOps: HashiCorp (Vault, Terraform, Packer, Boundary), GitHub Actions, Kubernetes, Docker',
    'Programming: Python (FastAPI, Flask)',
    'Tech Sales & Solutions Architecture',
  ],

  certs: [
    {
      name: 'HashiCorp Certified: Terraform Authoring and Operations Professional',
      issuer: 'HashiCorp / IBM',
      date: 'Aug 2026',
      link: 'https://www.credly.com/badges/d35068b5-b73b-40e1-80d0-f30548c924f8/public_url',
    },
    {
      name: 'AWS Certified Cloud Practitioner',
      issuer: 'AWS',
      date: 'May 2025',
      link: 'https://www.credly.com/badges/fda4fb65-cbfa-4105-ac8c-21c51ded9176/public_url',
    },
    {
      name: 'HashiCorp Certified: Vault Operations Professional',
      issuer: 'HashiCorp',
      date: 'Oct 2025',
      link: 'https://www.credly.com/badges/749c5f69-9381-49ce-a466-d2536667162d/public_url',
    },
    {
      name: 'HashiCorp Certified: Vault Associate (003)',
      issuer: 'HashiCorp',
      date: 'Oct 2025',
      link: 'https://www.credly.com/badges/2038e702-9cd6-498a-92aa-fb8a71c3e8f0/public_url',
    },
    {
      name: 'HashiCorp Certified: Terraform Associate (003)',
      issuer: 'HashiCorp',
      date: 'Oct 2024',
      link: 'https://www.credly.com/badges/9365bf39-97e0-4778-a2b9-b8d7a20c3d1f/public_url',
    },
  ],

  publications: [
    {
      title:
        'Hand Gesture and Arm Movement Recognition for Multimodal Control of a 3-DOF Helicopter',
      authors:
        'Ricardo Romero, Patricio J. Cruz, Juan P. Vásconez, Marco Benalcázar, Robin Álvarez, Lorena Barona & Ángel Leonardo Valdivieso',
      venue: 'Robot Intelligence Technology and Applications 6 (RiTA 2021)',
      link: 'https://link.springer.com/chapter/10.1007/978-3-030-97672-9_32',
    },
    {
      title:
        'A Deep Q-Network based hand gesture recognition system for control of robotic platforms',
      authors:
        'Patricio J. Cruz, Juan P. Vásconez, Ricardo Romero, Alex Chico, Marco Benalcázar, Robin Álvarez, Lorena Barona & Ángel Leonardo Valdivieso',
      venue: 'Scientific Reports',
      link: 'https://www.nature.com/articles/s41598-023-34540-x',
    },
  ],

  volunteering: [
    'Co-founder & mentor, EPN Languages Club (2021)',
    "Student member of IEEE's Control Systems Society (2020-2021)",
  ],

  languages: [
    { language: 'English', proficiency: 'Full professional proficiency' },
    { language: 'Spanish', proficiency: 'Native' },
    { language: 'French', proficiency: 'Limited working proficiency' },
  ],
}
