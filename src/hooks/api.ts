import { useQuery } from "@tanstack/react-query"
import { useAtom } from "jotai"
import { useEffect } from "react"
import {
  aboutmeAtom,
  activitiesAtom,
  awardsAtom,
  certificatesAtom,
  experiencesAtom,
  projectsAtom,
  skillsAtom,
  languageAtom,
} from "@/store/atoms"
import {
  AboutMeType,
  ActivityType,
  AwardType,
  CertificateType,
  ExperienceType,
  ProjectType,
  SkillType,
} from "@/types"

const fetcher = async (url: string) => {
  const response = await fetch(url)
  return response.json()
}

interface PortfolioData {
  aboutme: AboutMeType[]
  activities: ActivityType[]
  awards: AwardType[]
  certificates: CertificateType[]
  experiences: ExperienceType[]
  projects: ProjectType[]
  skills: SkillType[]
}

export const usePortfolio = () => {
  const [aboutme, setAboutme] = useAtom(aboutmeAtom)
  const [activities, setActivities] = useAtom(activitiesAtom)
  const [awards, setAwards] = useAtom(awardsAtom)
  const [certificates, setCertificates] = useAtom(certificatesAtom)
  const [experiences, setExperiences] = useAtom(experiencesAtom)
  const [projects, setProjects] = useAtom(projectsAtom)
  const [skills, setSkills] = useAtom(skillsAtom)
  const [language] = useAtom(languageAtom)

  const query = useQuery({
    queryKey: ["portfolio", language],
    queryFn: (): Promise<PortfolioData> =>
      fetcher(`/api/portfolio?lang=${language}`),
  })

  useEffect(() => {
    if (query.data) {
      setAboutme(query.data.aboutme[0])
      setActivities(query.data.activities)
      setAwards(query.data.awards)
      setCertificates(query.data.certificates)
      setExperiences(query.data.experiences)
      setProjects(query.data.projects)
      setSkills(query.data.skills)
    }
  }, [query.data, setAboutme, setActivities, setAwards, setCertificates, setExperiences, setProjects, setSkills])

  return {
    ...query,
    data: {
      aboutme,
      activities,
      awards,
      certificates,
      experiences,
      projects,
      skills,
    },
  }
}

