import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Button,
  Card,
  Typography,
  CardActions,
  CardContent,
  CardHeader,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { ethers } from "ethers";
import Patient from "../../Patient.json";
import { ElevatorSharp } from "@mui/icons-material";
import PendingIcon from "@mui/icons-material/Pending";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [openPendingModal, setOpenPendingModal] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [openPreview, setOpenPreview] = useState(false);
  const [Files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const handlePendingModalOpen = () => {
    setOpenPendingModal(true);
  };

  const handlePendingModalClose = () => {
    setOpenPendingModal(false);
  };

  // Dummy data for available files
  const availableFiles = [
    {
      name: "DummyImage.jpg",
      type: "image",
      url: "https://via.placeholder.com/150",
    },
    {
      name: "DummyImage_2.jpg",
      type: "image",
      url: "https://via.placeholder.com/151",
    },
    {
      name: "DummyImage_3.jpg",
      type: "image",
      url: "https://via.placeholder.com/151",
    },
    {
      name: "DummyPDF.pdf",
      type: "pdf",
      url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    },
  ];
  window.ethereum.on("accountsChanged", function (accounts) {
    func();
  });
  const func = async () => {
    setLoading(true);
    // await window.ethereum.request({ method: "eth_requestAccounts" });
    // const Web3provider = new ethers.BrowserProvider(window.ethereum);
    // const signer = await Web3provider.getSigner();
    // const Address = await signer.getAddress();
    // const provider = new ethers.JsonRpcProvider(
    //   process.env.REACT_APP_PUBLIC_RPC_URL
    // );
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(
      localStorage.getItem("contractAddress"),
      Patient.abi,
      signer
    );
    const data = await contract.getData();
    const mappedData = [];
    for (let i = 0; i < data.length; i++) {
      mappedData.push({ name: data[i][0], URI: data[i][1] });
    }
    console.log(mappedData);
    setFiles(mappedData);
    setLoading(false);
  };
  useEffect(() => {
    func();
  }, []);

  const handleUpload = async (event) => {
    setLoading(true);
    const uploadedFiles = event.target.files[0];
    setUploadedFiles(uploadedFiles);
    const formData = new FormData();
    formData.append("file", event.target.files[0]);
    console.log(event.target.files[0]);
    const resFile = await axios({
      method: "post",
      url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
      data: formData,
      headers: {
        pinata_api_key: `${process.env.REACT_APP_PINATA_API_KEY}`,
        pinata_secret_api_key: `${process.env.REACT_APP_PINATA_SECRET_API_KEY}`,
        "Content-Type": "multipart/form-data",
      },
    });
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(
      localStorage.getItem("contractAddress"),
      Patient.abi,
      signer
    );
    try {
      const data = await contract.addData(
        resFile.data.IpfsHash,
        event.target.files[0].name
      );
      await data.wait();
      console.log(data);
    } catch (err) {
      console.log(err);
    }
    func();
  };

  const handlePreview = (file) => {
    if (file) {
      setSelectedFile(file);
      setOpenPreview(true);
    }
  };

  const handleClosePreview = () => {
    setOpenPreview(false);
  };

  const renderFilePreview = () => {
    if (selectedFile) {
      // console.log(selectedFile)
      // if (selectedFile.type === "image") {
      //   return (
      //     <img
      //       src={`https://apricot-fashionable-pig-724.mypinata.cloud/ipfs/${selectedFile.URI}?pinataGatewayToken=${process.env.REACT_APP_PINATA_GATEWAY_KEY}`}
      //       alt={selectedFile.name}
      //       style={{ maxWidth: "100%", maxHeight: "80vh" }}
      //     />
      //   );
      // } else if (selectedFile.type === "pdf") {
      //   return (
      //     <embed
      //       src={selectedFile.url}
      //       type="application/pdf"
      //       width="100%"
      //       height="100%"
      //     />
      //   );

      //}
      // const res = await axios(
      //   `https://apricot-fashionable-pig-724.mypinata.cloud/ipfs/${selectedFile.URI}?pinataGatewayToken=${process.env.REACT_APP_PINATA_GATEWAY_KEY}`
      // );
      // console.log(res);
      if (selectedFile.name.endsWith(".pdf")) {
        return (
          <iframe
            src={`https://docs.google.com/viewer?url=https://apricot-fashionable-pig-724.mypinata.cloud/ipfs/${selectedFile.URI}?pinataGatewayToken=${process.env.REACT_APP_PINATA_GATEWAY_KEY}&embedded=true`}
            title="Preview"
            width="100%"
            height="500px"
          />
        );
      } else {
        return (
          <img
            src={`https://apricot-fashionable-pig-724.mypinata.cloud/ipfs/${selectedFile.URI}?pinataGatewayToken=${process.env.REACT_APP_PINATA_GATEWAY_KEY}`}
            alt="Preview"
            style={{ maxWidth: "100%" }}
          />
        );
      }
    }
    return null;
  };

  const headingStyle = {
    marginBottom: "20px",
    fontSize: "2.5rem",
    color: "#555",
    // fontWeight:'bold'
  };

  return (
    <Container>
      <Paper
        elevation={3}
        style={{ padding: 20, marginTop: 20, minHeight: "100vh" }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} style={{ textAlign: "center" }}>
            <Typography variant="h3" style={headingStyle}>
              Dashboard
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <input
              accept="image/*,.pdf"
              style={{ display: "none" }}
              id="contained-button-file"
              multiple
              type="file"
              onChange={handleUpload}
            />
            <label htmlFor="contained-button-file">
              <Button
                variant="contained"
                component="span"
                style={{ fontWeight: "bold" }}
              >
                Upload Files
              </Button>
            </label>
            <Button
              variant="contained"
              style={{ fontWeight: "bold", marginLeft: "10px" }}
              onClick={handlePendingModalOpen}
            >
              <PendingIcon />
            </Button>

            {/* {uploadSuccess && <p>File Successfully Uploaded!</p>} */}
          </Grid>
          <Grid item xs={12} style={{ marginTop: "25px" }}>
            <Typography
              variant="h5"
              style={{ color: "#555", marginBotton: "10px" }}
            >
              Available Files:
            </Typography>
            {loading ? (
              <CircularProgress />
            ) : (
              <Grid container spacing={3}>
                {Files.map((file, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Card>
                      <CardHeader title={file.name} />
                      {/* <CardContent>
                      {file.type === 'image' ? (
                        <img src={file.url} alt={file.name} style={{ maxWidth: '100%' }} />
                      ) : (
                        <div>PDF Thumbnail</div>
                      )}
                    </CardContent> */}
                      <CardActions>
                        <Button
                          size="small"
                          style={{ fontWeight: "bold" }}
                          onClick={() => handlePreview(file)}
                        >
                          Preview
                        </Button>
                        <Button size="small" style={{ fontWeight: "bold" }}>
                          Download
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Grid>
        </Grid>
      </Paper>
      <Dialog open={openPreview} onClose={handleClosePreview}>
        <DialogTitle>Preview</DialogTitle>
        <DialogContent>{renderFilePreview()}</DialogContent>
        <DialogActions>
          <Button style={{ fontWeight: "bold" }} onClick={handleClosePreview}>
            Close
          </Button>
          <Button style={{ fontWeight: "bold" }}>Download</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openPendingModal} onClose={handlePendingModalClose}>
        <DialogTitle>Pending Requests and Remove Access</DialogTitle>
        <DialogContent>
          <Button
            variant="contained"
            component={Link}
            to="/pendingRequest"
            style={{ fontWeight: "bold", marginRight: "10px" }}
          >
            Pending Requests
          </Button>
          <Button
            variant="contained"
            component={Link}
            to="/removeAccess"
            style={{ fontWeight: "bold" }}
          >
            Remove Access
          </Button>
        </DialogContent>
        <DialogActions>
          <Button
            style={{ fontWeight: "bold" }}
            onClick={handlePendingModalClose}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Dashboard;
