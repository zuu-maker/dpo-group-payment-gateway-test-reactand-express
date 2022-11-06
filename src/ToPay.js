import React from "react";
import { Button, Typography } from "@mui/material";

const ToPay = ({ createTransaction, isSend, token, error }) => {
  return (
    <React.Fragment>
      {error && error.length > 0 ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <Typography>Pay amount 5 kwacha</Typography>
      )}
      {isSend ? (
        <a
          style={{
            textDecoration: "none",
          }}
          target="_blank"
          href={`https://secure.3gdirectpay.com/payv2.php?ID=${token}`}
        >
          <Button variant="contained" color="success">
            Pay Securely
          </Button>
        </a>
      ) : (
        <Button onClick={createTransaction} variant="contained">
          Continue to Pay
        </Button>
      )}
    </React.Fragment>
  );
};

export default ToPay;
