import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {ReactiveFormsModule, FormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { RegisterComponent } from './pages/register/register.component';
import { NavbarComponent } from './pages/navbar/navbar.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ChatListComponent } from './pages/chat/chat-list/chat-list.component';
import { ChatItemComponent } from './pages/chat/chat-list/chat-item/chat-item.component';
import {MatCardModule} from '@angular/material/card';
import {MatDividerModule} from '@angular/material/divider';
import {MatMenuModule} from '@angular/material/menu';
import { ConversationComponent } from './pages/chat/conversation/conversation.component';
import { ChatComponent } from './pages/chat/chat.component';
import {MessageComponent} from "./pages/chat/conversation/message/message.component";
import {HttpClientModule} from "@angular/common/http";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatBadgeModule} from '@angular/material/badge';
import {MatSelectModule} from '@angular/material/select';
import {MatOptionModule} from "@angular/material/core";
import {AuthService} from "./core/services/auth.service";
import {CryptoService} from "./core/services/crypto.service";
import {ChatListService} from "./core/services/chat-list.service";


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    NavbarComponent,
    ChatListComponent,
    ChatItemComponent,
    ConversationComponent,
    ChatComponent,
    MessageComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatCardModule,
    FontAwesomeModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatBadgeModule,
    MatSelectModule,
    MatOptionModule
  ],
  providers: [
    AuthService,
    CryptoService,
    ChatListService

  ],
  bootstrap: [AppComponent ]
})
export class AppModule {

}
