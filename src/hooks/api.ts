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
} from "@/store/atoms"
import { AboutMeType } from "@/types/AboutMeType"
import { ActivityType } from "@/types/ActivityType"
import { AwardType } from "@/types/AwardType"
import { CertificateType } from "@/types/CertificateType"
import { ExperienceType } from "@/types/ExperienceType"
import { ProjectType } from "@/types/ProjectType"
import { SkillType } from "@/types/SkillType"

const fetcher = async (url: string) => {
  const response = await fetch(url)
  return response.json()
}

export const useAboutMe = () => {
  const [aboutme, setAboutme] = useAtom(aboutmeAtom)

  const query = useQuery({
    queryKey: ["aboutme"],
    queryFn: (): Promise<{ results: AboutMeType[] }> => fetcher("/api/aboutme"),
  })

  useEffect(() => {
    if (query.data) {
      setAboutme(query.data.results[0])
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
    queryFn: (): Promise<{ results: ActivityType[] }> =>
      fetcher("/api/activities"),
  })

  useEffect(() => {
    if (query.data) {
      setActivities(query.data.results)
    }
  }, [query.data, setActivities])

  return {
    ...query,
    data: activities,
  }
}

export const useAwards = () => {
  const [awards, setAwards] = useAtom(awardsAtom)

  const query = useQuery({
    queryKey: ["awards"],
    queryFn: (): Promise<{ results: AwardType[] }> => fetcher("/api/awards"),
  })

  useEffect(() => {
    if (query.data) {
      setAwards(query.data.results)
    }
  }, [query.data, setAwards])

  return {
    ...query,
    data: awards,
  }
}

export const useCertificates = () => {
  const [certificates, setCertificates] = useAtom(certificatesAtom)

  const query = useQuery({
    queryKey: ["certificates"],
    queryFn: (): Promise<{ results: CertificateType[] }> =>
      fetcher("/api/certificates"),
  })

  useEffect(() => {
    if (query.data) {
      setCertificates(query.data.results)
    }
  }, [query.data, setCertificates])

  return {
    ...query,
    data: certificates,
  }
}

export const useExperiences = () => {
  const [experiences, setExperiences] = useAtom(experiencesAtom)

  const query = useQuery({
    queryKey: ["experiences"],
    queryFn: (): Promise<{ results: ExperienceType[] }> =>
      fetcher("/api/experiences"),
  })

  useEffect(() => {
    if (query.data) {
      setExperiences(query.data.results)
    }
  }, [query.data, setExperiences])

  return {
    ...query,
    data: experiences,
  }
}

export const useProjects = () => {
  const [projects, setProjects] = useAtom(projectsAtom)

  const query = useQuery({
    queryKey: ["projects"],
    queryFn: (): Promise<{ results: ProjectType[] }> =>
      fetcher("/api/projects"),
  })

  useEffect(() => {
    if (query.data) {
      setProjects(query.data.results)
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
    queryFn: (): Promise<{ results: SkillType[] }> => fetcher("/api/skills"),
  })

  useEffect(() => {
    if (query.data) {
      setSkills(query.data.results)
    }
  }, [query.data, setSkills])

  return {
    ...query,
    data: skills,
  }
}
