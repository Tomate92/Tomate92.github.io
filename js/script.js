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