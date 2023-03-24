import Xarrow from 'react-xarrows';
import type { SankeyData, SankeyLevers } from 'src/logic/libs/digital-workplace';
import styles from './digital-workplace.module.scss';
import InfoCard from './info-card';
import exports from 'styles/_exports.module.scss';

const sankeyTooltip = (id: string, levers: SankeyLevers): string | undefined => {
  const daysWorkingPerMonth = 20;

  //WFH values - uses hybridLower
  const wfhDays = daysWorkingPerMonth * levers.hybridLower;
  const wfhDaysWeek = wfhDays / 4;
  const wfhPercentage = levers.hybridLower * 100;

  //The office values are inverted - use hybrid upper and subrtract from full value.
  const wfoDays = daysWorkingPerMonth - daysWorkingPerMonth * levers.hybridUpper;
  const wfoDaysWeek = wfoDays / 4;
  const wfoPercentage = 100 - levers.hybridUpper * 100;

  switch (id) {
    case 'home':
      return `Up to ${wfoDays} day every month, or ${wfoDaysWeek} days per week, or ${wfoPercentage}% of the month, may be spent at the office.`;
    case 'office':
      return `Up to ${wfhDays} day every month, or ${wfhDaysWeek} days per week, or ${wfhPercentage}% of the month, may be spent at home.`;
    default:
      return undefined;
  }
};

const Sankey = ({ data }: { data: SankeyData }) => {
  const { totalEmployees, locationBreakdown, hybridBreakdown, levers } = data;
  return (
    <div className={styles.digitalWorkplace} id="canvas">
      {/* render snakes fist so they dont appear above cards */}
      {locationBreakdown.map((box) => (
        <Xarrow
          key={box.id}
          start={totalEmployees.id}
          end={box.id}
          showHead={false}
          strokeWidth={40}
          color={box.snakeColor}
          curveness={0.6}
        />
      ))}

      {hybridBreakdown.map((box) => (
        <Xarrow
          key={box.id}
          start={'hybrid'}
          end={box.id}
          showHead={false}
          strokeWidth={40}
          color={exports.snakeHybrid}
          curveness={0.6}
        />
      ))}

      <InfoCard title={totalEmployees.title} id={totalEmployees.id} value={totalEmployees.value} />

      <div className={styles.sankeyInnerColumn}>
        {locationBreakdown.map(({ id, title, value, color }) => (
          <InfoCard
            key={id}
            title={title}
            id={id}
            value={value}
            total={totalEmployees.value}
            color={color}
            tooltip={sankeyTooltip(id, levers)}
          />
        ))}
      </div>

      <div className={styles.sankeyInnerColumnLast}>
        <div className={styles.hybridWorkingInfo}>
          <span>Days Per Week In The Office</span>
        </div>
        {hybridBreakdown.map(({ id, title, value, color }) => (
          <InfoCard key={id} title={title} id={id} value={value} total={totalEmployees.value} color={color} />
        ))}
      </div>
    </div>
  );
};

export default Sankey;
