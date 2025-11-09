import React from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import logo from "../assets/logo.png";

export default function Footer() {
    return (
        <footer style={{backgroundColor: '#f7f7f7', borderTop:" 4px solid rgb(34, 183, 126)"}} className="bg-opacity-10 py-4 d-block">
            <Container>
                <Row className="align-items-center text-center text-md-start mb-3">
                    <Col md={4} className="mb-3 mb-md-0 d-flex align-items-center justify-content-center justify-content-md-start">
                        <Link to="/" className="text-decoration-none d-flex align-items-center">
                            <div>
                                <img className="w-25" src={logo} alt="" />
                            </div>
                        </Link>
                    </Col>
                    <Col md={4} className="mb-3 mb-md-0">
                        <Row className="justify-content-center">
                            <Col xs="auto" className="mb-2 mb-md-0">
                                <Link to="/login" className="text-success text-decoration-none fw-semibold">Dashboard</Link>
                            </Col>
                            <Col xs="auto" className="mb-2 mb-md-0">
                                <Link to="/about-us" className="text-success text-decoration-none fw-semibold">Sobre</Link>
                            </Col>
                            <Col xs="auto" className="mb-2 mb-md-0">
                                <Link to="/metas" className="text-success text-decoration-none fw-semibold">Metas</Link>
                            </Col>
                            <Col xs="auto" className="mb-2 mb-md-0">
                                <Link to="/doacoes" className="text-success text-decoration-none fw-semibold">Doações</Link>
                            </Col>
                            <Col xs="auto">
                                <Link to="/ajuda" className="text-success text-decoration-none fw-semibold">Ajuda</Link>
                            </Col>
                        </Row>
                    </Col>


                    <Col md={4} className="text-center text-md-end">
                        <Row className="justify-content-center justify-content-md-end">
                            <Col xs="auto">
                                <Link to="/">
                                    <Button variant="success" size="sm">Feedback rápido</Button>
                                </Link>
                            </Col>
                            <Col xs="auto" className="d-flex align-items-center">
                                <a href="mailto:no-reply@auria.local" className="text-dark opacity-75 small text-decoration-none">contato</a>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
}