// src/pages/AboutUs.jsx
import React from "react";
import logo from "../../assets/logofundo.png"; // <-- Substitua pelo caminho da sua logo


export default function AboutUs() {
  const primaryColor = "#22B77E";
  const textColor = "#333";

  const membros = [
    {
      nome: "Endrew",
      cargo: "Frontend Developer",
      imgUrl:
        "https://media.licdn.com/dms/image/v2/D5603AQF8rq6ZYXWVPw/profile-displayphoto-shrink_200_200/B56Zbg.kchGoAY-/0/1747531221646?e=1763596800&v=beta&t=zGjZ-gatuXsDArAqDb3VDFHVXZKJDoUKYCVQYonMdS4",
      link: "https://www.linkedin.com/in/endrewsantosn/", // 🔗 Substitua pelo seu LinkedIn
    },
    {
      nome: "Mariana",
      cargo: "Designer UI/UX",
      imgUrl:
        "https://media.licdn.com/dms/image/v2/D4D03AQFBkVDQC6hrMg/profile-displayphoto-shrink_200_200/B4DZcCJE5mHEAY-/0/1748087624031?e=1763596800&v=beta&t=dF-u4xwCQIbUg2hNg7_9wiOLeKFRY3z74X94hTTY_UQ",
      link: "https://www.linkedin.com/in/mariana-almeidanascimento/", // substitua
    },
    {
      nome: "Gustavo",
      cargo: "Full Stack Developer",
      imgUrl:
        "https://media.licdn.com/dms/image/v2/D4D03AQEBwWMTnU7bOQ/profile-displayphoto-scale_200_200/B4DZoS2tdHJUAY-/0/1761252936060?e=1763596800&v=beta&t=g2Uemo94oxqxo57tBSpzQTbmr1LaV8qsoXDR3czp3go",
      link: "https://www.linkedin.com/in/gustavo-archangelo/", // substitua
    },
    {
      nome: "Luiz",
      cargo: "Backend Developer",
      imgUrl:
        "https://media.licdn.com/dms/image/v2/D4E35AQE-XqzhE02kvA/profile-framedphoto-shrink_200_200/B4EZcULws_H0Ak-/0/1748390317188?e=1762819200&v=beta&t=PIt35VviACZgti5_KwxzRHC4O3K4XT78NGUipNIenWs",
      link: "https://www.linkedin.com/in/luiz-antonio-b57bb4312/", // substitua
    },
    {
      nome: "Artur",
      cargo: "Full Stack Developer",
      imgUrl:
        "https://media.licdn.com/dms/image/v2/D4D03AQHkY0gx8OY9gw/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1721687292038?e=1763596800&v=beta&t=vqM-O4sJpqS5qorcg_nEVbOzGT9pyHm63ETCpLBmShM",
      link: "https://www.linkedin.com/in/artur-loreto/", // substitua
    },
  ];

  return (
    <div
      className="container py-5"
      style={{ fontFamily: "Arial, sans-serif", color: textColor }}
    >
      {/* Cabeçalho principal */}
      <div className="text-center mb-5">
        <h1 style={{ fontWeight: 600, fontSize: "4.0rem", color: primaryColor }}>
          SOBRE O AURIA
        </h1>
        <p
          className="lead"
          style={{
            fontSize: "1.2rem",
            lineHeight: 1.6,
            marginBottom: "30px",
          }}
        >
          Conheça nossa missão, visão, valores e a equipe que torna tudo possível.
        </p>

        {/* Logo centralizada */}
        <div style={{ marginBottom: "70px" }}>
          <img
            src={logo}
            alt="Logo Áuria"
            style={{
              width: "300px",
              height: "auto",
              borderRadius: "30px",
              
            }}
          />
        </div>
      </div>

      {/* Missão, Visão e Valores */}
      <div
        className="d-flex flex-wrap justify-content-center mb-5"
        style={{ gap: "30px" }}
      >
        {[
          {
            titulo: "Missão",
            texto: `Oferecer soluções de gerenciamento e controle dos alimentos e dinheiro destinados 
            ao projeto Lideranças Empáticas, promovendo a transparência e integridade das operações.`,
          },
          {
            titulo: "Visão",
            texto: `Ser referência de projeto estudantil em 2026, reconhecido pelo desempenho, 
            inovação e responsabilidade acadêmica.`,
          },
          {
            titulo: "Valores",
            texto: (
              <ul
                style={{
                  fontSize: "1rem",
                  lineHeight: 1.6,
                  paddingLeft: 0,
                  listStyle: "none",
                  textAlign: "center",
                }}
              >
                <li>● Transparência</li>
                <li>● Segurança e ética</li>
                <li>● Acessibilidade e inclusão</li>
                <li>● Clareza nas informações</li>
                <li>● Comprometimento com resultados</li>
              </ul>
            ),
          },
        ].map((card, index) => (
          <div
            key={index}
            className="card p-4"
            style={{
              width: "280px",
              backgroundColor: "#f8f9fa",
              borderTop: `5px solid ${primaryColor}`,
              borderRadius: "12px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              textAlign: "center",
              transition: "transform 0.3s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <h2
              style={{
                fontWeight: 600,
                fontSize: "1.5rem",
                marginBottom: "15px",
                color: primaryColor,
              }}
            >
              {card.titulo}
            </h2>
            {typeof card.texto === "string" ? (
              <p style={{ fontSize: "1rem", lineHeight: 1.6, textAlign: "center" }}>
                {card.texto}
              </p>
            ) : (
              card.texto
            )}
          </div>
        ))}
      </div>

      {/* Nossa Equipe */}
      <div
        style={{
          backgroundColor: "#F0F8F5",
          borderRadius: "12px",
          padding: "50px 20px",
          textAlign: "center",
          boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
        }}
      >
        <h2
          style={{
            fontWeight: 600,
            fontSize: "2rem",
            marginBottom: "25px",
            color: primaryColor,
          }}
        >
          Nossa Equipe
        </h2>

        <p
          style={{
            fontSize: "1.1rem",
            lineHeight: 1.7,
            maxWidth: "800px",
            margin: "0 auto 40px auto",
          }}
        >
          A equipe <strong>Auria</strong> é formada por pessoas dedicadas e criativas, unidas pelo
          propósito de transformar ideias em soluções reais. Cada integrante contribui com suas
          habilidades únicas para o desenvolvimento do projeto e o fortalecimento do trabalho em equipe.
        </p>

        {/* Cards dos membros */}
        <div
          className="d-flex flex-wrap justify-content-center"
          style={{ gap: "40px" }}
        >
          {membros.map((membro, i) => (
            <div
              key={i}
              style={{
                textAlign: "center",
                transition: "transform 0.25s ease",
                cursor: "pointer",
              }}
              onClick={() => window.open(membro.link, "_blank")} // 👈 Abre o link ao clicar
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <div
                style={{
                  width: "150px",
                  height: "150px",
                  borderRadius: "50%",
                  backgroundImage: `url(${membro.imgUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  margin: "0 auto 10px auto",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                  border: `3px solid ${primaryColor}`,
                }}
              />
              <p style={{ fontWeight: 600, marginBottom: 4 }}>{membro.nome}</p>
              <p style={{ fontSize: "0.9rem", color: "#666", marginTop: 0 }}>
                {membro.cargo}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
