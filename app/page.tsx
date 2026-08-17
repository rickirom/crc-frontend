import Navbar from '@/components/Navbar'
import LogoSection from '@/components/sections/LogoSection'
import ResumeSection from '@/components/sections/ResumeSection'
import ProjectsSection from '@/components/sections/ProjectsSection'
import AboutSection from '@/components/sections/AboutSection'
import ContactSection from '@/components/sections/ContactSection'
import Footer from '@/components/Footer'
import LogoNew from '@/components/LogoNew'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <AboutSection />
        <LogoNew />
      </main>
      <Footer />
    </>
  )
}
