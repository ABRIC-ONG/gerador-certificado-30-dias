import { useState } from "react";

interface FormProps {
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  projects: Project[];
}

const initialProject = {
  title: "",
  authors: [],
};
const initialAuthorName = "";

const Form = (props: FormProps) => {
  const [project, setProject] = useState<Project>(initialProject);
  const [authorName, setAuthorName] = useState<string>(initialAuthorName);

  const addAuthor = () => {
    if (authorName) project.authors.push({ name: authorName });
    setAuthorName(initialAuthorName);
  };

  const removeAuthor = (index: number) => {
    let authors = project.authors;
    authors = authors.filter(
      (selectedAuthor) => selectedAuthor !== project.authors[index]
    );
    setProject({ ...project, authors });
  };

  const addProject = () => {
    props.setProjects([...props.projects, project]);
    setProject(initialProject);
    setAuthorName(initialAuthorName);
  };

  return (
    <form className="flex flex-col items-left py-4 w-[90%] max-w-sm mb-">
      <h1 className="text-2xl self-center mb-6 font-bold text-primary lg:text-4xl">
        Cadastro de Projeto
      </h1>
      <label className="text-primary font-semibold text-lg md:text-xl">
        Título do Projeto
      </label>
      <input
        className="appearance-none border bg-gray-100 p-2 focus:bg-white focus:outline-darkPrimary mb-4 md:text-xl"
        placeholder="Título do Projeto"
        value={project.title}
        onChange={(e) =>
          setProject({ ...project, title: e.currentTarget.value })
        }
      />
      {project.authors.length > 0 && (
        <>
          <label className="text-primary font-semibold text-lg md:text-xl">
            Autor(es)
          </label>
          <ul className="md:mb-4">
            {project.authors.map((author, index) => {
              return (
                <li key={index} className="flex items-center">
                  <button
                    type="button"
                    onClick={() => removeAuthor(index)}
                    className="text-red-400 font-bold text-xl p-1"
                  >
                    X
                  </button>
                  <span className="inline-block md:text-xl max-w-full overflow-hidden text-ellipsis">
                    {author.name}
                  </span>
                </li>
              );
            })}
          </ul>
        </>
      )}
      <label className="text-primary font-semibold text-lg md:text-xl">
        Nome do autor
      </label>
      <div className="mb-4 flex">
        <input
          className="flex-1 appearance-none border bg-gray-100 p-2 md:text-xl focus:bg-white focus:outline-darkPrimary"
          placeholder="Nome do autor"
          value={authorName}
          onChange={(e) => setAuthorName(e.currentTarget.value)}
        />
        <button
          type="button"
          onClick={addAuthor}
          className="p-4 text-white bg-primary font-bold py-2"
        >
          +
        </button>
      </div>
      <button
        type="button"
        onClick={addProject}
        disabled={!project?.title || !(project.authors.length > 0)}
        className="px-16 text-white bg-primary font-bold py-2  md:text-xl disabled:opacity-75 md:py-4"
      >
        Adicionar projeto
      </button>
    </form>
  );
};

export { Form };
