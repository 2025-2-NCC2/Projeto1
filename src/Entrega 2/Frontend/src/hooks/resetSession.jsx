
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export function useLogout() {
    const navigate = useNavigate();

    const logout = async () => {
        // Remove JWT do localStorage ou sessionStorage

        const token = localStorage.getItem("token");

        // Faz a requisição com o header Authorization
        await api.post("/auth/logout", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        // Limpa dados locais
        localStorage.clear();
        /* console.log(userId); */
        // Redireciona para a home
        navigate("/");
    };

    return logout;
}
