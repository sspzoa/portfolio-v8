import { atom } from "jotai"
import { AboutMeType } from "@/types/AboutMeType"
import { ActivityType } from "@/types/ActivityType"
import { AwardType } from "@/types/AwardType"
import { CertificateType } from "@/types/CertificateType"
import { ExperienceType } from "@/types/ExperienceType"
import { ProjectType } from "@/types/ProjectType"
import { SkillType } from "@/types/SkillType"

export const aboutmeAtom = atom<AboutMeType | null>(null)
export const activitiesAtom = atom<ActivityType[]>([])
export const awardsAtom = atom<AwardType[]>([])
export const certificatesAtom = atom<CertificateType[]>([])
export const experiencesAtom = atom<ExperienceType[]>([])
export const projectsAtom = atom<ProjectType[]>([])
export const skillsAtom = atom<SkillType[]>([])
