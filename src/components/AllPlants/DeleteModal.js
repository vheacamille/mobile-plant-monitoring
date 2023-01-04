import {
  Button,
  ButtonGroup,
  createTheme,
  Modal,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";

const DeleteModal = ({ plant, isOpen, closeModal, deletePlant }) => {
  const [confirmedDelete, setConfirmedDelete] = useState(false);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #d32f2f",
    boxShadow: 24,
    p: 4,
  };

  return (
    <>
      <Modal
        open={isOpen}
        onClose={() => {
          closeModal("delete");
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {!confirmedDelete
              ? "Remove " + plant.name + "?"
              : "Successfully deleted " + plant.name}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <ThemeProvider theme={theme}>
              {!confirmedDelete && (
                <>
                  <Button
                    size="small"
                    variant="outlined"
                    color="secondary"
                    onClick={() => {
                      deletePlant(plant, "Wrong plant details");
                      setConfirmedDelete(true);
                      isOpen = true;
                    }}
                  >
                    Yes. I entered the wrong plant details.
                  </Button>
                  <br></br>
                  <br></br>
                  <Button
                    size="small"
                    variant="outlined"
                    color="secondary"
                    onClick={() => {
                      deletePlant(plant, "Dead plant");
                      setConfirmedDelete(true);
                      isOpen = true;
                    }}
                  >
                    Yes. The plant died.
                  </Button>
                  <br></br>
                  <br></br>
                  <Button
                    size="small"
                    variant="outlined"
                    color="secondary"
                    onClick={() => {
                      deletePlant(plant, "Other reasons");
                      setConfirmedDelete(true);
                      isOpen = true;
                    }}
                  >
                    Yes. Delete plant for other reasons.
                  </Button>
                  <br></br>
                  <br></br>
                  <Button
                    size="small"
                    variant="outlined"
                    color="secondary"
                    onClick={() => {
                      closeModal("delete");
                    }}
                  >
                    No
                  </Button>
                </>
              )}
            </ThemeProvider>
          </Typography>
        </Box>
      </Modal>
    </>
  );
};

const theme = createTheme({
  palette: {
    primary: {
      main: "#81c784",
      light: "#c8e6c9",
    },
    secondary: {
      main: "#212121",
    },
    error: {
      main: "#d32f2f",
    },
  },
});

export default DeleteModal;
