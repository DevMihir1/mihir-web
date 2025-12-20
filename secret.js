import { supabase } from "./supabase.js";

/* ================= LOCK ================= */

const overlay = document.getElementById("overlay");
const container = document.querySelector(".container");
const PASSWORD = "Mihir1"; // change this

overlay.onclick = () => {
  const code = prompt("Enter code:");
  if (code === PASSWORD) {
    overlay.style.opacity = "0";
    setTimeout(() => overlay.remove(), 500);
    document.body.classList.remove("locked");
    container.classList.add("visible");
  } else {
    alert("Wrong code");
  }
};

/* ================= DEVICE ================= */

let currentDevice = "mihir";

window.setDevice = d => {
  currentDevice = d;

  document.querySelectorAll(".column").forEach(c => {
    c.style.outline = "none";
    c.style.boxShadow = "0 0 35px rgba(0,0,0,0.6)";
  });

  const col =
    d === "mihir"
      ? document.querySelector(".column:nth-child(1)")
      : document.querySelector(".column:nth-child(2)");

  col.style.outline = "1px solid rgba(255,255,255,.5)";
  col.style.boxShadow = "0 0 55px rgba(255,255,255,.15)";
};

/* ================= ELEMENTS ================= */

const fileInput = document.getElementById("fileInput");
const mihirList = document.getElementById("mihirList");
const schoolList = document.getElementById("schoolList");

/* ================= UPLOAD ================= */

fileInput.addEventListener("change", async () => {
  const file = fileInput.files[0];
  if (!file) return;

  const path = `${currentDevice}/${Date.now()}-${file.name}`;

  const { error: uploadError } = await supabase
    .storage
    .from("vault")
    .upload(path, file);

  if (uploadError) {
    alert(uploadError.message);
    return;
  }

  const { data } = supabase
    .storage
    .from("vault")
    .getPublicUrl(path);

  await supabase.from("files").insert({
    name: file.name,
    url: data.publicUrl,
    device: currentDevice
  });
});

/* ================= LOAD FILES ================= */

async function loadFiles() {
  mihirList.innerHTML = "";
  schoolList.innerHTML = "";

  const { data, error } = await supabase
    .from("files")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  data.forEach(f => {
    const li = document.createElement("li");
    li.innerHTML = `<a href="${f.url}" target="_blank">${f.name}</a>`;

    if (f.device === "mihir") {
      mihirList.appendChild(li);
    } else {
      schoolList.appendChild(li);
    }
  });
}

/* ================= MANUAL RELOAD ================= */

window.reloadFiles = async () => {
  await loadFiles();
};

/* ================= REALTIME ================= */

supabase
  .channel("files-realtime")
  .on(
    "postgres_changes",
    {
      event: "INSERT",
      schema: "public",
      table: "files"
    },
    () => {
      loadFiles();
    }
  )
  .subscribe();

/* ================= INIT ================= */

loadFiles();
