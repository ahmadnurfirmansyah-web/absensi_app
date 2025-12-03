// Pastikan user login
db.auth.getSession().then(({ data }) => {
  if (!data.session) {
    window.location = "index.html";
  }
});

// Logout
document.getElementById("logoutBtn").onclick = async () => {
  await db.auth.signOut();
  window.location = "index.html";
};

// =============================
// FUNGSI GET TODAY YYYY-MM-DD
// =============================
function getToday() {
  return new Date().toISOString().slice(0, 10);
}

// =============================
// FUNGSI AMBIL / BUAT RECORD HARI INI
// =============================
// Menghasilkan 1 record ABSENSI untuk tanggal hari ini
async function getAbsensiHariIni(user_id, tanggal) {
  const { data, error } = await db
    .from("absensi")
    .select("*")
    .eq("user_id", user_id)
    .eq("tanggal", tanggal.trim())
    .limit(1);

  if (error) {
    console.error("Error select absensi:", error);
    return null;
  }

  return data.length ? data[0] : null;
}

// =============================
// ABSEN MASUK
// =============================
document.getElementById("btnMasuk").onclick = async () => {
  const file = document.getElementById("fotoMasuk").files[0];
  if (!file) return alert("Ambil foto masuk dulu.");

  const user = (await db.auth.getUser()).data.user;
  const today = getToday();
  const filePath = `${user.id}/masuk-${Date.now()}.jpg`;

  // Upload file
  const upload = await db.storage.from("absensi-foto").upload(filePath, file);
  if (upload.error) {
    console.error(upload.error);
    return alert("Gagal upload foto masuk");
  }

  const { data: urlData } = db.storage
    .from("absensi-foto")
    .getPublicUrl(filePath);

  // Cek apakah baris untuk hari ini sudah ada
  const existing = await getAbsensiHariIni(user.id, today);

  if (existing) {
    // --- UPDATE MASUK SAJA ---
    const { error: updateErr } = await db
      .from("absensi")
      .update({
        jam_masuk: new Date().toISOString(),
        foto_masuk: urlData.publicUrl
      })
      .eq("id", existing.id);

    if (updateErr) {
      console.error(updateErr);
      return alert("Gagal update absen masuk");
    }

    return alert("Absen masuk berhasil diperbarui!");
  }

  // --- INSERT BARU ---
  const { error: insertErr } = await db.from("absensi").insert({
    user_id: user.id,
    tanggal: today,
    jam_masuk: new Date().toISOString(),
    foto_masuk: urlData.publicUrl
  });

  if (insertErr) {
    console.error(insertErr);
    return alert("Gagal insert absen masuk");
  }

  alert("Absen masuk berhasil disimpan!");
};

// =============================
// ABSEN PULANG
// =============================
document.getElementById("btnPulang").onclick = async () => {
  const file = document.getElementById("fotoPulang").files[0];
  if (!file) return alert("Ambil foto pulang dulu.");

  const user = (await db.auth.getUser()).data.user;
  const today = getToday();
  const filePath = `${user.id}/pulang-${Date.now()}.jpg`;

  // Upload file
  const upload = await db.storage.from("absensi-foto").upload(filePath, file);
  if (upload.error) {
    console.error(upload.error);
    return alert("Gagal upload foto pulang");
  }

  const { data: urlData } = db.storage
    .from("absensi-foto")
    .getPublicUrl(filePath);

  // Cari baris absen hari ini
  const existing = await getAbsensiHariIni(user.id, today);

  if (existing) {
    // --- UPDATE PULANG SAJA ---
    const { error: updateErr } = await db
      .from("absensi")
      .update({
        jam_pulang: new Date().toISOString(),
        foto_pulang: urlData.publicUrl
      })
      .eq("id", existing.id);

    if (updateErr) {
      console.error(updateErr);
      return alert("Gagal update absen pulang");
    }

    return alert("Absen pulang berhasil!");
  }

  // --- INSERT BARU JIKA BELUM ADA RECORD ---
  const { error: insertErr } = await db.from("absensi").insert({
    user_id: user.id,
    tanggal: today,
    jam_pulang: new Date().toISOString(),
    foto_pulang: urlData.publicUrl
  });

  if (insertErr) {
    console.error(insertErr);
    return alert("Gagal insert absen pulang");
  }

  alert("Absen pulang berhasil disimpan!");
};
