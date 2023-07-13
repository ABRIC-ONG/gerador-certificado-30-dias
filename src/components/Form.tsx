import { useState } from "react";
import { cpfMask } from "../utils/CPFMask";

interface FormProps {
  setPeople: React.Dispatch<React.SetStateAction<Person[]>>;
  people: Person[];
}

const initialPerson = {
  name: "",
  cpf: "",
};

const Form = (props: FormProps) => {
  const [person, setPerson] = useState<Person>(initialPerson);

  const addPerson = () => {
    props.setPeople([...props.people, person]);
    setPerson(initialPerson);
  };

  return (
    <form className="flex flex-col items-left py-4 w-[90%] max-w-sm mb-">
      <h1 className="text-2xl self-center mb-6 font-bold text-primary lg:text-4xl">
        Dados da pessoa
      </h1>
      <label
        htmlFor="name"
        className="text-primary font-semibold text-lg md:text-xl"
      >
        Nome completo
      </label>
      <input
        id="name"
        className="appearance-none border bg-gray-100 p-2 focus:bg-white focus:outline-darkPrimary mb-4 md:text-xl"
        placeholder="Nome completo"
        value={person.name}
        onChange={(e) => setPerson({ ...person, name: e.currentTarget.value })}
      />
      <label
        htmlFor="cpf"
        className="text-primary font-semibold text-lg md:text-xl"
      >
        CPF
      </label>
      <div className="mb-4 flex">
        <input
          maxLength={14}
          id="cpf"
          className="flex-1 appearance-none border bg-gray-100 p-2 md:text-xl focus:bg-white focus:outline-darkPrimary"
          placeholder="Ex.: 123.456.789-10"
          value={person.cpf}
          onChange={(e) =>
            setPerson({ ...person, cpf: cpfMask(e.currentTarget.value) })
          }
        />
      </div>
      <button
        type="button"
        onClick={addPerson}
        disabled={!person?.name || !person?.cpf}
        className="px-16 text-white bg-primary font-bold py-2  md:text-xl disabled:opacity-75 md:py-4"
      >
        Adicionar pessoa
      </button>
    </form>
  );
};

export { Form };
