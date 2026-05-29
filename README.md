Seleção FESF-SUS – 1 F.C

Este repositório contém a aplicação web desenvolvida para o 14º Processo de Seleção Pública Simplificada da FESF-SUS (Desenvolvedor(a) Full Stack Júnior), cumprindo integralmente o Item 01 da Formação Complementar.

Tema: Controle de Estoque de Insumos e Medicamentos (Entrada, saída e alerta de estoque mínimo).

Tecnologias Utilizadas

Backend: Python 3, FastAPI, SQLAlchemy, SQLite (Banco de dados embarcado, não requer instalação extra).

Frontend: React (Vite), TailwindCSS, Lucide React (Ícones).

Como Executar a Aplicação (Passo a Passo)

A aplicação foi projetada para execução simplificada (Plug-and-Play), sem necessidade de containers complexos.

1. Executando o Backend (API)

Abra um terminal na raiz do projeto e execute:

cd backend
python -m venv venv


Ative o ambiente virtual:

Windows: venv\Scripts\activate

Linux/Mac: source venv/bin/activate

Instale as dependências e inicie o servidor:

pip install -r requirements.txt
uvicorn app.main:app --reload


A API estará rodando em: http://127.0.0.1:8000 (Acesse /docs para visualizar a documentação Swagger).

2. Executando o Frontend (Interface)

Abra um novo terminal na raiz do projeto e execute:

cd frontend
npm install
npm run dev


Acesse o link gerado no terminal (geralmente http://localhost:5173) no seu navegador. O sistema estará pronto para uso.

Arquitetura

A aplicação adota separação de responsabilidades (Backend RESTful e Frontend SPA) e princípios de Clean Code/SOLID aplicados ao ecossistema Python e React. Veja o arquivo REVIEW.md para a defesa arquitetural completa.