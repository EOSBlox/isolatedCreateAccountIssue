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
      <form>
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
            <button type="submit" on-click="_start">Make Account</button> 
          </p>

        </fieldset>
      </form>
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
      console.log(eos)
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
    console.log(this.shadowRoot.querySelector('#keyProvider').value)
    return new Promise((resolve, reject) => {
      const config = {
        keyProvider: this.shadowRoot.querySelector('#keyProvider').value, 
        httpEndpoint: "https://api.eosnewyork.io",
        broadcast: true,
        sign: true,
        chainId: "aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906",
        expireInSeconds: 30
      }
      this.eos = Eos(config)
      console.log(this.eos)
      resolve(this.eos);
    })
  }



  _makeAccount(eos) {
    console.log(eos)
    eos.transaction(tr => {
      tr.newaccount({
        creator: this.shadowRoot.querySelector('#creatorAccountName').value,
        name: this.shadowRoot.querySelector('#newAccountName').value,
        owner: this.shadowRoot.querySelector('#ownerPublicKey').value,
        active: this.shadowRoot.querySelector('#activePublicKey').value,
      })
      tr.buyrambytes({
        payer: this.shadowRoot.querySelector('#creatorAccountName').value,
        receiver: this.shadowRoot.querySelector('#newAccountName').value,
        bytes: 8000
      })
      tr.delegatebw({
        from: this.shadowRoot.querySelector('#creatorAccountName').value,
        receiver: this.shadowRoot.querySelector('#newAccountName').value,
        stake_net_quantity: '0.0200 EOS',
        stake_cpu_quantity: '0.0200 EOS',
        transfer: 0
      })
    })
    .then((response) =>{
      console.log("response")
      console.log(response)
    })
    .catch((err) =>{
      console.log("err")
      console.log(err)
    })
  }

} window.customElements.define('create-account-check', CreateAccountCheck);
