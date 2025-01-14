import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {

  private hubConnection: HubConnection | undefined;
  private messageSubject: Subject<string> = new Subject<string>();

  constructor() { }

  // Iniciar a conexão com o SignalR
  public startConnection(): void {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl('http://unidockdev01:8052/notifications')  // A URL do BFF
      .build();

    // Quando a conexão for estabelecida, ouça os métodos do backend
    this.hubConnection
      .start()
      .then(() => {
        console.log("Conectado ao SignalR");
      })
      .catch(err => {
        console.log("Erro ao conectar: ", err);
      });

    // Ouça o método 'ReceiveMessageSiaBFF' do SignalR no backend
    this.hubConnection.on('ReceiveMessageSiaBFF', (message: string) => {
      console.log('Mensagem recebida: ', message);
      this.messageSubject.next(message);  // Emite a mensagem recebida
    });
  }

  // Observable para fornecer as mensagens recebidas aos componentes
  public getMessages(): Observable<string> {
    return this.messageSubject.asObservable();
  }

  // Parar a conexão
  public stopConnection(): void {
    if (this.hubConnection) {
      this.hubConnection.stop();
    }
  }
}
