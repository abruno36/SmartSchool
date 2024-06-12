import { Disciplina } from './Disciplina';

export class Professor {
  id: number;
  nome: string;
  sobrenome: string;
  disciplinas: Disciplina[];

  constructor(id: number, nome: string, sobrenome: string) {
    this.id = id;
    this.nome = nome;
    this.sobrenome = sobrenome;
  }

}
