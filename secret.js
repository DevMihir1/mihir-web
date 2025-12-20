const PASSWORD = "1234"; // 🔴 CHANGE THIS

const overlay = document.getElementById("overlay");
const container = document.querySelector(".container");
const noteBox = document.getElementById("noteBox");
const fileInput = document.getElementById("fileInput");
const fileList = document.getElementById("fileList");

/* Unlock */
overlay.onclick = () => {
    const code = prompt("Enter access code:");
    if(code === PASSWORD){
        overlay.style.opacity = "0";
        setTimeout(()=>overlay.remove(),600);
        document.body.classList.remove("locked");
        container.classList.add("visible");
        loadNotes();
        loadFiles();
    } else {
        alert("Wrong code");
    }
};

/* Notes */
function saveNotes(){
    localStorage.setItem("vault_notes", noteBox.value);
    alert("Saved");
}

function loadNotes(){
    noteBox.value = localStorage.getItem("vault_notes") || "";
}

/* Files */
fileInput.onchange = () => {
    const file = fileInput.files[0];
    if(!file) return;

    const reader = new FileReader();
    reader.onload = () => {
        const files = JSON.parse(localStorage.getItem("vault_files") || "[]");
        files.push({ name:file.name, data:reader.result });
        localStorage.setItem("vault_files", JSON.stringify(files));
        loadFiles();
    };
    reader.readAsDataURL(file);
};

function loadFiles(){
    fileList.innerHTML = "";
    const files = JSON.parse(localStorage.getItem("vault_files") || "[]");
    files.forEach(f=>{
        const li = document.createElement("li");
        li.textContent = f.name;
        li.onclick = ()=>downloadFile(f);
        fileList.appendChild(li);
    });
}

function downloadFile(f){
    const a = document.createElement("a");
    a.href = f.data;
    a.download = f.name;
    a.click();
}

/* Back */
function goBack(){
    document.body.style.opacity="0";
    setTimeout(()=>window.location.href="index.html",400);
}
