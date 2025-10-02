import React, { useState, useEffect } from "react";

export default function GmailAccountManager() {
  const [accounts, setAccounts] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [usedDate, setUsedDate] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const saved = localStorage.getItem("accounts");
    if (saved) setAccounts(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("accounts", JSON.stringify(accounts));
  }, [accounts]);

  const addAccount = () => {
    if (!name || !email || !usedDate) return alert("Lengkapi semua data!");
    if (!email.endsWith("@gmail.com")) return alert("Email harus @gmail.com");

    const readyDate = new Date(usedDate);
    readyDate.setDate(readyDate.getDate() + 15);

    setAccounts([
      ...accounts,
      {
        id: Date.now(),
        name,
        email,
        usedDate,
        readyDate: readyDate.toISOString().split("T")[0],
      },
    ]);
    setName("");
    setEmail("");
    setUsedDate("");
  };

  const deleteAccount = (id) => {
    setAccounts(accounts.filter((acc) => acc.id !== id));
  };

  const exportCSV = () => {
    const headers = ["Nama", "Email", "Tanggal Dipakai", "Siap Digunakan"];
    const rows = accounts.map((acc) => [acc.name, acc.email, acc.usedDate, acc.readyDate]);
    let csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].map(e => e.join(",")).join("\n");

    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "akun_gmail.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filterAccounts = accounts.filter((acc) => {
    const matchSearch =
      acc.name.toLowerCase().includes(search.toLowerCase()) ||
      acc.email.toLowerCase().includes(search.toLowerCase());

    const today = new Date();
    const ready = new Date(acc.readyDate) <= today;

    if (filter === "ready" && !ready) return false;
    if (filter === "notready" && ready) return false;

    return matchSearch;
  });

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📊 Pendataan Akun Gmail</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-4">
        <input
          className="border p-2 rounded"
          placeholder="Nama"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="border p-2 rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="date"
          className="border p-2 rounded"
          value={usedDate}
          onChange={(e) => setUsedDate(e.target.value)}
        />
        <button
          onClick={addAccount}
          className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600"
        >
          Tambah
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        <input
          className="border p-2 rounded flex-1"
          placeholder="Cari nama atau email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="border p-2 rounded"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">Semua</option>
          <option value="ready">Sudah Siap</option>
          <option value="notready">Belum Siap</option>
        </select>
        <button
          onClick={exportCSV}
          className="bg-green-500 text-white rounded px-3 hover:bg-green-600"
        >
          📥 Ekspor CSV
        </button>
      </div>

      <table className="w-full border-collapse border text-sm">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Nama</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Tanggal Dipakai</th>
            <th className="border p-2">Siap Digunakan</th>
            <th className="border p-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {filterAccounts.map((acc) => {
            const today = new Date();
            const ready = new Date(acc.readyDate) <= today;
            return (
              <tr key={acc.id} className={ready ? "bg-green-100" : "bg-red-100"}>
                <td className="border p-2">{acc.name}</td>
                <td className="border p-2">{acc.email}</td>
                <td className="border p-2">{acc.usedDate}</td>
                <td className="border p-2">{acc.readyDate}</td>
                <td className="border p-2 text-center">
                  <button
                    onClick={() => deleteAccount(acc.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
