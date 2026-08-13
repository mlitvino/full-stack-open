import { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  InputLabel,
  ListItemText,
  MenuItem,
  Radio,
  Select,
  TextField,
  Typography,
} from "@mui/material";

import {
  Diagnosis,
  Entry,
  EntryWithoutId,
  HealthCheckRating,
} from "../../types";

type EntryType = Entry["type"];

const entryTypes = [
  "HealthCheck",
  "OccupationalHealthcare",
  "Hospital",
] as const;

const isEntryType = (value: string): value is EntryType =>
  (entryTypes as readonly string[]).includes(value);

const assertNever = (value: never): never => {
  throw new Error(`Unhandled entry type: ${JSON.stringify(value)}`);
};

interface Props {
  onSubmit: (entry: EntryWithoutId) => Promise<void>;
  diagnoses: Diagnosis[];
}

const AddEntryForm = ({ onSubmit, diagnoses }: Props) => {
  const [type, setType] = useState<EntryType>("HealthCheck");

  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [specialist, setSpecialist] = useState("");
  const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);

  const [healthCheckRating, setHealthCheckRating] = useState<HealthCheckRating>(
    HealthCheckRating.Healthy
  );

  const [employerName, setEmployerName] = useState("");
  const [sickLeaveStart, setSickLeaveStart] = useState("");
  const [sickLeaveEnd, setSickLeaveEnd] = useState("");

  const [dischargeDate, setDischargeDate] = useState("");
  const [dischargeCriteria, setDischargeCriteria] = useState("");

  const resetFields = () => {
    setDescription("");
    setDate("");
    setSpecialist("");
    setDiagnosisCodes([]);
    setHealthCheckRating(HealthCheckRating.Healthy);
    setEmployerName("");
    setSickLeaveStart("");
    setSickLeaveEnd("");
    setDischargeDate("");
    setDischargeCriteria("");
  };

  const submit = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    const base = {
      description,
      date,
      specialist,
      diagnosisCodes,
    };

    switch (type) {
      case "HealthCheck":
        await onSubmit({ ...base, type, healthCheckRating });
        break;
      case "OccupationalHealthcare":
        await onSubmit({
          ...base,
          type,
          employerName,
          ...(sickLeaveStart || sickLeaveEnd
            ? { sickLeave: { startDate: sickLeaveStart, endDate: sickLeaveEnd } }
            : {}),
        });
        break;
      case "Hospital":
        await onSubmit({
          ...base,
          type,
          discharge: { date: dischargeDate, criteria: dischargeCriteria },
        });
        break;
      default:
        return assertNever(type);
    }

    resetFields();
  };

  return (
    <Box sx={{ border: "1px dashed", padding: 2, marginTop: 2, marginBottom: 2 }}>
      <Typography variant="h6" sx={{ marginBottom: 1 }}>
        New entry
      </Typography>

      <form onSubmit={(event) => void submit(event)}>
        <TextField
          select
          fullWidth
          margin="dense"
          label="Entry type"
          value={type}
          onChange={({ target }) => {
            if (isEntryType(target.value)) {
              setType(target.value);
            }
          }}
        >
          {entryTypes.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          fullWidth
          margin="dense"
          label="Description"
          value={description}
          onChange={({ target }) => setDescription(target.value)}
        />
        <TextField
          fullWidth
          margin="dense"
          type="date"
          label="Date"
          slotProps={{ inputLabel: { shrink: true } }}
          value={date}
          onChange={({ target }) => setDate(target.value)}
        />
        <TextField
          fullWidth
          margin="dense"
          label="Specialist"
          value={specialist}
          onChange={({ target }) => setSpecialist(target.value)}
        />

        <InputLabel sx={{ marginTop: 1 }}>Diagnosis codes</InputLabel>
        <Select
          multiple
          fullWidth
          value={diagnosisCodes}
          onChange={({ target }) => {
            const { value } = target;
            setDiagnosisCodes(typeof value === "string" ? value.split(",") : value);
          }}
          renderValue={(selected) => selected.join(", ")}
        >
          {diagnoses.map((diagnosis) => (
            <MenuItem key={diagnosis.code} value={diagnosis.code}>
              <Checkbox checked={diagnosisCodes.includes(diagnosis.code)} />
              <ListItemText primary={`${diagnosis.code} ${diagnosis.name}`} />
            </MenuItem>
          ))}
        </Select>

        {type === "HealthCheck" && (
          <Box sx={{ marginTop: 1 }}>
            <Typography variant="body2">Health check rating</Typography>
            {Object.entries(HealthCheckRating).map(([name, rating]) => (
              <FormControlLabel
                key={rating}
                label={`${rating} ${name}`}
                control={
                  <Radio
                    checked={healthCheckRating === rating}
                    onChange={() => setHealthCheckRating(rating)}
                  />
                }
              />
            ))}
          </Box>
        )}

        {type === "OccupationalHealthcare" && (
          <>
            <TextField
              fullWidth
              margin="dense"
              label="Employer name"
              value={employerName}
              onChange={({ target }) => setEmployerName(target.value)}
            />
            <TextField
              fullWidth
              margin="dense"
              type="date"
              label="Sick leave start (optional)"
              slotProps={{ inputLabel: { shrink: true } }}
              value={sickLeaveStart}
              onChange={({ target }) => setSickLeaveStart(target.value)}
            />
            <TextField
              fullWidth
              margin="dense"
              type="date"
              label="Sick leave end (optional)"
              slotProps={{ inputLabel: { shrink: true } }}
              value={sickLeaveEnd}
              onChange={({ target }) => setSickLeaveEnd(target.value)}
            />
          </>
        )}

        {type === "Hospital" && (
          <>
            <TextField
              fullWidth
              margin="dense"
              type="date"
              label="Discharge date"
              slotProps={{ inputLabel: { shrink: true } }}
              value={dischargeDate}
              onChange={({ target }) => setDischargeDate(target.value)}
            />
            <TextField
              fullWidth
              margin="dense"
              label="Discharge criteria"
              value={dischargeCriteria}
              onChange={({ target }) => setDischargeCriteria(target.value)}
            />
          </>
        )}

        <Button type="submit" variant="contained" sx={{ marginTop: 1 }}>
          Add
        </Button>
      </form>
    </Box>
  );
};

export default AddEntryForm;
