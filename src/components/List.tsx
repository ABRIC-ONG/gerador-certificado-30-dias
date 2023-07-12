import { useEffect, useState } from "react";
import { ListPage } from "./List/ListPage";
import { ProjectAuthors } from "./List/ProjectAuthors";
import { GeneratorButton } from "./GeneratorButton";

interface ListProps {
  projects: Project[];
}

const initialProjectIndex = 0;

const List = (props: ListProps) => {
  const { projects } = props;
  const [projectIndex, setProjectIndex] = useState<number>(initialProjectIndex);
  const [selectedProject, setSelectedProject] = useState<Project>(
    projects[initialProjectIndex]
  );

  useEffect(() => {
    const newIndex = projects.length - 1;
    setProjectIndex(newIndex);
    setSelectedProject(projects[newIndex]);
  }, [projects]);

  useEffect(() => {
    setSelectedProject(projects[projectIndex]);
  }, [projectIndex]);

  return (
    <div className="flex flex-col items-center w-full max-w-xl lg:w-1/2 lg:max-w-3xl">
      <h2 className="font-bold text-xl mb-4 lg:text-3xl">
        {projects.length} projeto(s) cadastrados
      </h2>
      <div className="p-4 flex flex-col text-lg w-[90%] bg-gray-200">
        {projects?.length > 0 ? (
          <>
            <p className="font-semibold text-lg mb-2 lg:text-xl">
              {selectedProject?.title}
            </p>
            <ProjectAuthors
              authors={selectedProject?.authors || ([] as Author[])}
            />
            <ListPage
              projectIndex={projectIndex}
              setProjectIndex={setProjectIndex}
              projectCount={projects.length ?? 0}
            />
            <GeneratorButton selectedProject={selectedProject} />
          </>
        ) : (
          <>
            <h1>Nenhum projeto cadastrado.</h1>
          </>
        )}
      </div>
    </div>
  );
};

export { List };
