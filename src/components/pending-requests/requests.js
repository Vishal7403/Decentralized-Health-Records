import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Button,
  Card,
  Typography,
  CardActions,
  CardContent,
  Paper,
} from "@mui/material";
import { ethers } from "ethers";
import Patient from "../../Patient.json";

const PendingRequestPage = () => {
  const [Users, setUsers] = useState([]);
  useEffect(() => {
    const func = async () => {
      console.log("inside requests");
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        localStorage.getItem("contractAddress"),
        Patient.abi,
        signer
      );
      const response = await contract.getPendingRequests();
      console.log(response);
      const users = response.map((r) => {
        return {
          address: r,
        };
      });
      setUsers(users);
    };
    func();
  }, []);
  // Dummy data for pending requests
  const pendingRequests = [
    { id: 1, requester: "John Doe", requestType: "Access Removal" },
    { id: 2, requester: "Jane Smith", requestType: "Access Approval" },
    { id: 3, requester: "Alice Johnson", requestType: "Access Removal" },
  ];

  const handlePermission = async (address, res) => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(
      localStorage.getItem("contractAddress"),
      Patient.abi,
      signer
    );
    console.log(address,res)
    try {
      const response = await contract.handlePermission(address, res);
      console.log(response);
      const newUsers = Users.filter((e) => {
        return e.address !== address;
      });
      console.log(newUsers);
      setUsers(newUsers);
    } catch (err) {
      console.log(err);
    }
  };

  const headingStyle = {
    marginBottom: "20px",
    fontSize: "2.5rem",
    color: "#555",
    // fontWeight:'bold'
  };

  return (
    <Container>
      <Paper elevation={3} style={{ padding: 20, marginTop: 20 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h3" style={headingStyle}>
              Pending Requests
            </Typography>
            {Users.map((request, index) => (
              <div
                key={index}
                style={{
                  marginBottom: index !== Users.length - 1 ? "16px" : "0",
                }}
              >
                <Card>
                  <CardContent>
                    <Typography variant="h5">{request.address}</Typography>
                    <Typography variant="body1">Status: Pending</Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      variant="contained"
                      color="primary"
                      style={{ fontWeight: "bold" }}
                      onClick={() => handlePermission(request.address,true)}
                    >
                      Approve Request
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      style={{ fontWeight: "bold" }}
                      onClick={() => handlePermission(request.address,false)}
                    >
                      Deny Request
                    </Button>
                  </CardActions>
                </Card>
              </div>
            ))}
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default PendingRequestPage;
