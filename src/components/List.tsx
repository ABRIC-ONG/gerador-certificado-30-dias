import { useEffect, useState } from "react";
import { ListPage } from "./List/ListPage";
import { PersonCPF } from "./List/PersonCPF";
import { GeneratorButton } from "./GeneratorButton";
import { GenerateAllButton } from "./GenerateAllButton";

interface ListProps {
  people: Person[];
}

const initialPeopleIndex = 0;

const List = (props: ListProps) => {
  const { people: people } = props;
  const [personIndex, setPersonIndex] = useState<number>(initialPeopleIndex);
  const [selectedPerson, setSelectedPerson] = useState<Person>(
    people[initialPeopleIndex]
  );

  useEffect(() => {
    const newIndex = people.length - 1;
    setPersonIndex(newIndex);
    setSelectedPerson(people[newIndex]);
  }, [people]);

  useEffect(() => {
    setSelectedPerson(people[personIndex]);
  }, [personIndex]);

  return (
    <div className="flex flex-col items-center w-full max-w-xl lg:w-1/2 lg:max-w-3xl">
      <h2 className="font-bold text-xl mb-4 lg:text-3xl">
        {people.length} pessoa(s) cadastradas
      </h2>
      <div className="p-4 flex flex-col text-lg w-[90%] bg-gray-200">
        {people?.length > 0 ? (
          <>
            <h2 className="font-bold text-xl mb-4 lg:text-xl">Nome completo</h2>
            <p className="font-semibold text-lg mb-2 lg:text-xl">
              {selectedPerson?.name}
            </p>
            <PersonCPF cpf={selectedPerson?.cpf} />
            <ListPage
              projectIndex={personIndex}
              setProjectIndex={setPersonIndex}
              projectCount={people.length ?? 0}
            />
            <GeneratorButton selectedPerson={selectedPerson} />
            <GenerateAllButton people={people} />
          </>
        ) : (
          <>
            <h1>Nenhuma pessoa cadastrada.</h1>
          </>
        )}
      </div>
    </div>
  );
};

export { List };
