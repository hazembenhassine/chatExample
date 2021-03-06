import {Inject, Injectable, Injector} from "@angular/core";
import * as forge from "node-forge";
import {User} from "../models/user.model";

const pki = forge.pki
const rsa = pki.rsa;

const KEY_SIZE = 2048;

@Injectable()
export class CryptoService {
  private _privateKey: any;
  private _publicKey;
  private _certificate;

  constructor() {
    // @ts-ignore
    const savedCredentials = localStorage.getItem('user');
    if (savedCredentials) {
      const user: User = JSON.parse(savedCredentials);
      this._certificate = pki.certificateFromPem(user.certificate);
      this._publicKey = this._certificate.publicKey;
      this._privateKey = pki.privateKeyFromPem(user.privateKey);
    }
  }

  // @ts-ignore
  decryptPrivateKey(encryptedPrivateKeyPem: string, password: string) {
    return  pki.privateKeyToPem(pki.decryptRsaPrivateKey(encryptedPrivateKeyPem, password));
  }

  set certificate(certificatePem: string) {
    this._certificate = pki.certificateFromPem(certificatePem);
  }

  generateCertificateRequestAndEncryptedPrivateKeyPEM(username: string, password: string) {
    const keyPair = rsa.generateKeyPair(KEY_SIZE);
    this._publicKey = keyPair.publicKey;
    this._privateKey = keyPair.privateKey;
    const certificateRequest = pki.createCertificationRequest();
    certificateRequest.publicKey = this._publicKey;
    certificateRequest.setSubject([{
      name: 'commonName',
      value: username
    }, {
      name: 'countryName',
      value: 'TN'
    }, {
      name: 'localityName',
      value: 'Tunis'
    }, {
      name: 'organizationName',
      value: 'Eullo'
    }, {
      shortName: 'OU',
      value: 'Test'
    }]);
    certificateRequest.sign(this._privateKey);
    const encryptedPrivateKey = pki.encryptRsaPrivateKey(keyPair.privateKey, password);
    return {certificateRequest: pki.certificationRequestToPem(certificateRequest), encryptedPrivateKey};
  }

  generateEncryptedPrivateKey(password: string) {
    if (this._privateKey)
      return pki.encryptRsaPrivateKey(this._privateKey, password);
    return null;
  }

  encrypt(message: string, senderCertificate: string) {
    const certificate = pki.certificateFromPem(senderCertificate);
    const publicKey = certificate.publicKey;
    // @ts-ignore
    return forge.util.encode64(publicKey.encrypt(message));
  }

  decrypt(encryptedMessage: string) {
    // @ts-ignore
    return this._privateKey?.decrypt(forge.util.decode64(encryptedMessage));
  }

  hash(message: string) {
    const md = forge.md.sha512.create();
    md.update(message);
    return md.digest().toHex();
  }

}
