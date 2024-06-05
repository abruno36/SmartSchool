namespace SmartSchool.WebAPI.Models
{
    public class AlunoDisciplina
    {
        public AlunoDisciplina(){}

        public AlunoDisciplina(int aluniId, int disciplinaId)
        {
            AlunoId = aluniId;
            DisciplinaId = disciplinaId;
        }
        public int AlunoId { get; set; }
        public Aluno Aluno { get; set; }
        public int DisciplinaId { get; set; }
        public Disciplina Disciplina { get; set; }
    }
}
