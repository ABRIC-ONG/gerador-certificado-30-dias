import { useState } from "react";
import { cpfMask } from "../utils/CPFMask";
import { Person, CertificationType } from "../entities/Person";

interface FormProps {
  setPeople: React.Dispatch<React.SetStateAction<Person[]>>;
  people: Person[];
}

const initialPerson: Person = {
  name: "",
  cpf: "",
  dataEmissao: new Date(),
  tipoCertificado: CertificationType.Mentee,
};

const Form = (props: FormProps) => {
  const [person, setPerson] = useState<Person>(initialPerson);

  const data: () => string = () => {
    const date = person.dataEmissao;
    const stringDate =
      date.getFullYear() +
      "-" +
      ("0" + (date.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + date.getDate()).slice(-2);
    return stringDate;
  };

  const addPerson = () => {
    props.setPeople([...props.people, person]);
    setPerson({
      ...initialPerson,
      dataEmissao: person.dataEmissao,
      tipoCertificado: person.tipoCertificado,
    });
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
      <input
        maxLength={14}
        id="cpf"
        className="mb-4 flex appearance-none border bg-gray-100 p-2 md:text-xl focus:bg-white focus:outline-darkPrimary"
        placeholder="Ex.: 123.456.789-10"
        value={person.cpf}
        onChange={(e) =>
          setPerson({ ...person, cpf: cpfMask(e.currentTarget.value) })
        }
      />

      <label
        htmlFor="type"
        className="text-primary font-semibold text-lg md:text-xl"
      >
        Tipo de certificado
      </label>
      <select
        id="type"
        name="type"
        className="mb-4 flex appearance-none border bg-gray-100 p-2 md:text-xl focus:bg-white focus:outline-darkPrimary"
        placeholder="Ex.: 123.456.789-10"
        value={person.tipoCertificado}
        onChange={(e) =>
          setPerson({
            ...person,
            tipoCertificado: e.currentTarget
              .value as unknown as CertificationType,
          })
        }
      >
        <option value={CertificationType.Mentor}>Mentores</option>
        <option value={CertificationType.Training}>
          Capacitação de Mentores
        </option>
        <option value={CertificationType.Mentee}>Mentorados</option>
      </select>

      <label
        htmlFor="dataEmissao"
        className="text-primary font-semibold text-lg md:text-xl"
      >
        Data de emissão
      </label>
      <input
        id="dataEmissao"
        type="date"
        value={data()}
        onChange={(e) => {
          const dateInput = e.currentTarget.value; // yyyy-mm-dd string format from date input
          let dateParts = dateInput.split("-").map(Number); // split date values
          dateParts[1]--; // fix the current month to use as index of month in Date constructor
          setPerson({
            ...person,
            dataEmissao: new Date(dateParts[0], dateParts[1], dateParts[2]),
          });
        }}
        className="mb-4 flex appearance-none border bg-gray-100 p-2 md:text-xl focus:bg-white focus:outline-darkPrimary"
      />
      <button
        type="button"
        onClick={addPerson}
        disabled={!person?.name || !person?.cpf || !person?.dataEmissao}
        className="px-16 text-white bg-primary font-bold py-2  md:text-xl disabled:opacity-75 md:py-4"
      >
        Adicionar pessoa
      </button>
    </form>
  );
};

export { Form };
