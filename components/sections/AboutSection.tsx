import Image from 'next/image'

const INTERESTS = [
  'Running',
  'Music',
  'Cloud Infrastructure',
  'AI',
  'DevOps',
  'Tech & Science',
]

export default function AboutSection() {
  return (
    <section id="about" className="py-24 px-6 border-t border-gray-800">
      <div className="max-w-3xl mx-auto space-y-12">
        <h2 className="font-mono text-xs text-gray-500 uppercase tracking-widest">{/* about */}</h2>

        <div className="flex flex-col sm:flex-row gap-10 items-start">
          <div className="shrink-0 self-center sm:self-start">
            <div className="relative w-36 h-36 rounded-full overflow-hidden border border-gray-700">
              <Image
                src="/profile.jpg"
                alt="Ricardo Romero"
                fill
                className="object-cover"
                sizes="144px"
              />
            </div>
          </div>

          <div className="space-y-5">
            <div className="space-y-3 font-mono text-sm text-gray-300 leading-relaxed">

              <p>
                With a background in electronics engineering, I had a strong interest in how computers
                and software work. This led me to find a passion for cloud infrastructure automation 
                and security. I enjoy the intersection of deep technical work and helping teams ship 🚀
              </p>
              <p>
                Currently at HashiCorp as a Solutions Engineer, I work with enterprise customers
                to design infrastructure strategies around Terraform, Vault, and Boundary, etc.,
                translating complex engineering into real business outcomes.
              </p>
              <p>
                Before that, I graduated with a Master&apos;s in CS & Business Technology from IE
                University and a Bachelor&apos;s in Electronics & Control Engineering from{' '}
                <abbr title="Escuela Politécnica Nacional">EPN</abbr> in Ecuador, where I was born
                and raised.
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
