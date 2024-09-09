import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home.jsx";
import Layout from "./components/Layout/Layout.jsx";
import ViewRecords from "./components/ViewRecords.jsx";
import RecordDetail from "./components/Add/AddRecord.jsx";
import FilterRecodrs from "./components/FilterRecords.jsx";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="add_record" element={<RecordDetail new={true} />} />
            <Route
              path="update_record"
              element={<RecordDetail new={false} />}
            />
            <Route path="records" element={<ViewRecords />} />
            <Route path="filter-records" element={<FilterRecodrs />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
