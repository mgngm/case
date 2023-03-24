import { useState, useMemo } from 'react';

const useAccordionManager = <Accordion extends string>(keys: readonly Accordion[], initialOpen?: Accordion) => {
  const [accordions, setAccordions] = useState(() =>
    keys.reduce((acc, curr) => ((acc[curr] = curr === initialOpen), acc), {} as Record<Accordion, boolean>)
  );

  const toggleAccordion = (_acc: Accordion) => {
    //if the key exists toggle it.
    if (Object.keys(accordions).includes(_acc)) {
      setAccordions((accordions) => ({ ...accordions, [_acc]: !accordions[_acc] }));
    }
  };

  const openAccordions = useMemo(() => {
    const openAccs = [];
    for (const _key of Object.keys(accordions) as Accordion[]) {
      if (accordions[_key]) {
        openAccs.push(_key);
      }
    }

    return openAccs;
  }, [accordions]);

  const isAccordionOpen = (_acc: Accordion) => accordions[_acc] === true;
  const isAccordionClosed = (_acc: Accordion) => accordions[_acc] === false;

  //TODO: add a close all and open all here.
  return { toggleAccordion, openAccordions, isAccordionClosed, isAccordionOpen, accordions };
};

export default useAccordionManager;
