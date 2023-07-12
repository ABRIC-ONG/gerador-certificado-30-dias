interface ProjectAuthorsProps {
  authors: Author[];
}
export const ProjectAuthors = (props: ProjectAuthorsProps) => {
  const { authors } = props;

  return (
    <>
      <h2 className="text-primary font-bold text-lg lg:text-xl">Autor(es)</h2>
      <ul className="mb-4">
        {authors?.map((author, index) => (
          <li
            className="overflow-hidden text-ellipsis text-lg py-1 lg:text-xl"
            key={index}
          >
            {index + 1}. {author.name}
          </li>
        ))}
      </ul>
    </>
  );
};
