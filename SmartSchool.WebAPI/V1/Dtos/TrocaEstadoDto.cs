using System;

namespace SmartSchool.WebAPI.V1.Dtos
{
    /// <summary>
    /// Este é o DTO de mudança de estado do Aluno (ativo).
    /// </summary>
    public class TrocaEstadoDto
    {
        public bool Estado { get; set; }
        public DateTime? DataFim { get; set; } = null;
    }
}