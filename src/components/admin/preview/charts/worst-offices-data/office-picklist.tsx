import { useEffect, useState } from 'react';
import { ListSubheader } from '@mui/material';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import type { WorstOfficesChart } from 'lambda/parse/report/chart-data';
import styles from './office-picklist.module.scss';

/* SET FUNCTIONS! */

// this is really a symmetric difference, but it's basically the same thing
// build a set based on set a without the items in set b
function not(a: Set<string>, b: Set<string>) {
  const _difference = new Set(a);
  for (const elem of b) {
    if (_difference.has(elem)) {
      _difference.delete(elem);
    } else {
      _difference.add(elem);
    }
  }
  return _difference;
}

// build an intersection set of the items that are in both set a and set b
function intersection(a: Set<string>, b: Set<string>) {
  const _intersection: Set<string> = new Set();
  for (const elem of b) {
    if (a.has(elem)) {
      _intersection.add(elem);
    }
  }
  return _intersection;
}

// build a union set of all items in set a and set b
function union(setA: Set<string>, setB: Set<string>) {
  const _union = new Set(setA);
  for (const elem of setB) {
    _union.add(elem);
  }
  return _union;
}

const OfficePicklist = ({
  all,
  selected,
  onChange,
  label,
}: {
  all: WorstOfficesChart;
  selected: WorstOfficesChart;
  onChange: (s: WorstOfficesChart) => void;
  label?: string;
}) => {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [left, setLeft] = useState<Set<string>>(new Set());
  const [right, setRight] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (all && selected) {
      const allOffices = new Set(Object.keys(all));
      const selectedOffices = new Set(Object.keys(selected));

      setLeft(not(allOffices, selectedOffices));
      setRight(selectedOffices);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const handleChange = (officeNames: Set<string>) => {
    const offices: WorstOfficesChart = {};
    for (const name of officeNames) {
      offices[name] = { ...all[name] };
    }
    onChange(offices);
  };

  const handleToggle = (value: string) => () => {
    const current = checked.has(value);
    const newChecked = new Set(checked);

    if (!current) {
      newChecked.add(value);
    } else {
      newChecked.delete(value);
    }

    setChecked(newChecked);
  };

  const handleAllRight = () => {
    const selected = union(right, left);
    setRight(selected);
    setLeft(new Set());
    handleChange(selected);
  };

  const handleCheckedRight = () => {
    const selected = union(leftChecked, right);
    setRight(selected);
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
    handleChange(selected);
  };

  const handleCheckedLeft = () => {
    const selected = not(right, rightChecked);
    setLeft(union(left, rightChecked));
    setRight(selected);
    setChecked(not(checked, rightChecked));
    handleChange(selected);
  };

  const handleAllLeft = () => {
    const selected: Set<string> = new Set();
    setLeft(union(left, right));
    setRight(selected);
    handleChange(selected);
  };
  //375
  const customList = (items: Set<string>, label?: string) => (
    <>
      {label ? <ListSubheader>{label}</ListSubheader> : null}
      <Paper sx={{ width: '100%', height: 230, overflow: 'auto' }}>
        <List dense component="div" role="list" className={styles.picklistList}>
          {Array.from(items)
            .sort((a, b) => a.localeCompare(b))
            .map((value: string) => {
              const labelId = `transfer-list-item-${value}-label`;

              return (
                <ListItem key={value} role="listitem" onClick={handleToggle(value)} divider={true}>
                  <ListItemIcon>
                    <Checkbox
                      checked={checked.has(value)}
                      tabIndex={-1}
                      disableRipple
                      inputProps={{
                        'aria-labelledby': labelId,
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    id={labelId}
                    primary={value}
                    secondary={`HX: ${all[value]?.hxScore?.toFixed(1) ?? '-'}, Employees: ${
                      all[value]?.employeeCount ?? '-'
                    }`}
                  />
                </ListItem>
              );
            })}
        </List>
      </Paper>
    </>
  );

  return (
    <Grid className={styles.officePicklistWrap} container spacing={2} justifyContent="center" alignItems="center">
      <Grid item sx={{ flex: 2 }}>
        {customList(left, 'All offices')}
      </Grid>
      <Grid item>
        <Grid container direction="column" alignItems="center">
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={handleAllRight}
            disabled={left.size === 0}
            aria-label="move all right"
          >
            ≫
          </Button>
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={handleCheckedRight}
            disabled={leftChecked.size === 0}
            aria-label="move selected right"
          >
            &gt;
          </Button>
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={handleCheckedLeft}
            disabled={rightChecked.size === 0}
            aria-label="move selected left"
          >
            &lt;
          </Button>
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={handleAllLeft}
            disabled={right.size === 0}
            aria-label="move all left"
          >
            ≪
          </Button>
        </Grid>
      </Grid>
      <Grid item sx={{ flex: 2 }}>
        {customList(right, label)}
      </Grid>
    </Grid>
  );
};

export default OfficePicklist;
