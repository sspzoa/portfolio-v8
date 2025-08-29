import { atom } from "jotai"
import { ActivityType } from "@/types/ActivityType"
import { AwardType } from "@/types/AwardType"
import { CertificateType } from "@/types/CertificateType"
import { AboutType } from "@/types/ExperienceType"
import { ProjectType } from "@/types/ProjectType"
import { SkillType } from "@/types/SkillType"

export const activitiesAtom = atom<ActivityType[]>([])
export const awardsAtom = atom<AwardType[]>([])
export const certificatesAtom = atom<CertificateType[]>([])
export const experiencesAtom = atom<AboutType[]>([])
export const projectsAtom = atom<ProjectType[]>([])
export const skillsAtom = atom<SkillType[]>([])
