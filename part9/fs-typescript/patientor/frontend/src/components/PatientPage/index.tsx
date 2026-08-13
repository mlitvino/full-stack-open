import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Alert, Box, Button, Typography } from "@mui/material";

import { Diagnosis, EntryWithoutId, Patient } from "../../types";
import patientService from "../../services/patients";
import EntryDetails from "./EntryDetails";
import AddEntryForm from "./AddEntryForm";

interface Props {
  diagnoses: Diagnosis[];
}

interface ZodIssue {
  path: (string | number)[];
  message: string;
}

const PatientPage = ({ diagnoses }: Props) => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [error, setError] = useState<string>();
  const [formError, setFormError] = useState<string>();
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!id) {
      return;
    }

    const fetchPatient = async () => {
      try {
        const data = await patientService.getById(id);
        setPatient(data);
      } catch {
        setError("Could not fetch patient");
      }
    };

    void fetchPatient();
  }, [id]);

  const submitEntry = async (entry: EntryWithoutId) => {
    if (!patient) {
      return;
    }

    try {
      const addedEntry = await patientService.addEntry(patient.id, entry);

      setPatient({ ...patient, entries: patient.entries.concat(addedEntry) });
      setFormError(undefined);
      setShowForm(false);
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        const data: unknown = e.response?.data;
        const issues =
          data && typeof data === "object" && "error" in data
            ? (data as { error: unknown }).error
            : undefined;

        if (Array.isArray(issues) && issues.length > 0) {
          const { path, message } = issues[0] as ZodIssue;
          setFormError(`${path.join(".")}: ${message}`);
        } else {
          setFormError(e.message);
        }
      } else {
        setFormError("Unknown error");
      }
    }
  };

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!patient) {
    return <Typography>loading...</Typography>;
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ marginTop: "0.5em", marginBottom: "0.5em" }}>
        {patient.name}
      </Typography>

      <Typography>gender: {patient.gender}</Typography>
      {patient.ssn && <Typography>ssn: {patient.ssn}</Typography>}
      {patient.dateOfBirth && (
        <Typography>date of birth: {patient.dateOfBirth}</Typography>
      )}
      <Typography>occupation: {patient.occupation}</Typography>

      {formError && (
        <Alert severity="error" sx={{ marginTop: 2 }}>
          {formError}
        </Alert>
      )}

      {showForm ? (
        <>
          <AddEntryForm onSubmit={submitEntry} diagnoses={diagnoses} />
          <Button variant="outlined" onClick={() => setShowForm(false)}>
            Cancel
          </Button>
        </>
      ) : (
        <Button
          variant="contained"
          sx={{ marginTop: 2 }}
          onClick={() => setShowForm(true)}
        >
          Add New Entry
        </Button>
      )}

      {patient.entries.length > 0 && (
        <>
          <Typography variant="h6" sx={{ marginTop: "1em", marginBottom: "1em" }}>
            entries
          </Typography>

          {patient.entries.map((entry) => (
            <EntryDetails key={entry.id} entry={entry} diagnoses={diagnoses} />
          ))}
        </>
      )}
    </Box>
  );
};

export default PatientPage;
