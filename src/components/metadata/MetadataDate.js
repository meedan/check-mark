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
import config from './../../config';

dayjs.extend(utc);

function MetadataDate({
  node,
  classes,
  EditButton,
  DeleteButton,
  CancelButton,
  SaveButton,
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
  const [timeZoneOffset, setTimeZoneOffset] = React.useState(undefined);

  function handleChange(e) {
    // Use GMT as default time zone if none set
    if (timeZoneOffset === undefined) {
      setMetadataValue(e.utcOffset(0, true).format());
    } else {
      setMetadataValue(e.utcOffset(timeZoneOffset, true).format());
    }
  }

  function handleTimeZoneOffsetChange(e) {
    setTimeZoneOffset(e.target.value);
  }

  return (
    <>
      {hasData && !isEditing ? (
        <>
          <Typography variant="h6">{node.label}</Typography>
          <Typography variant="body1">{node.description}</Typography>
          <Typography variant="body1" className={classes.value}>
            {node.first_response_value}
          </Typography>
          <img
            className={classes.profileImage}
            src={node.annotator?.user?.profile_image}
            alt="Profile image"
          />
          <Typography variant="body1">
            Completed by{' '}
            <a
              href={`https://${config.checkWebUrl}/check/user/${node.annotator?.user?.dbid}`}
            >
              {node.annotator?.user?.name}
            </a>
          </Typography>
          <EditButton />
          <DeleteButton />
        </>
      ) : (
        <MuiPickersUtilsProvider utils={DayJsUtils}>
          <Typography variant="h6">{node.label}</Typography>
          <Typography variant="body1">{node.description}</Typography>
          <FormControl>
            <DateTimePicker
              value={dayjs(metadataValue)}
              onChange={handleChange}
            />
            <InputLabel id="time-zone-label" className={classes.timeZoneSelect}>
              <FormattedMessage
                id="datetime.timezone"
                defaultMessage="Time zone (GMT default)"
                description="This is a label that appears on a time zone selector dropdown when nothing is selected. This indicates that the user should select a time zone, and if they do not, GMT (Greenwich Mean Time) will be the default time zone assumed."
              />
            </InputLabel>
            <Select
              labelId="time-zone-label"
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
  hasData: PropTypes.bool.isRequired,
  isEditing: PropTypes.bool.isRequired,
  metadataValue: PropTypes.string.isRequired,
  setMetadataValue: PropTypes.func.isRequired,
};

export default MetadataDate;
