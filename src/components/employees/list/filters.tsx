import type { Dispatch, SetStateAction } from 'react';
import { useEffect } from 'react';
import { Button, Dialog, DialogActions, dialogClasses, DialogContent, DialogTitle } from '@mui/material';
import { memoizeWithArgs } from 'proxy-memoize';
import { RangeField } from 'src/components/shared/filters/range';
import { SelectChips, SelectField } from 'src/components/shared/filters/select';
import type { ModelDUFilterInput, ModelFloatInput } from 'src/graphql';
import { useAppSelector } from 'src/hooks';
import useGQLFilter, { makeFieldConfig } from 'src/hooks/use-gql-filter';
import useIsPreview from 'src/hooks/use-is-preview';
import useSkipReportQuery from 'src/hooks/use-skip-report-query';
import { sortStringsAscending } from 'src/logic/libs/helpers';
import { selectCurrentReportId, useFetchReportDataQuery, useGetReportCountriesQuery } from 'src/slices/report';
import type { BaseDialogProps } from 'src/types/dialogs';
import type { DashboardData } from 'src/types/slices';

type FiltersDialogProps = BaseDialogProps & {
  savedFilter: ModelDUFilterInput;
  setSavedFilter: Dispatch<SetStateAction<ModelDUFilterInput>>;
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

const selectOfficeOptions = memoizeWithArgs((data: DashboardData | undefined) =>
  Object.keys(data?.worstOffices?.all ?? {}).sort(sortStringsAscending)
);

const selectSortedCountries = memoizeWithArgs((countries: string[] | undefined) =>
  countries?.slice().sort(sortStringsAscending)
);

const fieldConfig = makeFieldConfig<ModelDUFilterInput>()({
  hxScore: true,
  office: { multi: true },
  country: { multi: true },
});

const FiltersDialog = ({ isOpen, handleClose, savedFilter, setSavedFilter }: FiltersDialogProps) => {
  const preview = useIsPreview();
  const reportId = useAppSelector(selectCurrentReportId);
  const skip = useSkipReportQuery(reportId, preview);
  const { offices } = useFetchReportDataQuery(
    { id: reportId, preview },
    {
      skip,
      selectFromResult: ({ data }) => ({
        offices: selectOfficeOptions(data?.data),
      }),
    }
  );
  const { data: countries = [] } = useGetReportCountriesQuery(reportId, {
    skip,
    selectFromResult: ({ data }) => ({ data: selectSortedCountries(data) }),
  });
  const [filterInput, methods, friendlyAnd] = useGQLFilter({
    savedFilter,
    fields: fieldConfig,
  });
  useEffect(() => {
    if (isOpen) {
      // make sure we reset when opening
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
        <SelectField
          title="Country:"
          idPrefix="country"
          disableReset={!friendlyAnd.country}
          onReset={() => friendlyAnd.country && methods.resetField('country')}
          multiple
          options={countries.map((country) => ({ key: country, value: country, children: country }))}
          value={friendlyAnd.country?.selected ?? []}
          renderValue={(selected) => (
            <SelectChips
              selected={selected}
              onChipDelete={(val, index) => methods.multiItemDeleted({ key: 'country', index })}
            />
          )}
          onChange={(e) => Array.isArray(e.target.value) && methods.setField({ key: 'country', value: e.target.value })}
        />
        <SelectField
          title="Office:"
          idPrefix="office"
          disableReset={!friendlyAnd.office}
          onReset={() => friendlyAnd.office && methods.resetField('office')}
          multiple
          options={offices.map((office) => ({ key: office, value: office, children: office }))}
          value={friendlyAnd.office?.selected ?? []}
          renderValue={(selected) => (
            <SelectChips
              selected={selected}
              onChipDelete={(val, index) => methods.multiItemDeleted({ key: 'office', index })}
            />
          )}
          onChange={(e) => Array.isArray(e.target.value) && methods.setField({ key: 'office', value: e.target.value })}
        />
        <RangeField
          title="HX Score:"
          idPrefix="hx-score"
          presets={bands}
          min={0}
          max={10}
          step={0.1}
          marks={[{ value: 4.9 }, { value: 7.9 }]}
          value={filterInput.hxScore ?? undefined}
          disableReset={!filterInput.hxScore}
          onReset={() => methods.resetField('hxScore')}
          disabled={!filterInput.hxScore}
          onChange={(size) => methods.setField({ key: 'hxScore', value: size })}
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
