import { Box, Divider, Typography } from "@mui/material";
import { produce } from "immer";
import { useRef } from "react";
import { Styles } from "../../types/styles";
import { AnnotatedText } from "./AnnotatedText";
import { TextAnnotation } from "./TextAnnotator";

type AnnotationSummarySidePanelProps = {
  textAnnotations: TextAnnotation[];
  onDelete(index: number): void;
  onSelect(index: number): void;
  onUpdateSelections(updatedSelections: TextAnnotation[]): void;
};

const styles: Styles = {
  container: {
    height: "100%",
    width: "30%",
    minWidth: "30%",
    display: "flex",
    overflowY: "hidden",
    overflowX: "hidden",
    flexDirection: "column",
    padding: 3,
    gap: 1,
  },
  annotationsList: {
    height: "60%",
    display: "flex",
    flexDirection: "column",
    gap: 1,
    overflow: "scroll",
  },
  answerBox: {
    height: "40%",
    display: "flex",
    flexDirection: "column",
    gap: 1,
    overflow: "scroll",
    border: "0.5px solid grey",
    borderRadius: "8px",
  },
  answerText: {
    whiteSpace: "pre-wrap",
    height: "100%",
    padding: 1,
    fontSize: "16px",
  },
};

export const AnnotationSummarySidePanel = ({
  textAnnotations,
  onDelete,
  onSelect,
  onUpdateSelections,
}: AnnotationSummarySidePanelProps) => {
  const dragItemRef = useRef<number>();
  const dragOverItemRef = useRef<number>();

  const handleDragStart = (index: number) => {
    dragItemRef.current = index;
  };

  const handleDragEnter = (index: number) => {
    dragOverItemRef.current = index;
  };

  const handleDragEnd = () => {
    if (
      dragItemRef.current === dragOverItemRef.current ||
      dragItemRef.current === undefined ||
      dragItemRef === undefined
    ) {
      return;
    }
    const updatedOrder = produce(textAnnotations, (draft) => {
      const item = draft[dragItemRef.current!];
      draft.splice(dragItemRef.current!, 1);
      draft.splice(dragOverItemRef.current!, 0, item);
      return draft;
    });

    onUpdateSelections(updatedOrder);
  };

  return (
    <Box sx={styles.container}>
      <Typography variant="h6" sx={{ textDecoration: "underline" }}>
        Annotation Summary
      </Typography>
      <Box data-testid="annotation-text-list" sx={styles.annotationsList}>
        {textAnnotations.map((annotatedText, index) => {
          return (
            <AnnotatedText
              key={index}
              text={annotatedText.text}
              onClick={() => onSelect(index)}
              onDelete={() => onDelete(index)}
              onDragStart={() => handleDragStart(index)}
              onDragEnter={() => handleDragEnter(index)}
              onDragEnd={handleDragEnd}
            />
          );
        })}
      </Box>
      <Divider />
      <Typography variant="h6" sx={{ textDecoration: "underline" }}>
        Annotated Answer
      </Typography>
      <Box sx={styles.answerBox}>
        <Typography data-testid="annotation-text-answer" sx={styles.answerText}>
          {textAnnotations.map((item) => item.text).join("\n\n")}
        </Typography>
      </Box>
    </Box>
  );
};
