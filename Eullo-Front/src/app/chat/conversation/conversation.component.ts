import {
  Component,
  ComponentFactoryResolver,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {WebSocketService} from "../../services/web-socket.service";
import {MessageComponent} from "./message/message.component";
import {UserItem} from "../../models/user-item.interface";
import {AuthService} from "../../services/authentication/auth.service";
import {ChatService} from "../../services/chat.service";
import {Observable} from "rxjs";
import {Message} from "../../models/message.interface";
import {User} from "../../models/user.interface";
import * as forge from "node-forge";

const pki = forge.pki
const rsa = pki.rsa;
@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.css']
})
export class ConversationComponent implements OnInit {

  message: string = "";

  users: Observable<UserItem[]> | undefined

  @Output()
  newMessage = new EventEmitter<string>();

  conversation: Observable<Message[]> | undefined;

  partner: UserItem | undefined;

  @ViewChild('messagesContainer', {read: ViewContainerRef})
  entry: ViewContainerRef | undefined;

  constructor(private resolver: ComponentFactoryResolver,
              private webSocketService: WebSocketService,
              private authService: AuthService,
              private chatService: ChatService) {
  }

  ngOnInit(): void {
    this.users = this.chatService.users;
    this.chatService.loadUsersItems();
    this.conversation = this.chatService.conversation;
    this.chatService.partner.subscribe(
      data => {
        this.partner = data;
        if (data.username && data.lastReceivedMessage) {
          this.chatService.loadConversation(data.username);
        }
      }
    )
  }

  setPartner(partner: UserItem) {
    this.chatService.setPartner(partner);
  }

  newMessageComponent() {
    const factory = this.resolver.resolveComponentFactory(MessageComponent);
    // @ts-ignore
    return this.entry.createComponent(factory);
  }

  sendMessage() {
    if (this.message){
      //get private key from local storage
      //encrypt message
      console.log(this.message)
      const partner_certificate = localStorage.getItem('partner')
      const public_key_pem = localStorage.getItem('pub_key')
      // @ts-ignore
      const certif = pki.certificateFromPem(partner_certificate)
      // @ts-ignore
      const pub_key = pki.publicKeyFromPem(public_key_pem)
      // @ts-ignore
      const receiver_encrypted = certif.publicKey.encrypt(this.message)
      const sender_encrypted = pub_key.encrypt(this.message)

      this.webSocketService.emit('message', {
        'receiver_encrypted': receiver_encrypted, // set this to the encrypted message
        'sender_encrypted': sender_encrypted, // set this to the encrypted message
        'receiver': this.partner?.username,
        'sender': this.authService.credentials?.username
      })
      const componentRef = this.newMessageComponent();
      componentRef.instance.message = this.message;
      componentRef.instance.status = "sent";
      this.newMessage.next(this.message);
      this.message = "";
    }
  }

  receiveMessage(message: string) {
    console.log('Received A new Message')
    const componentRef = this.newMessageComponent();
    componentRef.instance.message = message;
    componentRef.instance.status = "received";
    // this.message = "";
  }
}
