import { useState } from 'react';
import type { WorstOfficesChart } from 'lambda/parse/report/chart-data';
import type { WorstOffices } from 'src/types/slices';
import OfficePicklist from './office-picklist';

const WorstOfficesData = ({
  worstOffices,
  handleChange,
}: {
  worstOffices: WorstOffices;
  handleChange: (w: WorstOffices) => void;
}) => {
  const [worst10, setWorst10] = useState(worstOffices.Worst10);
  const [keySites, setKeySites] = useState(worstOffices.KeySites);
  const [upgrading, setUpgrading] = useState(worstOffices.Upgrading);

  if (!worstOffices.all && !worst10 && !keySites && !upgrading) {
    return <p>Old chart detected, re-parse the report to modify worst offices.</p>;
  }

  return (
    <>
      <h2>Top 10 worst affected</h2>
      <OfficePicklist
        all={worstOffices.all as WorstOfficesChart}
        selected={worst10 as WorstOfficesChart}
        label="Worst affected"
        onChange={(selected: WorstOfficesChart) => {
          setWorst10(selected);
          handleChange({
            ...worstOffices,
            Worst10: selected,
            KeySites: keySites,
            Upgrading: upgrading,
          } as WorstOffices);
        }}
      />
      <h2>Key Sites</h2>
      <OfficePicklist
        all={worstOffices.all as WorstOfficesChart}
        selected={worstOffices.KeySites as WorstOfficesChart}
        label="Key sites"
        onChange={(selected: WorstOfficesChart) => {
          setKeySites(selected);
          handleChange({
            ...worstOffices,
            Worst10: worst10,
            KeySites: selected,
            Upgrading: upgrading,
          } as WorstOffices);
        }}
      />
      <h2>Upgrading</h2>
      <OfficePicklist
        all={worstOffices.all as WorstOfficesChart}
        selected={worstOffices.Upgrading as WorstOfficesChart}
        label="Upgrading"
        onChange={(selected: WorstOfficesChart) => {
          setUpgrading(selected);
          handleChange({
            ...worstOffices,
            Worst10: worst10,
            KeySites: keySites,
            Upgrading: selected,
          } as WorstOffices);
        }}
      />
    </>
  );
};

export default WorstOfficesData;
