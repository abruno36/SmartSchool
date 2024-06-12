import { Component, OnInit, OnDestroy } from '@angular/core';
import { Professor } from '../../models/Professor';
import { Subject } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ProfessorService } from '../../services/professor.service';
import { takeUntil } from 'rxjs/operators';
import { Util } from '../../util/util';
import { Disciplina } from '../../models/Disciplina';
import { Router } from '@angular/router';

@Component({
  selector: 'app-professores',
  templateUrl: './professores.component.html',
  styleUrls: ['./professores.component.css']
})
export class ProfessoresComponent implements OnInit, OnDestroy {

  public titulo = 'Professores';
  public professorSelecionado: Professor;
  private unsubscriber = new Subject<void>();

  public professores: Professor[] = [];

  constructor(
    private router: Router,
    private professorService: ProfessorService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService) {}

  carregarProfessores(): void {
    this.spinner.show();
    this.professorService.getAll()
      .pipe(takeUntil(this.unsubscriber))
      .subscribe({
        next: (professores: Professor[]) => {
          this.professores = professores;
          this.toastr.success('Professores foram carregados com Sucesso!');
        },
        error: (error: any) => {
          this.toastr.error('Professores não carregados!');
          console.error(error);
          this.spinner.hide();
        },
        complete: () => this.spinner.hide()
      });
  }

  ngOnInit() {
    this.carregarProfessores();
  }

  ngOnDestroy(): void {
    this.unsubscriber.next();
    this.unsubscriber.complete();
  }

  disciplinaConcat(disciplinas: Disciplina[]) {
    return Util.nomeConcat(disciplinas);
  }

    // Método para obter o nome completo do professor
  getProfessorNomeCompleto(professor: Professor): string {
    const nomeCompleto =  `${professor.nome} ${professor.sobrenome}`;
    return nomeCompleto;
  }
}
