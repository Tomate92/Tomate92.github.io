function supprimerBaseDeDonnees() {
    let request = window.indexedDB.deleteDatabase("my-database");

    request.onerror = function(event) {
        console.error("Erreur lors de la suppression de la base de données:", event);
    };

    request.onsuccess = function(event) {
        console.log("Base de données supprimée avec succès");
        window.location.href = "index.html";
    };

    request.onblocked = function(event) {
        console.log("La suppression de la base de données est bloquée");
    };
}

function supprimerCookie(nom) {
    document.cookie = nom + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}

document.getElementById("deleteDB").onclick = function(event) {
    supprimerBaseDeDonnees();
    supprimerCookie("utilisateur");
};