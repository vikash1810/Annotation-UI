import { Grid, Typography } from "@mui/material";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { DocumentInfoItem } from "../components/DocumentInfoItem";
import { ErrorMessage } from "../components/ErrorMessage";
import { LoadingSpinner } from "../components/LoadingSpinner";
import useAxios from "../hooks/useAxios";
import { DocumentInfo } from "../types/api";

export const ReviewDocumentsList = () => {
  const navigate = useNavigate();

  const { makeRequest, data, status, error } = useAxios<{
    documents: DocumentInfo[];
  }>();

  useEffect(() => {
    async function getDocuments() {
      try {
        //TODO: update with review documents api
        await makeRequest("/user/users/documents", "GET");
      } catch (err: any) {
        toast.error(err.message);
      }
    }
    getDocuments();
  }, []);

  if (status === "pending") {
    return <LoadingSpinner />;
  }

  if (status === "error") {
    return (
      <ErrorMessage
        title="Error while fetching reviewable documents"
        subtitle={`Error : ${error?.message}`}
      />
    );
  }

  return (
    <Grid
      container
      columnSpacing={4}
      sx={{ padding: "24px", position: "relative" }}
      rowSpacing={4}
    >
      <Grid item xs={12}>
        <Typography variant="h6">Select a document to review</Typography>
      </Grid>
      {data?.documents.map((doc) => {
        return (
          <Grid item md={6} xs={12} key={doc.id}>
            <DocumentInfoItem
              {...doc}
              onClick={() => navigate(`/review/${doc.id}`)}
            />
          </Grid>
        );
      })}
      {data?.documents.length === 0 && (
        <Grid item xs={12}>
          <Typography variant="h6" textAlign={"center"}>
            No documents to review, please reach out to your admin.
          </Typography>
        </Grid>
      )}
    </Grid>
  );
};
