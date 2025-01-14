import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importação necessária
import { SignalrService } from './signalr.service';
import { DefaultDeserializer } from 'v8';

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
  status?: string; // Se for opcional, use o "?".
  idGruposTrabalhos: any[]; // Ajuste conforme o tipo correto (atualmente é um array vazio no exemplo).
  possuiLink: any; // Ajuste conforme o tipo correto (atualmente é `null` no exemplo).
}

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [CommonModule],
})
export class AppComponent implements OnInit, OnDestroy {
  public messages: BaseMicroserviceEvent[] = [];

  constructor(private signalrService: SignalrService) {}

  ngOnInit(): void {
    this.signalrService.startConnection();
  
    this.signalrService.getMessages().subscribe((message: any) => {
      try {
        // Verifica se a mensagem é uma string JSON ou um objeto
        debugger;
        const parsedMessages: BaseMicroserviceEvent[] = 
          typeof message === 'string' ? JSON.parse(message) : message;
  
        // Atualiza a lista de mensagens
        this.messages = parsedMessages;
  
        console.log(this.messages);
      } catch (error) {
        console.error('Erro ao processar mensagem:', error);
      }
    });
  }
  

  ngOnDestroy(): void {
    this.signalrService.stopConnection();
  }
}
