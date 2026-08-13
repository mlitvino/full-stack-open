import { Box, Typography } from "@mui/material";

import { Diagnosis, Entry } from "../../types";

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

interface Props {
  entry: Entry;
  diagnoses: Diagnosis[];
}

const entryStyle = {
  border: "1px solid",
  borderRadius: 1,
  padding: 1,
  marginBottom: 1,
};

const EntryDetails = ({ entry, diagnoses }: Props) => {
  const common = (
    <>
      <Typography>
        {entry.date} {entry.description}
      </Typography>
      {entry.diagnosisCodes && (
        <ul>
          {entry.diagnosisCodes.map((code) => (
            <li key={code}>
              {code} {diagnoses.find((d) => d.code === code)?.name}
            </li>
          ))}
        </ul>
      )}
      <Typography>diagnosed by {entry.specialist}</Typography>
    </>
  );

  switch (entry.type) {
    case "HealthCheck":
      return (
        <Box sx={entryStyle}>
          <Typography variant="subtitle2">Health check</Typography>
          {common}
          <Typography>health rating: {entry.healthCheckRating}</Typography>
        </Box>
      );
    case "OccupationalHealthcare":
      return (
        <Box sx={entryStyle}>
          <Typography variant="subtitle2">
            Occupational healthcare — {entry.employerName}
          </Typography>
          {common}
          {entry.sickLeave && (
            <Typography>
              sick leave: {entry.sickLeave.startDate} to{" "}
              {entry.sickLeave.endDate}
            </Typography>
          )}
        </Box>
      );
    case "Hospital":
      return (
        <Box sx={entryStyle}>
          <Typography variant="subtitle2">Hospital</Typography>
          {common}
          <Typography>
            discharged {entry.discharge.date}: {entry.discharge.criteria}
          </Typography>
        </Box>
      );
    default:
      return assertNever(entry);
  }
};

export default EntryDetails;
