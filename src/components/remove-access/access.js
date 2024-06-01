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
const RemoveAccessPage = () => {
  const [Users, setUsers] = useState([]);
  useEffect(() => {
    const func = async () => {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        localStorage.getItem("contractAddress"),
        Patient.abi,
        signer
      );
      const response=await contract.getPermits();
      console.log(response)
      const users=response.map((r)=>{
        return {
          address:r
        }
      })
      setUsers(users)
    };
    func();
  },[]);
  // Dummy data for current users
  const currentUsers = [
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Smith" },
    { id: 3, name: "Alice Johnson" },
  ];

  const handleRemoveAccess = (id) => {
    // Handle remove access logic here
    console.log(`Access removed for user ${id}`);
  };
  const removePermission = async (address) => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(
      localStorage.getItem("contractAddress"),
      Patient.abi,
      signer
    );
    console.log(address)
    try {
      const response = await contract.RemovePermission(address);
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
              Remove Access
            </Typography>
            {Users.map((user, index) => (
              <div
                key={index}
                style={{
                  marginBottom:
                    index !== Users.length - 1 ? "16px" : "0",
                }}
              >
                <Card>
                  <CardContent>
                    <Typography variant="h5">{user.address}</Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      variant="contained"
                      color="secondary"
                      style={{ fontWeight: "bold" }}
                      onClick={() => removePermission(user.address)}
                    >
                      Remove Access
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

export default RemoveAccessPage;
