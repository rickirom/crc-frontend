import { ScrambleText } from '../UI/ScrambleText'
import { ScrambleTextOnLoad } from '../UI/ScrambleTextOnLoad'
import { LinkedIn, GitHub, Instagram, X, Mail, WhatsApp } from '../UI/SocialLogos'

const INTERESTS = [
  'Running',
  'Music',
  'Infra and DevOps',
  'AI',
  'Tech & Science',
]

const scrambleValues = [
    "Solutions Engineer", 
    "DevOps Practitioner", 
    "An atom in the universe", 
    "A universe of atoms" , 
    "Electronics Engineer", 
    "Vibe coder",
    "Husband, friend, son, brother", 
    "Beer enthusiast", 
    "Occasional taco eater", 
    "Tech wanderer", 
    "Homelabber", 
    "Runner", 
    "AI tinkerer",
    "Keep on reloading this page ;)", 
    "Guitar player (average)", 
    "Your technical advisor", 
    "Terraform and Vault pro"
]

const LINKS = {
  "Github": { link: "https://github.com/rickirom", Icon: GitHub },
  "LinkedIn": { link: "https://linkedin.com/in/rickirom", Icon: LinkedIn },
  "X/Twitter": { link: "https://twitter.com/rickirom_", Icon: X },
  "Instagram": { link: "https://instagram.com/rickirom_", Icon: Instagram},
  "WhatsApp": { link: "https://wa.me/34664421942", Icon: WhatsApp},
  "Mail": { link: "mailto:ricardorompar@hotmail.com", Icon: Mail}
} as const;

export default function AboutSection() {
  return (
    <section id="about" className="pt-30 px-6 border-gray-800">
      <div className="max-w-3xl mx-auto space-y-12">
        

        <div className="flex flex-col sm:flex-row gap-10 items-start">

          <div className="space-y-5">
            <h1 className="space-y-3 font-title font-bold text-[2rem] sm:text-[3rem] text-white leading-relaxed">
                Hi I&apos;m{" "}
                <ScrambleText values={["Ricardo", "rickirom", "ricardorompar", "riki.sh"]} className='border-gray-500' />
            </h1>
            <h2 className="space-y-3 font-title font-bold text-[1rem] text-white leading-relaxed">
              <ScrambleTextOnLoad
                values={scrambleValues} className='text-accent'
              />
            </h2>
                    
            <div className="flex flex-wrap gap-2">
                {Object.entries(LINKS).map(([label, { link, Icon }]) => (
                  <div key={label} className='border border-solid rounded-sm text-xs text-gray-300 hover:border-accent hover:text-accent hover:border-dashed transition-all duration-300'>
                    <a href={link} target="_blank" rel="noopener noreferrer" className='flex flex-row p-1'>
                        <Icon className='h-4'></Icon>
                        {label}
                    </a>
                  </div>
                ))}
            </div>

            <h2 className="font-mono text-xs text-gray-500 tracking-widest mt-15">/ about</h2>

            <div className="space-y-3 font-mono text-sm text-gray-300 leading-relaxed">
              <p>
                I like building things with technology. Sometimes demos for customers, MVPs, experiments in my homelab, or a personal website. Some other times it&apos;s presentations or workshops to explain technical concepts. My focus is on finding out how technology can help organizations achieve their goals.
              </p>
              <p className="font-mono text-sm text-gray-300">
                Currently helping businesses <a className='alink' href="https://www.hashicorp.com/" target="_blank" rel="noopener noreferrer">do cloud right @HashiCorp</a>
              </p>
              <p>
                Outside of work I&apos;m a husband, a friend, a son and a brother. Always playing around with tech and AI. Occasionally a beer and taco enthusiast. Like the rest of us, I&apos;m just an atom in the universe, a universe of atoms. Always wondering about life.
              </p>
            </div>

            <div className="space-y-2">
              <p className="font-mono text-xs text-gray-500">interests</p>
              <div className="flex flex-wrap gap-2">
                {INTERESTS.map((interest) => (
                  <span
                    key={interest}
                    className="font-mono text-xs px-2 py-0.5 border border-gray-700 text-gray-400 rounded"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
