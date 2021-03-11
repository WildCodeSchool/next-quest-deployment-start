import Link from "next/link";
import { useState } from "react";
import axios from "axios";
import AdminLayout from "../../../components/AdminLayout";

export default function NewCampusPage() {
  const [newCampusName, setNewCampusName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    axios
      .post("/api/campuses", { name: newCampusName })
      .then(() => {
        alert("Campus created");
        setNewCampusName("");
      })
      .catch((err) => {
        console.error(err);
        alert("Sorry, an error occured");
      });
  };

  return (
    <AdminLayout pageTitle="Create campus">
      <h1>New campus</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name : </label>
        <input
          value={newCampusName}
          onChange={(e) => setNewCampusName(e.target.value)}
          type="text"
          required
          maxLength="50"
        />
        <br />
        <br />
        <input type="submit" value="Create" />
      </form>
      <br />

      <Link href="/campuses">
        <a href="/campuses">Back to the list</a>
      </Link>
    </AdminLayout>
  );
}
