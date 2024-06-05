using Microsoft.AspNetCore.Mvc;
using SmartSchool.WebAPI.Models;
using System.Collections.Generic;
using System.Linq;

namespace SmartSchool.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AlunoController : Controller
    {
        public List<Aluno> Alunos = new List<Aluno>()
        {
            new Aluno(){
                Id = 1, Nome = "Bruno", Sobrenome = "Junior", Telefone = "11993936883"},
            new Aluno(){
                Id = 2, Nome = "Bernadete", Sobrenome = "Mendes", Telefone = "1199878999"},
            new Aluno(){
                Id = 3, Nome = "Marcia Santos", Sobrenome = "Caldeira", Telefone = "11993456565"},
            new Aluno(){
                Id = 4, Nome = "Roberto", Sobrenome = "Silva", Telefone = "11993937899"}
        };

        [HttpGet]
        public ActionResult Get()
        {
            return Ok(Alunos);
        }

        [HttpGet("byId/{id}")]
        public ActionResult GetById(int id)
        {
            var aluno = Alunos.FirstOrDefault(a => a.Id == id);

            if (aluno == null) return BadRequest($"Aluno com este Id {id} não encontrado");

            return Ok(aluno);
        }

        [HttpGet("byName")]
        public ActionResult GetByName(string nome, string sobrenome)
        {
            var aluno = Alunos.FirstOrDefault(a => 
                a.Nome.Contains(nome) && a.Sobrenome.Contains(sobrenome));

            if (aluno == null) return BadRequest($"Aluno com este nome/sobrenome {nome}/{sobrenome} não encontrado");

            return Ok(aluno);
        }


        [HttpPost]
        public ActionResult Post(Aluno aluno)
        {
            return Ok(aluno);
        }

        [HttpPut("{id}")]
        public ActionResult Put(int id, Aluno aluno)
        {
            return Ok(aluno);
        }

        [HttpPatch("{id}")]
        public ActionResult Patch(int id, Aluno aluno)
        {
            return Ok(aluno);
        }

        [HttpDelete("{id}")]
        public ActionResult Delete(int id)
        {
            return Ok();
        }
    }
}
