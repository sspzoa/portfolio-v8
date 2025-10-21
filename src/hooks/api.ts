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

export const useAboutMe = () => {
  const [aboutme, setAboutme] = useAtom(aboutmeAtom)
  const [language] = useAtom(languageAtom)

  const query = useQuery({
    queryKey: ["aboutme", language],
    queryFn: (): Promise<AboutMeType[]> =>
      fetcher(`/api/aboutme?lang=${language}`),
  })

  useEffect(() => {
    if (query.data) {
      setAboutme(query.data[0])
    }
  }, [query.data, setAboutme])

  return {
    ...query,
    data: aboutme,
  }
}

export const useActivities = () => {
  const [activities, setActivities] = useAtom(activitiesAtom)

  const query = useQuery({
    queryKey: ["activities"],
    queryFn: (): Promise<ActivityType[]> => fetcher("/api/activities"),
  })

  useEffect(() => {
    if (query.data) {
      setActivities(query.data)
    }
  }, [query.data, setActivities])

  return {
    ...query,
    data: activities,
  }
}

export const useAwards = () => {
  const [awards, setAwards] = useAtom(awardsAtom)
  const [language] = useAtom(languageAtom)

  const query = useQuery({
    queryKey: ["awards", language],
    queryFn: (): Promise<AwardType[]> =>
      fetcher(`/api/awards?lang=${language}`),
  })

  useEffect(() => {
    if (query.data) {
      setAwards(query.data)
    }
  }, [query.data, setAwards])

  return {
    ...query,
    data: awards,
  }
}

export const useCertificates = () => {
  const [certificates, setCertificates] = useAtom(certificatesAtom)
  const [language] = useAtom(languageAtom)

  const query = useQuery({
    queryKey: ["certificates", language],
    queryFn: (): Promise<CertificateType[]> =>
      fetcher(`/api/certificates?lang=${language}`),
  })

  useEffect(() => {
    if (query.data) {
      setCertificates(query.data)
    }
  }, [query.data, setCertificates])

  return {
    ...query,
    data: certificates,
  }
}

export const useExperiences = () => {
  const [experiences, setExperiences] = useAtom(experiencesAtom)
  const [language] = useAtom(languageAtom)

  const query = useQuery({
    queryKey: ["experiences", language],
    queryFn: (): Promise<ExperienceType[]> =>
      fetcher(`/api/experiences?lang=${language}`),
  })

  useEffect(() => {
    if (query.data) {
      setExperiences(query.data)
    }
  }, [query.data, setExperiences])

  return {
    ...query,
    data: experiences,
  }
}

export const useProjects = () => {
  const [projects, setProjects] = useAtom(projectsAtom)
  const [language] = useAtom(languageAtom)

  const query = useQuery({
    queryKey: ["projects", language],
    queryFn: (): Promise<ProjectType[]> =>
      fetcher(`/api/projects?lang=${language}`),
  })

  useEffect(() => {
    if (query.data) {
      setProjects(query.data)
    }
  }, [query.data, setProjects])

  return {
    ...query,
    data: projects,
  }
}

export const useSkills = () => {
  const [skills, setSkills] = useAtom(skillsAtom)

  const query = useQuery({
    queryKey: ["skills"],
    queryFn: (): Promise<SkillType[]> => fetcher("/api/skills"),
  })

  useEffect(() => {
    if (query.data) {
      setSkills(query.data)
    }
  }, [query.data, setSkills])

  return {
    ...query,
    data: skills,
  }
}
