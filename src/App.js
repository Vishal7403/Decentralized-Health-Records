import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useHistory,
  Link,
} from "react-router-dom";
import Navbar from "./components/navbar/navbar";
import MainPage from "./components/main-page/main";
import Dashboard from "./components/dashboard/dashboard";
import SearchRecordsPage from "./components/search-records/search";
import ContactPage from "./components/contact/contact";
import AboutUsPage from "./components/about-us/about-us";
import PendingRequestPage from "./components/pending-requests/requests";
import RemoveAccessPage from "./components/remove-access/access";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <MainPage />
            </>
          }
        />
        <Route
          path="/dashboard"
          element={
            <>
              <Navbar />
              <Dashboard />
            </>
          }
        />
        <Route
          path="/search-records"
          element={
            <>
              <Navbar />
              <SearchRecordsPage />
            </>
          }
        />
        <Route
          path="/contactus"
          element={
            <>
              <Navbar />
              <ContactPage />
            </>
          }
        />
        <Route
          path="/aboutus"
          element={
            <>
              <Navbar />
              <AboutUsPage />
            </>
          }
        />
        <Route
          path="/pendingRequest"
          element={
            <>
              <Navbar />
              <PendingRequestPage />
            </>
          }
        />
        <Route
          path="/removeAccess"
          element={
            <>
              <Navbar />
              <RemoveAccessPage />
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
