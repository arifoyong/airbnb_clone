import { useState } from "react";
import DayPickerInput from "react-day-picker/DayPickerInput";
import { DateUtils } from "react-day-picker";
import dateFnsFormat from "date-fns/format";
import dateFnsParse from "date-fns/parse";

const parseDate = (str, format, locale) => {
  const parsed = dateFnsParse(str, format, new Date(), { locale });
  return DateUtils.isDate(parsed) ? parsed : null;
};

const formatDate = (date, format, locale) =>
  dateFnsFormat(date, format, { locale });

const format = "dd MMM yyyy";

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

const DateRangePicker = ({ datesChanged }) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(tomorrow);

  const numberOfNightsBetweenDates = (startDate, endDate) => {
    const start = new Date(startDate); //clone
    const end = new Date(endDate); //clone
    let dayCount = 0;

    while (end > start) {
      dayCount++;
      start.setDate(start.getDate() + 1);
    }

    return dayCount;
  };

  return (
    <div className="date-range-picker-container">
      <div>
        <label>From:</label>
        <DayPickerInput
          formatDate={formatDate}
          format={format}
          parseDate={parseDate}
          placeholder={`${dateFnsFormat(new Date(), format)}`}
          value={startDate}
          dayPickerProps={{
            modifiers: {
              disabled: {
                before: today,
              },
            },
          }}
          onDayChange={(day) => {
            setStartDate(day);
            const newEndDate = new Date(day);
            if (numberOfNightsBetweenDates(day, endDate) < 1) {
              newEndDate.setDate(newEndDate.getDate() + 1);
              setEndDate(newEndDate);
            }

            datesChanged(day, newEndDate);
          }}
        />
      </div>
      <div>
        <label>To:</label>
        <DayPickerInput
          formatDate={formatDate}
          format={format}
          parseDate={parseDate}
          value={endDate}
          placeholder={`${dateFnsFormat(tomorrow, format)}`}
          dayPickerProps={{
            modifiers: {
              disabled: {
                before: startDate,
              },
            },
          }}
          onDayChange={(day) => {
            setEndDate(day);
            datesChanged(startDate, day);
          }}
        />
      </div>

      <style jsx global>{`
        .DayPickerInput input {
          width: 120px;
          padding: 10px;
          font-size: 16px;
        }
      `}</style>
      <style jsx>{`
        .date-range-picker-container div {
          display: grid;
          border: 1px solid #ddd;
          grid-template-columns: 30% 70%;
          padding: 10px;
        }
      `}</style>
    </div>
  );
};

export default DateRangePicker;
