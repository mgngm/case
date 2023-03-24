import { useEffect } from 'react';
import { Button, Dialog, DialogActions, dialogClasses, DialogContent, DialogTitle } from '@mui/material';
import { formatISO, max, min, parseISO } from 'date-fns';
import { memoizeWithArgs } from 'proxy-memoize';
import DateField from 'src/components/shared/filters/date';
import { RangeField } from 'src/components/shared/filters/range';
import type { ModelFloatInput, ModelProjectFilterInput, Project } from 'src/graphql';
import { useAppSelector } from 'src/hooks';
import useGQLFilter, { makeFieldConfig } from 'src/hooks/use-gql-filter';
import useIsPreview from 'src/hooks/use-is-preview';
import useSkipReportQuery from 'src/hooks/use-skip-report-query';
import { satisfies, truthy } from 'src/logic/libs/helpers';
import { selectCurrency, selectEmployeeCounts } from 'src/slices/dashboard';
import { selectCurrentReportId, useFetchReportDataQuery } from 'src/slices/report';
import type { BaseDialogProps } from 'src/types/dialogs';
import type { KeysMatching, Nullish } from 'src/types/util';

type FiltersDialogProps = BaseDialogProps & {
  savedFilter: ModelProjectFilterInput;
  setSavedFilter: (filter: ModelProjectFilterInput) => void;
  projects: Project[] | undefined;
};

const bands: Record<'Satisfied' | 'Frustrated' | 'Suffering', ModelFloatInput> = {
  Suffering: {
    ge: 0,
    lt: 5,
  },
  Frustrated: {
    ge: 5,
    lt: 8,
  },
  Satisfied: {
    ge: 8,
    le: 10,
  },
};

const fieldConfig = makeFieldConfig<ModelProjectFilterInput>()({
  projectDate: true,
  timeLost: true,
  employeeCount: true,
  payroll: true,
  hxScore: true,
});

const maxKeys = satisfies<KeysMatching<Project, Nullish<number>>[]>()(['payroll', 'timeLost']);

const getMaximums = memoizeWithArgs((projects: Project[] | undefined = []) =>
  projects.reduce<Record<typeof maxKeys[number], number> & { projectDate?: { min: Date; max: Date } }>(
    (acc, project) => {
      for (const key of maxKeys) {
        acc[key] = Math.max(acc[key] ?? 0, project[key] ?? 0);
      }
      if (project.projectDate) {
        acc.projectDate = {
          min: min([acc.projectDate?.min, parseISO(project.projectDate)].filter(truthy)),
          max: max([acc.projectDate?.max, parseISO(project.projectDate)].filter(truthy)),
        };
      }
      return acc;
    },
    { payroll: 0, timeLost: 0 }
  )
);

const parseDates = memoizeWithArgs((input: Nullish<Partial<Record<'ge' | 'le', Nullish<string>>>>) => ({
  ge: input?.ge ? parseISO(input.ge) : undefined,
  le: input?.le ? parseISO(input.le) : undefined,
}));

const FiltersDialog = ({ isOpen, handleClose, projects, savedFilter, setSavedFilter }: FiltersDialogProps) => {
  const [filterInput, methods] = useGQLFilter({
    savedFilter,
    fields: fieldConfig,
  });
  const preview = useIsPreview();
  const reportId = useAppSelector(selectCurrentReportId);
  const skip = useSkipReportQuery(reportId, preview);
  const { currency, totalEmployees } = useFetchReportDataQuery(
    { id: reportId, preview },
    {
      skip,
      selectFromResult: ({ data }) => ({
        currency: selectCurrency(data?.data),
        totalEmployees: selectEmployeeCounts(data?.data)?.total,
      }),
    }
  );
  const { payroll, timeLost, projectDate } = getMaximums(projects);
  useEffect(() => {
    if (isOpen) {
      methods.replaceFilter(savedFilter);
    }
  }, [methods, savedFilter, isOpen]);
  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      maxWidth="sm"
      id="filter-dialog"
      aria-labelledby="filter-dialog-title"
      sx={{
        [`.${dialogClasses.paper}`]: {
          width: '100%',
        },
      }}
    >
      <DialogTitle id="filter-dialog-title">Filters</DialogTitle>
      <DialogContent>
        <DateField
          title="Date identified:"
          idPrefix="date-identified"
          selectsRange
          minDate={projectDate?.min}
          maxDate={projectDate?.max}
          startDate={parseDates(filterInput.projectDate).ge}
          endDate={parseDates(filterInput.projectDate).le}
          monthsShown={2}
          disableReset={!filterInput.projectDate}
          onReset={() => methods.resetField('projectDate')}
          onChange={([start, end]) => {
            methods.setField({
              key: 'projectDate',
              value: {
                ge: start && formatISO(start, { representation: 'date' }),
                le: end && formatISO(end, { representation: 'date' }),
              },
            });
          }}
        />
        <RangeField
          title="Employees affected:"
          idPrefix="employees"
          min={0}
          max={totalEmployees}
          step={1}
          value={filterInput.employeeCount ?? undefined}
          disableReset={!filterInput.employeeCount}
          onReset={() => methods.resetField('employeeCount')}
          onChange={(size) => methods.setField({ key: 'employeeCount', value: size })}
        />
        <RangeField
          title="Average time lost per employee:"
          idPrefix="time-lost"
          min={0}
          max={Math.ceil(timeLost)}
          step={1}
          value={filterInput.timeLost ?? undefined}
          disableReset={!filterInput.timeLost}
          endAdornment={' days'}
          onReset={() => methods.resetField('timeLost')}
          onChange={(size) => methods.setField({ key: 'timeLost', value: size })}
        />
        <RangeField
          title="HX score:"
          idPrefix="hx-score"
          presets={bands}
          min={0}
          max={10}
          step={0.1}
          marks={[{ value: 4.9 }, { value: 7.9 }]}
          value={filterInput.hxScore ?? undefined}
          disableReset={!filterInput.hxScore}
          onReset={() => methods.resetField('hxScore')}
          onChange={(size) => methods.setField({ key: 'hxScore', value: size })}
        />
        <RangeField
          title="Payroll opportunity:"
          idPrefix="payroll-opportunity"
          min={0}
          max={payroll}
          step={1}
          startAdornment={currency}
          value={filterInput.payroll ?? undefined}
          disableReset={!filterInput.payroll}
          onReset={() => methods.resetField('payroll')}
          onChange={(size) => methods.setField({ key: 'payroll', value: size })}
        />
      </DialogContent>
      <DialogActions>
        <Button
          color="error"
          disabled={Object.keys(filterInput).filter((key) => key !== 'meta').length === 0}
          id="clear-all-filters"
          sx={{ mr: 'auto' }}
          onClick={() => methods.replaceFilter({})}
        >
          Clear all filters
        </Button>
        <Button variant="outlined" onClick={() => handleClose()}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            setSavedFilter(filterInput);
            handleClose();
          }}
        >
          Apply
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FiltersDialog;
