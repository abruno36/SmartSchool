import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Aluno } from 'src/app/models/Aluno';
import { PaginatedResult, Pagination } from 'src/app/models/Pagination';
import { Professor } from 'src/app/models/Professor';
import { AlunoService } from '../../services/aluno.service';
import { ProfessorService } from '../../services/professor.service';


@Component({
  selector: 'app-alunos',
  templateUrl: './alunos.component.html',
  styleUrls: ['./alunos.component.css']
})
export class AlunosComponent implements OnInit, OnDestroy {
  
  public modalRef!: BsModalRef;
  public alunoForm!: FormGroup;
  public titulo = 'Alunos';
  public alunoSelecionado!: Aluno;
  public textSimple!: string;
  public profsAlunos!: Professor[];
  public alunos!: Aluno[];
  public aluno!: Aluno;
  public modeSave = 'post';
  public msnDeleteAluno!: string;
  pagination!: Pagination;

  private unsubscriber = new Subject<void>();

  constructor(
    private alunoService: AlunoService,
    private route: ActivatedRoute,
    private professorService: ProfessorService,
    private fb: FormBuilder,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {
    this.criarForm();
  }

  ngOnInit(): void {
    this.pagination = { currentPage: 1, itemsPerPage: 10 } as Pagination;
    this.carregarAlunos();
  }

  professoresAlunos(template: TemplateRef<any>, id: number): void {
    this.spinner.show();
    this.professorService.getByAlunoId(id)
      .pipe(takeUntil(this.unsubscriber))
      .subscribe({
        next: (professores: Professor[]) => {
          this.profsAlunos = professores;
          this.modalRef = this.modalService.show(template);
        },
        error: (error: any) => {
          this.toastr.error(`Erro: ${error.message}`);
          console.error(error.message);
          this.spinner.hide();
        },
        complete: () => this.spinner.hide()
      });
  }

  criarForm(): void {
    this.alunoForm = this.fb.group({
      id: [0],
      nome: ['', Validators.required],
      sobrenome: ['', Validators.required],
      telefone: ['', Validators.required],
      ativo: []
    });
  }

  trocarEstado(aluno: Aluno) {
    this.spinner.show();
    this.alunoService.trocarEstado(aluno.id, !aluno.ativo)
      .pipe(takeUntil(this.unsubscriber))
      .subscribe({
        next: (resp) => {
          console.log(resp);
          this.carregarAlunos();
          this.toastr.success('Aluno salvo com sucesso!');
        },
        error: (error: any) => {
          this.toastr.error('Erro: Aluno não pode ser salvo!');
          console.error(error);
          this.spinner.hide();
        },
        complete: () => this.spinner.hide()
      });
  }

  saveAluno(): void {
    if (this.alunoForm.valid) {
      this.spinner.show();

      if (this.modeSave === 'post') {
        this.aluno = {...this.alunoForm.value};
      } else {
        this.aluno = {id: this.alunoSelecionado.id, ...this.alunoForm.value};
      }

      this.alunoService[this.modeSave](this.aluno)
        .pipe(takeUntil(this.unsubscriber))
        .subscribe(
          () => {
            this.carregarAlunos();
            this.toastr.success('Aluno salvo com sucesso!');
          },
          (error: any) => {
            this.toastr.error(`Erro: Aluno não pode ser salvo!`);
            console.error(error);
            this.spinner.hide();
          },
          () => this.spinner.hide()
        );

    }
  }

   carregarAlunos(): void {
    const alunoId = +this.route.snapshot.paramMap.get('id');
    
    this.spinner.show();
    this.alunoService.getAll(this.pagination.currentPage, this.pagination.itemsPerPage)
      .pipe(takeUntil(this.unsubscriber))
      .subscribe({
        next: (alunos: PaginatedResult<Aluno[]>) => {
          this.alunos = alunos.result;
          this.pagination = alunos.pagination;

          if (alunoId > 0) {
            this.alunoSelect(alunoId);
          }

          this.toastr.success('Alunos foram carregados com Sucesso!');
        },
        error: (error: any) => {
          this.toastr.error('Alunos não carregados!');
          console.error(error);
          this.spinner.hide();
        },
        complete: () => this.spinner.hide()
      });
  }


  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.carregarAlunos();
  }

  alunoSelect(alunoId: number): void {
    this.modeSave = 'patch';
    this.alunoService.getById(alunoId).subscribe(
      (alunoReturn) => {
        this.alunoSelecionado = alunoReturn;
        this.alunoForm.patchValue(this.alunoSelecionado);
      },
      (error) => {
        this.toastr.error('Alunos não carregados!');
        console.error(error);
        this.spinner.hide();
      },
      () => this.spinner.hide()
    );
  }

  voltar(): void {
    this.alunoSelecionado = null;
  }

  openModal(template: TemplateRef<any>, alunoId: number): void {
    this.professoresAlunos(template, alunoId);
  }

  closeModal(): void {
    this.modalRef.hide();
  }

  ngOnDestroy(): void {
    this.unsubscriber.next();
    this.unsubscriber.complete();
  }


}
