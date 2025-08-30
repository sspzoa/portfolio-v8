import { Tile } from "@/components/common/Tile"
import { useProjects } from "@/hooks/api"
import Skeleton from "@/components/common/Skeleton"
import styled from "@emotion/styled"
import { atom, useAtom } from "jotai"
import {
  DescriptionText,
  DetailText,
  TitleText,
} from "@/components/common/Typo"
import { Card, CardColumn, Content } from "@/components/common/Layout"
import { Icon, IconImage } from "@/components/common/Object"

const showSideProjectsAtom = atom(false)

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4.5rem;
  padding: 0.5rem;
`

const ProjectSection = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 1rem;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`

const CoverImageContainer = styled.div`
  max-width: 24rem;
  width: 100%;
  aspect-ratio: 16/9;
  flex-shrink: 0;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--line-outline);
`

const CoverImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 0.5rem 0;
`

const Tag = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  border: 1px solid var(--line-outline);
`

const ShowMoreButton = styled.button`
  background: none;
  border: none;
  color: var(--content-standard-secondary);
  cursor: pointer;
  padding: 0.5rem 0;
  text-align: center;

  &:hover {
    color: var(--content-standard-primary);
  }
`

export function Projects() {
  const { data: projects, isLoading, error } = useProjects()
  const [showSideProjects, setShowSideProjects] = useAtom(showSideProjectsAtom)

  if (isLoading)
    return (
      <Tile title="Projects">
        <Container>
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} width="100%" height={38} borderRadius="8px" />
          ))}
        </Container>
      </Tile>
    )
  if (error) return <Tile title="Projects">Error loading projects</Tile>

  const mainProjects =
    projects?.filter((project) => !project.properties.isSideProject.checkbox) ||
    []
  const sideProjects =
    projects?.filter((project) => project.properties.isSideProject.checkbox) ||
    []
  const displayedProjects = showSideProjects
    ? [...mainProjects, ...sideProjects]
    : mainProjects

  return (
    <Tile title="Projects">
      <Container>
        {displayedProjects.map((project) => (
          <ProjectSection key={project.id}>
            <CoverImageContainer>
              {project.cover?.file?.url ? (
                <CoverImage
                  draggable={false}
                  src={project.cover.file.url}
                  alt={project.properties.name?.title[0]?.plain_text}
                />
              ) : (
                <span style={{ fontSize: "2rem" }}>📱</span>
              )}
            </CoverImageContainer>
            <CardColumn>
              <Card hasBackground={true}>
                <Icon>
                  {project.icon?.file?.url ? (
                    <IconImage
                      draggable={false}
                      src={project.icon.file.url}
                      alt={project.properties.name?.title[0]?.plain_text}
                    />
                  ) : (
                    <span style={{ fontSize: "1rem" }}>📱</span>
                  )}
                </Icon>
                <Content>
                  <TitleText>
                    {project.properties.name?.title[0]?.plain_text}
                  </TitleText>
                  <DescriptionText>
                    {project.properties.teamSize.number}인 프로젝트
                    {project.properties.shortDescription?.rich_text[0]
                      ?.plain_text && (
                      <>
                        {" "}
                        /{" "}
                        {
                          project.properties.shortDescription.rich_text[0]
                            .plain_text
                        }
                      </>
                    )}
                  </DescriptionText>
                </Content>
              </Card>
              <Tags>
                {project.properties.tags?.multi_select?.map((tag, index) => (
                  <Tag key={index}>{tag.name}</Tag>
                ))}
              </Tags>
              <DetailText>
                {project.properties.description?.rich_text[0].plain_text}
              </DetailText>
            </CardColumn>
          </ProjectSection>
        ))}
        {sideProjects.length > 0 && (
          <ShowMoreButton
            onClick={() => setShowSideProjects(!showSideProjects)}
          >
            <DetailText>
              {showSideProjects
                ? `사이드 프로젝트 숨기기`
                : `사이드 프로젝트 ${sideProjects.length}개 더보기`}
            </DetailText>
          </ShowMoreButton>
        )}
      </Container>
    </Tile>
  )
}
