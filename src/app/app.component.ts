import { Component, OnInit, OnDestroy } from '@angular/core';
import { SignalrService } from './signalr.service';

// Interface representando a estrutura da mensagem
interface BaseMicroserviceEvent {
  RotaMicroservico: string;
  Descricao: string;
  IdUsuario: string;
  Observacao: string;
}

@Component({
  selector: 'app-root',
  standalone: true,  // Torna este componente standalone
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  // Agora message é do tipo BaseMicroserviceEvent para ser facilmente acessado no HTML
  public message: BaseMicroserviceEvent | null = null;

  constructor(private signalrService: SignalrService) { }

  ngOnInit(): void {
    // Inicia a conexão com o SignalR quando o componente for carregado
    this.signalrService.startConnection();

    // Subscreve-se para receber as mensagens do SignalR
    this.signalrService.getMessages().subscribe((message: string) => {
      // Transforma a mensagem recebida de string para objeto JSON
      this.message = JSON.parse(message); // Aqui assume-se que a mensagem é um JSON válido
    });
  }

  ngOnDestroy(): void {
    // Quando o componente for destruído, pare a conexão do SignalR
    this.signalrService.stopConnection();
  }
}
