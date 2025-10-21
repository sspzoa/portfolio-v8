import { atom } from "jotai"
import {
  AboutMeType,
  ActivityType,
  AwardType,
  CertificateType,
  ExperienceType,
  ProjectType,
  SkillType,
} from "@/types"
import { SupportedLanguage } from "@/lib/translate"

export const aboutmeAtom = atom<AboutMeType | null>(null)
export const activitiesAtom = atom<ActivityType[]>([])
export const awardsAtom = atom<AwardType[]>([])
export const certificatesAtom = atom<CertificateType[]>([])
export const experiencesAtom = atom<ExperienceType[]>([])
export const projectsAtom = atom<ProjectType[]>([])
export const skillsAtom = atom<SkillType[]>([])
export const languageAtom = atom<SupportedLanguage>("ko")
