import "./App.css";
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import axios from "axios";
import ToPay from "./ToPay";

const url = "http://localhost:8000";

function App() {
  let date = new Date();
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [isSend, setIsSend] = useState(false);

  const [isVerified, setIsVerified] = useState(false);

  let _date =
    date.getFullYear() +
    "/" +
    date.getMonth() +
    "/" +
    date.getDate() +
    " " +
    date.toLocaleTimeString().substring(0, 5);

  const postData = {
    amount: 1,
    email: "setzulu73@gmail.com",
    phone: "+260972507705",
    date: _date,
  };

  useEffect(() => {
    console.log(token);
  }, [token]);

  useEffect(() => {
    verifyTransaction();
  }, []);

  const verifyTransaction = async () => {
    let parser = new DOMParser();
    try {
      const _token = await window.localStorage.getItem("token");
      const { data } = await axios.post(url + "/verify-transaction", {
        token: _token,
      });
      let doc = parser.parseFromString(data.data, "text/xml");

      if (
        doc
          .getElementsByTagName("Result")[0]
          .childNodes[0].nodeValue.toString() === "000"
      ) {
        setIsVerified(true);
      }
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const createTransaction = async () => {
    let parser = new DOMParser();
    try {
      const { data } = await axios.post(url, postData);
      let doc = parser.parseFromString(data.data, "text/xml");

      if (
        doc
          .getElementsByTagName("Result")[0]
          .childNodes[0].nodeValue.toString() !== "000"
      ) {
        setError("DPO server error please try again later");
        return;
      }

      setToken(
        doc
          .getElementsByTagName("TransToken")[0]
          .childNodes[0].nodeValue.toString()
      );
      console.log(
        doc
          .getElementsByTagName("TransToken")[0]
          .childNodes[0].nodeValue.toString()
      );
      await window.localStorage.setItem(
        "token",
        doc
          .getElementsByTagName("TransToken")[0]
          .childNodes[0].nodeValue.toString()
      );
      setIsSend(true);
    } catch (error) {
      console.log(error);
    }
  };

  const remove = async () => {
    await window.localStorage.removeItem("token");
    setIsVerified(false);
  };

  useEffect(() => {
    if (isVerified) {
      remove();
    }
  }, [isVerified]);

  return (
    <React.Fragment>
      <Container
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
        maxWidth="sm"
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
            height: "20vh",
          }}
        >
          {isVerified ? (
            <p>Verified</p>
          ) : (
            <ToPay
              createTransaction={createTransaction}
              isSend={isSend}
              token={token}
              error={error}
            />
          )}
        </Box>
      </Container>
    </React.Fragment>
  );
}

export default App;
