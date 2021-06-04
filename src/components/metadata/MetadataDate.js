import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@material-ui/core';
import { DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import DayJsUtils from '@date-io/dayjs';

dayjs.extend(utc);

function MetadataDate({
  node,
  classes,
  EditButton,
  DeleteButton,
  CancelButton,
  SaveButton,
  AnnotatorInformation,
  FieldInformation,
  hasData,
  isEditing,
  metadataValue,
  setMetadataValue,
}) {
  const mutationPayload = {
    annotation_type: 'task_response_datetime',
    set_fields: `{"response_datetime":"${metadataValue}"}`,
  };
  const options = node.options;
  // Use GMT as default time zone if none set
  const [timeZoneOffset, setTimeZoneOffset] = React.useState(0);
  const [displayDateTime, setDisplayDateTime] = React.useState(dayjs());
  if (!metadataValue) {
    setMetadataValue(
      dayjs(displayDateTime).utcOffset(timeZoneOffset, true).format(),
    );
  }

  function handleChange(e) {
    setDisplayDateTime(e.format());
    setMetadataValue(e.utcOffset(timeZoneOffset, true).format());
  }

  function handleTimeZoneOffsetChange(e) {
    setTimeZoneOffset(e.target.value);
    if (displayDateTime) {
      setMetadataValue(
        dayjs(displayDateTime).utcOffset(e.target.value, true).format(),
      );
    }
  }

  return (
    <>
      <FieldInformation />
      {hasData && !isEditing ? (
        <>
          <Typography variant="body1" className={classes.value}>
            {node.first_response_value}
          </Typography>
          <AnnotatorInformation />
          <EditButton />
          <DeleteButton />
        </>
      ) : (
        <MuiPickersUtilsProvider utils={DayJsUtils}>
          <FormControl variant="outlined" fullWidth>
            <DateTimePicker
              value={dayjs(displayDateTime)}
              onChange={handleChange}
              inputVariant="outlined"
            />
            <Select
              value={timeZoneOffset}
              onChange={handleTimeZoneOffsetChange}
            >
              {options.map((item) => (
                <MenuItem value={item.offset} key={item.label}>
                  {item.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <br />
          <CancelButton />
          <SaveButton {...{ mutationPayload }} />
        </MuiPickersUtilsProvider>
      )}
    </>
  );
}

MetadataDate.propTypes = {
  node: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  EditButton: PropTypes.element.isRequired,
  DeleteButton: PropTypes.element.isRequired,
  CancelButton: PropTypes.element.isRequired,
  SaveButton: PropTypes.element.isRequired,
  AnnotatorInformation: PropTypes.element.isRequired,
  FieldInformation: PropTypes.element.isRequired,
  hasData: PropTypes.bool.isRequired,
  isEditing: PropTypes.bool.isRequired,
  metadataValue: PropTypes.string.isRequired,
  setMetadataValue: PropTypes.func.isRequired,
};

export default MetadataDate;
