import { useState } from "react"
import { Routes, Route, MemoryRouter } from "react-router-dom"
import Login from "./pages/login"

function IndexPopup() {
  return (
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route path="/" element={<Login />} />
      </Routes>
    </MemoryRouter>
  )
}

export default IndexPopup
