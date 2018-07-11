import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import './eos.js';
/**
 * `create-account-check`
 * 
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class CreateAccountCheck extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
        input {
          width: 300px;
        }
      </style>
  
        <fieldset>
          <legend>EOS: Connect and make an account</legend>
          <p>
            <input type="text" name="creatorAccountName" id="creatorAccountName">
            <label for="creatorAccountName">creatorAccountName</label>
          </p>
          <p>
            <input type="text" name="keyProvider" id="keyProvider">
            <label for="keyProvider">keyProvider</label>
          </p>
          <hr>
          <p>
            <input type="text" name="newAccountName" id="newAccountName">
            <label for="newAccountName">newAccountName</label>
          </p>
          <p>
            <input type="text" name="ownerPublicKey" id="ownerPublicKey">
            <label for="ownerPublicKey">ownerPublicKey</label>
          </p>
          <p>
            <input type="text" name="activePublicKey" id="activePublicKey">
            <label for="activePublicKey">activePublicKey</label>
          </p>
          <p> 
            <button type="button" on-click="_start">Make Account</button> 
          </p>
        </fieldset>
    `;
  }
  static get properties() {
    return {
      prop1: {
        type: String,
        value: 'create-account-check',
      },
    };
  }

  _start() {
    this._connect()
    .then((eos) =>{
      return this._makeAccount(eos)
    })
    .then((result) =>{
      console.log(result)
    })
    .catch((err) =>{
      console.log(err)
    })
  }


  _connect(){
    return new Promise((resolve, reject) => {

      const keyProvider = this.shadowRoot.querySelector('#keyProvider').value;
      const httpEndpoint = "https://api.eosnewyork.io";
      const broadcast = true;
      const sign = true;
      const chainId = "aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906";
      const expireInSeconds = 30;

      this.eos = Eos({keyProvider, httpEndpoint, broadcast, sign, chainId, expireInSeconds})
      resolve(this.eos);
    })
  }



  _makeAccount(eos) {
    return new Promise((resolve, reject) => {

      const creator = payer = from = this.shadowRoot.querySelector('#creatorAccountName').value;
      const name = receiver = this.shadowRoot.querySelector('#newAccountName').value;
      const owner = this.shadowRoot.querySelector('#ownerPublicKey').value;
      const active = this.shadowRoot.querySelector('#activePublicKey').value;
      const bytes = 8000;
      const stake_net_quantity = '0.0200 EOS';
      const stake_cpu_quantity = '0.0200 EOS';
      const transfer = 0;

      eos.transaction(tr => {
        tr.newaccount({creator, name, owner, active})
        tr.buyrambytes({payer, receiver, bytes})
        tr.delegatebw({from, receiver, stake_net_quantity, stake_cpu_quantity, transfer})
      })
      .then((response) => {
        resolve(response)
      })
      .catch((err) => {
        reject(err)
      })
    })
  }

} window.customElements.define('create-account-check', CreateAccountCheck);
