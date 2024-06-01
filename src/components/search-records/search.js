import React, { useState } from "react";
import {
  TextField,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  CircularProgress,
} from "@mui/material";
import { ethers } from "ethers";
import Patient from "../../Patient.json";
import PatientData from "../../PatientData.json";
import { isAddress } from "web3-validator";

// Dummy data
// const userData = [
//   {
//     username: "faisalwaris01",
//     files: ["image1.jpg", "image2.jpg", "document1.pdf"],
//   },
//   { username: "john_doe", files: ["document2.pdf", "image3.jpg"] },
//   // Add more dummy data as needed
// ];

function SearchRecords() {
  const [searchTerm, setSearchTerm] = useState("");
  const [access, setAccess] = useState(true);
  // const [selectedUser, setSelectedUser] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [files, setFiles] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(false);
  console.log(access)
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    // setSelectedUser(null); // Reset selected user when searching
  };

  // const handleUserSelect = (username) => {
  //   setSelectedUser(username);
  // };

  const handlePreviewOpen = (file) => {
    setSelectedFile(file);
    setPreviewOpen(true);
  };

  const handlePreviewClose = () => {
    setSelectedFile(null);
    setPreviewOpen(false);
  };

  // const filteredUsers = searchTerm.trim() !== '' && userData.filter(user =>
  //   user.username.toLowerCase().includes(searchTerm.toLowerCase())
  // );
  const getUserData = async (Address) => {
    const provider = new ethers.JsonRpcProvider(
      process.env.REACT_APP_PUBLIC_RPC_URL
    );

    const contract = new ethers.Contract(
      process.env.REACT_APP_PUBLIC_ADDRESS_1,
      PatientData.abi,
      provider
    );
    const UserInfo = contract.filters.UserRegistered(Address, null);
    let contractAddress = await contract.queryFilter(UserInfo);
    return contractAddress;
  };
  const setUserData = async () => {
    setAccess(true);
    if (!isAddress(searchTerm)) {
      return;
    }
    const contractAddress = await getUserData(searchTerm);
    if (contractAddress.length === 0) {
      return;
    }
    console.log(contractAddress);
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(
      contractAddress[0].args[1],
      Patient.abi,
      signer
    );
    const mappedData = [];
    try {
      const data = await contract.getData();
      for (let i = 0; i < data.length; i++) {
        mappedData.push({ name: data[i][0], URI: data[i][1] });
      }
      console.log(mappedData);
      setFiles(mappedData);
    } catch (err) {
      console.log(err);
      setAccess(false);
    }
    return;
  };
  const searchUser = async () => {
    // const Web3provider = new ethers.BrowserProvider(window.ethereum);
    // const signer = await Web3provider.getSigner();
    // const Address = await signer.getAddress();
    setLoading(true);
    await setUserData();
    setLoading(false);
  };
  const sendRequest = async () => {
    setStatus(true);
    setLoading(true);
    const contractAddress = await getUserData(searchTerm);
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(
      contractAddress[0].args[1],
      Patient.abi,
      signer
    );
    try {
      const response = await contract.requestPermission();
      console.log(response);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };
  return (
    <Container>
      <Typography
        style={{ marginTop: "20px", color: "#555" }}
        variant="h4"
        align="center"
        gutterBottom
      >
        Search Records
      </Typography>
      <div>
        <TextField
          label="Search Username"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          style={{ marginBottom: "20px", width: "70%", marginRight: "30px" }}
        />
        <Button
          variant="contained"
          component="span"
          style={{ marginTop: "10px" }}
          onClick={searchUser}
          disabled={loading}
        >
          Search
        </Button>
      </div>
      {/* {filteredUsers && filteredUsers.length > 0 && (
        <Grid container spacing={2}>
          {filteredUsers.map((user, index) => (
            <Grid item xs={12} key={index}>
              <Card onClick={() => handleUserSelect(user.username)} style={{ cursor: 'pointer' }}>
                <CardContent>
                  <Typography variant="h6">{user.username}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )} */}
      {!access ? (
        <Button
          variant="contained"
          component="span"
          style={{ marginTop: "10px" }}
          onClick={sendRequest}
          disabled={status}
        >
          {loading ? <CircularProgress/> : "Request Access"}
        </Button>
      ) : (
        files !== null && (
          <div style={{ marginTop: "20px" }}>
            <Typography style={{ color: "#555" }} variant="h5" gutterBottom>
              {files.length !== 0
                ? `Available Files for user are`
                : `User does not exist`}
            </Typography>
            <Grid container spacing={2}>
              {files.map((file, index) => {
                return (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Paper elevation={3} style={{ padding: "20px" }}>
                      <Typography variant="h6">{file.name}</Typography>
                      <Button
                        variant="contained"
                        color="primary"
                        style={{ marginTop: "10px", fontWeight: "bold" }}
                        onClick={() => handlePreviewOpen(file)}
                      >
                        Preview
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        style={{
                          marginTop: "10px",
                          marginLeft: "10px",
                          fontWeight: "bold",
                        }}
                      >
                        Download
                      </Button>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
          </div>
        )
      )}
      <Dialog
        open={previewOpen}
        onClose={handlePreviewClose}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>{selectedFile?.name}</DialogTitle>
        <DialogContent>
          {selectedFile?.name && !selectedFile.name.endsWith(".pdf") && (
            <img
              src={`https://apricot-fashionable-pig-724.mypinata.cloud/ipfs/${selectedFile.URI}?pinataGatewayToken=${process.env.REACT_APP_PINATA_GATEWAY_KEY}`}
              alt="Preview"
              style={{ maxWidth: "100%" }}
            />
          )}
          {selectedFile && selectedFile.name.endsWith(".pdf") && (
            <iframe
              src={`https://apricot-fashionable-pig-724.mypinata.cloud/ipfs/${selectedFile.URI}?pinataGatewayToken=${process.env.REACT_APP_PINATA_GATEWAY_KEY}`}
              title="Preview"
              width="100%"
              height="500px"
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button
            style={{ fontWeight: "bold" }}
            onClick={handlePreviewClose}
            color="primary"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default SearchRecords;
