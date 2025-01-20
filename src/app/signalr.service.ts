import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {

  private hubConnection: HubConnection | undefined;
  private messageSubject: Subject<string> = new Subject<string>();
  private messageGlobalSubject: Subject<string> = new Subject<string>();

  constructor() { }

  // Iniciar a conexão com o SignalR
  public startConnection(): void {
    // Verificar se a conexão já foi estabelecida antes de tentar conectar novamente
    if (this.hubConnection?.state === "Connected") {
      console.log("Já conectado ao SignalR.");
      return; // Já está conectado
    }

    this.hubConnection = new HubConnectionBuilder()
      .withUrl('http://univmdockp01:8052/notifications')  // A URL do BFF
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

    this.hubConnection.on('ReceiveMessageGlobalSiaBFF', (message: string) => {
      console.log('Mensagem recebida: ', message);
      this.messageGlobalSubject.next(message);  // Emite a mensagem recebida
    });
    
  }

  // Observable para fornecer as mensagens recebidas aos componentes
  public getMessages(): Observable<string> {
    return this.messageSubject.asObservable();
  }

  public getGlobalMessages(): Observable<string> {
    return this.messageGlobalSubject.asObservable();
  }

  // Parar a conexão
  public stopConnection(): void {
    // Verifica se a conexão está em andamento antes de tentar parar
    if (this.hubConnection?.state === "Connected") {
      this.hubConnection.stop()
        .then(() => {
          console.log("Conexão SignalR parada com sucesso.");
        })
        .catch(err => {
          console.log("Erro ao parar a conexão SignalR:", err);
        });
    } else {
      console.log("Nenhuma conexão ativa para ser parada.");
    }
  }
}
