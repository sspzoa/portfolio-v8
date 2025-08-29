import { Tile } from "@/components/common/Tile"
import { useProjects } from "@/hooks/api"
import Skeleton from "@/components/common/Skeleton"
import styled from "@emotion/styled"
import { atom, useAtom } from "jotai"

const showSideProjectsAtom = atom(false)

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4.75rem;
  padding: 0.5rem;
`

const Card = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1rem;
  border-radius: 8px;
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
`

const CoverImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

const RightContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  flex: 1;
`

const TitleArea = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
`

const Icon = styled.div`
  width: 2rem;
  height: 2rem;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  overflow: hidden;
`

const IconImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
`

const Title = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  margin: 0;
`

const Description = styled.p`
  font-size: 0.75rem;
  font-weight: 500;
  margin: 0;
`

const DetailText = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.6;
  white-space: pre-line;
`

const ShowMoreButton = styled.button`
  background: none;
  border: none;
  color: var(--content-standard-secondary);
  font-size: 0.75rem;
  font-weight: 500;
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
          <Card key={project.id}>
            <CoverImageContainer>
              {project.cover?.file?.url ? (
                <CoverImage
                  src={project.cover.file.url}
                  alt={project.properties.name?.title[0]?.plain_text}
                />
              ) : (
                <span style={{ fontSize: "2rem" }}>📱</span>
              )}
            </CoverImageContainer>
            <RightContent>
              <TitleArea>
                <Icon>
                  {project.icon?.file?.url ? (
                    <IconImage
                      src={project.icon.file.url}
                      alt={project.properties.name?.title[0]?.plain_text}
                    />
                  ) : (
                    <span style={{ fontSize: "1rem" }}>📱</span>
                  )}
                </Icon>
                <Content>
                  <Title>{project.properties.name?.title[0]?.plain_text}</Title>
                  <Description>
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
                  </Description>
                </Content>
              </TitleArea>
              <DetailText>
                {project.properties.description?.rich_text[0].plain_text}
              </DetailText>
            </RightContent>
          </Card>
        ))}
        {sideProjects.length > 0 && (
          <ShowMoreButton
            onClick={() => setShowSideProjects(!showSideProjects)}
          >
            {showSideProjects
              ? `사이드 프로젝트 숨기기`
              : `사이드 프로젝트 ${sideProjects.length}개 더보기`}
          </ShowMoreButton>
        )}
      </Container>
    </Tile>
  )
}
