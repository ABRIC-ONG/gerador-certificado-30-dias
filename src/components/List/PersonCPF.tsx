interface PersonCPFProps {
  cpf: string;
}
export const PersonCPF = (props: PersonCPFProps) => {
  const { cpf } = props;

  return (
    <h2 className="my-4 text-primary font-bold text-lg lg:text-xl inline">
      CPF:{" "}
      <span className="overflow-hidden text-ellipsis text-lg py-1 lg:text-xl">
        {cpf}
      </span>
    </h2>
  );
};
