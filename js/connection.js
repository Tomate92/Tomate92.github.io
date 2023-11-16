// Objet tenant une réf. vers la base de données locale.
let db;

// Ouvrir une connexion à la base de données IndexedDB
let request = window.indexedDB.open("my-database", 2);

request.onerror = function(event) {
    console.error("Erreur d'ouverture de la base de données", event);
};

request.onsuccess = function(event) {
    db = event.target.result;
};

// création des structures nécessaires au stockage des données
request.onupgradeneeded = function(event) {
    let db = event.target.result;
    let objectStore;
    if (!db.objectStoreNames.contains("users")) {
        objectStore = db.createObjectStore("users", {autoIncrement: true});
    } else {
        objectStore = db.transaction(["users"], "readwrite").objectStore("users");
    }

    // Créer un index sur le champ "email" (pour que les recherches aillent plus vite
    if (!objectStore.indexNames.contains("email")) {
        objectStore.createIndex("email", "email", { unique: true });
    }
};

// Fonction pour ajouter des données
function ajouterUtilisateur(email, password) {
    let transaction = db.transaction(["users"], "readwrite");
    let store = transaction.objectStore("users");
    let request = store.add({ email: email, password: password });

    request.onsuccess = function() {
        console.log("Utilisateur ajouté avec succès");
        window.location.href = "success.html";
    };

    request.onerror = function(event) {
        console.error("Erreur d'ajout de l'utilisateur", event);
        window.location.href = "failure.html";
    };
}

function rechercherUtilisateur(email, password) {
    let transaction = db.transaction(["users"], "readonly");
    let store = transaction.objectStore("users");
    let index = store.index("email");

    index.openCursor().onsuccess = function(event) {
        let cursor = event.target.result;
        if (cursor) {
            if (cursor.value.email === email && cursor.value.password === password) {
                sauvegarderEnCookie( cursor.value);
                console.log("Utilisateur trouvé et sauvegardé en cookie.");
                window.location.href = "index.html";
            } else {
                cursor.continue();
            }
        } else {
            console.log("Aucun utilisateur correspondant trouvé");
            window.location.href = "connection-failure.html";
        }
    };
}
// Stockage de l'utilisateur connecté en cookie pour utilisation dans toutes les pages web
function sauvegarderEnCookie(utilisateur) {
    let dateExpiration = new Date();
    dateExpiration.setTime(dateExpiration.getTime() + (24*60*60*1000)); // Expiration après 1 jour
    let expires = "expires=" + dateExpiration.toUTCString();
    document.cookie = "utilisateur=" + JSON.stringify(utilisateur) + ";" + expires + ";path=/";
}

function obtenirValeurCookie(nom) {
    let nomCookie = nom + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(nomCookie) == 0) {
            return c.substring(nomCookie.length, c.length);
        }
    }
    return "";
}

//function afficherEmailUtilisateur() {
    let utilisateurCookie = obtenirValeurCookie("utilisateur");
    if (utilisateurCookie) {
        let utilisateur = JSON.parse(utilisateurCookie);
        document.getElementById("emailUtilisateur").innerText += utilisateur.email;
    } else {
        if (document.getElementById("emailUtilisateur") === null) {

        } else {
             document.getElementById("emailUtilisateur").innerText += "Non connecté";
        }
    }
//}



// Retrouver un utilisateur par son login et mot de passe
document.getElementById("connection-form").onsubmit = function(event) {
    event.preventDefault(); // Empêcher la soumission classique du formulaire

    let email = document.getElementById("email").value;
    let password = document.getElementById("mdp").value;

    if(email === "" || password === ""){
        alert("Tous les champs doivent être remplis !");
    } else {
        if (!email.includes('@')){
            alert("L'Email est invalide");
        } else {
            if (email.includes('.net') || email.includes('.com') || email.includes('.fr') || email.includes('.io')) {
                rechercherUtilisateur(email, password);
            } else {
                alert("L'Email est invalide");
            }
        }
    }
};