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
      
      var keyProvider = this.shadowRoot.querySelector('#keyProvider').value;
      var httpEndpoint = "https://api.eosnewyork.io";
      var broadcast = true;
      var sign = true;
      var chainId = "aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906";
      var expireInSeconds = 30;

      this.eos = Eos({keyProvider, httpEndpoint, broadcast, sign, chainId, expireInSeconds})
      resolve(this.eos);
    })
  }



  _makeAccount(eos) {
    return new Promise((resolve, reject) => {

      var creator = payer = from = this.shadowRoot.querySelector('#creatorAccountName').value;
      var name = receiver = this.shadowRoot.querySelector('#newAccountName').value;
      var owner = this.shadowRoot.querySelector('#ownerPublicKey').value;
      var active = this.shadowRoot.querySelector('#activePublicKey').value;
      var bytes = 8000;
      var stake_net_quantity = '0.0200 EOS';
      var stake_cpu_quantity = '0.0200 EOS';
      var transfer = 0;

      eos.transaction(tr => {
        tr.newaccount({creator, name, owner, active})
        tr.buyrambytes({payer, receiver, bytes})
        tr.delegatebw({from, receiver, stake_net_quantity, stake_cpu_quantity, transfer})
      })
      .then((response) =>{
        console.log(response)
        resolve(response)
      })
      .catch((err) =>{
        console.log(err)
        reject(err)
      })
    })
  }

} window.customElements.define('create-account-check', CreateAccountCheck);
