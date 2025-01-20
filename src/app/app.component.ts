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
  status?: string; // Se for opcional, use o "?".
  idGruposTrabalhos: any[]; // Ajuste conforme o tipo correto (atualmente é um array vazio no exemplo).
  possuiLink: any; // Ajuste conforme o tipo correto (atualmente é `null` no exemplo).
}

interface GlobalMicroserviceEvent {
  eventId: string;
  descricao: string;
  observacao: string;
  status?: string; 
  dataUltimaImportacao?: string; 
  horaUltimaImportacao?: string; 
  provavelHorarioProximaImportacao?: string; 
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
  public globalMessage: GlobalMicroserviceEvent | null = null; // Defina como null inicialmente
  public aquiVariavelquevenhadocomponente: string = ''; // Variável para armazenar a última atualização

  constructor(private signalrService: SignalrService) {}

  ngOnInit(): void {
    this.signalrService.startConnection();
  
    // Subscrição para receber mensagens do tipo BaseMicroserviceEvent
    this.signalrService.getMessages().subscribe((message: any) => {
      try {
        // Verifica se a mensagem é uma string JSON ou um objeto
        const parsedMessages: BaseMicroserviceEvent[] = 
          typeof message === 'string' ? JSON.parse(message) : message;
  
        // Atualiza a lista de mensagens
        this.messages = parsedMessages;
  
        console.log(this.messages); // Exibe a lista de mensagens
      } catch (error) {
        console.error('Erro ao processar mensagem:', error);
      }
    });

    // Subscrição para receber mensagens do tipo GlobalMicroserviceEvent
    this.signalrService.getGlobalMessages().subscribe((message: any) => {
      try {
        // Verifica se a mensagem é uma string JSON ou um objeto
        const parsedMessage: GlobalMicroserviceEvent = 
          typeof message === 'string' ? JSON.parse(message) : message;
  
        // Atualiza a variável globalMessage
        this.globalMessage = parsedMessage;
  
        // Loga a mensagem global para visualização
        console.log(this.globalMessage); // Corrigido para exibir globalMessage
      } catch (error) {
        console.error('Erro ao processar mensagem global:', error);
      }
    });
  }

  ngOnDestroy(): void {
    this.signalrService.stopConnection();
  }
}
