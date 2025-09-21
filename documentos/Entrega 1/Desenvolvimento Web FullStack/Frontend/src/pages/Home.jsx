import React from "react";
import Header from "../components/Header";
import "./Home.css"; // aqui importa o css
import { Link } from "react-router-dom";



function Home() {
  return (
    <div>
    

      <main>
        <h1>Bem-vindo ao Projeto Auria</h1>
        <p>Transparência, controle e seguranção: é o nosso dever</p>

        {/* Botões de login */}
        <div className="buttons">
          <Link to="/login-admin">
  <button>Administrador</button>
</Link>

         <Link to="/login-colab">
  <button>Colaborador</button>
</Link>

        </div>

        {/* Cards */}
        <section className="cards">
          <div>87.763 kg Arrecadados</div>
          <div>1.950 Famílias Alimentadas</div>
          <div>7.800 Pessoas Alimentadas</div>
          <div>+1.600 Alunos Participantes</div>
        </section>
      </main>
    </div>
  );
}

export default Home;
