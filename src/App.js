import React from "react";
import data from "./data";
import LibelleData from "./LibelleData";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import "bootstrap/dist/css/bootstrap.min.css";

import "./styles.css";

var tabNumId = [];
var doStriped = true;
export default class TabEtat extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      //state is by default an object
      etatFnc: data,
      doStriped: true
    };
    this.transformLibelleStatut = this.transformLibelleStatut.bind(this);
    this.transFormEcheance = this.transFormEcheance.bind(this);
    this.displayNomPrenom = this.displayNomPrenom.bind(this);
    this.functionStripedTable = this.functionStripedTable.bind(this);
  }

  displayNomPrenom(text) {
    var reversedText = text
      .split("@bridgebankgroup.com")
      .reverse()
      .join("");
    var tab = reversedText.split(".");
    var prenom = tab[0];
    prenom = prenom[0].toUpperCase() + prenom.slice(1);
    var nom = tab[1].toUpperCase();
    return nom + " " + prenom;
  }
  transFormEcheance(echeances) {
    return echeances
      .split("-")
      .reverse()
      .join("-");
  }
  functionStripedTable(numeroId, tabId, index) {
    if (index === 0) return this.state.doStriped;
    else {
      if (numeroId !== tabId[index - 1]) {
        doStriped = !doStriped;
        return doStriped;
      }

      return true;
    }
  }
  transformLibelleStatut(statutFnc) {
    var statut = "";
    switch (statutFnc) {
      case "initier":
        statut = "Initier";
        break;
      case "declarer":
        statut = "Déclarer";
        break;
      case "cloturerProv":
        statut = "Cloture provisoirement";
        break;
      case "routageCorrect":
        statut =
          "Routage correct (en attente d'action du responsable de traitement)";
        break;
      case "routageIncorrect":
        statut = "Correction par Organisation";
        break;
      case "traiter":
        statut = "Traiter";
        break;
      case "criterCre":
        statut = "Critere créé";
        break;
      case "activer":
        statut = "Analyse Créée";
        break;
      default:
        statut = "";
    }
    return statut;
  }

  renderTableData() {
    return this.state.etatFnc.map((etatFncs, index) => {
      const {
        numeroId,
        descriptionFNC,
        echeanceFnc,
        dateDeclaration,
        libelleSource,
        libelleProcesus,
        correction,
        actionCorrective,
        cause,
        echeances,
        statut,
        idActeur,
        idActeurDelegataire,
        dateClotureDef,
        dateFinAnalyse,
        statutFnc,
        statutEva
      } = etatFncs; //destructuring
      tabNumId.push(numeroId);
      var td1;

      if (index > 1) {
        td1 = numeroId !== tabNumId[index - 1] ? <td>{numeroId}</td> : <td />;
      } else {
        td1 = <td>{numeroId}</td>;
      }
      return (
        <tr
          bgcolor={
            this.functionStripedTable(numeroId, tabNumId, index)
              ? "#f2f2f2"
              : "#ddd"
          }
          key={index}
        >
          {td1}
          {/**numero de fiche */}
          <td style={{ width: "500px" }}>{libelleProcesus}</td>
          {/**Processus */}
          <td>{libelleSource}</td>
          {/**Source*/}
          <td style={{ width: "500px" }}>{descriptionFNC}</td>
          {/**Description fnc */}
          <td>{correction}</td>
          {/**Correction */}
          <td>{actionCorrective}</td>
          {/**Action corrective*/}
          <td>{cause}</td>
          {/**Cause */}
          <td>{this.transFormEcheance(echeances)}</td>
          {/**numero de fiche */}
          <td>{dateFinAnalyse}</td>
          {/**Echeances actions*/}
          <td>{this.transformLibelleStatut(statut)}</td>
          <td>{this.displayNomPrenom(idActeur)}</td>
          <td>{this.displayNomPrenom(idActeurDelegataire)}</td>
          <td>{dateDeclaration}</td>
          <td>{dateClotureDef}</td>
          <td>{echeanceFnc}</td>
          <td>{this.transformLibelleStatut(statutFnc)}</td>
          <td>{statutEva}</td>
          {/* <td>{descriptionFNC}</td>
          <td>{echeanceFnc}</td>
          <td>{libelleSource}</td>
          <td>{libelleSource}</td>
          <td>{numeroId}</td>
          <td>{descriptionFNC}</td>
          <td>{echeanceFnc}</td>
          <td>{libelleSource}</td>
          <td>{libelleSource}</td> */}
        </tr>
      );
    });
  }

  renderTableHeader() {
    let header = Object.entries(LibelleData);
    return header.map((key, index) => {
      return (
        <th
          key={index}
          style={{
            backgroundColor: "#d9531e",
            border: "1px solid #ddd",
            padding: "10px",
            width: "auto"
          }}
        >
          {key[1]}
        </th>
      );
    });
  }

  render() {
    return (
      <div>
        <ReactHTMLTableToExcel
          id="test-table-xls-button"
          className="btn btn-primary m-3"
          table="etatFnc"
          filename="tablexls"
          sheet="tablexls"
          buttonText="Exporter les états"
        />
        <h1 id="title">Mise en forme etat fnc</h1>
        <table id="etatFnc">
          <tbody>
            <tr>{this.renderTableHeader()}</tr>
            {this.renderTableData()}
          </tbody>
        </table>
      </div>
    );
  }
}
