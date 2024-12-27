import PropTypes from 'prop-types';
import { Grid, MenuItem, TextField } from '@mui/material';
import dayjs from 'dayjs'; // Import dayjs

function CustomTimePicker({ label, value, onChange }) {
  const now = dayjs();

  const handleDateChange = (e) => {
    const selectedDate = dayjs(e.target.value);
    if (selectedDate.isAfter(now)) {
      onChange(selectedDate);
    }
  };

  const handleHourChange = (e) => {
    const hour = e.target.value;
    const selectedDateTime = value.hour(hour);
    if (selectedDateTime.isAfter(now)) {
      onChange(selectedDateTime);
    }
  };

  const handleMinuteChange = (e) => {
    const minute = e.target.value;
    const selectedDateTime = value.minute(minute);
    if (selectedDateTime.isAfter(now)) {
      onChange(selectedDateTime);
    }
  };

  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={12} sm={6}>
        <TextField
          label={label}
          type="datetime-local"
          value={value.format('YYYY-MM-DDTHH:mm')}
          onChange={handleDateChange}
          InputLabelProps={{
            shrink: true,
          }}
          fullWidth
          readOnly={false} 
          inputProps={{
            min: now.format('YYYY-MM-DDTHH:mm'), // Set minimum date and time to now
          }}
        />
      </Grid>
      <Grid item xs={6} sm={3}>
        <TextField
          select
          label="Hour"
          value={value.format('HH')}
          onChange={handleHourChange}
          fullWidth
        >
          {[...Array(24).keys()].map((hour) => (
            <MenuItem
              key={hour}
              value={hour}
              disabled={value.isSame(now, 'day') && hour < now.hour()}
            >
              {hour.toString().padStart(2, '0')}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item xs={6} sm={3}>
        <TextField
          select
          label="Minute"
          value={value.format('mm')}
          onChange={handleMinuteChange}
          fullWidth
        >
          {[...Array(60).keys()].map((minute) => (
            <MenuItem
              key={minute}
              value={minute}
              disabled={
                value.isSame(now, 'day') &&
                value.hour() === now.hour() &&
                minute < now.minute()
              }
            >
              {minute.toString().padStart(2, '0')}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
    </Grid>
  );
}

CustomTimePicker.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.object.isRequired, 
  onChange: PropTypes.func.isRequired,
};

export default CustomTimePicker;
