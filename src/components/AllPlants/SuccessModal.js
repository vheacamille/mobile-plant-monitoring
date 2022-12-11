import { Modal, Typography } from "@mui/material";
import { Box } from "@mui/system";

const SuccessModal = ({ isOpen, closeModal, message }) => {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #81c784",
    boxShadow: 24,
    p: 4,
  };

  return (
    <>
      <Modal
        open={isOpen}
        onClose={closeModal("success")}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Successful!
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Successfully {message}
          </Typography>
        </Box>
      </Modal>
    </>
  );
};

export default SuccessModal;
