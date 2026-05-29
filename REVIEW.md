Revisão de Arquitetura, Clean Code e Princípios SOLID

Este documento evidencia as decisões arquiteturais adotadas no desenvolvimento do sistema de Controle de Estoque FESF-SUS, garantindo manutenibilidade e escalabilidade.

1. Princípios SOLID Aplicados

Single Responsibility Principle (SRP): Separação clara de responsabilidades no Back-end. Rotas (endpoints.py), regras de negócio (services.py), esquemas de validação (schemas.py) e modelos de banco de dados (models.py) possuem funções únicas e isoladas.

Dependency Inversion Principle (DIP): O banco de dados não é instanciado diretamente nas funções. Utilizamos a injeção de dependência (Depends(get_db)) no FastAPI, permitindo que a sessão do banco seja facilmente substituída (por exemplo, em testes automatizados).

2. Clean Code

Nomenclatura Intuitiva: Variáveis, funções e classes foram nomeadas em português claro e alinhadas ao domínio do problema (ex: registrar_movimentacao, estoque_minimo), facilitando a leitura por outros desenvolvedores brasileiros.

Tratamento de Erros: Exceções são tratadas na camada de services e retornam status HTTP semânticos (ex: 400 para regras de negócio violadas, 404 para não encontrado) através do HTTPException.

Semântica no Front-end: Uso de componentes funcionais do React com Hooks (useState, useEffect), mantendo o ciclo de vida da interface reativo e o código enxuto.

3. Bateria de Testes Básica

Foi implementado um ambiente base de testes automatizados utilizando pytest e TestClient do FastAPI, validando a integridade das rotas principais e a conexão com o banco de dados.