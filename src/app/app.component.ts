import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importação necessária
import { SignalrService } from './signalr.service';

// Interface representando a estrutura da mensagem
interface BaseMicroserviceEvent {
  eventId: string;
  dataInclusao: string;
  dataExpiracao: string;
  hora: string;
  idUsuario: string;
  rotaMicroservico: string;
  descricao: string;
  observacao: string;
}

@Component({
  selector: 'app-root',
  standalone: true,  // Torna este componente standalone
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [CommonModule], // Importa CommonModule para usar *ngFor
})
export class AppComponent implements OnInit, OnDestroy {

  // Agora messages é uma lista de BaseMicroserviceEvent
  public messages: BaseMicroserviceEvent[] = [];

  constructor(private signalrService: SignalrService) { }

  ngOnInit(): void {
    // Inicia a conexão com o SignalR quando o componente for carregado
    this.signalrService.startConnection();
  
    // Subscreve-se para receber as mensagens do SignalR
    this.signalrService.getMessages().subscribe((message: string) => {
      // Transforma a mensagem recebida de string para uma lista de objetos JSON
      const parsedMessages: BaseMicroserviceEvent[] = JSON.parse(message); // Assume-se que a mensagem é um JSON válido que contém uma lista
  
      this.messages = []; 
      
      // Itera sobre cada mensagem da lista e adiciona à propriedade messages
      parsedMessages.forEach(msg => {
        this.messages.push(msg);
      });
  
      console.log(this.messages);
    });
  }

  ngOnDestroy(): void {
    // Quando o componente for destruído, pare a conexão do SignalR
    this.signalrService.stopConnection();
  }
}
