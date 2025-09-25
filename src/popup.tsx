import { useState } from "react"
import { Routes, Route, MemoryRouter } from "react-router-dom"
import Login from "./pages/login"
import Index from "./pages/index"

function IndexPopup() {
  return (
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </MemoryRouter>
  )
}

export default IndexPopup
