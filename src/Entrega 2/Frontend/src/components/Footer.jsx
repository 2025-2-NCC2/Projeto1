import React from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import logo from "../assets/logo.png";

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer
            role="contentinfo"
            className="bg-light py-3"
            style={{
                borderTop: "2px solid #22B77E",
                fontSize: "0.9rem",
            }}
        >
            <Container>
                <Row className="align-items-center justify-content-between text-center text-md-start">
                    {/* Logo e nome */}
                    <Col xs={12} md="auto" className="mb-2 mb-md-0">
                        <Link
                            to="/"
                            className="d-inline-flex align-items-center text-decoration-none"
                        >
                            <img
                                src={logo}
                                alt="Áuria logo"
                                style={{ height: 40, marginRight: 8 }}
                            />
                            <div>
                                <div className="fw-semibold text-success mb-0">Áuria</div>
                                <small className="text-muted">Lideranças Empáticas</small>
                            </div>
                        </Link>
                    </Col>

                    {/* Contato */}
                    <Col xs={12} md="auto" className="text-center text-md-end">
                        <a
                            href="mailto:contato@auria.local"
                            className="text-muted text-decoration-none"
                        >
                            contato@auria.local
                        </a>
                    </Col>
                </Row>

                {/* Direitos autorais */}
                <Row className="">
                    <Col className="text-center">
                        <small className="text-muted">
                            © {year} Áuria — Todos os direitos reservados.
                        </small>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
}
