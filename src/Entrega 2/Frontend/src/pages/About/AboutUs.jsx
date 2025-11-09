export default function AboutUs() {
  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1>Sobre o Áuria</h1>
        <p className="lead">
          Conheça nossa missão, valores e equipe que torna tudo possível.
        </p>
      </div>

      <section className="mb-5">
        <h2 className="mb-3">Nossa Missão</h2>
        <p>
          O Áuria tem como missão fornecer soluções inovadoras e sustentáveis
          para gestão de equipes e recursos, garantindo eficiência, transparência
          e satisfação de todos os envolvidos.
        </p>
      </section>

      <section className="mb-5">
        <h2 className="mb-3">Nossos Valores</h2>
        <ul>
          <li>Transparência em todas as operações</li>
          <li>Inovação constante</li>
          <li>Compromisso com a sustentabilidade</li>
          <li>Valorização das pessoas e do trabalho em equipe</li>
        </ul>
      </section>

      <section>
        <h2 className="mb-3">Nossa Equipe</h2>
        <p>
          Contamos com profissionais qualificados e apaixonados pelo que fazem.
          Juntos, trabalhamos para criar uma plataforma confiável e eficiente
          que transforma a forma como empresas e colaboradores interagem.
        </p>
      </section>
    </div>
  );
}
